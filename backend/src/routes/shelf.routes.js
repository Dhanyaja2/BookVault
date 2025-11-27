// src/routes/shelf.routes.js
import { Router } from "express";
import * as ctrl from "../controllers/shelf.controller.js";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  createShelfSchema,
  renameShelfSchema,
  addBookToShelfSchema,
  updateBookInShelfSchema,
  removeBookSchema,
  listShelvesSchema,
} from "../validators/shelf.validator.js";

const shelfRoutes = Router();

// All shelf routes require authentication
shelfRoutes.use(requireAuth());

// Create shelf
shelfRoutes.post("/", validate(createShelfSchema), ctrl.createShelf);

// List user's shelves (paged)
shelfRoutes.get("/", validate(listShelvesSchema), ctrl.listShelves);

// Get single shelf
shelfRoutes.get("/:shelfId", ctrl.getShelf);

// Update shelf metadata (rename)
shelfRoutes.put("/:shelfId", validate(renameShelfSchema), ctrl.updateShelf);

// Delete shelf
shelfRoutes.delete("/:shelfId", ctrl.deleteShelf);

// Add book to shelf
shelfRoutes.post(
  "/:shelfId/books",
  validate(addBookToShelfSchema),
  ctrl.addBook
);

// Update book in shelf (status/progress/notes)
shelfRoutes.patch(
  "/:shelfId/books/:bookId",
  validate(updateBookInShelfSchema),
  ctrl.updateBookEntry
);

// Remove book from shelf
shelfRoutes.delete(
  "/:shelfId/books/:bookId",
  validate(removeBookSchema),
  ctrl.removeBook
);

// Stats
shelfRoutes.get("/stats/me", ctrl.getLibraryStats);

export default shelfRoutes;
