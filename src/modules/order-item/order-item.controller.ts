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
  Put,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { JwtAccessTokenGuard } from '../auth/guards';

@Controller('api/v1/order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto, @Req() req) {
    return this.orderItemService.create(req.user.userId, createOrderItemDto);
  }

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(+id);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put()
  update(@Body() updateOrderItemDto: UpdateOrderItemDto, @Req() req) {
    return this.orderItemService.update(req.user.userId, updateOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(+id);
  }
}
