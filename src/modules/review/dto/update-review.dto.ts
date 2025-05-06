import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsNotEmpty } from 'class-validator';
import { ReviewStatus } from '@prisma/client';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsNotEmpty()
  status: ReviewStatus;
}
