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
import { Roles } from 'src/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';


@Controller('api/v1/sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  async create(@Req() req, @Body() dto: CreateSizeDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    const newSize = await this.sizeService.create(name, dto);
    return newSize;
  }

  @Get('all')
  async findAll() {
    return await this.sizeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.sizeService.findOne(id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateSizeDto,
  ) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;

    return await this.sizeService.update(id, dto, name);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.sizeService.remove(id);
  }
}
