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
import { requireAuth } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/signup", ...signup);
authRouter.post("/login", ...login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

authRouter.post("/password-reset/request", ...requestPasswordReset);
authRouter.post("/password-reset/:userId/:token", ...resetPassword);

authRouter.get("/verify-email/:userId/:token", ...verifyEmail);

authRouter.get("/me", requireAuth(), async (req, res) => {
  try {
    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
