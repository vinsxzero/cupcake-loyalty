import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

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
}
