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
} from '@nestjs/common';
import { ProductService } from './products.service';
import { Response } from 'express';
import { IProduct } from './products.interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsDbService } from './productsDb.service';
import { Product as ProductEntity } from './products.entity';
import { ProductSeederService } from './product.seed';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productsDbService: ProductsDbService,
    private readonly productSeederService: ProductSeederService,
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

  // @Get(':id')
  // async getProduct(@Param('id') id: string, @Res() res: Response) {
  //   const product = await this.productService.getProductById(Number(id));
  //   res.status(HttpStatus.OK).json(product);
  // }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() product: ProductEntity, @Res() res: Response) {
    const result = await this.productsDbService.createProduct(product);
    res.status(HttpStatus.CREATED).json(result);
  }

  // @Put(':id')
  // @UseGuards(AuthGuard)
  // async updateProduct(
  //   @Param('id') id: string,
  //   @Body() product: Partial<IProduct>,
  //   @Res() res: Response,
  // ) {
  //   const updatedId = await this.productService.updateProduct(
  //     Number(id),
  //     product,
  //   );
  //   res.status(HttpStatus.OK).json({ id: updatedId });
  // }

  // @Delete(':id')
  // @UseGuards(AuthGuard)
  // async deleteProduct(@Param('id') id: string, @Res() res: Response) {
  //   const deletedId = await this.productService.deleteProduct(Number(id));
  //   res.status(HttpStatus.OK).json({ id: deletedId });
  // }
}
