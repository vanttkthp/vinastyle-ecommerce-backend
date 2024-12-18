import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async confirmOrderNotification(
    email: string,
    name: string,
    orderId: string,
    orderItems: {
      quantity: number;
      total: number;
      productVariant: {
        colorId: string;
        sizeId: string;
        product: {
          name: string;
          images: {
            imageURL: string;
          }[];
        };
      };
    }[],
  ) {
    const subject = `Order Confirmation: Your Order #${orderId} is on the way!`;

    // Tạo danh sách sản phẩm dưới dạng bảng HTML
    const itemsHtml = orderItems
      .map((item) => {
        const productName = item.productVariant.product?.name || 'nothing';
        const productImage =
          item.productVariant.product?.images[0].imageURL ||
          'https://via.placeholder.com/100';
        return `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; text-align: center;">
          <img src="${productImage}" alt="${productName}" style="width: 60px; height: auto; border-radius: 5px;" />
        </td>
        <td style="padding: 10px;">${productName}</td>
        <td style="padding: 10px;">Color: ${item.productVariant.colorId}, Size: ${item.productVariant.sizeId}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">${item.total.toFixed(2)}</td>
      </tr>
    `;
      })
      .join('');

    // Tính tổng số tiền
    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    // Nội dung email dạng HTML
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/bookstore-online-5335a.appspot.com/o/book_covers%2Fvinastyle.png?alt=media&token=599fbd11-ec3c-4196-b504-405e58474fbd" 
        alt="Company Logo" 
        style="width: 150px; height: auto; margin-bottom: 5px;"
      />
      <p style="font-size: 14px; color: #555;">Thank you for shopping with us!</p>
    </div>
    <hr/>
    <p>Dear <strong>${name ?? 'customer'}</strong>,</p>
    <p>
      Your order <strong>#${orderId}</strong> has been 
      successfully processed and is now being prepared for shipping.
    </p>

    <p>Here are the details of your order:</p>
    <table 
      border="0" 
      cellpadding="10" 
      style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; margin-bottom: 20px;"
    >
      <thead style="background-color: #007BFF; color: #fff;">
        <tr>
          <th style="padding: 10px;">Image</th>
          <th style="padding: 10px;">Product Name</th>
          <th style="padding: 10px;">Product (Color / Size)</th>
          <th style="padding: 10px;">Quantity</th>
          <th style="padding: 10px;">Total Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <p style="font-size: 16px; color: #007BFF; font-weight: bold;">
      Total Amount: ${totalAmount.toFixed(2)} VND
    </p>

    <p>
      If you have any questions, feel free to contact us at 
      <a href="mailto:support@vinastyle.com" style="color: #007BFF;">support@vinastyle.com</a>.
    </p>
    <p>Best regards,</p>
    <p><strong>VinaStyle Corp.</strong></p>
    <hr/>
    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
      <p>Vinastyle Company<br>
      123 Fashion Street, Ha Noi City, Vietnam<br>
      Phone: +84 965 373 958<br>
      Shop online: <a href="vinastyle.com.vn" style="color: #007BFF;">vinastyle.com</a>
    </div>
  </div>
`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
      console.log(`Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Could not send order confirmation email');
    }
  }
  async sendResetPasswordEmail(email: string) {
    // Kiểm tra email có tồn tại
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error();
    }

    // Tạo token reset mật khẩu (sử dụng JWT hoặc uuid)
    const token = this.jwtService.sign(
      { email: user.email, id: user.userId },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        algorithm: 'HS256',
        expiresIn: '1h',
      }, // Token hết hạn trong 1 giờ
    );

    // Tạo link reset mật khẩu
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Nội dung email
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/bookstore-online-5335a.appspot.com/o/book_covers%2Fvinastyle.png?alt=media&token=599fbd11-ec3c-4196-b504-405e58474fbd" 
        alt="Company Logo" 
        style="width: 150px; height: auto; margin-bottom: 5px;"
      />
    </div>  
    <p style="font-size: 16px;">Hello <strong>${user.lastName ?? 'User'}</strong>,</p>
      <p style="font-size: 15px;">
        We received a request to reset your password for your account.
      </p>
      <p style="font-size: 15px;">
        Please click the button below to reset your password:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a 
          href="${resetLink}" 
          style="
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>
      </div>
      <p style="font-size: 15px;">
        If you did not request to reset your password, please ignore this email.
      </p>
      <p style="font-size: 15px; margin-top: 20px;">
        Best regards,<br>
        <strong>VinaStyle Corp.</strong>
      </p>
    </div>
  `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password reset request',
        html,
      });
      console.log(`Reset password email sent to ${email}`);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
  }
  async sendVerificationCode(email: string, code: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/bookstore-online-5335a.appspot.com/o/book_covers%2Fvinastyle.png?alt=media&token=599fbd11-ec3c-4196-b504-405e58474fbd" 
        alt="Company Logo" 
        style="width: 150px; height: auto; margin-bottom: 5px;"
      />
    </div>  
    <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 15px;">
        Thank you for signing up. Please use the verification code below to activate your account:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <h2 style="color: #007BFF;">${code}</h2>
      </div>
      <p style="font-size: 15px;">
        If you did not request to reset your password, please ignore this email.
      </p>
      <p style="font-size: 15px; margin-top: 20px;">
        Best regards,<br>
        <strong>VinaStyle Corp.</strong>
      </p>
    </div>
  `;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Account Verification Code',
        html: html,
      });
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Could not send verification email');
    }
  }
}
