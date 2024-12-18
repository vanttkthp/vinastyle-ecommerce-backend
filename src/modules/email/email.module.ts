import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      // Use the RSA public key
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'nguyenduc10102002@gmail.com', // Gmail của bạn
          pass: 'arkv zaag rdtw hqvr',   // Mật khẩu ứng dụng
        },
      },
      defaults: {
        from: '"VinaStyle Corp." <vinastyle@gmail.com>', // Địa chỉ gửi mặc định
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController]
})
export class EmailModule {}
