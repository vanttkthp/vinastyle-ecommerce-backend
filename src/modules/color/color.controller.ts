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
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('api/v1/colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('create')
  async create(@Req() req, @Body() dto: CreateColorDto) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;
    return await this.colorService.create(name, dto);
  }

  @Get('all')
  async findAll(@Query() dto: PageOptionDto) {
    return await this.colorService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.colorService.findOne(id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateColorDto,
  ) {
    const name = `${req.user.roleName} ${req.user.firstName} ${req.user.lastName}`;

    return await this.colorService.update(id, dto, name);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.colorService.remove(id);
  }
}
