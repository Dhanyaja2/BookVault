// const required = (name, def = undefined) => {
//   const v = process.env[name] ?? def;
//   if (v === undefined) throw new Error(`Missing env: ${name}`);
//   return v;
// };

// export default {
//   NODE_ENV: process.env.NODE_ENV || "development",
//   PORT: Number(process.env.PORT || 5000),
//   CLIENT_ORIGIN: required("CLIENT_ORIGIN"),

//   MONGO_URI: required("MONGO_URI"),

//   JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
//   JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
//   ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
//   REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || "7d",

//   PWD_RESET_TOKEN_TTL: process.env.PWD_RESET_TOKEN_TTL || "30m",
//   EMAIL_VERIFY_TOKEN_TTL: process.env.EMAIL_VERIFY_TOKEN_TTL || "24h",

//   COOKIE_SECURE: String(process.env.COOKIE_SECURE || "false") === "true",
// };

// export default {
//   NODE_ENV: process.env.NODE_ENV || "development",
//   PORT: Number(process.env.PORT || 3000),
//   // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,

//   MONGO_URI: process.env.MONGO_URI,

//   JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
//   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
//   ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
//   REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || "7d",

//   PWD_RESET_TOKEN_TTL: process.env.PWD_RESET_TOKEN_TTL || "30m",
//   EMAIL_VERIFY_TOKEN_TTL: process.env.EMAIL_VERIFY_TOKEN_TTL || "24h",

//   COOKIE_SECURE: String(process.env.COOKIE_SECURE || "false") === "true",
// };

import dotenv from "dotenv";
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT,

  // Mongo
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || "7d",

  // Optional tokens
  PWD_RESET_TOKEN_TTL: process.env.PWD_RESET_TOKEN_TTL || "30m",
  EMAIL_VERIFY_TOKEN_TTL: process.env.EMAIL_VERIFY_TOKEN_TTL || "24h",

  // CORS + cookies
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
};

export default env;
