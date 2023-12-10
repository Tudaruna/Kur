import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import path, { dirname, join } from "path";
import morgan from "morgan";
import fs from "fs";
import authRouter from "./routes/auth.js";
import projectRouter from "./routes/project.js";
import modeleRouter from "./routes/module.js";
import fileRouter from "./routes/file.js";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express(); //создание сервера
const PORT = process.env.PORT || 5000; 
dotenv.config();


const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const access_token_secret = generateRandomToken();
const refresh_token_secret = generateRandomToken();
const corsOption = { credential: true, origin: process.env.URL || "*" };
//Запись токинов в файл
fs.writeFileSync(
  ".env",
  `ACCESS_TOKEN_SECRET=${access_token_secret}\nREFRESH_TOKEN_SECRET=${refresh_token_secret}`
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors(corsOption)); 
app.use("/api/auth", authRouter); 
app.use("/api", projectRouter);
app.use("/api", modeleRouter);
app.use("/api", fileRouter);

app.use(express.static(join(__dirname, "client")));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "index.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "About.html"));
});
app.get("/kontakt", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "kontakt.html"));
});
app.get("/q-and-a", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "QandAscreen.html"));
});
app.get("/mainprepod.html", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "mainprepod.html"));
});
app.get("/myproject.html", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "myproject.html"));
});
app.get("/addproject.html", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "addproject.html"));
});
app.get("/changeproject.html", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "changeproject.html"));
});
app.get("/viewCurs.html", (req, res) => {
  res.sendFile(join(__dirname, "client", "html", "viewCurs.html"));
});

app.listen(PORT, () => console.log(`server work on ${PORT}`)); 
export default app;
