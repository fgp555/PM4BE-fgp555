// src/users/dto/update-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User name description',
    example: 'User 1 Update',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User email description',
    example: 'User123s@gmail.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User password description',
    example: 'User123s@',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User address description',
    example: 'Calle 123',
  })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User phone description',
    example: '123456789',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User address description',
    example: 'Calle 456',
  })
  country: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User city description',
    example: 'Juliaca',
  })
  city: string;
}
