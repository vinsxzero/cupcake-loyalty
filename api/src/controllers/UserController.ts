import { UserService } from "../services/UserService.js";
const userService = new UserService();

export class UserController {
  async createUser(req: any, res: any) {
    try {
      const users = req.body;
      await userService.createUser(users);
      res.status(201).json({ message: "Users created successfully" });
    } catch (error) {
      console.error("Error creating users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
