import { Injectable, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { userId: id } });
    return user;
  }

  async getUserWithRole(userId: string): Promise<Partial<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId },
        select: {
          userId: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          avatar: true,
          gender: true,
          roleId: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
