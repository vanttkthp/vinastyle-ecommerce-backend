import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Gender, Role, RoleName, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersSearchParamsDto } from './dto/users-search-params.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    try {
      await this.prisma.user.update({
        where: { userId: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          gender: data.gender as Gender,
          avatar: data.avatar,
          password: data.password,
        },
      });
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      error.message = 'User updated failed';
      return {
        message: error.message,
      };
    }
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
          roleName: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  //Admin
  async getAllUser(searchParams: UsersSearchParamsDto) {
    const { firstName, lastName, email, phoneNumber, roleName, gender } =
      searchParams;
    if (roleName && !Object.values(RoleName).includes(roleName as RoleName)) {
      throw new BadRequestException(`Invalid roleName: ${roleName}`);
    }
    const users = await this.prisma.user.findMany({
      where:
        firstName || lastName || email || phoneNumber || roleName || gender
          ? {
              OR: [
                {
                  firstName: {
                    contains: firstName,
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: lastName,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: email,
                    mode: 'insensitive',
                  },
                },
                {
                  phoneNumber: {
                    contains: phoneNumber,
                    mode: 'insensitive',
                  },
                },
                {
                  roleName: {
                    equals: roleName as RoleName,
                  },
                },
                {
                  gender: {
                    equals: gender as Gender,
                  },
                },
              ],
            }
          : {},
      select: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        avatar: true,
        gender: true,
        roleName: true,
      },
    });
    if (!users) {
      return {
        message: 'No users found.',
      };
    }
    return users;
  }

  async updateUserRole(userId: string, roleName: RoleName) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId: userId },
      });
      if (!user) {
        return {
          message: 'User not found',
        };
      }
      await this.prisma.user.update({
        where: { userId: userId },
        data: {
          roleName: roleName,
        },
      });
      return {
        message: 'User role updated successfully',
      };
    } catch (error) {
      error.message = 'User role updated failed';
      return {
        message: error.message,
      };
    }
  }

  async deleteUserByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId: userId },
    });
    if (!user) {
      return {
        message: 'User not found',
      };
    }
    await this.prisma.user.delete({
      where: { userId: userId },
    });
    return {
      message: 'User deleted successfully',
    };
  }
}
