// src/routes/book.routes.js
import { Router } from "express";
import * as ctrl from "../controllers/book.controller.js";
import {
  createBookSchema,
  updateBookSchema,
  listBooksSchema,
} from "../validators/book.validator.js";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";

const bookRoutes = Router();

/**
 * Public endpoints
 */
bookRoutes.get("/", validate(listBooksSchema), ctrl.listBooks);
bookRoutes.get("/:id", ctrl.getBook);

/**
 * Protected endpoints - admin only
 * assuming requireAuth accepts roles array: requireAuth(['admin'])
 */
bookRoutes.post(
  "/",
  requireAuth(["admin"]),
  validate(createBookSchema),
  ctrl.createBook
);
bookRoutes.put(
  "/:id",
  requireAuth(["admin"]),
  validate(updateBookSchema),
  ctrl.updateBook
);

// src/routes/book.routes.js
bookRoutes.post("/import", requireAuth(), ctrl.importExternalBook);

bookRoutes.patch("/:bookId/progress", requireAuth(), ctrl.updateBookProgress);

bookRoutes.delete("/:id", requireAuth(["admin"]), ctrl.deleteBook);

export default bookRoutes;
