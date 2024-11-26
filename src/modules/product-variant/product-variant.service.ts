import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import {
  action,
  foundAllMessage,
  message,
  model,
  statusCode,
  SuccessMessage,
} from 'src/enums';

@Injectable()
export class ProductVariantService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(dto: CreateProductVariantDto, name: string) {
    const variant = await this.prismaService.productVariant.findFirst({
      where: {
        SKU: dto.SKU,
      },
    });
    if (variant) throw new BadRequestException('SKU existed!');
    try {
      await this.prismaService.productVariant.create({
        data: {
          createdBy: name,
          colorId: dto.colorId,
          SKU: dto.SKU,
          productId: dto.productId,
          sizeId: dto.sizeId,
          stock: dto.stock,
        },
      });
      return {
        message: SuccessMessage(model.PRODUCT_VARIANT, action.CREATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async findByProductId(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        productId: id,
      },
    });
    if (!product) throw new BadRequestException(message.ID_NOT_FOUND);

    const variants = await this.prismaService.productVariant.findMany({
      where: {
        productId: id,
      },
    });
    if (!variants)
      return {
        message: message.NOT_FOUND,
        statusCode: statusCode.NOT_FOUND,
      };
    return {
      message: message.OK,
      statusCode: statusCode.OK,
      variants: variants,
    };
  }

  async update(id: string, dto: UpdateProductVariantDto, name: string) {
    const variant = await this.prismaService.productVariant.findUnique({
      where: {
        productVariantId: id,
      },
    });
    if (!variant) {
      throw new BadRequestException(message.ID_NOT_FOUND);
    }
    try {
      await this.prismaService.productVariant.update({
        where: {
          productVariantId: id,
        },
        data: {
          colorId: dto.colorId,
          sizeId: dto.sizeId,
          productId: dto.productId,
          createdBy: name,
          stock: dto.stock,
          SKU: dto.SKU,
        },
      });
      return {
        message: SuccessMessage(model.PRODUCT_VARIANT, action.UPDATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const variant = await this.prismaService.productVariant.findUnique({
      where: {
        productVariantId: id,
      },
    });
    if (!variant) {
      throw new BadRequestException(message.ID_NOT_FOUND);
    }
    try {
      await this.prismaService.productVariant.delete({
        where: {
          productVariantId: id,
        },
      });
      return {
        message: SuccessMessage(model.PRODUCT_VARIANT, action.DELETE),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
