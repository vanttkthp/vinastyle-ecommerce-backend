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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  create(@Req() req, @Body() dto: CreateCategoryDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return this.categoryService.create(name, dto);
  }

  @Get('all')
  async findAll(@Query() dto: PageOptionDto) {
    const categories = await this.categoryService.findAll(dto);
    return categories;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return this.categoryService.update(id, dto, name);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
