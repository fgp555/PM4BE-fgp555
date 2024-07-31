// order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderDetail } from '../order-details/order-details.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ default: new Date(), type: 'date' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order_id)
  @JoinTable()
  orderDetails: OrderDetail[];
}
