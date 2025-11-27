import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Trash } from "lucide-react";

const BookDetails = () => {
  const { shelfId, bookId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (book) {
      setProgress(book.readingProgress || 0);
      setNotes(book.notes || "");
    }
  }, [book]);

  // const saveDetails = async () => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:3000/api/books/${bookId}/progress`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify({
  //           readingProgress: progress,
  //           notes,
  //         }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message);
  //       return;
  //     }
  //     console.log("Save details executed");
  //     alert("Progress updated!");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const saveDetails = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/books/${bookId}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            readingProgress: progress,
            notes,
          }),
        }
      );

      const data = await res.json();
      console.log("STATUS:", res.status, "DATA:", data);

      if (!res.ok) {
        alert(data.message || "Failed to update");
        return;
      }

      alert("Progress updated!");

      // REFRESH UI
      fetchBook();
    } catch (err) {
      console.error("Progress save error:", err);
    }
  };

  // Fetch single book from shelf
  const fetchBook = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/shelves/${shelfId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();

      // find specific book inside shelf
      const found = data.shelf.books.find((item) => item.bookId._id === bookId);

      setBook(found ? found.bookId : null);
    } catch (err) {
      console.error("Book fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  // Delete book from shelf
  const deleteBook = async () => {
    if (!window.confirm("Remove this book from shelf?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/shelves/${shelfId}/books/${bookId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete book");
        return;
      }

      alert("Book removed from shelf");
      navigate(`/shelf/${shelfId}`);
      fetchBook();
    } catch (err) {
      console.error("Delete book error:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Loading...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Book not found
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-10 text-white max-w-4xl mx-auto">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(`/shelf/${shelfId}`)}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* BOOK INFO */}
      <div className="flex gap-10">
        <img
          src={book.coverImage || "/placeholder-image.avif"}
          onError={(e) => (e.target.src = "/placeholder-image.avif")}
          className="w-60 h-80 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-4xl font-bold mb-3">{book.title}</h1>

          <p className="text-gray-300 text-lg mb-4">
            {book.authors?.join(", ") || "Unknown Author"}
          </p>

          {/* DELETE BUTTON */}
          <button
            onClick={deleteBook}
            className="px-6 py-3 bg-red-500/30 hover:bg-red-500/50 
                       text-red-300 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Trash size={20} /> Remove from Shelf
          </button>
        </div>
      </div>
      {/* READING PROGRESS SECTION */}
      <div className="mt-10 bg-white/10 p-6 rounded-xl border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Your Reading Progress</h2>

        {/* Pages Read */}
        <label className="block mb-2 text-gray-300">Pages Read</label>
        <input
          type="number"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-32 px-3 py-2 rounded-lg bg-white/20 outline-none border border-white/30 text-white"
        />

        {/* Notes / Comments */}
        <label className="block mt-6 mb-2 text-gray-300">Your Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full p-3 rounded-lg bg-white/20 outline-none border border-white/30 text-white"
          placeholder="Write your thoughts, highlights, or summary..."
        />

        <button
          onClick={saveDetails}
          className="mt-6 px-6 py-3 bg-blue-500/40 hover:bg-blue-500/60 rounded-xl text-white font-semibold cursor-pointer"
        >
          Save Progress
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
