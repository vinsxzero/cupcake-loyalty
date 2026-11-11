import { Sale } from "../models/Sale.js";
import { AppDataSource } from "../config/data-source.js";

import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

const saleRepository = AppDataSource.getRepository(Sale);

export default class SaleService {
  async createSale(
    total: any,
    status: any,
    paymentMethod: any,
    quantity: any,
    productId: any,
    userId: any,
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
    const quantityToUpdate = product.stock - quantity;
    if (quantityToUpdate < 0 || product.stock < quantity) {
      throw new Error("Estoque de produto insuficiente");
    }
    product.stock = quantityToUpdate;

    const sale = saleRepository.create({
      total,
      status,
      paymentMethod,
      quantity,
      product,
      user,
    });
    await AppDataSource.getRepository(Product).save(product);
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
        createdAt: "DESC",
      },
    });
  }
  async getSaleById(id: string) {
    const sale = await saleRepository.findOne({
      where: { id },
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
    });
    if (!sale) {
      throw new Error("Sale not found");
    }
    return sale;
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
    const actualQuantity = sale.quantity;
    const { productId, userId, ...data } = saleData;

    Object.assign(sale, data);

    if (productId !== undefined) {
      const product = await AppDataSource.getRepository(Product).findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }
      if (sale.quantity !== actualQuantity) {
        const quantityDifference = sale.quantity - actualQuantity;
        const quantityToUpdate = product.stock - quantityDifference;
        if (quantityToUpdate < 0 || product.stock < quantityDifference) {
          throw new Error("Estoque de produto insuficiente");
        }
        product.stock = quantityToUpdate;
        await AppDataSource.getRepository(Product).save(product);
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
