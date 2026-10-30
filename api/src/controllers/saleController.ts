import SaleService from "../services/saleService.js";

const saleService = new SaleService();

export default class SaleController {
  async createSale(req: any, res: any) {
    const { total, status, paymentMethod, quantity, productId, userId } =
      req.body;
    try {
      const sale = await saleService.createSale(
        total,
        status,
        paymentMethod,
        quantity,
        productId,
        userId,
      );
      res.status(201).json(sale);
    } catch (error) {
      console.log(error);
      throw new Error("Error creating sale");
    }
  }
  async getSales(req: any, res: any) {
    try {
      const sales = await saleService.getSales();
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching sales");
    }
  }
  async updateSale(req: any, res: any) {
    const { id } = req.params;
    const SaleData = req.body;
    try {
      await saleService.updateSale(id, SaleData);
      res.status(200).json({ message: "Sale updated successfully" });
    } catch (error) {
      throw new Error("Error updating sale");
    }
  }
  async deleteSale(req: any, res: any) {
    const { id } = req.params;
    try {
      await saleService.deleteSale(id);
      res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
      throw new Error("Error deleting sale");
    }
  }
}
