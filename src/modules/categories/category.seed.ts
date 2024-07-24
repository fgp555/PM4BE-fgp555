// src/category/category.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { categoriesSeeder } from 'src/pre-load/categoriesSeeder';

@Injectable()
export class CategorySeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    for (const category of categoriesSeeder) {
      const exists = await this.categoryRepository.findOneBy({
        name: category.name,
      });
      if (!exists) {
        await this.categoryRepository.save(category);
        console.info(`Category ${category.name} created`);
      } else {
        console.info(`Category ${category.name} already exists`);
      }
    }
  }
}
