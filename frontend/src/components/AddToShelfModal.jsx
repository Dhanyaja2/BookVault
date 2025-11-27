import React, { useState } from "react";

const AddToShelfModal = ({
  book,
  shelves,
  onClose,
  onAdd,
  onRemove,
  onCreate,
}) => {
  const [newShelf, setNewShelf] = useState("");
  const [newDescription, setNewDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-[400px] text-white shadow-xl">
        <button
          className="float-right text-gray-300 cursor-pointer"
          onClick={onClose}
        >
          ✖
        </button>

        <img
          src={book.coverUrl}
          alt="book"
          className="w-28 h-40 object-cover mx-auto rounded-xl mb-3"
        />

        <h2 className="text-xl font-semibold text-center">{book.title}</h2>
        <p className="text-center text-gray-300 mb-6">{book.author}</p>

        <h3 className="text-lg mb-2">Your Shelves</h3>

        <div className="space-y-3 max-h-48 overflow-y-auto">
          {shelves.map((s) => {
            const exists = s.books.some((b) => b.bookId === book.bookId);
            return (
              <div
                key={s._id}
                className="bg-white/10 border border-white/20 p-3 rounded-xl flex justify-between items-center"
              >
                <span>{s.name}</span>
                {!exists ? (
                  <button
                    onClick={() => onAdd(s._id)}
                    className="text-green-300 cursor-pointer"
                  >
                    Add
                  </button>
                ) : (
                  <button
                    onClick={() => onRemove(s._id)}
                    className="text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <input
            value={newShelf}
            onChange={(e) => setNewShelf(e.target.value)}
            placeholder="New shelf name"
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 mb-3"
          />

          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Shelf description (optional)"
            rows={3}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 mb-3"
          />

          <button
            onClick={() => {
              onCreate(newShelf, newDescription);
              setNewShelf("");
              setNewDescription("");
            }}
            className="w-full bg-purple-200 text-black rounded-xl p-2 cursor-pointer"
          >
            Create Shelf
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToShelfModal;
