import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from '../users/user.entity';
import { OrderDetail } from '../order-details/order-details.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  // @ManyToOne(() => User, user => user.orders)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column()
  date: Date;

  // @OneToOne(() => OrderDetail)
  // @JoinColumn()
  // orderDetail: OrderDetail;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
