import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, DeleteIcon, Trash } from "lucide-react";

const ShelfDetails = () => {
  const { shelfId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [shelf, setShelf] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShelf = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/shelves/${shelfId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setShelf(data.shelf || null);
      console.log("shelf: ", shelf);
    } catch (err) {
      console.error("Shelf fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteShelf = async () => {
    if (!window.confirm("Are you sure you want to delete this shelf?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/shelves/${shelfId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete shelf");
        return;
      }

      alert("Shelf deleted successfully!");
      await fetchShelf();
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete shelf error:", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchShelf();
    console.log("Updated shelf:", shelf);
  }, [shelfId]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Loading shelf...
      </div>
    );
  }

  if (!shelf) {
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Shelf not found
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 text-white max-w-6xl mx-auto">
      {/* Back Button */}

      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex gap-2 mb-6 text-gray-300 hover:text-white transition items-center cursor-pointer"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button
          onClick={deleteShelf}
          className="flex gap-2 items-center text-red-300 cursor-pointer"
        >
          <Trash size={20} /> Delete Shelf
        </button>
      </div>

      {/* Shelf Header */}
      <h1 className="text-4xl font-bold mb-2">{shelf.name}</h1>
      <p className="text-gray-300 mb-8">
        {shelf.description || "No description provided"}
      </p>

      {/* If no books */}
      {shelf.books.length === 0 && (
        <p className="text-gray-400">No books in this shelf yet.</p>
      )}

      {/* Books Grid */}
      {shelf.books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {/* {shelf.books.map((book) => (
            <div
              key={book.bookId}
              className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl shadow-lg"
            >
              <img
                src={book.cover ?? "/placeholder-image.avif"}
                className="w-full h-48 object-cover rounded-lg"
                alt="Book cover"
              />

              <h3 className="text-lg mt-3 font-semibold line-clamp-2">
                {book.title}
              </h3>

              <p className="text-gray-300 text-sm">{book.author}</p>
            </div>
          ))} */}
          {shelf.books.map((item) => {
            const book = item.bookId;

            return (
              // <div
              //   key={book._id}
              //   className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl shadow-lg"
              // >
              //   <img
              //     src={book.coverImage || "/placeholder-image.avif"}
              //     className="w-full h-48 object-cover rounded-lg"
              //     alt={book.title}
              //   />

              //   <h3 className="text-lg mt-3 font-semibold line-clamp-2">
              //     {book.title}
              //   </h3>

              //   <p className="text-gray-300 text-sm">
              //     {book.authors?.[0] || "Unknown Author"}
              //   </p>
              // </div>

              <div
                key={book._id}
                className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl shadow-lg cursor-pointer"
                onClick={() => navigate(`/shelf/${shelfId}/book/${book._id}`)}
              >
                <img
                  src={book.coverImage || "/placeholder-image.avif"}
                  className="w-full h-48 object-cover rounded-lg"
                  alt={book.title}
                />

                <h3 className="text-lg mt-3 font-semibold line-clamp-2">
                  {book.title}
                </h3>

                <p className="text-gray-300 text-sm">
                  {book.authors?.[0] || "Unknown Author"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShelfDetails;
