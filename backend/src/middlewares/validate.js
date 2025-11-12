import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const data = {
      body: schema.body ? schema.body.parse(req.body) : undefined,
      params: schema.params ? schema.params.parse(req.params) : undefined,
      query: schema.query ? schema.query.parse(req.query) : undefined,
    };
    Object.assign(req, data);
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      return res
        .status(422)
        .json({ message: "Validation error", errors: e.flatten() });
    }
    next(e);
  }
};
