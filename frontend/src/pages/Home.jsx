import React from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";
import TrendingBooks from "../components/TrendingBooks";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MainContent />
      </main>
      <TrendingBooks />
      <Footer />
    </div>
  );
};

export default Home;
