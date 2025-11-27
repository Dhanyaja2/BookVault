import dotnev from "dotenv";
dotnev.config();
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./config/env.js";
import bookRoutes from "./routes/book.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import externalBookRoutes from "./routes/externalBooks.routes.js";
import shelfRoutes from "./routes/shelf.routes.js";
import ExternalRoutes from "./routes/external.routes.js";
import recommendedRoutes from "./routes/recommend.routes.js";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/externalBooks/books", externalBookRoutes);
app.use("/api/shelves", shelfRoutes);
app.use("/api/external/books", ExternalRoutes);
app.use("/api/recommend", recommendedRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

export default app;
