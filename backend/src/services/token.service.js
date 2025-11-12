import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt.js";
import { sha256 } from "../utils/crypto.js";
import User from "../models/User.js";

export const issueTokens = async (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  user.refreshTokenHash = sha256(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
};

export const rotateRefresh = async (currentRt) => {
  const decoded = verifyRefresh(currentRt);
  const user = await User.findById(decoded.id).select("+password");
  if (!user) throw Object.assign(new Error("User not found"), { status: 401 });

  const incomingHash = sha256(currentRt);
  if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
    throw Object.assign(new Error("Refresh token invalidated"), {
      status: 401,
    });
  }

  const { accessToken, refreshToken } = await issueTokens(user);
  return { user, accessToken, refreshToken };
};

export const revokeRefresh = async (rt) => {
  try {
    const decoded = verifyRefresh(rt);
    await User.findByIdAndUpdate(decoded.id, {
      $set: { refreshTokenHash: null },
    });
  } catch {
    /* ignore */
  }
};
