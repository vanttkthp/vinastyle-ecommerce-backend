import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateMomoPaymentDto } from '../momo/dto/create-momo-payment.dto';
import { OrderService } from '../order/order.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { JwtAccessTokenGuard } from '../auth/guards';

@Controller('api/v1/payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('momo')
  async createMomoPayment(@Body() createMomoPaymentDto: CreateMomoPaymentDto) {
    return await this.paymentService.createPaymentWithMomo(
      createMomoPaymentDto,
    );
  }

  @Post('callback')
  async handleCallback(@Body() callbackData: any, @Res() res: Response) {
    /**
     * resultCode = 0: giao dịch thành công.
     * resultCode = 9000: giao dịch được cấp quyền (authorization) thành công.
     * resultCode <> 0: giao dịch thất bại.
     */
    console.log('callback: ');
    console.log(callbackData);

    // Xử lý trạng thái đơn hàng tại đây (update database)

    if (callbackData.resultCode === 0) {
      await this.paymentService.updatePaymentStatus(
        callbackData.orderId,
        PaymentStatus.PAID,
        OrderStatus.PENDING,
      );
    }

    return {
      status: res.status,
      data: callbackData,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('check-transaction-status')
  async checkTransactionStatus(@Body() dto: { orderId: string }) {
    return await this.paymentService.checkMomoTransactionStatus(dto.orderId);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentService.update(+id, updatePaymentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
