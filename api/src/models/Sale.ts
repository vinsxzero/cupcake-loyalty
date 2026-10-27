import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.js";
import { Product } from "./Product.js";

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column("double")
  total!: number;
  @Column("varchar")
  status!: string;
  @Column("varchar")
  paymentMethod!: string;

  @CreateDateColumn()
  CreatedAt!: Date;

  @OneToMany(() => Product, (product) => product.sale)
  product!: Product[];
  @ManyToOne(() => User, (user) => user.sales)
  user!: User;
}
