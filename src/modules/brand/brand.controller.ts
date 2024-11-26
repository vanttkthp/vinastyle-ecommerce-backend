import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';

@Controller('api/v1/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  async create(@Req() req, @Body() dto: CreateBrandDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;

    return await this.brandService.create(name, dto);
  }

  @Get('all')
  async findAll(@Query() dto: PageOptionDto) {
    return await this.brandService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.brandService.findOne(id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return await this.brandService.update(id, dto, name);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.brandService.remove(id);
  }
}
