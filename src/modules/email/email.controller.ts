import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  //   @Post('send-to-customer')
  //   async sendEmailToCustomer(@Body() body: { email: string; name: string }) {
  //     const { email, name } = body;
  //     await this.emailService.sendCustomerNotification(email, name);
  //     return { message: `Email sent to ${email}` };
  //   }
  @Post('reset-password')
  async sendResetPasswordEmail(@Body() body: { email: string }) {
    const { email } = body;
    return this.emailService.sendResetPasswordEmail(email)
  }
}
