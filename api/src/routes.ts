import { Request, Response, Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "./controllers/UserController.js";
const router = Router();
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
const frontendPath = path.resolve(__dirname, "../../web");

const userController = new UserController();

//routes
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/index.html"));
});

router.post("/create-user", async (req: Request, res: Response) => {
  try {
    await userController.createUser(req, res);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
