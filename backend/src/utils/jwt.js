import jwt from "jsonwebtoken";
import env from "../config/env";

export const signAccess = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });

export const signRefresh = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL,
  });

export const verifyAccess = (t) => jwt.verify(t, env.JWT_ACCESS_SECRET);
export const verifyRefresh = (t) => jwt.verify(t, env.JWT_REFRESH_SECRET);
