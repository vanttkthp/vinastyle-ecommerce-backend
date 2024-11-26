import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { ProductVariant, RoleName } from '@prisma/client';
import { PageDto } from 'src/common/dtos/page.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards';

@Controller('api/v1/product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  async create(@Req() req, @Body() dto: CreateProductVariantDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return this.productVariantService.create(dto, name);
  }

  @Get('product/:id')
  async findByProductId(@Param('id') id: string) {
    return await this.productVariantService.findByProductId(id);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return await this.productVariantService.update(id, dto, name);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productVariantService.remove(id);
  }
}
