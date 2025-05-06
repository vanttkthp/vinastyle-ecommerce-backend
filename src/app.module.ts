import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AddressModule } from './modules/address/address.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { WishListModule } from './modules/wish-list/wish-list.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { ColorModule } from './modules/color/color.module';
import { SizeModule } from './modules/size/size.module';
import { SubCategory } from './modules/sub-category/entities/sub-category.entity';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { VoucherModule } from './voucher/voucher.module';
import { EmailModule } from './modules/email/email.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { MomoModule } from './modules/momo/momo.module';
import { ReviewModule } from './modules/review/review.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    AddressModule,
    PrismaModule,
    ProductModule,
    OrderModule,
    WishListModule,
    PaymentModule,
    ShipmentModule,
    CategoryModule,
    BrandModule,
    ProductVariantModule,
    OrderItemModule,
    ColorModule,
    SizeModule,
    SubCategoryModule,
    VoucherModule,
    EmailModule,
    StatisticModule,
    MomoModule,
    ReviewModule,
  ],
})
export class AppModule {}
