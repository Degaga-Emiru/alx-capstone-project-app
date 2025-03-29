import React from "react";
import {  useNavigate } from "react-router-dom";

const BorrowedBooks = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const borrowedBooks = currentUser?.borrowedBooks || [];
  const navigate = useNavigate();
  const handleReturn = (book) => {
    const updatedBorrowedBooks = borrowedBooks.filter((b) => b.key !== book.key);
    const updatedUser = { ...currentUser, borrowedBooks: updatedBorrowedBooks };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Book returned successfully!");
    window.location.reload(); // Refresh to update the UI
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
      <button
  onClick={() => navigate("/home")}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 flex items-center justify-center space-x-2">
  <i className="fa-solid fa-arrow-left"></i> {/* Font Awesome Arrow Icon */}
  <span>Back to Home</span> {/* Text */}
</button>
        <h1 className="text-3xl font-bold mb-6">Your Borrowed Books</h1>
        {borrowedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {borrowedBooks.map((book) => (
              <div
                key={book.key}
                className="bg-white p-4 rounded-lg shadow-md">
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
                  Due Date: {new Date(book.dueDate).toDateString()}
                </p>
                <button
                  onClick={() => handleReturn(book)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Return Book
                </button>
              </div>
            ))}
          </div> ) : (
          <p className="text-gray-700">You have no borrowed books.</p>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;