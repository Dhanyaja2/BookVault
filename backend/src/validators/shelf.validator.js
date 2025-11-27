// src/validators/shelf.validator.js
import { z } from "zod";

export const createShelfSchema = {
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
  }),
};

export const renameShelfSchema = {
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
  }),
  params: z.object({
    shelfId: z.string().min(1),
  }),
};

export const addBookToShelfSchema = {
  body: z.object({
    bookId: z.string().min(1),
    status: z
      .enum(["reading", "completed", "wantToRead", "favorite"])
      .optional(),
    progress: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    shelfId: z.string().min(1),
  }),
};

export const updateBookInShelfSchema = {
  body: z.object({
    status: z
      .enum(["reading", "completed", "wantToRead", "favorite"])
      .optional(),
    progress: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    shelfId: z.string().min(1),
    bookId: z.string().min(1),
  }),
};

export const removeBookSchema = {
  params: z.object({
    shelfId: z.string().min(1),
    bookId: z.string().min(1),
  }),
};

export const listShelvesSchema = {
  query: z
    .object({
      page: z.preprocess(
        (v) => (v ? Number(v) : undefined),
        z.number().optional()
      ),
      limit: z.preprocess(
        (v) => (v ? Number(v) : undefined),
        z.number().optional()
      ),
    })
    .optional(),
};
