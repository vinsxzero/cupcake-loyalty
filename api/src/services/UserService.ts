import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { MailerSend, Sender, Recipient, EmailParams } from "mailersend";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);
export class UserService {
  // Implement your user service methods here
  async createUser(newUser: {
    email: string;
    name: string;
    password: string;
    role: string;
  }) {
    const hashPassword = await bcrypt.hash(newUser.password, 10);

    const user = userRepository.create({
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      password: hashPassword,
    });

    await userRepository.save(user);
    return user;
  }
  async forgetPassword(email: string) {
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);

    const hashPassword = await bcrypt.hash(temporaryPassword, 10);

    user.password = hashPassword;

    await userRepository.save(user);

    await this.sendEmailForget(user, temporaryPassword);

    return { message: "Temporary password generated successfully" };
  }
  async sendEmailForget(user: any, temporaryPassword: string) {
    try {
      const mailerSend = new MailerSend({
        apiKey: process.env.api_key_mailersend as string,
      });

      const sentFrom = new Sender(
        "test@test-3m5jgro5zpmgdpyo.mlsender.net",
        "Doce Gestão",
      );

      const recipients = [new Recipient(user.email, user.name)];
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Bem-vindo ao Doce Gestão! 🧁")
        .setText(`Bem-vindo ao Doce Gestão!`)
        .setHtml(
          `
          <div style="
            margin: 0;
            padding: 40px 20px;
            background-color: #f8f5f0;
            font-family: Arial, Helvetica, sans-serif;
          ">
            <div style="
              max-width: 520px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 14px;
              overflow: hidden;
              border: 1px solid #eee5da;
            ">
    
              <div style="
                background-color: #5c4033;
                padding: 30px 24px;
                text-align: center;
              ">
                <h1 style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 27px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                ">
                  Doce Gestão
                </h1>
    
                <p style="
                  margin: 8px 0 0;
                  color: #e8d5c4;
                  font-size: 13px;
                ">
                  Gestão simples, resultados deliciosos.
                </p>
              </div>
    
              <div style="padding: 36px 30px;">
    
                <h2 style="
                  margin: 0 0 16px;
                  color: #4a352b;
                  font-size: 22px;
                ">
                  Seja bem-vindo! 🧁
                </h2>
    
                <p style="
                  margin: 0 0 20px;
                  color: #6b625c;
                  font-size: 15px;
                  line-height: 1.7;
                ">
                  Sua conta no <strong style="color: #5c4033;">Doce Gestão</strong>
                  foi criada com sucesso!
                </p>
    
                <p style="
                  margin: 0 0 12px;
                  color: #6b625c;
                  font-size: 14px;
                  line-height: 1.6;
                ">
                  Para realizar seu primeiro acesso, utilize a senha temporária abaixo:
                </p>
    
                <div style="
                  margin: 24px 0;
                  padding: 22px;
                  background-color: #f8f5f0;
                  border: 1px dashed #b99a80;
                  border-radius: 10px;
                  text-align: center;
                ">
                  <p style="
                    margin: 0 0 10px;
                    color: #8b7768;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                  ">
                    Sua senha de primeiro acesso
                  </p>
    
                  <p style="
                    margin: 0;
                    color: #5c4033;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    word-break: break-all;
                  ">
                    ${temporaryPassword}
                  </p>
                </div>
    
                <p style="
                  margin: 20px 0 0;
                  color: #8a817a;
                  font-size: 13px;
                  line-height: 1.6;
                ">
                  Recomendamos que você altere sua senha após realizar o primeiro acesso
                  para manter sua conta segura.
                </p>
    
                <p style="
                  margin: 28px 0 0;
                  color: #6b625c;
                  font-size: 14px;
                  line-height: 1.6;
                ">
                  Estamos felizes em ter você conosco!<br />
                  <strong style="color: #5c4033;">Equipe Doce Gestão</strong>
                </p>
    
              </div>
    
              <div style="
                padding: 18px 24px;
                background-color: #f8f5f0;
                border-top: 1px solid #eee5da;
                text-align: center;
              ">
                <p style="
                  margin: 0;
                  color: #a0958c;
                  font-size: 11px;
                  line-height: 1.6;
                ">
                  Este é um e-mail automático. Por favor, não responda a esta mensagem.
                  <br />
                  © ${new Date().getFullYear()} Doce Gestão. Todos os direitos reservados.
                </p>
              </div>
    
            </div>
          </div>
        `,
        )
        .setText(
          `Bem-vindo ao Doce Gestão!
    
              Sua conta foi criada com sucesso.
    
              Sua senha de primeiro acesso é: ${temporaryPassword}
    
              Recomendamos que você altere sua senha após realizar o primeiro acesso.
    
              Estamos felizes em ter você conosco!
              Equipe Doce Gestão.`,
        );
      await mailerSend.email.send(emailParams);
    } catch (err: any) {
      console.error("Erro ao enviar e-mail:", err);
      console.error("Detalhes:", err.body || err.message || err);

      throw new Error(
        `Error sending email: ${JSON.stringify(err.body || err.message || err)}`,
      );
    }
  }
  async activateUser(email: string, oldPassword: string, newPassword: string) {
    const user = await userRepository.findOneBy({ email });
    if (!email) {
      throw new Error("Email is required");
    }
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid old password");
    }
    if (user.isActive) {
      throw new Error("User is already active");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.isActive = true;
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
    if (user.id === undefined) {
      throw new Error("User ID is undefined");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
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
