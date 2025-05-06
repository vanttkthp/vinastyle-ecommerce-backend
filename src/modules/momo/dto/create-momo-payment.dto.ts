import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMomoPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  orderId: string;
  
  orderInfo: string;
}
