// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from "typeorm";

// import { User } from "./User.js";
// import { Product } from "./Product.js";

// @Entity("sales")
// export class Sale {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @Column("numeric", {
//     precision: 10,
//     scale: 2,
//   })
//   total!: string;

//   @Column("varchar")
//   status!: string;

//   @Column("varchar")
//   paymentMethod!: string;

//   @Column("integer", { default: 0 })
//   quantity!: number;

//   @CreateDateColumn()
//   CreatedAt!: Date;

//   @ManyToOne(() => Product, (product) => product.sales, {
//     nullable: false,
//     onDelete: "CASCADE",
//   })
//   product!: Product;

//   @ManyToOne(() => User, (user) => user.sales, {
//     nullable: false,
//     onDelete: "CASCADE",
//   })
//   user!: User;
// }

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

  @Column("numeric", {
    precision: 10,
    scale: 2,
  })
  total!: string;

  @Column("varchar", {
    length: 50,
    default: "pending",
  })
  status!: string;

  @Column("varchar", {
    length: 50,
  })
  paymentMethod!: string;

  @Column("integer", {
    default: 0,
  })
  quantity!: number;

  @CreateDateColumn({
    type: "timestamp with time zone",
    name: "created_at",
  })
  createdAt!: Date;

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
