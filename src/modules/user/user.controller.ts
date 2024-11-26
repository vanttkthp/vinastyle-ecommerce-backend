import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessTokenGuard } from '../auth/guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleName, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersSearchParamsDto } from './dto/users-search-params.dto';

@Controller(
    {
        path: 'api/v1/users',
        version: '1'
    }
)
export class UserController {
    constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAccessTokenGuard)
    @Get('/profile')
    getUser(@Req() req) {
        return req.user;
    }

    @UseGuards(JwtAccessTokenGuard)
    @Put('/update')
    updateUser(@Req() req, @Body() data: UpdateUserDto) {
        console.log(data);
        return this.userService.updateUser(req.user.userId, data);
    }

    // @Roles(RoleName.ADMIN, RoleName.STAFF)
	// @UseGuards(RolesGuard)
	// @UseGuards(JwtAccessTokenGuard)
    @Get('/all')
    getAllUser(@Query() searchParams: UsersSearchParamsDto) {
        return this.userService.getAllUser(searchParams);
    }

    @Roles(RoleName.ADMIN)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Delete('/delete/:userId')
    deleteUserByUserId(@Param('userId') userId: string) {
        return this.userService.deleteUserByUserId(userId);
    }

    @Roles(RoleName.ADMIN)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Put('/update-role/:userId')
    updateUserRole(@Param('userId') userId: string, @Body('roleName') roleName: RoleName) {
        return this.userService.updateUserRole(userId, roleName);
    }
}