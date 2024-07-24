// src/products/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsUrl,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
  @IsOptional()
  @ApiProperty({
    description: 'Product name',
    example: 'Update Product',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  @MaxLength(500, {
    message: 'La descripción no debe superar los 500 caracteres',
  })
  @IsOptional()
  @ApiProperty({
    description: 'Product description ',
    example: 'This is a Update product',
  })
  description: string;

  @IsNumber()
  @Min(0, { message: 'El precio debe ser al menos 0' })
  @IsOptional()
  @ApiProperty({
    description: 'Product price',
    example: 1000,
  })
  price: number;

  @IsNumber()
  @Min(0, { message: 'El stock debe ser al menos 0' })
  @IsOptional()
  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es requerida' })
  @MinLength(3, { message: 'La categoría debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La categoría no debe superar los 50 caracteres' })
  @IsOptional()
  @ApiProperty({
    description: 'Product category',
    example: 'smartphone',
  })
  category: string;

  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  @IsOptional()
  @ApiProperty({
    description: 'Product image url',
    example: 'https://example.com/image.png',
  })
  imgUrl: string;
}
