// src/products/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  Res,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsDbService } from './productsDb.service';
import { ProductSeederService } from './product.seed';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from '../categories/categories.service';
import { Roles } from '../users/decorator/roles.decorator';
import { RolesEnum } from '../users/enum/roles.enum';
import { RolesGuard } from '../users/roles.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productsDbService: ProductsDbService,
    private readonly productSeederService: ProductSeederService,
    private readonly categoryService: CategoryService,
  ) {}

  // ========================================
  @Post('seeder')
  @HttpCode(HttpStatus.CREATED)
  async seed() {
    await this.productSeederService.seed();
    return {
      message: 'Database seeding successful',
    };
  }

  // ========================================
  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of elements per page',
    schema: { default: 20 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    schema: { default: 1 },
  })
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Res() res: Response,
  ) {
    const products = await this.productsDbService.getAllProducts(page, limit);
    res.status(HttpStatus.OK).json(products);
  }

  // ========================================
  @Get(':id')
  async getProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const product = await this.productsDbService.getProductById(id);
    res.status(HttpStatus.OK).json(product);
  }

  // ========================================
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createProduct(@Body() product: CreateProductDto, @Res() res: Response) {
    const category = await this.categoryService.findByName(product.category);
    if (!category) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Category not found' });
    }

    const exists = await this.productsDbService.findByName(product.name);
    if (exists) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Product already exists' });
    }

    const newProduct = await this.productsDbService.createProduct({
      ...product,
      category,
    });
    return res.status(HttpStatus.CREATED).json(newProduct);
  }

  // ========================================
  @Put(':id')
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: UpdateProductDto,
    @Res() res: Response,
  ) {
    const updatedId = await this.productsDbService.updateProduct(id, product);
    res.status(HttpStatus.OK).json({ id: updatedId });
  }

  // ========================================
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const deletedId = await this.productsDbService.deleteProduct(id);
    res.status(HttpStatus.OK).json({ id: deletedId });
  }
}
