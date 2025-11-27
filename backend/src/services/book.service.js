// // src/services/book.service.js
// import mongoose from "mongoose";
// import Book from "../models/Book.js";

// /**
//  * Service layer encapsulating DB interactions for Books
//  */

// export const createBook = async (data, userId = null) => {
//   const payload = { ...data };
//   if (userId) payload.createdBy = userId;
//   const doc = await Book.create(payload);
//   return doc;
// };

// export const updateBook = async (id, data) => {
//   const doc = await Book.findByIdAndUpdate(id, data, {
//     new: true,
//     runValidators: true,
//   });
//   return doc;
// };

// export const deleteBook = async (id) => {
//   await Book.findByIdAndDelete(id);
//   return true;
// };

// export const getBookById = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) return null;
//   return Book.findById(id);
// };

// /**
//  * Query books with pagination and simple filters
//  * - q: text search
//  * - author, genre, year, isbn
//  */
// export const queryBooks = async (
//   filters = {},
//   { skip = 0, limit = 10, sort = { createdAt: -1 } } = {}
// ) => {
//   const mongoFilter = {};

//   // text search using text index
//   if (filters.q) {
//     mongoFilter.$text = { $search: filters.q };
//   }

//   if (filters.author) {
//     mongoFilter.authors = {
//       $elemMatch: { $regex: filters.author, $options: "i" },
//     };
//   }

//   if (filters.genre) {
//     mongoFilter.genres = { $in: [new RegExp(filters.genre, "i")] };
//   }

//   if (filters.isbn) {
//     mongoFilter.$or = [{ isbn10: filters.isbn }, { isbn13: filters.isbn }];
//   }

//   if (filters.year) {
//     mongoFilter.publishYear = Number(filters.year);
//   }

//   // optional: minRating
//   if (filters.minRating) {
//     mongoFilter.avgRating = { $gte: Number(filters.minRating) };
//   }

//   // count & docs
//   const [total, docs] = await Promise.all([
//     Book.countDocuments(mongoFilter),
//     Book.find(mongoFilter).sort(sort).skip(skip).limit(limit).lean(),
//   ]);

//   return { total, docs };
// };

import Book from "../models/Book.js";

export const createBook = async (data, userId = null) => {
  const book = await Book.create({
    ...data,
    createdBy: userId,
  });
  return book;
};

export const getBookByExternalId = async (externalId) => {
  return Book.findOne({ externalId });
};

export const getBookById = async (id) => Book.findById(id);

export const listBooks = async (filter, skip, limit, sort) => {
  const docs = await Book.find(filter).skip(skip).limit(limit).sort(sort);
  const total = await Book.countDocuments(filter);
  return { docs, total };
};

export const queryBooks = async (
  filters = {},
  { skip = 0, limit = 10, sort = { createdAt: -1 } } = {}
) => {
  const mongoFilter = {};

  // text search
  if (filters.q) {
    mongoFilter.$text = { $search: filters.q };
  }

  // author filter
  if (filters.author) {
    mongoFilter.authors = { $regex: filters.author, $options: "i" };
  }

  // genre filter
  if (filters.genre) {
    mongoFilter.genres = { $regex: filters.genre, $options: "i" };
  }

  // year filter
  if (filters.year) {
    mongoFilter.publishYear = Number(filters.year);
  }

  // isbn filter
  if (filters.isbn) {
    mongoFilter.$or = [{ isbn10: filters.isbn }, { isbn13: filters.isbn }];
  }

  // rating filter (optional)
  if (filters.minRating) {
    mongoFilter.avgRating = { $gte: Number(filters.minRating) };
  }

  // execute query
  const [total, docs] = await Promise.all([
    Book.countDocuments(mongoFilter),
    Book.find(mongoFilter).skip(skip).limit(limit).sort(sort).lean(),
  ]);

  return { total, docs };
};

export const deleteBook = async (id) => {
  const result = await Book.findByIdAndDelete(id);
  return result !== null; // true if deleted, false if not found
};
