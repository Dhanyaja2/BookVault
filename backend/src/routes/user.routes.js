import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { me } from "../controllers/user.controller.js";

const r = Router();

r.get("/me", requireAuth(), me);
r.get("/admin/ping", requireAuth(["admin"]), (req, res) =>
  res.json({ ok: true })
);

export default r;
