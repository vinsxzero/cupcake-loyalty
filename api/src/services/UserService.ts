import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);
export class UserService {
  // Implement your user service methods here
  async createUser(newUser: {
    email: string;
    name: string;
    password: string;
    role: string;
  }): Promise<void> {
    const hashPassword = await bcrypt.hash(newUser.password, 10);

    const user = userRepository.create({
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      password: hashPassword,
    });

    await userRepository.save(user);
  }
  async getUsers() {
    const users = await userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return users;
  }

  async loginUser(email: string, password: string) {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    return {
      message: "Login successful",
      token,
    };
  }
  async updatePassword(email: string, newPassword: string) {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await userRepository.save(user);
  }
  async deleteUser(id: string) {
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    await userRepository.remove(user);
  }
}
