import React, { useState, useEffect } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";

// 🔥 NEW IMPORTS
import { useShelves } from "../context/ShelfContext";
import AddToShelfModal from "../components/AddToShelfModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { accessToken } = useAuth();

  const navigate = useNavigate();

  // 🔥 NEW STATE
  const [selectedBook, setSelectedBook] = useState(null);

  // 🔥 SHELF CONTEXT
  const { shelves, addBookToShelf, removeBookFromShelf, createShelf } =
    useShelves();

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      setSearched(true);

      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setBooks(data.docs || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // Load default books when page opens
  useEffect(() => {
    const loadDefaultBooks = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          "https://openlibrary.org/search.json?q=popular"
        );

        const data = await res.json();
        setBooks(data.docs || []);
        setSearched(false); // prevent "no result" message
      } catch (err) {
        console.error("Default load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultBooks();
  }, []); // runs only once on first page load

  const importBook = async (book) => {
    const body = {
      openLibraryId: book.key,
      title: book.title,
      authors: book.author_name,
      coverUrl: book.coverUrl,
      publishYear: book.first_publish_year,
      isbn10: book.isbn?.[0],
      isbn13: book.isbn13?.[0],
    };

    const res = await fetch("http://localhost:3000/api/books/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // 🔥
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log("Book imported");
    console.log("book data", data);
    return data.bookId; // <-- MongoDB ID
  };

  // STEP 2 — Import OpenLibrary book into MongoDB then add to shelf
  const handleAddToShelf = async (shelfId) => {
    try {
      // 1. IMPORT BOOK INTO BACKEND
      const res = await fetch("http://localhost:3000/api/books/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          openLibraryId: selectedBook.bookId,
          title: selectedBook.title,
          authors: [selectedBook.author],
          coverUrl: selectedBook.coverUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Import failed:", data);
        return;
      }

      const mongoBookId = data.bookId; // REAL MongoDB ID

      // 2. ADD TO SHELF USING THE REAL ID
      await addBookToShelf(shelfId, mongoBookId);

      alert("Book added to shelf!");
    } catch (err) {
      console.error("Add to shelf error:", err);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 max-w-6xl mx-auto text-white relative">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute left-6 top-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        Go Back
      </button>

      <h1 className="text-4xl font-bold text-center mb-8">Search for Books</h1>

      {/* Search Bar */}
      <div
        className="max-w-3xl mx-auto flex items-center backdrop-blur-xl bg-white/20 
        border border-white/30 rounded-full px-6 py-3 shadow-xl"
      >
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <SearchIcon size={24} className="text-white opacity-70" />
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-500/20 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-12">
          {books.map((book, idx) => {
            const coverUrl = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
              : "/placeholder-image.avif";

            return (
              <div
                key={idx}
                className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl 
                hover:scale-[1.02] transition cursor-pointer shadow-lg"
                // 🔥 OPEN MODAL ON CLICK
                onClick={() =>
                  setSelectedBook({
                    bookId: book.key,
                    title: book.title,
                    author: book.author_name?.[0],
                    coverUrl,
                  })
                }
              >
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <h3 className="text-lg font-semibold mt-3 line-clamp-2">
                  {book.title}
                </h3>

                <p className="text-gray-300 text-sm">
                  {book.author_name?.[0] || "Unknown Author"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && searched && books.length === 0 && (
        <p className="text-center text-gray-300 mt-10 text-lg">
          No books found. Try a different keyword.
        </p>
      )}

      {/* 🔥 ADD MODAL HERE */}
      {selectedBook && (
        <AddToShelfModal
          book={selectedBook}
          shelves={shelves}
          onClose={() => setSelectedBook(null)}
          // onAdd={async (shelfId) => {
          //   const mongoBookId = await importBook(selectedBook);
          //   await addBookToShelf(shelfId, mongoBookId); // ✔ valid ID
          //   alert("Book added to shelf");
          //   console.log("selected book:", selectedBook);
          // }}
          onAdd={(shelfId) => handleAddToShelf(shelfId)}
          onRemove={(shelfId) =>
            removeBookFromShelf(shelfId, selectedBook.bookId)
          }
          onCreate={(name, description) => createShelf(name, description)}
        />
      )}
    </div>
  );
};

export default Search;
