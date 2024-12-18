import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class GetRevenueInput {
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsOptional()
  startDate: Date

  @IsOptional() 
  endDate: Date
}
