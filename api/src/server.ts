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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
AppDataSource.initialize()

  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
