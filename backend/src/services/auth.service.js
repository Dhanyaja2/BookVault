import { randomToken, sha256 } from "../utils/crypto.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";
import env from "../config/env.js";
import ms from "ms";

export const createPasswordResetToken = async (userId) => {
  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + ms(env.PWD_RESET_TOKEN_TTL));
  await PasswordResetToken.deleteMany({ userId }); // one active token rule
  await PasswordResetToken.create({ userId, tokenHash, expiresAt });
  return token; // send via email/SMS channel by your choice
};

export const verifyPasswordResetToken = async (userId, token) => {
  const doc = await PasswordResetToken.findOne({ userId });
  if (!doc) return false;
  if (doc.tokenHash !== sha256(token)) return false;
  if (doc.expiresAt.getTime() < Date.now()) return false;
  return true;
};

export const consumePasswordResetToken = async (userId) => {
  await PasswordResetToken.deleteMany({ userId });
};

export const createEmailVerifyToken = async (userId) => {
  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + ms(env.EMAIL_VERIFY_TOKEN_TTL));
  await EmailVerificationToken.deleteMany({ userId });
  await EmailVerificationToken.create({ userId, tokenHash, expiresAt });
  return token;
};

export const verifyEmailToken = async (userId, token) => {
  const doc = await EmailVerificationToken.findOne({ userId });
  if (!doc) return false;
  if (doc.tokenHash !== sha256(token)) return false;
  if (doc.expiresAt.getTime() < Date.now()) return false;
  await EmailVerificationToken.deleteMany({ userId });
  return true;
};
