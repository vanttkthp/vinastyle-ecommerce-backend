import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';


@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async createAddress(userId: string, data: Partial<CreateAddressDto>) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    await this.prisma.address.create({
      data: {
        addressDetail: data.addressDetail,
        city: data.city,
        district: data.district,
        ward: data.ward,
        street: data.street,
        houseNumber: data.houseNumber,
        postalCode: data.postalCode,
        userId: userId,
      },
    });
    return {
      message: 'Create address successfully',
    };
  }

  async getAllByUserId(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: {
        userId: userId,
      },
      select: {
        addressId: true,
        addressDetail: true,
        street: true,
        houseNumber: true,
        ward: true,
        district: true,
        city: true,
        postalCode: true,
      },
    });
    addresses.map((address) => {
      Object.assign(address, {
        fullAddress:
          `${address.addressDetail}, ` +
          (address.houseNumber ? `${address.houseNumber}, ` : '') +
          (address.street ? `${address.street}, ` : '') +
          `${address.ward}, ${address.district}, ${address.city}` +
          (address.postalCode ? `, ${address.postalCode}` : ''),
      });
    });
    return addresses;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: UpdateAddressDto,
  ) {
    const address = await this.prisma.address.findUnique({
      where: {
        addressId: addressId,
        userId: userId,
      },
    });
    if (!address) {
      throw new Error('Address not found');
    }
    
    await this.prisma.address.update({
      where: {
        addressId: addressId,
        userId: userId,
      },
      data: {
        addressDetail: data.addressDetail || address.addressDetail,
        city: data.city || address.city,
        district: data.district || address.district,
        ward: data.ward || address.ward,
        street: data.street,
        houseNumber: data.houseNumber,
        postalCode: data.postalCode,
      },
    });

    return {
      message: 'Update address successfully',
    };
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: {
        addressId: addressId,
        userId: userId,
      },
    });
    if (!address) {
      throw new Error('Address not found');
    }
    await this.prisma.address.delete({
      where: {
        addressId: addressId,
        userId: userId,
      },
    });
    return {
      message: 'Delete address successfully',
    };
  }
}
