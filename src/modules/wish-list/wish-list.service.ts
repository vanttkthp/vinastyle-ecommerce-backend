import { Injectable } from '@nestjs/common';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';

@Injectable()
export class WishListService {
  create(createWishListDto: CreateWishListDto) {
    return 'This action adds a new wishList';
  }

  findAll() {
    return `This action returns all wishList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishList`;
  }

  update(id: number, updateWishListDto: UpdateWishListDto) {
    return `This action updates a #${id} wishList`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishList`;
  }
}
