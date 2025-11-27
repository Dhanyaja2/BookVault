// src/controllers/shelf.controller.js
import * as shelfService from "../services/shelf.service.js";
import * as bookService from "../services/book.service.js"; // to check book existence
import { ok, fail } from "../utils/response.js";
import { parsePagination } from "../utils/pagination.js";

/**
 * Create a shelf for the logged in user
 */
export const createShelf = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.validatedBody || req.body;
    const shelf = await shelfService.createShelf(userId, data);
    return ok(res, { shelf }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Rename / update shelf metadata
 */
export const updateShelf = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shelfId = req.params.shelfId;
    const data = req.validatedBody || req.body;
    const shelf = await shelfService.updateShelf(shelfId, userId, data);
    if (!shelf) return fail(res, "Shelf not found", 404);
    return ok(res, { shelf });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete shelf
 */
export const deleteShelf = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shelfId = req.params.shelfId;
    const deleted = await shelfService.deleteShelf(shelfId, userId);
    if (!deleted) return fail(res, "Shelf not found", 404);
    return ok(res, { message: "Shelf deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single shelf (owner-only)
 */
export const getShelf = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shelfId = req.params.shelfId;
    const shelf = await shelfService.getShelfById(shelfId, userId);
    if (!shelf) return fail(res, "Shelf not found", 404);
    return ok(res, { shelf });
  } catch (err) {
    next(err);
  }
};

/**
 * List shelves for current user (paged)
 */
export const listShelves = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const q = req.validatedQuery || req.query;
    const { page, limit, skip } = parsePagination(q);
    const { total, docs } = await shelfService.listShelvesForUser(userId, {
      skip,
      limit,
    });
    const totalPages = Math.ceil(total / limit);
    return ok(res, {
      meta: { total, page, limit, totalPages },
      data: docs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add a book to shelf (or update book entry if already exists)
 */
export const addBook = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shelfId = req.params.shelfId;
    const { bookId, status, progress, notes } = req.validatedBody || req.body;

    // check shelf ownership exists
    const shelf = await shelfService.getShelfById(shelfId, userId);
    if (!shelf) return fail(res, "Shelf not found", 404);

    // check book exists in DB (optional: allow importing external later)
    const book = await bookService.getBookById(bookId);
    if (!book) return fail(res, "Book not found (import it first)", 404);

    const bookEntry = {
      bookId,
      status: status || "wantToRead",
      progress: typeof progress === "number" ? progress : 0,
      notes: notes || "",
    };

    const updated = await shelfService.addBookToShelf(
      shelfId,
      userId,
      bookEntry
    );
    return ok(res, { shelf: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove a book from shelf
 */
export const removeBook = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shelfId, bookId } = req.params;
    const shelf = await shelfService.removeBookFromShelf(
      shelfId,
      userId,
      bookId
    );
    if (!shelf) return fail(res, "Shelf not found or book not present", 404);
    return ok(res, { shelf });
  } catch (err) {
    next(err);
  }
};

/**
 * Update book entry in shelf (status/progress/notes)
 */
export const updateBookEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shelfId, bookId } = req.params;
    const updates = req.validatedBody || req.body;

    const shelf = await shelfService.updateBookEntry(
      shelfId,
      userId,
      bookId,
      updates
    );
    if (!shelf) return fail(res, "Shelf or book entry not found", 404);
    return ok(res, { shelf });
  } catch (err) {
    next(err);
  }
};

/**
 * User library / stats
 */
export const getLibraryStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await shelfService.getUserLibraryStats(userId);
    return ok(res, { stats });
  } catch (err) {
    next(err);
  }
};
