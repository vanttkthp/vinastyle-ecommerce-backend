import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod } from '@prisma/client';
import { GetRevenueInput } from './dto/get-revenue-input.dto';
import { dot } from 'node:test/reporters';

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}

  async getRevenue(dto: GetRevenueInput) {
    // Validate input nếu cần thiết
    if (!dto.status) {
      throw new Error('Status is required');
    }

    // Query Prisma để tính tổng amount
    const totalAmount = await this.prismaService.payment.aggregate({
      where: {
        status: dto.status,
        paymentDate: {
          gte: new Date(dto.startDate), // Greater than or equal to startDate
          lte: new Date(dto.endDate), // Less than or equal to endDate
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalAmount: totalAmount._sum.amount || 0,
    };
  }

  async getRevenueByDay(dto: GetRevenueInput) {
    // Validate input nếu cần thiết
    if (!dto.status || !dto.startDate || !dto.endDate) {
      throw new Error('Status, startDate, and endDate are required');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // Query Prisma để thống kê doanh thu theo ngày
    const dailyRevenue = await this.prismaService.payment.groupBy({
      by: ['paymentDate'], // Group by ngày thanh toán
      where: {
        status: dto.status,
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true, // Tổng doanh thu theo ngày
      },
      orderBy: {
        paymentDate: 'asc', // Sắp xếp theo ngày tăng dần
      },
    });

    // Nhóm dữ liệu theo ngày và tính tổng
    const groupedData = dailyRevenue.reduce((acc, record) => {
      const date = record.paymentDate.toISOString().split('T')[0]; // Định dạng ngày YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = 0; // Khởi tạo nếu chưa tồn tại
      }
      acc[date] += record._sum.amount || 0; // Cộng dồn số lượng
      return acc;
    }, {});

    // Chuyển đổi dữ liệu thành mảng kết quả
    return Object.entries(groupedData).map(([date, totalAmount]) => ({
      date,
      totalAmount,
    }));
  }

  async getProductsSoldByDay(dto: GetRevenueInput) {
    // Validate input nếu cần thiết
    if (!dto.startDate || !dto.endDate) {
      throw new Error('startDate and endDate are required');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // Query Prisma để thống kê số sản phẩm bán được theo ngày
    const dailyProductSales = await this.prismaService.orderItem.groupBy({
      by: ['createdAt'], // Nhóm theo cột `createdAt` (ngày tạo)
      where: {
        createdAt: {
          gte: startDate, // Lọc ngày bắt đầu
          lte: endDate, // Lọc ngày kết thúc
        },
        order: {
          status: 'PENDING',
        },
      },
      _sum: {
        quantity: true, // Tổng số lượng sản phẩm bán được
      },
      orderBy: {
        createdAt: 'asc', // Sắp xếp theo ngày tăng dần
      },
    });

    // Nhóm dữ liệu theo ngày và tính tổng
    const groupedData = dailyProductSales.reduce((acc, record) => {
      const date = record.createdAt.toISOString().split('T')[0]; // Định dạng ngày YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = 0; // Khởi tạo nếu chưa tồn tại
      }
      acc[date] += record._sum.quantity || 0; // Cộng dồn số lượng
      return acc;
    }, {});

    // Chuyển đổi dữ liệu thành mảng kết quả
    return Object.entries(groupedData).map(([date, totalProductsSold]) => ({
      date,
      totalProductsSold,
    }));
  }

  async getTotalProductsSold(dto: GetRevenueInput) {
    // Validate input nếu cần thiết
    if (!dto.startDate || !dto.endDate) {
      throw new Error('startDate and endDate are required');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // Query Prisma để tính tổng số lượng sản phẩm bán được
    const totalProducts = await this.prismaService.orderItem.aggregate({
      where: {
        createdAt: {
          gte: startDate, // Lọc ngày bắt đầu
          lte: endDate, // Lọc ngày kết thúc
        },
        order: {
          status: 'PENDING',
        },
      },
      _sum: {
        quantity: true, // Tổng số lượng sản phẩm bán được
      },
    });

    // Trả về kết quả tổng
    return {
      totalProductsSold: totalProducts._sum.quantity, // Tổng số sản phẩm bán được
    };
  }
}
