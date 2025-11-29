import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ShelfContext = createContext();
export const useShelves = () => useContext(ShelfContext);

export const ShelfProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [shelves, setShelves] = useState([]);

  // Fetch all shelves
  const fetchShelves = async () => {
    try {
      const res = await fetch(
        "https://bookvault-production.up.railway.app/shelves",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );
      console.log("fetch shelves executed");
      const data = await res.json();
      setShelves(data.data || []);
    } catch (err) {
      console.error("Fetch shelves error:", err);
    }
  };

  // Create new shelf
  const createShelf = async (name, description = "") => {
    try {
      const res = await fetch(
        "https://bookvault-production.up.railway.app/shelves",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name, description }),
        }
      );

      console.log("create shelf executed");
      const data = await res.json();
      console.log("Data: ", data);
      if (res.ok) fetchShelves();
      return res.ok;
    } catch (err) {
      console.error(err);
    }
  };

  // Add book to shelf
  const addBookToShelf = async (shelfId, bookId) => {
    try {
      const res = await fetch(
        `https://bookvault-production.up.railway.app/shelves/${shelfId}/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ bookId }),
        }
      );

      if (res.ok) fetchShelves();
      return res.ok;
    } catch (err) {
      console.error(err);
    }
  };

  // Remove book
  const removeBookFromShelf = async (shelfId, bookId) => {
    try {
      const res = await fetch(
        `https://bookvault-production.up.railway.app/shelf/${shelfId}/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) fetchShelves();
      return res.ok;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (accessToken) fetchShelves();
  }, [accessToken]);

  return (
    <ShelfContext.Provider
      value={{
        shelves,
        fetchShelves,
        createShelf,
        addBookToShelf,
        removeBookFromShelf,
      }}
    >
      {children}
    </ShelfContext.Provider>
  );
};
