import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "./config/data-source.js";
import router from "./routes.js";
dotenv.config();

const app = express();

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
console.log("Current directory:", __dirname);
const frontendPath = path.resolve(__dirname, "../../web");
console.log("Frontend path:", frontendPath);
app.use(express.static(frontendPath));
app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
