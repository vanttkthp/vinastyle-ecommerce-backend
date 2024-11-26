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
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Injectable()
export class SizeService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(name: string, dto: CreateSizeDto) {
    try {
      await this.prismaService.size.create({
        data: {
          sizeType: dto.sizeType,
          createdBy: name
        },
      });
      return {
        message: SuccessMessage(model.SIZE, action.CREATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll() {
    const sizes = await this.prismaService.size.findMany();
    return {
      message: message.OK,
      statusCode: statusCode.OK,
      sizes: sizes,
    };
  }

  async findOne(id: string) {
    const size = await this.prismaService.size.findUnique({
      where: {
        sizeId: id,
      },
    });
    if (!size)
      return {
        message: IdNotFoundMessage(model.SIZE),
        statusCode: statusCode.NOT_FOUND,
      };
    return {
      message: foundOneMessage(model.SIZE),
      statusCode: statusCode.OK,
      size: size,
    };
  }

  async update(id: string, dto: UpdateSizeDto, name: string) {
    const size = await this.findOne(id);
    if (size.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(size.message);
    }
    try {
      await this.prismaService.size.update({
        where: {
          sizeId: id
        },
        data: {
          sizeType: dto.sizeType
        },
      });
      return {
        message: SuccessMessage(model.SIZE, action.UPDATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const size = await this.findOne(id);
    if (size.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(size.message);
    }
    try {
      await this.prismaService.size.delete({
        where: {
          sizeId: id,
        },
      });
      return {
        message: SuccessMessage(model.SIZE, action.DELETE),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
