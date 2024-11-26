import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('api/v1/sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  async create(@Req() req, @Body() dto: CreateSubCategoryDto) {
    console.log(dto)
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return await this.subCategoryService.create(name, dto);
  }

  @Get('all')
  async findAll(@Query() dto: PageOptionDto) {
    return await this.subCategoryService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subCategoryService.findOne(id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return await this.subCategoryService.update(id, dto, name);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subCategoryService.remove(id);
  }
}
