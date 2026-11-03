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

//send email function
// import { MailerSend, Sender, Recipient, EmailParams } from "mailersend";

// async function sendEmail(user: any) {
//   try {
//     const mailerSend = new MailerSend({
//       apiKey: process.env.api_key_mailersend as string,
//     });

//     const sentFrom = new Sender(
//       "test@test-3m5jgro5zpmgdpyo.mlsender.net",
//       "Doce Gestão",
//     );

//     const recipients = [
//       new Recipient(
//         "vinicius.ferreira@arceralifesciences.com",
//         "vinicius ferreira",
//       ),
//     ];
//     const emailParams = new EmailParams()
//       .setFrom(sentFrom)
//       .setTo(recipients)
//       .setReplyTo(sentFrom)
//       .setSubject("Bem-vindo ao Doce Gestão! 🧁")
//       .setText(`Bem-vindo ao Doce Gestão!`)
//       .setHtml(
//         `
//       <div style="
//         margin: 0;
//         padding: 40px 20px;
//         background-color: #f8f5f0;
//         font-family: Arial, Helvetica, sans-serif;
//       ">
//         <div style="
//           max-width: 520px;
//           margin: 0 auto;
//           background-color: #ffffff;
//           border-radius: 14px;
//           overflow: hidden;
//           border: 1px solid #eee5da;
//         ">

//           <div style="
//             background-color: #5c4033;
//             padding: 30px 24px;
//             text-align: center;
//           ">
//             <h1 style="
//               margin: 0;
//               color: #ffffff;
//               font-size: 27px;
//               font-weight: 700;
//               letter-spacing: -0.5px;
//             ">
//               Doce Gestão
//             </h1>

//             <p style="
//               margin: 8px 0 0;
//               color: #e8d5c4;
//               font-size: 13px;
//             ">
//               Gestão simples, resultados deliciosos.
//             </p>
//           </div>

//           <div style="padding: 36px 30px;">

//             <h2 style="
//               margin: 0 0 16px;
//               color: #4a352b;
//               font-size: 22px;
//             ">
//               Seja bem-vindo! 🧁
//             </h2>

//             <p style="
//               margin: 0 0 20px;
//               color: #6b625c;
//               font-size: 15px;
//               line-height: 1.7;
//             ">
//               Sua conta no <strong style="color: #5c4033;">Doce Gestão</strong>
//               foi criada com sucesso!
//             </p>

//             <p style="
//               margin: 0 0 12px;
//               color: #6b625c;
//               font-size: 14px;
//               line-height: 1.6;
//             ">
//               Para realizar seu primeiro acesso, utilize a senha temporária abaixo:
//             </p>

//             <div style="
//               margin: 24px 0;
//               padding: 22px;
//               background-color: #f8f5f0;
//               border: 1px dashed #b99a80;
//               border-radius: 10px;
//               text-align: center;
//             ">
//               <p style="
//                 margin: 0 0 10px;
//                 color: #8b7768;
//                 font-size: 12px;
//                 font-weight: 600;
//                 text-transform: uppercase;
//                 letter-spacing: 1px;
//               ">
//                 Sua senha de primeiro acesso
//               </p>

//               <p style="
//                 margin: 0;
//                 color: #5c4033;
//                 font-size: 24px;
//                 font-weight: 700;
//                 letter-spacing: 2px;
//                 word-break: break-all;
//               ">
//                 Eu19289asd!!@#
//               </p>
//             </div>

//             <p style="
//               margin: 20px 0 0;
//               color: #8a817a;
//               font-size: 13px;
//               line-height: 1.6;
//             ">
//               Recomendamos que você altere sua senha após realizar o primeiro acesso
//               para manter sua conta segura.
//             </p>

//             <p style="
//               margin: 28px 0 0;
//               color: #6b625c;
//               font-size: 14px;
//               line-height: 1.6;
//             ">
//               Estamos felizes em ter você conosco!<br />
//               <strong style="color: #5c4033;">Equipe Doce Gestão</strong>
//             </p>

//           </div>

//           <div style="
//             padding: 18px 24px;
//             background-color: #f8f5f0;
//             border-top: 1px solid #eee5da;
//             text-align: center;
//           ">
//             <p style="
//               margin: 0;
//               color: #a0958c;
//               font-size: 11px;
//               line-height: 1.6;
//             ">
//               Este é um e-mail automático. Por favor, não responda a esta mensagem.
//               <br />
//               © ${new Date().getFullYear()} Doce Gestão. Todos os direitos reservados.
//             </p>
//           </div>

//         </div>
//       </div>
//     `,
//       )
//       .setText(
//         `Bem-vindo ao Doce Gestão!

//           Sua conta foi criada com sucesso.

//           Sua senha de primeiro acesso é: Eu19289asd!!@#

//           Recomendamos que você altere sua senha após realizar o primeiro acesso.

//           Estamos felizes em ter você conosco!
//           Equipe Doce Gestão.`,
//       );
//     console.log("Email sent successfully to: me");
//     await mailerSend.email.send(emailParams);
//   } catch (err) {
//     console.error("Error while sending mail:", err);
//   }
// }
//user related routes
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "/pages/login.html"));
}); //✅
router.post("/send-email", async (req: Request, res: Response) => {});
router.post(
  "/create-user",
  // ensureAuth,
  async (req: Request, res: Response) => {
    const user = await userController.createUser(req, res);
    await userController.sendEmail(user);
  },
); //✅
router.get(
  "/get-users",
  // ensureAuth,
  userController.getUsers.bind(userController),
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
