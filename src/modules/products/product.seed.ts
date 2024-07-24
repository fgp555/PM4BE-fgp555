// src/product/product.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { Category } from '../categories/categories.entity';
import { productSeeder } from 'src/pre-load/productSeeder';

@Injectable()
export class ProductSeederService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    for (const product of productSeeder) {
      const category = await this.categoryRepository.findOneBy({
        name: product.category,
      });
      if (category) {
        const exists = await this.productRepository.findOneBy({
          name: product.name,
        });
        if (!exists) {
          await this.productRepository.save({
            ...product,
            category: category,
          });
        }
      }
    }
  }
}
