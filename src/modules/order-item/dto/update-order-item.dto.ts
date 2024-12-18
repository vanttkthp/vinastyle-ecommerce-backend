import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
