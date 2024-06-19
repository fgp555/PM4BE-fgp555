// src/products/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { IProduct } from './products.interfaces';

@Injectable()
export class ProductsDbService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createProduct(product: Product): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    const savedProduct = await this.productsRepository.save(newProduct);
    return savedProduct;
  }

  async getAllProducts(page: number = 1, limit: number = 5): Promise<any[]> {
    const [result, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return result;
  }

  //   async getProductById(id: number): Promise<IProduct> {
  //     const product = await this.productRepository.findOne({ where: { id } });
  //     if (!product) {
  //       throw new NotFoundException('Product not found');
  //     }
  //     return product;
  //   }

  //   async updateProduct(
  //     id: number,
  //     productData: Partial<IProduct>,
  //   ): Promise<number> {
  //     const product = await this.productRepository.findOne({ where: { id } });
  //     if (!product) {
  //       throw new NotFoundException('Product not found');
  //     }
  //     Object.assign(product, productData);
  //     await this.productRepository.save(product);
  //     return product.id;
  //   }

  //   async deleteProduct(id: number): Promise<number> {
  //     const deleteResult = await this.productRepository.delete(id);
  //     if (deleteResult.affected === 0) {
  //       throw new NotFoundException('Product not found');
  //     }
  //     return id;
  //   }
}
