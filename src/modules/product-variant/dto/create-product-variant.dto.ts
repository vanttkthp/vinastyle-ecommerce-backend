import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  productId: string; //lấy cái id của cái product vừa tạo

  @IsString()
  @IsNotEmpty()
  sizeId: string; //chọn từ list

  @IsString()
  @IsNotEmpty()
  colorId: string; //chọn từ list

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  SKU: string;
}
