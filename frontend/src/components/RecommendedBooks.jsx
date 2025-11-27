import React, { useEffect, useState } from "react";
import AddToShelfModal from "./AddToShelfModal";
import { useShelves } from "../context/ShelfContext";
import { useAuth } from "../context/AuthContext";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  const { accessToken } = useAuth();
  const { addBookToShelf, removeBookFromShelf, createShelf, shelves } =
    useShelves();

  // Fetch recommended (fiction / trending) books
  // useEffect(() => {
  //   const loadRecommended = async () => {
  //     try {
  //       const res = await fetch(
  //         "http://localhost:3000/api/recommend/recommended"
  //       );

  //       const data = await res.json();
  //       setBooks(data.works); // top 12 recommendations
  //     } catch (error) {
  //       console.error("Recommendation load error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadRecommended();
  // }, []);

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/recommend/recommended"
        );
        const data = await res.json();

        // For each work, fetch fallback if cover missing
        const fixedBooks = await Promise.all(
          data.works.map(async (b) => {
            let coverUrl = null;

            // 1. Try primary cover
            if (b.cover_id) {
              coverUrl = `https://covers.openlibrary.org/b/id/${b.cover_id}-L.jpg`;
            }

            // 2. Fallback → fetch work details for cover list
            else {
              try {
                const workRes = await fetch(
                  `https://openlibrary.org${b.key}.json`
                );
                const workData = await workRes.json();

                if (workData.covers && workData.covers.length > 0) {
                  const fallbackId = workData.covers[0];
                  coverUrl = `https://covers.openlibrary.org/b/id/${fallbackId}-L.jpg`;
                }
              } catch (err) {
                console.log("Fallback cover lookup failed", err);
              }
            }

            return {
              ...b,
              coverUrl: coverUrl || "/placeholder-image.avif",
              author:
                b.author_name?.[0] || b.authors?.[0]?.name || "Unknown Author",
            };
          })
        );

        setBooks(fixedBooks);
      } catch (error) {
        console.error("Recommendation load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommended();
  }, []);

  // Import book into backend
  // const importBook = async (b) => {
  //   const body = {
  //     openLibraryId: b.bookId,
  //     title: b.title,
  //     author: b.authors?.[0]?.name || "Unknown Author",
  //     coverUrl: b.coverUrl,
  //     publishYear: b.first_publish_year,
  //     isbn10: b.isbn?.[0],
  //     isbn13: b.isbn13?.[0],
  //   };

  //   const res = await fetch("http://localhost:3000/api/books/import", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     credentials: "include",
  //     body: JSON.stringify(body),
  //   });

  //   const data = await res.json();
  //   if (!res.ok) throw new Error(data.message);

  //   return data.bookId;
  // };
  const importBook = async (b) => {
    const body = {
      openLibraryId: b.bookId,
      title: b.title,
      authors: [b.author],
      coverUrl: b.coverUrl,
    };

    const res = await fetch("http://localhost:3000/api/books/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return data.bookId;
  };

  // Add to shelf
  const handleAddToShelf = async (shelfId) => {
    try {
      const mongoBookId = await importBook(selectedBook);
      await addBookToShelf(shelfId, mongoBookId);
    } catch (err) {
      console.error("Add to shelf error:", err);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-semibold mb-4">Recommended for You</h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-500/20 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Book grid */}
      {/* {!loading && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {books.map((b, idx) => {
            const coverUrl = b.cover_i
              ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`
              : "/placeholder-book.png";

            return (
              <div
                key={idx}
                className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl 
                           hover:scale-[1.02] transition cursor-pointer shadow-lg"
                onClick={() =>
                  setSelectedBook({
                    bookId: b.key,
                    title: b.title,
                    author: b.author_name?.[0],
                    coverUrl,
                  })
                }
              >
                <img
                  src={coverUrl}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-3 line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {b.author_name?.[0] || "Unknown Author"}
                </p>
              </div>
            );
          })}
        </div>
      )} */}

      {/* Horizontal Scroll Row */}
      {/* {!loading && books.length > 0 && (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="flex gap-6">
            {books.map((b, idx) => {
              const coverUrl = b.cover_i
                ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`
                : "/placeholder-book.png";

              return (
                <div
                  key={idx}
                  className="min-w-[180px] bg-white/10 border border-white/20 rounded-xl p-4 
                       backdrop-blur-xl hover:scale-[1.05] transition cursor-pointer shadow-lg"
                  onClick={() =>
                    setSelectedBook({
                      bookId: b.key,
                      title: b.title,
                      author: b.author_name?.[0],
                      coverUrl,
                    })
                  }
                >
                  <img
                    src={coverUrl}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <h3 className="text-lg font-semibold mt-3 line-clamp-2">
                    {b.title}
                  </h3>

                  <p className="text-gray-300 text-sm">
                    {b.author_name?.[0] || "Unknown Author"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )} */}

      {/* Carousel Container */}
      {!loading && books.length > 0 && (
        <div className="relative">
          {/* LEFT BUTTON */}
          <button
            onClick={() => {
              document.getElementById("rec-slider").scrollBy({
                left: -300,
                behavior: "smooth",
              });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => {
              document.getElementById("rec-slider").scrollBy({
                left: 300,
                behavior: "smooth",
              });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </button>

          {/* SCROLLABLE ROW */}
          <div
            id="rec-slider"
            className="flex gap-6 overflow-x-scroll no-scrollbar scroll-smooth px-2"
          >
            {books.map((b, idx) => {
              const coverUrl = b.cover_i
                ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`
                : "/placeholder-image.avif";

              return (
                <div
                  key={idx}
                  className="min-w-[180px] bg-white/10 border border-white/20 rounded-xl p-4 
                     backdrop-blur-xl hover:scale-[1.05] transition cursor-pointer shadow-lg"
                  onClick={() =>
                    setSelectedBook({
                      bookId: b.key,
                      title: b.title,
                      author:
                        b.author ||
                        b.author_name?.[0] ||
                        b.authors?.[0]?.name ||
                        "Unknown Author",
                      coverUrl,
                    })
                  }
                >
                  <img
                    src={coverUrl}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <h3 className="text-lg font-semibold mt-3 line-clamp-2">
                    {b.title}
                  </h3>

                  <p className="text-gray-300 text-sm">
                    {b.authors?.[0]?.name || "Unknown Author"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to Shelf Modal */}
      {selectedBook && (
        <AddToShelfModal
          book={selectedBook}
          shelves={shelves}
          onClose={() => setSelectedBook(null)}
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

export default RecommendedBooks;
