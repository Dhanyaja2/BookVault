import { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

const r = Router();

r.post("/signup", ...signup);
r.post("/login", ...login);
r.post("/refresh", refresh);
r.post("/logout", logout);

r.post("/password-reset/request", ...requestPasswordReset);
r.post("/password-reset/:userId/:token", ...resetPassword);

r.get("/verify-email/:userId/:token", ...verifyEmail);

export default r;
