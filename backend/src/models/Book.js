// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const BookSchema = new Schema(
//   {
//     title: { type: String, required: true, trim: true, index: true },
//     subtitle: { type: String, trim: true },
//     authors: { type: [String], default: [] },
//     description: { type: String },
//     coverImage: { type: String }, // URL
//     publishYear: { type: Number, index: true },
//     isbn10: { type: String, index: true },
//     isbn13: { type: String, index: true, unique: false },
//     pages: { type: Number },
//     publisher: { type: String },
//     genres: { type: [String], default: [], index: true },
//     language: { type: String, default: "en" },
//     externalId: { type: String }, // e.g., googleBooks id or openlibrary id
//     source: {
//       type: String,
//       enum: ["googleBooks", "openLibrary", "custom"],
//       default: "custom",
//     },

//     // meta
//     avgRating: { type: Number, default: 0 },
//     ratingsCount: { type: Number, default: 0 },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who added this entry
//   },
//   {
//     timestamps: true,
//   }
// );

// // Text index for search (title, subtitle, authors, description)
// BookSchema.index(
//   {
//     title: "text",
//     subtitle: "text",
//     authors: "text",
//     description: "text",
//     publisher: "text",
//   },
//   { weights: { title: 10, authors: 5, description: 1 } }
// );

// export default mongoose.model("Book", BookSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    subtitle: String,
    authors: { type: [String], default: [] },
    description: String,
    coverImage: String,
    publishYear: Number,
    isbn10: String,
    isbn13: String,
    pages: Number,
    publisher: String,
    genres: { type: [String], default: [] },
    language: { type: String, default: "en" },

    externalId: String,
    source: {
      type: String,
      enum: ["openLibrary", "googleBooks", "custom"],
      default: "custom",
    },

    readingProgress: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    avgRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

BookSchema.index({
  title: "text",
  authors: "text",
  description: "text",
});

export default mongoose.model("Book", BookSchema);
