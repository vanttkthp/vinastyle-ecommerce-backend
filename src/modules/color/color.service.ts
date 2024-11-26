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
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(name: string, dto: CreateColorDto) {
    try {
      await this.prismaService.color.create({
        data: {
          name: dto.name,
          description: dto.description,
          hexCode: dto.hexCode,
          createdBy: name,
        },
      });
      return {
        message: SuccessMessage(model.COLOR, action.CREATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(pageOption: PageOptionDto) {
    const { page, limit, skip, search } = pageOption;

    const whereCondition = {
      AND: [search ? { name: { has: search } } : {}],
    };

    const total = await this.prismaService.color.count({
      where: whereCondition,
    });

    const colors = await this.prismaService.color.findMany({
      where: whereCondition,
      take: limit, // Use `limit` instead of `take`
      skip: skip, // Ensure `skip` is properly calculated
    });
    if (!colors)
      return {
        message: message.NOT_FOUND,
      };
    return new PageDto(
      colors,
      new PageMetaDto(total, page, limit, foundAllMessage(total, model.COLOR)),
    );
  }

  async findOne(id: string) {
    const color = await this.prismaService.color.findUnique({
      where: {
        colorId: id,
      },
    });
    if (!color)
      return {
        message: IdNotFoundMessage(model.COLOR),
        statusCode: statusCode.NOT_FOUND,
      };
    return {
      message: foundOneMessage(model.COLOR),
      statusCode: statusCode.OK,
      color: color,
    };
  }

  async update(id: string, dto: UpdateColorDto, name: string) {
    const color = await this.findOne(id);
    if (color.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(color.message);
    }
    try {
      await this.prismaService.color.update({
        where: {
          colorId: id,
        },
        data: {
          name: dto.name,
          description: dto.description,
          hexCode: dto.hexCode,
          createdBy: name,
        },
      });
      return {
        message: SuccessMessage(model.COLOR, action.UPDATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const color = await this.findOne(id);
    if (color.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(color.message);
    }
    try {
      await this.prismaService.color.delete({
        where: {
          colorId: id,
        },
      });
      return {
        message: SuccessMessage(model.COLOR, action.DELETE),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
