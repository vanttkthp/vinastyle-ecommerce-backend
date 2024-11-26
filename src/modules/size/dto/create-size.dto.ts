import { SizeType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateSizeDto {
  @IsNotEmpty()
  @IsEnum(SizeType, {
    message: `Must be an accurate size type. Valid options are: ${Object.values(SizeType).join(', ')}`,
  })
  sizeType: SizeType;
}
