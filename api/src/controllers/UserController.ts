import { UserService } from "../services/userService.js";
const userService = new UserService();

export class UserController {
  async createUser(req: any, res: any) {
    try {
      const users = req.body;
      await userService.createUser(users);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getUsers(req: any, res: any) {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async loginUser(req: any, res: any) {
    try {
      const { email, password } = req.body;

      const response = await userService.loginUser(email, password);

      res
        .cookie("token", response.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: "Login successful", token: response.token });
    } catch (error) {
      res.status(500).json({ message: "Credenciais inválidas" });
    }
  }
  async updatePassword(req: any, res: any) {
    try {
      const { email, newPassword } = req.body;

      await userService.updatePassword(email, newPassword);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteUser(req: any, res: any) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
