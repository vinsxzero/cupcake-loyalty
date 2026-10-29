import { Request, Response, Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "./controllers/userController.js";
import { middleware } from "./middleware/ensureAuth.js";
import ProductController from "./controllers/productController.js";
import SaleController from "./controllers/saleController.js";

const ensureAuth = new middleware().ensureAuth;
const router = Router();
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
const frontendPath = path.resolve(__dirname, "../../web");

const userController = new UserController();
const productController = new ProductController();
const saleController = new SaleController();

//user related routes
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/login.html"));
}); //✅

router.post(
  "/create-user",
  // ensureAuth,
  userController.createUser.bind(userController),
); //✅
router.post("/login", await userController.loginUser.bind(userController));
router.get(
  "/main",
  // ensureAuth,
  (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, "/pages/index.html"));
  },
); //✅
router.post(
  "/update-password",
  userController.updatePassword.bind(userController),
); //✅

router.delete(
  "/delete-user/:id",
  userController.deleteUser.bind(userController),
); //✅

//product related routes
router.post(
  "/create-product",
  productController.createProduct.bind(productController),
); //✅
router.get(
  "/get-products",
  productController.getProducts.bind(productController),
); //✅
router.put(
  "/update-product/:id",
  productController.updateProduct.bind(productController),
); //✅
router.delete(
  "/delete-product/:id",
  productController.deleteProduct.bind(productController),
); //✅

//sale related routes
router.post("/create-sale", saleController.createSale.bind(saleController)); //✅
router.get("/get-sales", saleController.getSales.bind(saleController)); //✅
router.put("/update-sale/:id", saleController.updateSale.bind(saleController)); //✅
router.delete(
  "/delete-sale/:id",
  saleController.deleteSale.bind(saleController),
);

export default router;
