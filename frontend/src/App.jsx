import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ShelfDetails from "./components/ShelfDetails";
import BookDetails from "./components/BookDetails";

// const App = () => {
//   return (
//     <div className="min-h-screen image">
//       <div className="bg-gray-600 min-h-screen opacity-95">
//         <div className="body max-w-6xl mx-auto">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/search" element={<Search />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// };

const App = () => {
  return (
    <div className="relative min-h-screen scroll-smooth">
      {/* Background Blur Layer */}
      {/* <div
        className="absolute inset-0 bg-contain bg-no-repeat bg-right  blur-sm"
        style={{ backgroundImage: 'url("/bg.png")' }}
      ></div> */}

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/bg.png"
          className="w-full h-full object-cover blur-sm opacity-90"
          alt="background"
        />
      </div>

      {/* Dark Overlay (optional) */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Actual Content Layer */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/shelf/:shelfId" element={<ShelfDetails />} />
          <Route
            path="/shelf/:shelfId/book/:bookId"
            element={<BookDetails />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
