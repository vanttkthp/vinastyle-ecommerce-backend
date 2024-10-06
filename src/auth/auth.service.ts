import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    try {
      const { email, password, confirmPassword } = dto;
      if (password !== confirmPassword) {
        throw new BadRequestException(
          'Password and confirm password do not match',
        );
      }
      const user = await this.prisma.user.findUnique({
        where: {
          email: email, // Ensure userEmail is defined and contains a valid email
        },
      });
      if (user) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await this.hashPassword(password);
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      return await this.signToken(newUser.userId, newUser.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async signIn(dto: AuthDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }
    return await this.signToken(user.userId, user.email);
  }

  async signOut() {
    return 'I am sign out';
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Define the number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
    return hashedPassword; // Return the hashed password
  }

  private async signToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return { accessToken: jwtToken };
  }
}
