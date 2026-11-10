import { Product } from "../models/Product.js";
import { AppDataSource } from "../config/data-source.js";

const productRepository = AppDataSource.getRepository(Product);
export default class ProductService {
  async createProduct(name: any, price: any, stock: any, category: any) {
    const newP = {
      name: name,
      price: price,
      stock: stock,
      category: category,
    };
    const product = await productRepository.create(newP);

    await productRepository.save(product);
    return null;
  }
  async getProducts() {
    return await productRepository.find();
  }
  async updateProduct(
    id: string,
    name: any,
    price: any,
    stock: any,
    category: any,
  ) {
    const product = await productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.category = category;
    await productRepository.save(product);
  }
  async getProductById(id: string) {
    const product = await productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async deleteProduct(id: string) {
    const product = await productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    await productRepository.remove(product);
  }
}
