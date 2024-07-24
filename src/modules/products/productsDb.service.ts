// src/products/product.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './products.entity';
import { IProduct } from './products.interfaces';
import { OrderDetail } from '../order-details/order-details.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/categories.entity';

@Injectable()
export class ProductsDbService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    // @InjectRepository(OrderDetail)
    // private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async helloProduct() {
    return 'hello Product Service';
  }

  async createProduct(product: any /* Product */) /* : Promise<Product> */ {
    // return product
    const newProduct = this.productsRepository.create(product);
    const savedProduct = await this.productsRepository.save(newProduct);
    return savedProduct;
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 5,
  ) /* : Promise<any[]> */ {
    const [result, total] = await this.productsRepository.findAndCount({
      where: {
        stock: MoreThan(0), // Only select products with stock greater than 0
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

  async findByName(name: string) {
    return this.productsRepository.findOne({ where: { name } });
  }

  async getProductById(id: string) /* : Promise<IProduct> */ {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(id: string, productUpdate: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const allCategories = await this.categoryRepository.find();
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

  async deleteProduct(id: string) {
    const deleteResult = await this.productsRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Product not found');
    }
    // return id;
    return deleteResult;
  }

  // async deleteProduct(id: string) {
  //   const relatedOrderDetails = await this.orderDetailRepository.find({ where: { product_id: id } });

  //   if (relatedOrderDetails.length > 0) {
  //     throw new ConflictException('Cannot delete product because it is referenced in order details');
  //   }

  //   const deleteResult = await this.productsRepository.delete(id);

  //   if (deleteResult.affected === 0) {
  //     throw new NotFoundException('Product not found');
  //   }

  //   return deleteResult;
  // }
}
