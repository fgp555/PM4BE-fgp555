import { Module } from '@nestjs/common';
import { ProductController } from './products.controller';
import { ProductsDbService } from './productsDb.service';
import { Product } from './products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSeederService } from './product.seed';
import { Category } from '../categories/categories.entity';
import { CategoryService } from '../categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [
    ProductsDbService,
    ProductSeederService,
    CategoryService
  ],
  controllers: [ProductController],
  exports: [ProductSeederService],
})
export class ProductsModule {}
