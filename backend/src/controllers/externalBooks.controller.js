// src/controllers/externalBooks.controller.js
import {
  searchOpenLibrary,
  getOpenLibraryBook,
} from "../services/openLibrary.service.js";
import * as bookService from "../services/book.service.js";

// 1) Search Open Library API
export const searchExternalBooks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Missing search query" });

    const results = await searchOpenLibrary(q);
    return res.json({ results });
  } catch (err) {
    next(err);
  }
};

// 2) Import external book into your MongoDB
export const importExternalBook = async (req, res, next) => {
  try {
    const { externalId } = req.body;

    if (!externalId) {
      return res.status(400).json({ message: "externalId is required" });
    }

    // Check if already stored
    const existing = await bookService.getBookByExternalId(externalId);
    if (existing) return res.json({ book: existing });

    // Fetch full details from Open Library
    const details = await getOpenLibraryBook(externalId);

    // Create your local book using external metadata
    const book = await bookService.createBook({
      title: details.title,
      description: details.description?.value || details.description || "",
      genres: details.subjects || [],
      externalId,
      source: "openLibrary",
    });

    return res.json({ book });
  } catch (err) {
    next(err);
  }
};
