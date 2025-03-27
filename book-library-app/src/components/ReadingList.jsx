import React from "react";
import {  useNavigate } from "react-router-dom";
const ReadingList = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const readingList = currentUser?.readingList || [];
const navigate = useNavigate();
//const location = useLocation();
  const handleUpdateStatus = (book, newStatus) => {
    const updatedReadingList = readingList.map((item) =>
      item.key === book.key ? { ...item, status: newStatus } : item);
    const updatedUser = { ...currentUser, readingList: updatedReadingList };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert(`Status updated to "${newStatus}"`);
    window.location.reload(); // Refresh to update the UI components
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
      <button
  onClick={() => navigate("/home")}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 flex items-center justify-center space-x-2">
  <i className="fa-solid fa-arrow-left"></i> {/* Font Awesome Arrow Icon */}
  <span>Back to Home</span> 
</button>
<h1 className="text-3xl font-bold mb-6">Your Reading List</h1>
        {readingList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readingList.map((book) => (
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
                  Status:{" "}
                  <select
                    value={book.status}
                    onChange={(e) => handleUpdateStatus(book, e.target.value)}
                    className="p-2 border border-gray-300 rounded" > 
                    {/*the option for  book status change the added to reading list*/}
                    <option value="Want to Read">Want to Read</option>
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Completed">Completed</option>
                  </select>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">Your reading list is empty.</p>
        )}
      </div>
    </div>
  );
};
export default ReadingList;