import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    // ========== userFound ==========
    const userFound = await this.userRepository.findOneBy({ id: userId });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    // ========== newOrder ==========
    const newOrder = new Order();
    newOrder.user_id = userFound;
    await this.orderRepository.save(newOrder);

    // ========== productFound ==========
    let totalAmount = 0;
    const orderDetails = [];

    for (const productRequest of products) {
      const productFound = await this.productRepository.findOneBy({
        id: productRequest.id,
      });
      if (!productFound) {
        throw new NotFoundException(
          `Product with id ${productRequest.id} not found`,
        );
      }

      // if (productFound.stock <= 0) {
      //   throw new BadRequestException(`Product with id ${productRequest.id} is out of stock`);
      // }

      const newOrderDetail = new OrderDetail();
      newOrderDetail.order_id = newOrder;
      newOrderDetail.product_id = productFound;
      newOrderDetail.price = productFound.price;
      await this.orderDetailRepository.save(newOrderDetail);
    }

    // complete the code
    return body;
  }

  async getOrderService() {
    return await this.orderRepository.find();
  }
}
