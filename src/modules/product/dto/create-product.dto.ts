import { SizeType } from '@prisma/client';

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

type Variant = {
  colorId: string;
  sizeId: string;
  stock: number;
};

type Image = {
  url: string;
  colorName: string;
};

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
  brandId: string = 'mlb';

  //product-variant

  // @IsNotEmpty()
  // @IsString()
  // sizeId: string;
  // @IsNotEmpty()
  // @IsNumber()
  // stock: number;

  //images
  @IsNotEmpty()
  @IsArray()
  images: Image[];

  @IsArray()
  @IsNotEmpty()
  variants: Variant[];
}
