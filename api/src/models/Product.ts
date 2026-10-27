import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./Sale.js";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column("varchar", { length: 255 })
  name!: string;
  @Column("double")
  price!: number;
  @Column("int")
  stock!: number;

  @Column("varchar", { length: 255 })
  description!: string;

  @ManyToOne(() => Sale, (sale) => sale.product)
  sale!: Sale;
}
