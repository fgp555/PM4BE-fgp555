// src/products/product.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './products.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsDbService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // ========================================
  async createProduct(product: Omit<Product, 'orderDetails' | 'id'>) {
    const newProduct = this.productsRepository.create(product);
    const savedProduct = await this.productsRepository.save(newProduct);
    return savedProduct;
  }

  // ========================================
  async getAllProducts(page: number = 1, limit: number = 5) {
    const [result, total] = await this.productsRepository.findAndCount({
      where: {
        stock: MoreThan(0),
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ========================================
  async findByName(name: string) {
    return this.productsRepository.findOne({ where: { name } });
  }

  // ========================================
  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // ========================================
  async updateProduct(id: string, productUpdate: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const foundCategory = await this.categoryRepository.findOne({
      where: { name: productUpdate.category },
    });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(product, productUpdate);
    product.category = foundCategory;
    await this.productsRepository.save(product);
    return product;
  }

  // ========================================
  async deleteProduct(id: string) {
    const deleteResult = await this.productsRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Product not found');
    }
    return deleteResult;
  }
}
