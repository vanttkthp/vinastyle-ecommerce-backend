import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post()
  create(@Body() createWishListDto: CreateWishListDto) {
    return this.wishListService.create(createWishListDto);
  }

  @Get()
  findAll() {
    return this.wishListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishListDto: UpdateWishListDto) {
    return this.wishListService.update(+id, updateWishListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishListService.remove(+id);
  }
}
