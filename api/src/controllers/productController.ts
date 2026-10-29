import ProductService from "../services/productService.js";

const productService = new ProductService();
export default class ProductController {
  async createProduct(req: any, res: any) {
    const { name, price, stock, description } = req.body;
    try {
      await productService.createProduct(name, price, stock, description);
      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      throw new Error("Error creating product");
    }
  }
  async getProducts(req: any, res: any) {
    try {
      const products = await productService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateProduct(req: any, res: any) {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;
    try {
      await productService.updateProduct(id, name, price, stock, description);
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteProduct(req: any, res: any) {
    const { id } = req.params;
    try {
      await productService.deleteProduct(id);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
