import { Router } from "express";
import { me } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const userRoutes = Router();

userRoutes.get("/me", requireAuth(), me);
userRoutes.get("/admin/ping", requireAuth(["admin"]), (req, res) =>
  res.json({ ok: true })
);

export default userRoutes;
