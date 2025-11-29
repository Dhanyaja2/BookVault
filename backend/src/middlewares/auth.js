import env from "../config/env.js";
import { verifyAccess } from "../utils/jwt.js";

export const requireAuth =
  (roles = []) =>
  (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No access token" });

    try {
      const payload = verifyAccess(token); // { id, email, role, iat, exp }
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid/expired token" });
    }
  };

// Cookie helper for refresh token
// export const setRefreshCookie = (res, token) => {
//   const prod = env.NODE_ENV === "production";
//   res.cookie("rt", token, {
//     httpOnly: true,
//     secure: env.COOKIE_SECURE || prod,
//     sameSite: prod ? "None" : "Lax",
//     path: "/api/auth/refresh",
//     maxAge:  7 * 24 * 60 * 60 * 1000,
//   });
// };

export const setRefreshCookie = (res, token) => {
  res.cookie("rt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", // IMPORTANT: allow cookie on all routes
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
