import { Sale } from "../models/Sale.js";
import { AppDataSource } from "../config/data-source.js";
import { In } from "typeorm/browser/find-options/operator/In.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

const saleRepository = AppDataSource.getRepository(Sale);

export default class SaleService {
  async createSale(
    total: number,
    status: string,
    paymentMethod: string,
    quantity: number,
    productId: string,
    userId: string,
  ) {
    const product = await AppDataSource.getRepository(Product).findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const sale = saleRepository.create({
      total,
      status,
      paymentMethod,
      quantity,
      product,
      user,
    });

    return await saleRepository.save(sale);
  }
  async getSales() {
    return await saleRepository.find({
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        product: {
          id: true,
          name: true,
          price: true,
        },
      },
      relations: { user: true, product: true },
      order: {
        CreatedAt: "DESC",
      },
    });
  }
  async updateSale(
    id: string,
    saleData: Partial<Sale> & {
      productId?: string;
      userId?: string;
    },
  ) {
    const sale = await saleRepository.findOne({
      where: { id },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    const { productId, userId, ...data } = saleData;

    Object.assign(sale, data);

    if (productId !== undefined) {
      const product = await AppDataSource.getRepository(Product).findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      sale.product = product;
    }

    if (userId !== undefined) {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      sale.user = user;
    }

    return await saleRepository.save(sale);
  }
  async deleteSale(id: any) {
    const sale = await saleRepository.findOne({ where: { id } });
    if (!sale) {
      throw new Error("Sale not found");
    }
    return await saleRepository.remove(sale);
  }
}
