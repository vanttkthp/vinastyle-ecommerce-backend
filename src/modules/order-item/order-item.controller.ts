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
import { RequestWithUser } from 'src/types/request.type';

@Controller('api/v1/order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto, @Req() req: RequestWithUser) {
    return this.orderItemService.create(req.user.userId, createOrderItemDto);
  }

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderItemService.findOne(+id);
  // }

  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async update(
    @Body() updateOrderItemDto: UpdateOrderItemDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return await this.orderItemService.update(
      req.user.userId,
      id,
      updateOrderItemDto,
    );
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return await this.orderItemService.remove(req.user.userId, id);
  }
}
