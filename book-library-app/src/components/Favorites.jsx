import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  // Load favorites from localStorage on component mount and updates
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
        setFavorites(currentUser.favorites || []);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavorites([]);
      }
    };
    loadFavorites();
    // Listen for changes in localStorage (e.g., from other tabs)
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);
  const handleRemoveFavorite = (book) => {
    if (!book?.key) return;

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      const updatedFavorites = (currentUser.favorites || []).filter(
        (fav) => fav.key !== book.key
      );
      const updatedUser = { ...currentUser, favorites: updatedFavorites };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setFavorites(updatedFavorites); // Update state immediately when user remove the books from the Favorites list
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 flex items-center justify-center space-x-2"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Home</span>
        </button>
        <h1 className="text-3xl font-bold mb-6">Your Favorite Books</h1>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((book) => (
              <div key={book.key} className="bg-white p-4 rounded-lg shadow-md">
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title || "Book cover"}
                    className="w-full h-48 object-cover mb-4"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
                    }}/>) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4">
                    <span>No cover available</span>
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{book.title || "Untitled"}</h2>
                <p className="text-gray-700 mb-2">
                  Author(s): {book.author_name?.join(", ") || "Unknown author"}
                </p>
                {/* this button  helps to remove books from the Favorites list when this button clicked the handleRemoveFavorites handles the remove book list*/}
                <button
                  onClick={() => handleRemoveFavorite(book)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        ) : (<p className="text-gray-700">You have no favorite books yet.</p>
        )}
        {/* when user remove the book list from favorites it set that pages to You have no favorites books yet*/}
      </div>
    </div>
  );
};

export default Favorites;