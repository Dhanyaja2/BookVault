import User from "../models/User.js";

export const createUser = (data) => User.create(data);
export const findUserByEmail = (email) =>
  User.findOne({ email }).select("+password");
export const getProfile = async (id) =>
  User.findById(id).select("name email role isEmailVerified createdAt");
