import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateColorDto {
  @IsArray()
  @IsNotEmpty()
  name: string[];

  @IsArray()
  @IsNotEmpty()
  hexCode: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
