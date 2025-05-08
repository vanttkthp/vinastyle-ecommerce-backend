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
  Put,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleName } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { RequestWithUser } from 'src/types/request.type';
import { Response } from 'express';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Roles(RoleName.ADMIN)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAccessTokenGuard)
  // @Post('create')
  // create(@Req() req: RequestWithUser, @Body() dto: CreateProductDto) {
  //   const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`
  //   return this.productService.create(name, dto);
  // }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create-with-variants')
  createWithVariants(
    @Req() req: RequestWithUser,
    @Body() dto: CreateProductDto,
  ) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return this.productService.createWithVariants(name, dto);
  }

  @Get('all')
  findAll(@Query() dto: PageOptionDto) {
    return this.productService.findAll(dto);
  }

  // @Get('all')
  // findProductsByCategoryId(@Query() dto: PageOptionDto) {
  //   return this.productService.findAll(dto);
  // }
  @Post('export')
  async exportExportPdf(
    @Res() res: Response,
    @Body()
    data: {
      result: { productVariantId: string; quantity: number }[];
    },
  ) {
    try {
      console.log(data.result);

      const pdfBuffer =
        await this.productService.generateExportProductQuantityPdf(data.result);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="product-quantity.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message || 'Failed to generate PDF' });
    }
  }

  @Post('import')
  async exportImportPdf(
    @Res() res: Response,
    @Body()
    data: {
      result: { productVariantId: string; quantity: number }[];
    },
  ) {
    try {
      console.log(data.result);

      const pdfBuffer =
        await this.productService.generateImportProductQuantityPdf(data.result);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="product-quantity.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message || 'Failed to generate PDF' });
    }
  }

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

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
