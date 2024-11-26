import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubCategoryDto {
    @IsString()
    @IsNotEmpty()
    categoryId: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description: string
}
