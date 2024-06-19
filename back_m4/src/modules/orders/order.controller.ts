// src/modules/orders/order.controller.ts

import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async addOrderController(@Body() order: any) {
    const result = await this.orderService.addOrderService(order);
    return result
  }

  @Get()
  async getOrderController() {
    const result = await this.orderService.getOrderService();
    return result
  }
}
