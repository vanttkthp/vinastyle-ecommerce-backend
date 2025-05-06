import { BadRequestException, Injectable, Search } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { action, foundAllMessage, model, SuccessMessage } from 'src/enums';
import * as pdfkit from 'pdfkit';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  //create new product
  // async create(name: string, dto: CreateProductDto) {
  //   try {
  //     const newProduct = await this.prismaService.product.create({
  //       data: {
  //         createdBy: name,
  //         description: dto.description,
  //         name: dto.name,
  //         price: dto.price,
  //         brand: {
  //           connect: {
  //             brandId: dto.brandId,
  //           },
  //         },
  //         category: {
  //           connect: {
  //             categoryId: dto.categoryId,
  //           },
  //         },
  //         subCategory: {
  //           connect: {
  //             subCategoryId: dto.subCategoryId,
  //           },
  //         },
  //       },
  //       select: {
  //         name: true,
  //         createdBy: true,
  //         productId: true,
  //       },
  //     });
  //     const colorId = dto.colorId;
  //     const productId = newProduct.productId;

  //     const imagesData = dto.images.map((url) => ({
  //       colorId,
  //       productId,
  //       imageURL: url,
  //     }));

  //     return {
  //       message: SuccessMessage(model.PRODUCT, action.CREATE),
  //       product: newProduct,
  //     };
  //   } catch {
  //     throw new BadRequestException();
  //   }
  // }

  async createWithVariants(name: string, dto: CreateProductDto) {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        // Tạo sản phẩm mới
        const newProduct = await prisma.product.create({
          data: {
            createdBy: name,
            description: dto.description,
            name: dto.name,
            price: dto.price,
            brand: {
              connect: {
                brandId: dto.brandId,
              },
            },
            category: {
              connect: {
                categoryId: dto.categoryId,
              },
            },
            subCategory: {
              connect: {
                subCategoryId: dto.subCategoryId,
              },
            },
          },
          select: {
            name: true,
            createdBy: true,
            productId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        // Tạo các product variants
        const productVariantsData = dto.variants.map((variant) => ({
          productId: newProduct.productId,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          SKU: `${variant.colorId}-${variant.sizeId}-${newProduct.productId}`,
          stock: variant.stock,
        }));

        await prisma.productVariant.createMany({
          data: productVariantsData,
          skipDuplicates: true,
        });

        // Tạo danh sách hình ảnh
        const imagesData = dto.images.map((image) => ({
          colorName: image.colorName,
          productId: newProduct.productId,
          imageURL: image.url,
          category: newProduct.category.name,
        }));

        await prisma.image.createMany({
          data: imagesData,
          skipDuplicates: true,
        });

        return newProduct;
      });

      return {
        message: SuccessMessage(model.PRODUCT, action.CREATE),
        product: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find all products
  async findAll(pageOption: PageOptionDto) {
    const { page, limit, skip, search, categoryId, subCategoryId } = pageOption;

    const whereCondition = {
      AND: [
        { isActive: true },
        search ? { name: { contains: search } } : {},
        categoryId
          ? { OR: [{ categoryId }, { subCategoryId: categoryId }] }
          : {},
        subCategoryId ? { subCategoryId } : {},
      ],
    };

    const total = await this.prismaService.product.count({
      where: whereCondition,
    });

    const products = await this.prismaService.product.findMany({
      where: whereCondition,
      take: limit, // Use `limit` instead of `take`
      skip: skip, // Ensure `skip` is properly calculated
      select: {
        images: {
          select: {
            imageURL: true,
          },
        },
        productId: true,
        name: true,
        description: true,
        price: true,
        categoryId: true,
        subCategoryId: true,
        brandId: true,
        productVariants: {
          select: {
            color: {
              select: {
                name: true,
                colorId: true,
                hexCode: true,
              },
            },
            size: {
              select: {
                sizeType: true,
              },
            },
          },
        },
      },
    });

    return new PageDto(
      products,
      new PageMetaDto(
        total,
        page,
        limit,
        foundAllMessage(total, model.PRODUCT),
      ),
    );
  }

  async findProductImagesByColorId(productId: string, colorId: string) {
    return await this.prismaService.image.findMany({
      where: {
        productId: productId,
        colorName: colorId,
      },
      select: {
        colorName: true,
        imageURL: true,
      },
    });
  }

  //find all products
  async findProductsByCategoryId(
    pageOption: PageOptionDto,
    categoryId: string,
  ) {
    const { page, limit, skip } = pageOption;

    const total = await this.prismaService.product.count({
      where: {
        name: {
          contains: categoryId,
        },
        isActive: true,
      },
    });

    const products = await this.prismaService.product.findMany({
      where: {
        name: {
          contains: categoryId,
        },
      },
      take: limit, // Use `limit` instead of `take`
      skip: skip, // Ensure `skip` is properly calculated
    });

    return new PageDto(
      products,
      new PageMetaDto(
        total,
        page,
        limit,
        foundAllMessage(total, model.PRODUCT),
      ),
    );
  }

  //find top selling products
  async findTopSellingProducts(pageOption: PageOptionDto) {
    const { page, limit, skip } = pageOption;

    const products = await this.prismaService.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        productId: true,
        name: true,
        price: true,
        productVariants: true,
        images: {
          select: {
            imageURL: true,
          },
        },
      },
    });

    const calculatedProducts = products.map((product) => {
      let totalInStock = 0;
      let totalSold = 0;

      product.productVariants.forEach((variant) => {
        totalInStock += variant.stock;
        totalSold += variant.soldQuantity;
      });
      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        totalInStock,
        totalSold,
        images: product.images,
      };
    });

    const sortedProducts = calculatedProducts.sort(
      (a, b) => b.totalSold - a.totalSold,
    );

    const paginatedProducts = sortedProducts.slice(skip, skip + limit);

    const total = calculatedProducts.length;
    return new PageDto(
      paginatedProducts,
      new PageMetaDto(
        total,
        page,
        limit,
        foundAllMessage(total, model.PRODUCT),
      ),
    );
  }

  //find product detail
  async findOne(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { productId: id },
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            categoryId: true,
            name: true,
          },
        },
        subCategory: {
          select: {
            subCategoryId: true,
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
        productVariants: {
          select: {
            productVariantId: true,
            SKU: true,
            soldQuantity: true,
            stock: true,
            color: {
              select: {
                hexCode: true,
                name: true,
              },
            },
            size: {
              select: {
                sizeType: true,
              },
            },
          },
        },
        images: {
          select: {
            imageURL: true,
          },
        },
      },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    let totalInStock = 0;
    let totalSold = 0;

    product.productVariants.forEach((variant) => {
      totalInStock += variant.stock;
      totalSold += variant.soldQuantity;
    });
    return {
      ...product,
      totalInStock,
      totalSold,
      images: product.images,
    };
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prismaService.product.update({
      where: { productId: id },
      data: {
        categoryId: updateProductDto.categoryId,
        subCategoryId: updateProductDto.subCategoryId,
        description: updateProductDto.description,
        name: updateProductDto.name,
        price: updateProductDto.price,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.product.update({
      where: { productId: id },
      data: { isActive: false },
    });
  }

  async generateProductQuantityPdf(
    id: string,
    reason?: string,
    staff?: string,
  ): Promise<Buffer> {
    // Fetch product data using the same logic as findOne
    const product = await this.prismaService.product.findUnique({
      where: { productId: id },
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            categoryId: true,
            name: true,
          },
        },
        subCategory: {
          select: {
            subCategoryId: true,
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
        productVariants: {
          select: {
            productVariantId: true,
            SKU: true,
            soldQuantity: true,
            stock: true,
            color: {
              select: {
                hexCode: true,
                name: true,
              },
            },
            size: {
              select: {
                sizeType: true,
              },
            },
          },
        },
        images: {
          select: {
            imageURL: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }
    // Calculate totals
    let totalInStock = 0;
    let totalSold = 0;
    product.productVariants.forEach((variant) => {
      totalInStock += variant.stock;
      totalSold += variant.soldQuantity;
    });

    // Tạo tài liệu PDF
    const doc = new pdfkit({
      size: 'A4',
      margin: 50,
    });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text('PHIEU XUAT KHO', { align: 'center' });
    doc.moveDown(2);

    // Thông tin sản phẩm chính
    doc.fontSize(12);
    doc.text(`San pham: ${product.name}`);
    doc.text(
      `Danh muc: ${product.subCategory?.name || 'Không có'} - ${product.category.name}`,
    );
    doc.text(`Gia: ${product.price.toLocaleString()} VND`);
    if (reason) {
      doc.text(`Ly do xuat kho: ${reason}`);
    }
    if (staff) {
      doc.text(`Nhan vien xuat kho: ${staff}`);
    }
    doc.moveDown(1);

    // Bảng thông tin các loại sản phẩm
    doc.fontSize(12).text('Chi tiet cac san pham:', { underline: true });
    doc.moveDown(0.5);

    // Vẽ bảng tiêu đề
    const tableTop = doc.y + 10;
    const itemSpacing = 20;

    doc
      .font('Helvetica-Bold')
      .text('STT', 50, tableTop)
      .text('SKU', 90, tableTop)
      .text('Mau sac', 170, tableTop)
      .text('Ma mau', 270, tableTop)
      .text('Size', 340, tableTop)
      // .text('Ton kho', 410, tableTop)
      .text('Da xuat', 410, tableTop)
      .moveDown();

    doc.font('Helvetica');
    product.productVariants.forEach((variant, index) => {
      const y = tableTop + itemSpacing * (index + 1);
      doc
        .text(index + 1, 50, y)
        .text(variant.SKU, 90, y)
        .text(variant.color.name, 170, y)
        .text(variant.color.hexCode, 270, y)
        .text(variant.size.sizeType, 340, y)
        // .text(variant.stock.toString(), 410, y)
        .text(variant.soldQuantity.toString(), 410, y); //470
    });

    doc.moveDown(2);

    // Tổng kết
    doc.font('Helvetica-Bold').text('Tong ket:', { underline: true });
    doc.font('Helvetica');
    doc.text(`Tong ton kho: ${totalInStock}`);
    doc.text(`Tong da ban: ${totalSold}`);

    // Thời gian tạo
    doc.moveDown(2);
    doc
      .fontSize(10)
      .text(`Ngay tao phieu: ${new Date().toLocaleString('vi-VN')}`, {
        align: 'right',
      });

    doc.end();

    // Return the PDF buffer
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
  async generateImportProductQuantityPdf(
    id: string,
    reason?: string,
    staff?: string,
  ): Promise<Buffer> {
    // Fetch product data using the same logic as findOne
    const product = await this.prismaService.product.findUnique({
      where: { productId: id },
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            categoryId: true,
            name: true,
          },
        },
        subCategory: {
          select: {
            subCategoryId: true,
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
        productVariants: {
          select: {
            productVariantId: true,
            SKU: true,
            soldQuantity: true,
            stock: true,
            color: {
              select: {
                hexCode: true,
                name: true,
              },
            },
            size: {
              select: {
                sizeType: true,
              },
            },
          },
        },
        images: {
          select: {
            imageURL: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }
    // Calculate totals
    let totalInStock = 0;
    let totalSold = 0;
    product.productVariants.forEach((variant) => {
      totalInStock += variant.stock;
      totalSold += variant.soldQuantity;
    });

    // Tạo tài liệu PDF
    const doc = new pdfkit({
      size: 'A4',
      margin: 50,
    });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text('PHIEU XUAT KHO', { align: 'center' });
    doc.moveDown(2);

    // Thông tin sản phẩm chính
    doc.fontSize(12);
    doc.text(`San pham: ${product.name}`);
    doc.text(
      `Danh muc: ${product.subCategory?.name || 'Không có'} - ${product.category.name}`,
    );
    doc.text(`Gia: ${product.price.toLocaleString()} VND`);
    if (reason) {
      doc.text(`Ly do nhap kho: ${reason}`);
    }
    if (staff) {
      doc.text(`Nhan vien nhap kho: ${staff}`);
    }
    doc.moveDown(1);

    // Bảng thông tin các loại sản phẩm
    doc.fontSize(12).text('Chi tiet cac san pham:', { underline: true });
    doc.moveDown(0.5);

    // Vẽ bảng tiêu đề
    const tableTop = doc.y + 10;
    const itemSpacing = 20;

    doc
      .font('Helvetica-Bold')
      .text('STT', 50, tableTop)
      .text('SKU', 90, tableTop)
      .text('Mau sac', 170, tableTop)
      .text('Ma mau', 270, tableTop)
      .text('Size', 340, tableTop)
      // .text('Ton kho', 410, tableTop)
      .text('Da nhap', 410, tableTop)
      .moveDown();

    doc.font('Helvetica');
    product.productVariants.forEach((variant, index) => {
      const y = tableTop + itemSpacing * (index + 1);
      const totalImportQuantity = variant.stock + variant.soldQuantity;
      doc
        .text(index + 1, 50, y)
        .text(variant.SKU, 90, y)
        .text(variant.color.name, 170, y)
        .text(variant.color.hexCode, 270, y)
        .text(variant.size.sizeType, 340, y)
        // .text(variant.stock.toString(), 410, y)
        .text(totalImportQuantity.toString(), 410, y); //470
    });

    doc.moveDown(2);

    // Tổng kết
    doc.font('Helvetica-Bold').text('Tong ket:', { underline: true });
    doc.font('Helvetica');
    doc.text(`Tong ton kho: ${totalInStock}`);
    doc.text(`Tong da ban: ${totalSold}`);

    // Thời gian tạo
    doc.moveDown(2);
    doc
      .fontSize(10)
      .text(`Ngay tao phieu: ${new Date().toLocaleString('vi-VN')}`, {
        align: 'right',
      });

    doc.end();

    // Return the PDF buffer
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}
