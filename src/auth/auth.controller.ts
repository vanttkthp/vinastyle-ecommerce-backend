import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('sign-up')
    signUp(@Body() dto: AuthDto) {
        console.log(dto);
        return this.authService.signUp(dto);
    }

    @Post('sign-in')
    signIn(@Body() dto: AuthDto) {
        return this.authService.signIn(dto);
    }

    @Post('sign-out')
    signOut() {
        return this.authService.signOut();
    }

}