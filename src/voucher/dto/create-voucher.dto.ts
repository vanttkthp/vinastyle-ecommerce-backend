import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsOptional()
  discountAmount: number;

  @IsNumber()
  @IsOptional()
  discountPercentage: number;

  @IsDate()
  @IsNotEmpty()
  expiryDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  description: string;
}
