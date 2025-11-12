import { z } from "zod";
import { validate } from "../middleware/validate.js";
import User from "../models/User.js";
import {
  issueTokens,
  rotateRefresh,
  revokeRefresh,
} from "../services/token.service.js";
import { setRefreshCookie } from "../middleware/auth.js";
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  consumePasswordResetToken,
  createEmailVerifyToken,
  verifyEmailToken,
} from "../services/auth.service.js";
import { ok, fail } from "../utils/response.js";

export const signupSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};

export const signup = [
  validate(signupSchema),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return fail(res, "Email already in use", 409);

      const user = await User.create({ name, email, password });

      // (optional) send email verification link with token
      // const evToken = await createEmailVerifyToken(user._id);
      // sendEmailVerification(email, evToken) // implement later

      const { accessToken, refreshToken } = await issueTokens(user);
      setRefreshCookie(res, refreshToken);

      return ok(
        res,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
          accessToken,
        },
        201
      );
    } catch (e) {
      next(e);
    }
  },
];

export const login = [
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.comparePassword(password)))
        return fail(res, "Invalid credentials", 401);

      const { accessToken, refreshToken } = await issueTokens(user);
      setRefreshCookie(res, refreshToken);

      return ok(res, {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
      });
    } catch (e) {
      next(e);
    }
  },
];

export const refresh = async (req, res) => {
  const rt = req.cookies?.rt;
  if (!rt) return fail(res, "No refresh token", 401);
  try {
    const { accessToken, refreshToken, user } = await rotateRefresh(rt);
    setRefreshCookie(res, refreshToken);
    return ok(res, { accessToken });
  } catch (e) {
    return fail(res, e.message || "Refresh failed", e.status || 401);
  }
};

export const logout = async (req, res) => {
  const rt = req.cookies?.rt;
  if (rt) await revokeRefresh(rt);
  res.clearCookie("rt", {
    httpOnly: true,
    sameSite: "Lax",
    path: "/api/auth/refresh",
  });
  return ok(res, { message: "Logged out" });
};

// ==== Password Reset ====

export const requestPasswordResetSchema = {
  body: z.object({ email: z.string().email() }),
};

export const requestPasswordReset = [
  validate(requestPasswordResetSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return ok(res, { message: "If the email exists, we sent reset link" }); // don't leak existence

      const token = await createPasswordResetToken(user._id);
      // sendEmailReset(email, token); // you plug your mailer here
      return ok(res, { message: "If the email exists, we sent reset link" });
    } catch (e) {
      next(e);
    }
  },
];

export const resetPasswordSchema = {
  body: z.object({ password: z.string().min(6) }),
  params: z.object({ userId: z.string(), token: z.string() }),
};

export const resetPassword = [
  validate(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { userId, token } = req.params;
      const isValid = await verifyPasswordResetToken(userId, token);
      if (!isValid) return fail(res, "Invalid/expired token", 400);

      const user = await User.findById(userId).select("+password");
      if (!user) return fail(res, "User not found", 404);

      user.password = req.body.password;
      user.refreshTokenHash = null; // revoke active sessions
      await user.save();
      await consumePasswordResetToken(userId);

      return ok(res, { message: "Password updated" });
    } catch (e) {
      next(e);
    }
  },
];

// ==== Email Verification (optional) ====

export const verifyEmailSchema = {
  params: z.object({ userId: z.string(), token: z.string() }),
};

export const verifyEmail = [
  validate(verifyEmailSchema),
  async (req, res, next) => {
    try {
      const { userId, token } = req.params;
      const success = await verifyEmailToken(userId, token);
      if (!success) return fail(res, "Invalid/expired token", 400);

      await User.findByIdAndUpdate(userId, { $set: { isEmailVerified: true } });
      return ok(res, { message: "Email verified" });
    } catch (e) {
      next(e);
    }
  },
];
