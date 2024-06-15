import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // @OneToOne(() => Order, (order) => order.orderDetail)
  // @JoinColumn({ name: 'order_id' })
  // order: Order;

  // @ManyToMany(() => Product, (product) => product.orderDetails)
  // @JoinTable()
  // products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
