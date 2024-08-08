import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategorySeederService } from './category.seed';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDTO } from './dtos/category.entity';
import { Roles } from '../users/decorator/roles.decorator';
import { RolesEnum } from '../users/enum/roles.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../users/roles.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categorySeederService: CategorySeederService,
  ) {}

  // ========================================
  @Post('seeder')
  @HttpCode(HttpStatus.CREATED)
  async seeder() {
    await this.categorySeederService.seed();
    return {
      message: 'categories Database seeding successful',
    };
  }

  // ========================================
  @Get()
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  // ========================================
  @Post()
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async addCategories(@Body() category: CreateCategoryDTO) {
    console.log("addCategories")
    try {
      return await this.categoryService.addCategories(category);
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          statusCode: 409,
          message: error.message,
        };
      }
      throw error;
    }
  }
}
