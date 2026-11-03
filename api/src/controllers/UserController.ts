import { UserService } from "../services/userService.js";
import { MailerSend, Sender, Recipient, EmailParams } from "mailersend";
const userService = new UserService();

export class UserController {
  async createUser(req: any, res: any) {
    try {
      const user = req.body;
      await userService.createUser(user);
      res.status(201).json({ message: "User created successfully" });

      return user;
    } catch (error) {
      console.error("Error creating users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async sendEmail(user: any) {
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
                    ${user.password}
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
    
              Sua senha de primeiro acesso é: ${user.password}
    
              Recomendamos que você altere sua senha após realizar o primeiro acesso.
    
              Estamos felizes em ter você conosco!
              Equipe Doce Gestão.`,
        );
      await mailerSend.email.send(emailParams);
    } catch (err) {
      throw new Error("Error sending email" + err);
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
