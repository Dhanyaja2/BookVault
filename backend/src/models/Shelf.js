// src/models/Shelf.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const ShelfBookSchema = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    addedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["reading", "completed", "wantToRead", "favorite"],
      default: "wantToRead",
    },
    progress: { type: Number, min: 0, max: 100, default: 0 }, // percent complete
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const ShelfSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    books: { type: [ShelfBookSchema], default: [] },
  },
  { timestamps: true }
);

ShelfSchema.index({ userId: 1, name: 1 }, { unique: true }); // user cannot have two shelves with same name

export default mongoose.model("Shelf", ShelfSchema);
