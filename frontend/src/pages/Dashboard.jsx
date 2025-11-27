import React, { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LogOut,
  Library,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useShelves } from "../context/ShelfContext";
import { trendingBooks } from "../data/trendingBooks";
import RecommendedBooks from "../components/RecommendedBooks";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { shelves } = useShelves();

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
    <div className="min-h-screen px-6 py-10 text-white relative">
      {/* TOP SECTION */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          {/* Welcome Message */}
          <h1 className="text-4xl font-semibold">
            Welcome, <span className="font-bold">{user?.name}</span> 👋
          </h1>

          {/* Search Icon */}
          <button
            onClick={handleSearchClick}
            className="p-3 bg-white/20 hover:bg-white/30 transition rounded-full shadow-md cursor-pointer"
            title="Search Books"
          >
            <Search size={26} />
          </button>
        </div>

        {/* USER CARD */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl mb-12">
          <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

          <p className="text-gray-200">{user?.name}</p>

          <button
            onClick={handleLogout}
            className="mt-6 cursor-pointer px-6 py-3 flex items-center gap-2 bg-red-400/20 hover:bg-red-400/30 text-red-300 rounded-xl transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* USER LIBRARY */}
        {/* <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Your Library</h2>
          <p className="text-gray-400 mb-6">
            Books you saved will appear here.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="h-48 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
              <p className="text-gray-400 text-center">No saved books yet</p>
            </div>
          </div>
        </div> */}
        {/* User Library */}

        {/* ------------------------- */}
        {/*    USER SHELVES SECTION   */}
        {/* ------------------------- */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Your Shelves</h2>

          {shelves.length === 0 ? (
            <p className="text-gray-400 mb-6">
              You haven’t created any shelves yet.
            </p>
          ) : (
            <p className="text-gray-400 mb-6">
              Manage your reading collections below.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {shelves.map((shelf) => (
              <div
                key={shelf._id}
                onClick={() => navigate(`/shelf/${shelf._id}`)}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 
                           backdrop-blur-xl shadow-lg hover:scale-[1.02] transition cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Library size={28} className="text-purple-200" />
                  <h3 className="text-xl font-semibold">{shelf.name}</h3>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {shelf.description || "No description provided"}
                </p>

                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-purple-200">
                    {shelf.books?.length || 0}
                  </span>{" "}
                  books in this shelf
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDATIONS
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Recommended for You</h2>
          <p className="text-gray-400 mb-6">Coming soon...</p>

          <div className="h-48 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
            <p className="text-gray-400 text-center">
              AI recommendations coming later.
            </p>
          </div>
        </div> */}

        {/* <section className="mt-20 max-w-6xl px-6 relative">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Recommended for You
          </h2>
          {/* Left Arrow *
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full z-10 cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
          {/* Scroll Container *
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
        {/* <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full z-10 cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>
        </section> */}
        <RecommendedBooks />
      </div>
    </div>
  );
};

export default Dashboard;
