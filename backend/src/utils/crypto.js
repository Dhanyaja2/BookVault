import crypto from "crypto";

export const sha256 = (str) =>
  crypto.createHash("sha256").update(str).digest("hex");

export const randomToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
