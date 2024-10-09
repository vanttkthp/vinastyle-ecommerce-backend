import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { Response } from 'express';

@Injectable({})
export class AuthService {
  private SALT_ROUNDS = 10;
  private SALT = bcrypt.genSaltSync(this.SALT_ROUNDS);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
      const user = await this.prisma.user.create({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
        },
      });
      const accessToken = this.generateAccessToken({
        sub: user.userId,
      });
      return {
        accessToken,
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
        roleId: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        avatar: true,
        gender: true,
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
      throw new BadRequestException('Invalid password');
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
}
