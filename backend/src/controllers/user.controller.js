import { ok } from "../utils/response.js";
import { getProfile } from "../services/user.service.js";

export const me = async (req, res) => {
  const user = await getProfile(req.user.id);
  return ok(res, { user });
};
