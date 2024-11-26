import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { LocalAuthGuard, JwtAccessTokenGuard } from './guards';
import { RequestWithUser } from 'src/types/request.type';

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
}
