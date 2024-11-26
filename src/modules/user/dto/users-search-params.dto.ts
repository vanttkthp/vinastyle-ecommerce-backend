import { IsOptional, IsString } from "class-validator";

export class UsersSearchParamsDto {
    @IsString()
    @IsOptional()
    firstName: string; 

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    roleName: string;

    @IsString()
    @IsOptional()
    gender: string;
}
