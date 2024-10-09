import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies';
import { JwtAccessTokenStrategy } from './strategies';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    JwtModule.register({
      // Use the RSA public key
    }),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy],
})
export class AuthModule {}
