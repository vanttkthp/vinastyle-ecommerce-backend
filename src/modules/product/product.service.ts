import { BadRequestException, Injectable, Search } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { action, foundAllMessage, model, SuccessMessage } from 'src/enums';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  //create new product
  async create(name: string, dto: CreateProductDto) {
    try {
      const newProduct = await this.prismaService.product.create({
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
        },
      });
      return {
        message: SuccessMessage(model.PRODUCT, action.CREATE),
        product: newProduct,
      };
    } catch {
      throw new BadRequestException();
    }
  }

  //find all products
  async findAll(pageOption: PageOptionDto) {
    const { page, limit, skip, search, categoryId, subCategoryId } = pageOption;

    const whereCondition = {
      AND: [
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
        colorId: colorId,
      },
      select: {
        colorId: true,
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
            name: true,
          },
        },
        subCategory: {
          select: {
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
        brand: {
          connect: { brandId: updateProductDto.brandId },
        },
        category: {
          connect: { categoryId: updateProductDto.categoryId },
        },
        subCategory: {
          connect: { subCategoryId: updateProductDto.subCategoryId },
        },
      },
    });
  }

  remove(id: string) {
    return this.prismaService.product.delete({
      where: { productId: id },
    });
  }
}
