import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards';
import { GetRevenueInput } from './dto/get-revenue-input.dto';

@Controller('api/v1/statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('get-revenue')
  async getRevenue(@Body() dto: GetRevenueInput) {
    return await this.statisticService.getRevenue(dto);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('get-revenue-by-day')
  async getRevenueByDay(@Body() dto: GetRevenueInput) {
    return await this.statisticService.getRevenueByDay(dto);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('get-products-sold-by-day')
  async getProductsSoldByDay(@Body() dto: GetRevenueInput) {
    return await this.statisticService.getProductsSoldByDay(dto);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Post('get-total-products-sold')
  async getTotalProductsSold(@Body() dto: GetRevenueInput) {
    return await this.statisticService.getTotalProductsSold(dto);
  }
}
