import { Controller, Get, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAccessTokenGuard } from '../auth/guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { USER_ROLE } from '../../constants/user.constant';

@Controller(
    {
        path: 'api/v1/users',
        version: '1'
    }
)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('/profile')
    getUser(@Req() req) {
        return req.user;
    }
    
}