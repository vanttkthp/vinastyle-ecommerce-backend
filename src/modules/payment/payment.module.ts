import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MomoModule } from '../momo/momo.module';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';

@Module({
  imports: [MomoModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
