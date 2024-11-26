import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  action,
  foundAllMessage,
  foundOneMessage,
  IdNotFoundMessage,
  message,
  model,
  statusCode,
  SuccessMessage,
} from 'src/enums';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(name: string, dto: CreateSubCategoryDto) {
    try {
      await this.prismaService.subCategory.create({
        data: {
          name: dto.name,
          category: {
            connect: { categoryId: dto.categoryId },
          },
          description: dto.description,
          createdBy: name,
        },
      });
      return {
        message: SuccessMessage(model.SUB_CATEGORY, action.CREATE),
      };
    } catch(e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(pageOption: PageOptionDto) {
    const { page, limit, skip, search } = pageOption;

    const whereCondition = {
      AND: [
        search
          ? { name: { contains: search, mode: 'insensitive' as any } }
          : {},
      ],
    };

    const total = await this.prismaService.subCategory.count({
      where: whereCondition,
    });

    const subCategories = await this.prismaService.subCategory.findMany({
      where: whereCondition,
      take: limit, // Use `limit` instead of `take`
      skip: skip, // Ensure `skip` is properly calculated
    });
    if (!subCategories)
      return {
        message: message.NOT_FOUND,
      };
    return new PageDto(
      subCategories,
      new PageMetaDto(
        total,
        page,
        limit,
        foundAllMessage(total, model.SUB_CATEGORY),
      ),
    );
  }

  async findOne(id: string) {
    const subCategory = await this.prismaService.subCategory.findUnique({
      where: {
        subCategoryId: id,
      },
    });
    if (!subCategory)
      return {
        message: IdNotFoundMessage(model.SUB_CATEGORY),
        statusCode: statusCode.NOT_FOUND,
      };
    return {
      message: foundOneMessage(model.SUB_CATEGORY),
      statusCode: statusCode.OK,
      subCategory: subCategory,
    };
  }

  async update(id: string, dto: UpdateSubCategoryDto, name: string) {
    const subCategory = await this.findOne(id);
    if (subCategory.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(subCategory.message);
    }
    try {
      await this.prismaService.subCategory.update({
        where: {
          subCategoryId: id,
        },
        data: {
          name: dto.name,
          categoryId: dto.categoryId,
          description: dto.description,
          createdBy: name,
        },
      });
      return {
        message: SuccessMessage(model.SUB_CATEGORY, action.UPDATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const subCategory = await this.findOne(id);
    if (subCategory.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(subCategory.message);
    }
    try {
      await this.prismaService.subCategory.delete({
        where: {
          subCategoryId: id,
        },
      });
      return {
        message: SuccessMessage(model.SUB_CATEGORY, action.DELETE),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
