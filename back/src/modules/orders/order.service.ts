import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';
import { OrderDetail } from '../order-details/order-details.entity';

@Injectable()
export class OrderService {
  constructor(
    // @InjectRepository(Order)
    // private readonly orderRepository: Repository<Order>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async addOrderService(body: any) {
    const { userId, products } = body;
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    
    // complete the code
    return body;
  }

  async getOrderService() {
    return await this.orderRepository.find();
  }
}
