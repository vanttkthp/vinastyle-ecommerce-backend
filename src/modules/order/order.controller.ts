import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestWithUser } from 'src/types/request.type';
import { JwtAccessTokenGuard } from '../auth/guards';
import { OrderStatus, RoleName } from '@prisma/client';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get('/user-order')
  async findOrdersByUser(@Req() req, @Query('status') status: OrderStatus) {
    return await this.orderService.findOrdersByUser(req.user.userId, status);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Get('all')
  async findAll(@Query() dto: PageOptionDto) {
    return await this.orderService.findAll(dto);
  }

  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @Get('user/:id')
  async findOneByUserId(
    @Param('id') id: string,
    @Query('status') status: OrderStatus,
  ) {
    return await this.orderService.findOrdersByUserId(id, status);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('in-cart')
  async findCartByUserId(@Req() req) {
    return await this.orderService.findCartByUserId(req.user.userId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put('/complete-order')
  async update(@Req() request: RequestWithUser, @Body() dto: UpdateOrderDto) {
    return await this.orderService.update(request.user.userId, dto);
  }
}
