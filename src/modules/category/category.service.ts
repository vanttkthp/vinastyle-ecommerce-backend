import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(name: string, dto: CreateCategoryDto) {
    try {
      await this.prismaService.category.create({
        data: {
          name: dto.name,
          description: dto.description,
          createdBy: name,
        },
        select: {
          name: true,
          createdBy: true,
        },
      });
      return {
        message: SuccessMessage(model.CATEGORY, action.CREATE),
      };
    } catch {
      throw new BadRequestException();
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

    const total = await this.prismaService.category.count({
      where: whereCondition,
    });

    const categories = await this.prismaService.category.findMany({
      where: whereCondition,
      take: limit, // Use `limit` instead of `take`
      skip: skip, // Ensure `skip` is properly calculated
      select: {
        categoryId: true,
        name: true,
        subCategories: {
          select: {
            subCategoryId: true,
            name: true,
          },
        },
      },
    });
    if (!categories)
      return {
        message: message.NOT_FOUND,
      };
    return new PageDto(
      categories,
      new PageMetaDto(
        total,
        page,
        limit,
        foundAllMessage(total, model.CATEGORY),
      ),
    );
  }

  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        categoryId: id,
      },
    });
    if (!category)
      return {
        message: IdNotFoundMessage(model.CATEGORY),
        statusCode: statusCode.NOT_FOUND,
      };
    return {
      message: foundOneMessage(model.CATEGORY),
      statusCode: statusCode.OK,
      category: category,
    };
  }

  async update(id: string, dto: UpdateCategoryDto, name: string) {
    const category = await this.findOne(id);
    if (category.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(category.message);
    }
    try {
      await this.prismaService.category.update({
        where: {
          categoryId: id,
        },
        data: {
          name: dto.name,
          description: dto.description,
          updatedBy: name,
        },
      });
      return {
        message: SuccessMessage(model.CATEGORY, action.UPDATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (category.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(category.message);
    }
    try {
      await this.prismaService.category.delete({
        where: {
          categoryId: id,
        },
      });
      return {
        message: SuccessMessage(model.CATEGORY, action.DELETE),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
