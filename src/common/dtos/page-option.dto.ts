import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

export class PageOptionDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 3;

  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  sortBy?: string;

  sortOrder?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  subCategoryId?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
