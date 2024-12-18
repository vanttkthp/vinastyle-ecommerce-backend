import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEnum(Gender, { message: 'Gender must be a valid value' })
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsOptional()
  defaultAddress: string;
}
