import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MomoService } from '../momo/momo.service';
import { CreateMomoPaymentDto } from '../momo/dto/create-momo-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly momoService: MomoService,
    private prismaService: PrismaService,
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  async createPaymentWithMomo(dto: CreateMomoPaymentDto) {
    return await this.momoService.createPayment(dto);
  }

  async checkMomoTransactionStatus(orderId: string) {
    return await this.momoService.checkTransactionStatus(orderId);
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    orderStatus: OrderStatus,
  ) {
    return this.prismaService.order.update({
      where: { orderId },
      data: {
        payment: { update: { status: paymentStatus } },
        status: orderStatus,
      },
    });
  }
  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
