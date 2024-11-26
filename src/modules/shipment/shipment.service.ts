import { Injectable } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { ShipmentMethod } from '@prisma/client';

@Injectable()
export class ShipmentService {
  create(createShipmentDto: CreateShipmentDto) {
    return 'This action adds a new shipment';
  }

  async findAllShipmentMethod() {
    return ShipmentMethod;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return `This action updates a #${id} shipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }
}
