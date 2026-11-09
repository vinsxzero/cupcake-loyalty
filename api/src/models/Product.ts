// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

// import { Sale } from "./Sale.js";

// @Entity("products")
// export class Product {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @Column("varchar", { length: 255 })
//   name!: string;

//   @Column("numeric", {
//     precision: 10,
//     scale: 2,
//   })
//   price!: string;

//   @Column("integer", { default: 0 })
//   stock!: string;

//   @Column("varchar", { length: 255 })
//   category!: string;

//   @OneToMany(() => Sale, (sale) => sale.product)
//   sales!: Sale[];
// }

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Sale } from "./Sale.js";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", {
    length: 255,
  })
  name!: string;

  @Column("numeric", {
    precision: 10,
    scale: 2,
  })
  price!: string;

  @Column("integer", {
    default: 0,
  })
  stock!: number;

  @Column("varchar", {
    length: 255,
  })
  category!: string;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales!: Sale[];
}
