import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  productId: string; // ID of the product being reviewed

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number; // Rating given by the user (e.g., 1 to 5 stars)

  @IsOptional()
  @IsString()
  comment?: string; // Review comment or feedback

  @IsOptional()
  images?: string[]; // Optional array of image URLs related to the review
}
