export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,

  MONGO_URI: process.env.MONGO_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || "7d",

  PWD_RESET_TOKEN_TTL: process.env.PWD_RESET_TOKEN_TTL || "30m",
  EMAIL_VERIFY_TOKEN_TTL: process.env.EMAIL_VERIFY_TOKEN_TTL || "24h",

  COOKIE_SECURE: String(process.env.COOKIE_SECURE || "false") === "true",
};
