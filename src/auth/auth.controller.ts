import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('sign-up')
    signUp() {
        return 'I am sign up'
    }

    @Post('sign-in')
    signIn() {
        return 'I am sign in'
    }

    @Post('sign-out')
    signOut() {
        return 'I am sign out'
    }

}