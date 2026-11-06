import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User.js";
import { Product } from "./Product.js";

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("double")
  total!: number;

  @Column("varchar")
  status!: string;

  @Column("varchar")
  paymentMethod!: string;

  @Column("int")
  quantity!: number;

  @CreateDateColumn()
  CreatedAt!: Date;

  @ManyToOne(() => Product, (product) => product.sales, {
    nullable: false,
    onDelete: "CASCADE",
  })
  product!: Product;

  @ManyToOne(() => User, (user) => user.sales, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user!: User;
}
