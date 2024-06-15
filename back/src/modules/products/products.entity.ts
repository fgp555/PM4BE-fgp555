import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
// import { Category } from '../categories/categories.entity';
// import { OrderDetail } from '../order-details/order-details.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 50 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ default: 'default-image-url' })
  imgUrl: string;

  @Column()
  category: string;

  @Column({nullable: true})
  category2: string;

  // @ManyToOne(() => Category, (category) => category.product)
  // category: Category;

  // @ManyToMany(() => OrderDetail, orderDetail => orderDetail.products)
  // @JoinTable()
  // orderDetails: OrderDetail[];

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
