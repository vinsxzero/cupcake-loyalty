import { Request, Response, Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "./controllers/UserController.js";
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
router.get("/activate-user/:email", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/activate-account.html"));
});
router.post("/logout", userController.lougout.bind(userController)); //✅
router.post(
  "/create-user",
  // ensureAuth,
  async (req: Request, res: Response) => {
    const user = await userController.createUser(req, res);
    await userController.sendEmailCreate(user);
  },
); //✅

router.put(
  "/activate-user/:email",
  userController.activateUser.bind(userController),
);
router.post("/forget-pass", async (req: Request, res: Response) => {
  await userController.forgetPassword(req, res);
}); //✅
router.get("/forget-pass", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/forgetPass.html"));
}); //✅
router.get(
  "/get-users",
  ensureAuth,
  userController.getUsers.bind(userController),
); //✅
router.post("/login", await userController.loginUser.bind(userController));
router.get("/main", ensureAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/index.html"));
}); //✅
router.post(
  "/update-password",
  userController.updatePassword.bind(userController),
); //✅

router.delete(
  "/delete-user/:id",
  ensureAuth,
  userController.deleteUser.bind(userController),
); //✅

//product related routes
router.post(
  "/create-product",
  ensureAuth,
  productController.createProduct.bind(productController),
); //✅
router.get(
  "/get-products",
  ensureAuth,
  productController.getProducts.bind(productController),
); //✅
router.put(
  "/update-product/:id",
  ensureAuth,
  productController.updateProduct.bind(productController),
); //✅
router.delete(
  "/delete-product/:id",
  ensureAuth,
  productController.deleteProduct.bind(productController),
); //✅

//sale related routes
router.post(
  "/create-sale",
  ensureAuth,
  saleController.createSale.bind(saleController),
); //✅
router.get(
  "/get-sales",
  ensureAuth,
  saleController.getSales.bind(saleController),
); //✅
router.put(
  "/update-sale/:id",
  ensureAuth,
  saleController.updateSale.bind(saleController),
); //✅
router.delete(
  "/delete-sale/:id",
  ensureAuth,
  saleController.deleteSale.bind(saleController),
);

export default router;
