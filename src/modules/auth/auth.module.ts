import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies';
import { JwtAccessTokenStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
@Module({
  imports: [
    JwtModule.register({
      // Use the RSA public key
    }),
    PassportModule,
    UserModule,
    OrderModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy],
})
export class AuthModule {}
