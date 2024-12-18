import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('api/v1/addresses')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @UseGuards(JwtAccessTokenGuard)
    @Post('create')
    async createAddress(@Req() req, @Body() data: CreateAddressDto) {
        return this.addressService.createAddress(req.user.userId, data);
    }

    @UseGuards(JwtAccessTokenGuard)
    @Get('all')
    async getAllAddress(@Req() req) {
        return this.addressService.getAllByUserId(req.user.userId);
    }

    @UseGuards(JwtAccessTokenGuard)
    @Put('update/:addressId')
    async updateAddress(@Req() req, @Param('addressId') addressId: string, @Body() data: UpdateAddressDto) {
        return this.addressService.updateAddress(req.user.userId, addressId, data);
    }

    @UseGuards(JwtAccessTokenGuard)
    @Delete('delete/:addressId')
    async deleteAddress(@Req() req, @Param('addressId') addressId: string) {
        return this.addressService.deleteAddress(req.user.userId, addressId);
    }
}
