// src/services/shelf.service.js
import Shelf from "../models/Shelf.js";
import mongoose from "mongoose";

/**
 * Service functions for Shelves. Keep DB logic here.
 */

// Create a new shelf for user
export const createShelf = async (userId, data) => {
  const doc = await Shelf.create({ userId, ...data });
  return doc;
};

// Rename / update shelf metadata
export const updateShelf = async (shelfId, userId, data) => {
  const doc = await Shelf.findOneAndUpdate(
    { _id: shelfId, userId },
    { $set: { ...data } },
    { new: true, runValidators: true }
  );
  return doc;
};

// Delete a shelf (only owner)
export const deleteShelf = async (shelfId, userId) => {
  const res = await Shelf.findOneAndDelete({ _id: shelfId, userId });
  return res !== null;
};

// Get a single shelf (with populated books if needed)
export const getShelfById = async (shelfId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(shelfId)) return null;
  // return Shelf.findOne({ _id: shelfId, userId }).lean();
  return Shelf.findOne({ _id: shelfId, userId })
    .populate("books.bookId") // 🔥 this loads title, cover, authors
    .lean();
};

// List shelves for a user (paged)
export const listShelvesForUser = async (
  userId,
  { skip = 0, limit = 20 } = {}
) => {
  const [total, docs] = await Promise.all([
    Shelf.countDocuments({ userId }),
    Shelf.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean(),
  ]);
  return { total, docs };
};

/**
 * Add a book to a shelf:
 * - if book already exists in shelf, return null or update depending on flag
 */
export const addBookToShelf = async (shelfId, userId, bookEntry) => {
  // push only if not exist
  const exists = await Shelf.findOne({
    _id: shelfId,
    userId,
    "books.bookId": bookEntry.bookId,
  });

  if (exists) {
    // update existing book entry fields (status/progress/notes)
    await Shelf.updateOne(
      { _id: shelfId, userId, "books.bookId": bookEntry.bookId },
      {
        $set: {
          "books.$.status":
            bookEntry.status ??
            exists.books.find((b) => b.bookId.toString() === bookEntry.bookId)
              .status,
          "books.$.progress":
            typeof bookEntry.progress === "number"
              ? bookEntry.progress
              : exists.books.find(
                  (b) => b.bookId.toString() === bookEntry.bookId
                ).progress,
          "books.$.notes":
            bookEntry.notes ??
            exists.books.find((b) => b.bookId.toString() === bookEntry.bookId)
              .notes,
          "books.$.addedAt": exists.books.find(
            (b) => b.bookId.toString() === bookEntry.bookId
          ).addedAt,
        },
      }
    );
    return await Shelf.findById(shelfId).lean();
  } else {
    await Shelf.findByIdAndUpdate(
      shelfId,
      { $push: { books: bookEntry } },
      { new: true }
    );
    return await Shelf.findById(shelfId).lean();
  }
};

// Remove a book from a shelf
export const removeBookFromShelf = async (shelfId, userId, bookId) => {
  const res = await Shelf.findOneAndUpdate(
    { _id: shelfId, userId },
    { $pull: { books: { bookId } } },
    { new: true }
  );
  return res;
};

// Update a book entry in a shelf (status/progress/notes)
export const updateBookEntry = async (shelfId, userId, bookId, updates) => {
  const fields = {};
  if (updates.status !== undefined) fields["books.$.status"] = updates.status;
  if (updates.progress !== undefined)
    fields["books.$.progress"] = updates.progress;
  if (updates.notes !== undefined) fields["books.$.notes"] = updates.notes;

  const res = await Shelf.findOneAndUpdate(
    { _id: shelfId, userId, "books.bookId": bookId },
    { $set: fields },
    { new: true }
  );
  return res;
};

// Simple stats for user (counts by shelf/status)
export const getUserLibraryStats = async (userId) => {
  // counts: total shelves, total books across all shelves, counts by status
  const shelves = await Shelf.find({ userId }).lean();
  let totalBooks = 0;
  const statusCounts = { reading: 0, completed: 0, wantToRead: 0, favorite: 0 };

  for (const s of shelves) {
    for (const b of s.books || []) {
      totalBooks++;
      if (statusCounts[b.status] !== undefined) statusCounts[b.status]++;
    }
  }

  return {
    totalShelves: shelves.length,
    totalBooks,
    statusCounts,
  };
};
