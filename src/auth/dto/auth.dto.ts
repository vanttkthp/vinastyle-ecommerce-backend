import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    confirmPassword: string;
}