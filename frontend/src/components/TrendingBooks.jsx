import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trendingBooks } from "../data/trendingBooks";

const TrendingBooks = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
    console.log("Scrolled Left");
  };
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
    console.log("Scrolled Right");
  };

  return (
    <section className="mt-20 max-w-6xl px-6 relative">
      <h2 className="text-3xl font-bold text-center mb-10">Trending Books</h2>
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full z-10 cursor-pointer"
      >
        <ChevronLeft size={28} />
      </button>
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-scroll hide-scrollbar scroll-smooth py-4"
      >
        {trendingBooks.map((book) => (
          <div
            key={book.id}
            className="min-w-[180px] p-4 rounded-xl shadow hover:scale-105 transition cursor-pointer"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-60 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-lg font-semibold">{book.title}</h3>
            <p className="text-sm">{book.author}</p>
          </div>
        ))}
      </div>
      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full z-10 cursor-pointer"
      >
        <ChevronRight size={28} />
      </button>
    </section>
  );
};

export default TrendingBooks;
