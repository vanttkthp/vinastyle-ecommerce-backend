import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class OrderItemService {
  constructor(
    private prismaService: PrismaService,
    private orderService: OrderService,
  ) {}

  async create(userId: string, createOrderItemDto: CreateOrderItemDto) {
    return this.prismaService.$transaction(async (prisma) => {
      const productVariant = await prisma.productVariant.findUnique({
        where: {
          productVariantId: createOrderItemDto.productVariantId,
        },
        select: {
          product: {
            select: {
              price: true,
            },
          },
        },
      });

      const order = await prisma.order.findFirst({
        where: {
          userId: userId,
          status: 'IN_CART',
        },
        select: {
          orderId: true,
        },
      });

      if (!productVariant) {
        throw new Error('Product variant not found');
      }

      const existingOrderItem = await prisma.orderItem.findFirst({
        where: {
          productVariantId: createOrderItemDto.productVariantId,
          orderId: order.orderId,
          order: {
            status: 'IN_CART',
          },
        },
      });

      let orderItem;

      if (existingOrderItem) {
        // Cập nhật orderItem đã tồn tại: tăng số lượng và cập nhật tổng giá trị
        orderItem = await prisma.orderItem.update({
          where: {
            orderItemId: existingOrderItem.orderItemId, // Sử dụng khóa chính để cập nhật đúng orderItem
          },
          data: {
            quantity: existingOrderItem.quantity + createOrderItemDto.quantity, // Cộng dồn số lượng
            total:
              (existingOrderItem.quantity + createOrderItemDto.quantity) *
              productVariant.product.price, // Cập nhật tổng giá
          },
        });
      } else {
        // Tạo mới orderItem
        orderItem = await prisma.orderItem.create({
          data: {
            quantity: createOrderItemDto.quantity,
            total: productVariant.product.price * createOrderItemDto.quantity,
            productVariant: {
              connect: {
                productVariantId: createOrderItemDto.productVariantId,
              },
            },
            order: {
              connect: { orderId: order.orderId },
            },
          },
        });
      }

      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: order.orderId,
        },
      });

      const totalPrice = orderItems.reduce((sum, item) => sum + item.total, 0);

      await prisma.order.update({
        where: {
          userId: userId,
          orderId: order.orderId,
          status: 'IN_CART',
        },
        data: {
          totalPrice: totalPrice,
        },
      });

      return orderItem;
    });
  }

  findAll() {
    return `This action returns all orderItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  async update(
    userId: string,
    updateOrderItemDto: UpdateOrderItemDto
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      const productVariant = await prisma.productVariant.findUnique({
        where: {
          productVariantId: updateOrderItemDto.productVariantId,
        },
        select: {
          product: {
            select: {
              price: true,
            },
          },
        },
      });
  
      const order = await prisma.order.findFirst({
        where: {
          userId: userId,
          status: 'IN_CART',
        },
        select: {
          orderId: true,
        },
      });
  
      if (!productVariant) {
        throw new Error('Product variant not found');
      }
  
      if (!order) {
        throw new Error('No active cart found for the user');
      }
  
      const existingOrderItem = await prisma.orderItem.findFirst({
        where: {
          productVariantId: updateOrderItemDto.productVariantId,
          orderId: order.orderId,
          order: {
            status: 'IN_CART',
          },
        },
      });
  
      if (!existingOrderItem) {
        throw new Error('Order item not found');
      }
  
      // Update the existing order item with new quantity and total price
      const updatedOrderItem = await prisma.orderItem.update({
        where: {
          orderItemId: existingOrderItem.orderItemId,
        },
        data: {
          quantity: updateOrderItemDto.quantity, // Set the new quantity
          total: updateOrderItemDto.quantity * productVariant.product.price, // Update the total
        },
      });
  
      // Recalculate the total price of the entire order
      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: order.orderId,
        },
      });
  
      const totalPrice = orderItems.reduce((sum, item) => sum + item.total, 0);
  
      await prisma.order.update({
        where: {
          userId: userId,
          orderId: order.orderId,
          status: 'IN_CART',
        },
        data: {
          totalPrice: totalPrice,
        },
      });
  
      return updatedOrderItem;
    });
  }
  

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
