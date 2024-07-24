import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({
    example: 'Laptops',
    description: 'Name of the new category',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
