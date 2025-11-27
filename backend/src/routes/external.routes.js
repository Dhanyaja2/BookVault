import { Router } from "express";
import axios from "axios";

const ExternalRoutes = Router();

ExternalRoutes.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "harry potter";

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      q
    )}&limit=20`;

    const { data } = await axios.get(url);

    const results = (data.docs || []).map((book) => ({
      externalId: book.key, // e.g. "/works/OL82563W"
      title: book.title,
      authors: book.author_name || [],
      firstPublishYear: book.first_publish_year,
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
    }));

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default ExternalRoutes;
