import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./Sale.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  @Column("varchar", { length: 255 })
  name!: string;
  @Column("varchar", { length: 255, unique: true })
  email!: string;
  @Column("varchar", { length: 255 })
  password!: string;
  @Column("varchar", { length: 255 })
  role!: string;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales!: Sale[];
}
