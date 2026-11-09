import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "./config/data-source.js";
import router from "./routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser());
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const frontendPath = path.resolve(__dirname, "../../web");

app.use(express.static(frontendPath));
app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT;
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL conectado com sucesso!");

    app.listen(PORT, () => {
      console.log("Servidor iniciado!");
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}
startServer();
