// src/orders/dto/create-order.dto.ts

import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'UUID_PRODUCT',
    description: 'The id of the product',
  })
  id: string;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: "UUID_USER",
    description: 'The id of the user',
  })
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
