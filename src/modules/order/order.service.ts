import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentMethod, ShipmentMethod } from '@prisma/client';
import { formatDate } from 'src/helpers';
import { PageOptionDto } from 'src/common/dtos/page-option.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { foundAllMessage, model } from 'src/enums';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(id: string) {
    const orderItems = await this.prismaService.orderItem.findMany({
      where: {
        orderId: id,
      },
    });
    let totalPrice = 0;
    orderItems.forEach((item) => {
      totalPrice += item.total;
    });
    const order = await this.prismaService.order.create({
      data: {
        userId: id,
        totalPrice: totalPrice,
        status: 'IN_CART',
        totalAmount: totalPrice,
      },
    });

    return order;
  }

  async findCartByUserId(id: string) {
    const cart = await this.prismaService.order.findFirst({
      where: {
        userId: id,
        status: 'IN_CART',
      },
      select: {
        orderId: true,
        totalPrice: true,
        orderItems: {
          select: {
            orderItemId: true,
            quantity: true,
            total: true,
            productVariant: {
              select: {
                size: true,
                color: true,
                colorId: true,
                productId: true,
                productVariantId: true,
                product: {
                  select: {
                    name: true,
                    price: true,
                    images: true,
                    productId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    cart.orderItems.forEach((item) => {
      const { colorId, productId } = item.productVariant;
      item.productVariant.product.images =
        item.productVariant.product.images.filter(
          (image) => image.colorId === colorId && image.productId === productId,
        );
    });

    const orderItems = cart.orderItems.map((item) => ({
      orderItemId: item.orderItemId,
      quantity: item.quantity,
      total: item.total,
      price: item.productVariant.product.price,
      name: item.productVariant.product.name,
      color: item.productVariant.color.name[0],
      size: item.productVariant.size.sizeType,
      imageURL: item.productVariant.product.images[0].imageURL,
      productId: item.productVariant.productId,
      productVariantId: item.productVariant.productVariantId
    }));

    return {
      orderId: cart.orderId,
      totalPrice: cart.totalPrice,
      orderItems: orderItems,
    };
  }

  //tracking order status
  async findOrdersByUser(id: string, status: OrderStatus) {
    if (status === OrderStatus.IN_CART) throw new BadRequestException();
    const orders = await this.prismaService.order.findMany({
      where: {
        userId: id,
        status: {
          equals: status,
        },
      },
      select: {
        orderId: true,
        userId: true,
        totalAmount: true,
        totalPrice: true,
        orderDate: true,
        orderItems: {
          select: {
            orderItemId: true,
            quantity: true,
            total: true,
            productVariant: {
              select: {
                color: {
                  select: {
                    hexCode: true,
                    name: true
                  },
                },
                size: {
                  select: {
                    sizeType: true,
                  },
                },
                product: {
                  select: {
                    images: {
                      select: {
                        imageURL: true,
                      },
                    },
                    name: true,
                    price: true
                  },
                },
              },
            },
          },
        },
        discountAmount: true,
        shipmentId: true,
        note: true,
        status: true,
      },
    });
    const filteredOrders = orders.filter((item) => item.status !== 'IN_CART');
    return filteredOrders;
  }

  async findOrdersByUserId(id: string, status: OrderStatus) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userId: id,
        status: {
          equals: status,
        },
      },
    });
    return orders;
  }

  async findAll(pageOption: PageOptionDto) {
    const { page, limit, skip, status } = pageOption;

    const whereCondition = status ? { status: { equals: status } } : {};

    const total = await this.prismaService.order.count({
      where: whereCondition,
    });

    const orders = await this.prismaService.order.findMany({
      where: whereCondition,
      take: limit,
      skip: skip,
      select: {
        status: true,
        orderId: true,
        user: {
          select: {
            lastName: true,
            firstName: true,
          },
        },
        payment: {
          select: {
            paymentMethod: true,
          },
        },
        shipment: {
          select: {
            estimatedDeliveryDate: true,
          },
        },
      },
    });

    return new PageDto(
      orders,
      new PageMetaDto(total, page, limit, foundAllMessage(total, model.ORDER)),
    );
  }

  private calculateCost(method: string, city: string) {
    if (city === 'HANOI')
      switch (method) {
        case 'EXPRESS':
          return 30000;
        case 'SHIPMENT':
          return 15000;
        default:
          return 0;
      }
    else {
      switch (method) {
        case 'EXPRESS':
          return 60000;
        case 'SHIPMENT':
          return 30000;
        default:
          return 0;
      }
    }
  }

  private calculateEstimatedDeliveryDate(method: string, city: string) {
    const now = new Date();

    if (city === 'HANOI') {
      if (method === 'EXPRESS') {
        // Giao hàng trong vòng 6-12 tiếng
        const hoursToAdd = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
        now.setHours(now.getHours() + hoursToAdd);
      } else if (method === 'SHIPMENT') {
        // Giao hàng trong vòng 2-3 ngày
        const daysToAdd = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
        now.setDate(now.getDate() + daysToAdd);
      }
    } else {
      if (method === 'EXPRESS') {
        // Giao hàng trong vòng 6-12 tiếng
        const daysToAdd = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
        now.setDate(now.getDate() + daysToAdd);
      } else if (method === 'SHIPMENT') {
        // Giao hàng trong vòng 2-3 ngày
        const daysToAdd = Math.floor(Math.random() * (5 - 4 + 1)) + 4;
        now.setDate(now.getDate() + daysToAdd);
      }
    }

    return now;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.prismaService.order.findFirst({
      where: {
        userId: id,
        status: 'IN_CART',
      },
    });
    if (order.totalPrice === 0)
      throw new BadRequestException('Should buy something!');
    const address = await this.prismaService.address.create({
      data: {
        addressDetail: dto.addressDetail,
        city: dto.city,
        district: dto.district,
        ward: dto.ward,
        userId: id,
      },
    });
    if (address) {
      const shipment = await this.prismaService.shipment.create({
        data: {
          address: {
            connect: { addressId: address.addressId },
          },
          shipmentMethod: dto.shipmentMethod,
          estimatedCost: this.calculateCost(dto.shipmentMethod, dto.city),
          estimatedDeliveryDate: this.calculateEstimatedDeliveryDate(
            dto.shipmentMethod,
            dto.city,
          ),
        },
      });
      if (shipment) {
        const updatedOrder = await this.prismaService.order.update({
          where: {
            orderId: order.orderId,
          },
          data: {
            shipment: {
              connect: { shipmentId: shipment.shipmentId },
            },
            payment: {
              connect: { paymentId: dto.paymentId },
            },
            status: OrderStatus.PENDING,
            totalAmount: order.totalPrice + shipment.estimatedCost,
          },
        });
        if (updatedOrder) {
          await this.create(id);
        }
        return {
          updatedOrder,
          ...shipment,
          shipmentDate: formatDate(shipment.shipmentDate),
          estimatedDeliveryDate: formatDate(shipment.estimatedDeliveryDate),
        };
      }
    }

    return {
      message: 'Something went wrong',
    };
  }
}
