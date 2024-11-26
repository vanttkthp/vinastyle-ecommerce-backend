import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
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

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(name: string, dto: CreateBrandDto) {
    try {
      await this.prismaService.brand.create({
        data: {
          name: dto.name,
          description: dto.description,
          logo: dto.logo,
          createdBy: name,
        },
      });
      return {
        message: SuccessMessage(model.BRAND, action.CREATE),
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

    const total = await this.prismaService.brand.count({
      where: whereCondition,
    });

    const brands = await this.prismaService.brand.findMany({
      where: whereCondition,
      take: limit, // Use `limit` instead of `take`
      skip: skip, // Ensure `skip` is properly calculated
    });
    if (!brands)
      return {
        message: message.NOT_FOUND,
      };
    return new PageDto(
      brands,
      new PageMetaDto(total, page, limit, foundAllMessage(total, model.BRAND)),
    );
  }

  async findOne(id: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: {
        brandId: id,
      },
    });
    if (!brand)
      return {
        message: IdNotFoundMessage(model.BRAND),
        statusCode: statusCode.NOT_FOUND,
      };
    return {
      message: foundOneMessage(model.BRAND),
      statusCode: statusCode.OK,
      brand: brand,
    };
  }

  async update(id: string, dto: UpdateBrandDto, name: string) {
    const brand = await this.findOne(id);
    if (brand.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(brand.message);
    }
    try {
      await this.prismaService.brand.update({
        where: {
          brandId: id,
        },
        data: {
          name: dto.name,
          description: dto.description,
          logo: dto.logo,
          updatedBy: name,
        },
      });
      return {
        message: SuccessMessage(model.BRAND, action.UPDATE),
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    if (brand.statusCode === statusCode.NOT_FOUND) {
      throw new BadRequestException(brand.message);
    }
    try {
      await this.prismaService.brand.delete({
        where: {
          brandId: id,
        },
      });
      return {
        message: SuccessMessage(model.BRAND, action.DELETE),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
