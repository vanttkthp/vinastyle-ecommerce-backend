import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { LocalAuthGuard, JwtAccessTokenGuard } from './guards';
import { RequestWithUser } from 'src/types/request.type';
import e from 'express';

@Controller({
  path: 'api/v1/auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const role = user.roleName;
    const token = await this.authService.signIn(user.userId);
    return {
      role: role,
      accessToken: token.accessToken,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('sign-out')
  signOut(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authService.signOut(user.userId);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() body: { newPassword: string; confirmNewPassword: string },
  ) {
    const { newPassword, confirmNewPassword } = body;
    return await this.authService.resetPassword(
      token,
      newPassword,
      confirmNewPassword,
    );
  }

  @Post('verify-account')
  async verifyAccount(@Body() body: {code: string }, @Query('email') email: string) {
    const { code } = body;
    return this.authService.verifyAccount(email, code);
  }
}
