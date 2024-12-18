import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable({})
export class AuthService {
  private SALT_ROUNDS = 10;
  private SALT = bcrypt.genSaltSync(this.SALT_ROUNDS);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private orderService: OrderService,
    private emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      if (signUpDto.password !== signUpDto.confirmPassword) {
        throw new BadRequestException(
          'Password and confirm password do not match!!',
        );
      }
      const existedUser = await this.prisma.user.findUnique({
        where: {
          email: signUpDto.email,
        },
      });
      if (existedUser) {
        throw new ConflictException('Email already existed!!');
      }
      const hashedPassword = await this.hashPassword(signUpDto.password);
      const verificationCode = this.generateVerificationCode();
      const user = await this.prisma.user.create({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
          verificationCode: verificationCode,
        },
        select: {
          userId: true,
        },
      });
      const newOrder = await this.prisma.order.create({
        data: {
          totalAmount: 0,
          totalPrice: 0,
          userId: user.userId,
          status: OrderStatus.IN_CART,
        },
      });
      // const accessToken = this.generateAccessToken({
      //   sub: user.userId,
      // });
      // const order = await this.prisma.order.findMany({
      //   where: {
      //     status: 'IN_CART',
      //   },
      // });
      // console.log(order);
      // if (order) await this.orderService.create(user.userId);

      await this.emailService.sendVerificationCode(
        signUpDto.email,
        verificationCode,
      );

      return {
        message: 'Sign up successfully!!',
      };
    } catch (error) {
      const message = error.message || 'Sign up failed!! Try again later.';
      return {
        message,
      };
    }
  }

  async signIn(userId: string) {
    try {
      const accessToken = this.generateAccessToken({
        sub: userId,
      });
      return {
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }
  async signOut(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    return {
      message: 'Sign out successfully!!',
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.SALT); // Hash the password with the salt
    return hashedPassword; // Return the hashed password
  }

  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        password: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        avatar: true,
        gender: true,
        roleName: true,
      },
    });

    if (!user) {
      // This will throw if user doesn't exist, and it will skip the try-catch block
      throw new BadRequestException('User does not exist');
    }

    await this.verifyPlainContentWithHashedContent(password, user.password);
    try {
      // Try to verify the password if the user exists
      return user;
    } catch (error) {
      // Any other errors (like wrong password) will be caught here
      throw new BadRequestException('Wrong credentials!!');
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const isMatching = await bcrypt.compare(plainText, hashedText);
    if (!isMatching) {
      throw new UnauthorizedException('Invalid password');
    }
  }
  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      algorithm: 'HS256',
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  private async verifyResetToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        algorithms: ['HS256'],
      });
      return decoded; // Trả về thông tin người dùng từ token
    } catch (error) {
      throw new BadRequestException('Token is invalid or expired');
    }
  }
  async resetPassword(
    token: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    const decoded = await this.verifyResetToken(token);
    if (newPassword !== confirmNewPassword)
      throw new BadRequestException(
        'Password and confirm password do not match!!',
      );
    const hashedPassword = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: {
        userId: decoded.id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 chữ số
  }

  private async sendAccountVerificationEmail(userEmail: string) {
    const verificationCode = this.generateVerificationCode();

    // Lưu mã xác nhận vào cơ sở dữ liệu (ví dụ thêm trường `verificationCode` trong user entity)
    await this.prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        verificationCode: verificationCode,
      },
    });

    // Gửi mã xác nhận qua email
    await this.emailService.sendVerificationCode(userEmail, verificationCode);

    return { message: 'Verification code sent to email' };
  }

  async verifyAccount(email: string, code: string) {
    // Lấy người dùng từ cơ sở dữ liệu
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra mã xác nhận
    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    // Cập nhật trạng thái tài khoản
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        isVerified: true,
        verificationCode: null,
      },
    });

    return { message: 'Account verified successfully' };
  }
}
