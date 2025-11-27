// src/validators/book.validator.js
import { z } from "zod";

export const createBookSchema = {
  body: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    authors: z.array(z.string()).optional(),
    description: z.string().optional(),
    coverImage: z.string().url().optional(),
    publishYear: z.number().int().min(0).optional(),
    isbn10: z.string().optional(),
    isbn13: z.string().optional(),
    pages: z.number().int().optional(),
    publisher: z.string().optional(),
    genres: z.array(z.string()).optional(),
    language: z.string().optional(),
    externalId: z.string().optional(),
    source: z.enum(["googleBooks", "openLibrary", "custom"]).optional(),
  }),
};

export const updateBookSchema = {
  body: z.object({
    title: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    authors: z.array(z.string()).optional(),
    description: z.string().optional(),
    coverImage: z.string().url().optional(),
    publishYear: z.number().int().min(0).optional(),
    isbn10: z.string().optional(),
    isbn13: z.string().optional(),
    pages: z.number().int().optional(),
    publisher: z.string().optional(),
    genres: z.array(z.string()).optional(),
    language: z.string().optional(),
    externalId: z.string().optional(),
    source: z.enum(["googleBooks", "openLibrary", "custom"]).optional(),
  }),
};

export const listBooksSchema = {
  query: z.object({
    q: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    isbn: z.string().optional(),
    year: z.string().optional(),
    minRating: z.preprocess(
      (v) => (v ? Number(v) : undefined),
      z.number().optional()
    ),
    page: z.preprocess(
      (v) => (v ? Number(v) : undefined),
      z.number().optional()
    ),
    limit: z.preprocess(
      (v) => (v ? Number(v) : undefined),
      z.number().optional()
    ),
    sort: z.string().optional(),
  }),
};
