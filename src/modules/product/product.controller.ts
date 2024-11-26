import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleName } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(RoleName.ADMIN, RoleName.STAFF, RoleName.CUSTOMER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  create(@Req() req, @Body() dto: CreateProductDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`
    return this.productService.create(name, dto);
  }

  @Get('all')
  findAll(@Query() dto: PageOptionDto) {
    return this.productService.findAll(dto);
  }

  // @Get('all')
  // findProductsByCategoryId(@Query() dto: PageOptionDto) {
  //   return this.productService.findAll(dto);
  // }

  @Get('top-selling')
  findTopSellingProducts(@Query() dto: PageOptionDto) {
    return this.productService.findTopSellingProducts(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('/:productId/:colorId')
  findImages(
    @Param('productId') productId: string,
    @Param('colorId') colorId: string,
  ) {
    return this.productService.findProductImagesByColorId(productId, colorId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
