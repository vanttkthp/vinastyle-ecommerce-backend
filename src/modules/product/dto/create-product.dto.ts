import { SizeType } from '@prisma/client';

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  categoryId: string;
  @IsNotEmpty()
  @IsString()
  subCategoryId: string;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  brandId: string = "mlb";

  //product-variant
  @IsNotEmpty()
  @IsString()
  colorId: string;
  // @IsNotEmpty()
  // @IsString()
  // sizeId: string;
  // @IsNotEmpty()
  // @IsNumber()
  // stock: number;

  //images
  @IsNotEmpty()
  @IsArray()
  imageURLs: string[];
}
