import { Controller, Get, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAccessTokenGuard } from 'src/auth/guards';

@Controller(
    {
        path: 'api/v1/users',
        version: '1'
    }
)
export class UserController {
    constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAccessTokenGuard) // Thêm vào đây
    @Get('/profile')
    getUser(@Req() req) {
        return req.user;
    }
    
}