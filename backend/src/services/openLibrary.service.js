import axios from "axios";

const BASE = "https://openlibrary.org";

export const searchOpenLibrary = async (q) => {
  const url = `${BASE}/search.json?q=${encodeURIComponent(q)}`;
  const res = await axios.get(url);

  return res.data.docs.map((doc) => ({
    title: doc.title,
    authors: doc.author_name || [],
    publishYear: doc.first_publish_year,
    isbn10: doc.isbn?.find((i) => i.length === 10) || null,
    isbn13: doc.isbn?.find((i) => i.length === 13) || null,
    coverImage: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : null,
    genres: doc.subject ? doc.subject.slice(0, 5) : [],
    externalId: doc.key, // e.g "/works/OL12345W"
    source: "openLibrary",
  }));
};

export const getOpenLibraryBook = async (workId) => {
  const url = `${BASE}${workId}.json`;
  const res = await axios.get(url);
  return res.data;
};
