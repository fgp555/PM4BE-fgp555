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
import { ProductService } from './products.service';
import { Response } from 'express';
import { IProduct } from './products.interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsDbService } from './productsDb.service';
import { Product, Product as ProductEntity } from './products.entity';
import { ProductSeederService } from './product.seed';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productsDbService: ProductsDbService,
    private readonly productSeederService: ProductSeederService,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Post('seeder')
  @HttpCode(HttpStatus.CREATED)
  async seed() {
    await this.productSeederService.seed();
    return {
      message: 'Database seeding successful',
    };
  }

  @Get()
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Res() res: Response,
  ) {
    const products = await this.productsDbService.getAllProducts(page, limit);
    res.status(HttpStatus.OK).json(products);
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const product = await this.productsDbService.getProductById(id);
    res.status(HttpStatus.OK).json(product);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() product: CreateProductDto, @Res() res: Response) {
    const category = await this.categoryRepository.findOneBy({
      name: product.category,
    });
    console.log('76 category', category);

    if (category) {
      const exists = await this.productRepository.findOneBy({
        name: product.name,
      });
      console.log('80 exists', exists);
      if (!exists) {
        await this.productRepository.save({
          ...product,
          category: category,
        });
      }
    }

    const result = await this.productsDbService.createProduct(product);
    res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: Partial<IProduct>,
    @Res() res: Response,
  ) {
    const updatedId = await this.productsDbService.updateProduct(id, product);
    res.status(HttpStatus.OK).json({ id: updatedId });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    console.log('109 id', id);
    const deletedId = await this.productsDbService.deleteProduct(id);
    res.status(HttpStatus.OK).json({ id: deletedId });
  }
}
