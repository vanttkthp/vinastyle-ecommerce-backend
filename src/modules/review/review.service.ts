import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { action, model, SuccessMessage } from 'src/enums';
import { Order } from '../order/entities/order.entity';
import { OrderStatus, ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    try {
      console.log(userId);
      const checkExistingOrder = await this.prismaService.orderItem.findFirst({
        where: {
          order: {
            userId: userId,
            status: {
              in: [
                OrderStatus.SHIPPING,
                OrderStatus.DELIVERED,
                OrderStatus.PENDING,
              ],
            },
          },
          productVariant: {
            productId: createReviewDto.productId,
          },
        },
      });

      if (checkExistingOrder === null) {
        throw new BadRequestException(
          'You have not purchased this product yet!',
        );
      }

      await this.prismaService.review.create({
        data: {
          product: {
            connect: { productId: createReviewDto.productId },
          },
          user: {
            connect: { userId: userId },
          },
          rating: createReviewDto.rating,
          comment: createReviewDto.comment,
          images: createReviewDto.images,
        },
      });
      return {
        message: SuccessMessage(model.REVIEW, action.CREATE),
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  findAll(productId: string) {
    return this.prismaService.review.findMany({
      where: {
        product: {
          productId: productId,
        },
      },
      select: {
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        rating: true,
        comment: true,
        images: true,
        createdAt: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(status: ReviewStatus, reviewId: string) {
    return this.prismaService.review.update({
      where: {
        reviewId: reviewId,
      },
      data: {
        status: status,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
