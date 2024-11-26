import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  addressDetail: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  ward: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  houseNumber: string;

  @IsString()
  @IsOptional()
  postalCode: string;
}
