import { DataSource } from "typeorm";

import { User } from "../models/User.js";
import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";

import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",

  host: process.env.MYSQLHOST,

  port: Number(process.env.MYSQLPORT),

  username: process.env.MYSQLUSER,

  password: process.env.MYSQLPASSWORD,

  database: process.env.MYSQLDATABASE,

  entities: [User, Sale, Product],

  migrations: ["dist/config/migrations/*.js"],
  synchronize: true,

  logging: ["schema"],
});
