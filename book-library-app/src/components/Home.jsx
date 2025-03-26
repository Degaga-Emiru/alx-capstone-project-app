import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "./store";
import logo from '../assets/logo.png';
const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  // Fetch books from Open Library API
  const fetchBooks = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setBooks(data.docs);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  // Navigate to Book Details page
  const handleSeeDetails = (book) => {
    navigate("/book-details", { state: { book } });
  };

  // Toggle navbar menu for small screens
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
               src={logo}
               alt="Book Library Logo"
               className="h-10 w-10 mr-2"
            />
            <h1 className="text-2xl font-bold">Book Library</h1>
          </div>
          {/* Menu Button for Small Screens */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
          {/* Navbar Links */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4`}
          >
            <Link to="/" className="block hover:text-gray-200">
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/favorites" className="block hover:text-gray-200">
                  Favorites
                </Link>
                <Link to="/reading-list" className="block hover:text-gray-200">
                  Reading List
                </Link>
                <Link to="/borrowed-books" className="block hover:text-gray-200">
                  Borrowed Books
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {/* Heading and Paragraph */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Book of Choice</h1>
          <p className="text-gray-700">
            Explore our vast collection of books and discover your next great
            read. Search by title, author, or category—the world of knowledge is
            just a click away!
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center space-x-2 mb-8"
        >
          <input
            type="text"
            placeholder="Search for books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Book List */}
        <div className="container mx-auto p-4">
          {books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.key}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  {book.cover_i && (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                      className="w-full h-48 object-cover mb-4"
                    />
                  )}
                  <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                  <p className="text-gray-700 mb-2">
                    Author(s): {book.author_name?.join(", ")}
                  </p>
                  <p className="text-gray-700 mb-2">
                    Publisher: {book.publisher?.join(", ")}
                  </p>
                  <button
                    onClick={() => handleSeeDetails(book)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >See Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700">No books found. Try searching!</p>
          )}
        </div>
      </main>

      <footer className="bg-black text-white py-4">
  <div className="max-w-1xl mx-auto text-center px-2">
  <p className="text-xl font-bold mb-2">Stay Connected with Us!</p>
    {/* Social Media Links */}
    <div className="flex justify-center sm:justify-end space-x-4 mb-2">
      <a href="#" className="hover:text-gray-400">
        <i className="fab fa-facebook text-xl"></i>
      </a>
      <a href="#" className="hover:text-gray-400">
        <i className="fab fa-twitter text-xl"></i>
      </a>
      <a href="#" className="hover:text-gray-400">
        <i className="fab fa-instagram text-xl"></i>
      </a>
      <a href="#" className="hover:text-gray-400">
        <i className="fab fa-linkedin text-xl"></i>
      </a>
    </div>

    {/* Copyright Text */}
    <p className="text-xs">
      &copy; 2023 Book Library. All rights reserved.
    </p>
  </div>
</footer>

    </div>
  );
}; 
export default Home;