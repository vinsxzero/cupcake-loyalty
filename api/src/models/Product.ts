import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Sale } from "./Sale.js";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("double")
  price!: number;

  @Column("int")
  stock!: number;

  @Column("varchar", { length: 255 })
  description!: string;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales!: Sale[];
}
