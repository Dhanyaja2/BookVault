// src/controllers/book.controller.js
import * as bookService from "../services/book.service.js";
import { parsePagination } from "../utils/pagination.js";
import { ok, fail } from "../utils/response.js";

/**
 * Controllers:
 * - createBook (admin)
 * - updateBook (admin)
 * - deleteBook (admin)
 * - getBook
 * - listBooks (public)
 */

export const createBook = async (req, res, next) => {
  try {
    const data = req.validatedBody || req.body;
    const userId = req.user?.id; // optional: who added it
    const book = await bookService.createBook(data, userId);
    return ok(res, { book }, 201);
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.validatedBody || req.body;
    const book = await bookService.updateBook(id, data);
    if (!book) return fail(res, "Book not found", 404);
    return ok(res, { book });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await bookService.getBookById(id);
    if (!book) return fail(res, "Book not found", 404);
    await bookService.deleteBook(id);
    return ok(res, { message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await bookService.getBookById(id);
    if (!book) return fail(res, "Book not found", 404);
    return ok(res, { book });
  } catch (err) {
    next(err);
  }
};

export const listBooks = async (req, res, next) => {
  try {
    const q = req.validatedQuery || req.query;
    const { page, limit, skip, sort } = parsePagination(q);
    const { total, docs } = await bookService.queryBooks(q, {
      skip,
      limit,
      sort,
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

// src/controllers/book.controller.js

// src/controllers/book.controller.js

// Import an external book (OpenLibrary → MongoDB)
// src/controllers/book.controller.js

import Book from "../models/Book.js";

export const importExternalBook = async (req, res) => {
  try {
    const {
      openLibraryId,
      title,
      authors,
      coverUrl,
      publishYear,
      isbn10,
      isbn13,
    } = req.body;

    // Check if book already exists in DB
    let existing = await Book.findOne({
      externalId: openLibraryId,
      source: "openLibrary",
    });

    if (existing) {
      return res.json({ bookId: existing._id });
    }

    // Create using your model fields
    const book = await Book.create({
      title,
      authors,
      coverImage: coverUrl,
      publishYear,
      isbn10,
      isbn13,
      externalId: openLibraryId,
      source: "openLibrary",
    });

    return res.json({ bookId: book._id });
  } catch (err) {
    console.error("IMPORT ERROR", err);
    return res.status(500).json({ message: "Import failed" });
  }
};

export const updateBookProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { readingProgress, notes } = req.body;

    const updated = await Book.findByIdAndUpdate(
      bookId,
      { readingProgress, notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ success: true, book: updated });
  } catch (err) {
    console.error("Progress update error:", err);
    return res.status(500).json({ message: "Failed to update progress" });
  }
};
