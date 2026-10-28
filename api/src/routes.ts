import { Request, Response, Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "./controllers/userController.js";
import { middleware } from "./middleware/ensureAuth.js";
const ensureAuth = new middleware().ensureAuth;
const router = Router();
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
const frontendPath = path.resolve(__dirname, "../../web");

const userController = new UserController();

//routes
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/login.html"));
});

router.post("/create-user", ensureAuth, async (req: Request, res: Response) => {
  try {
    await userController.createUser(req, res);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/login", await userController.loginUser.bind(userController));
router.get("/main", ensureAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/index.html"));
});
router.post("/update-password", async (req: Request, res: Response) => {
  try {
    await userController.updatePassword(req, res);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/delete-user", async (req: Request, res: Response) => {
  try {
    await userController.deleteUser(req, res);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
