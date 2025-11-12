import express from "express";
import helmet from "helmet";
import dotnev from "dotenv";
dotnev.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./config/env.js";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));

export default app;
