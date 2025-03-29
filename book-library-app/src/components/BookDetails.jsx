import { useLocation, useNavigate } from 'react-router-dom';// for navigation 
import useAuthStore from '../store/store';// use zustand store
import React, { useState, useEffect } from 'react';
const BookDetails = () => {
  const location = useLocation();
  const { book } = location.state;
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);
  // Fetch detailed book information using ISBN
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        let isbn = book.isbn?.[0] || '';
        
        if (!isbn && book.key) {
          const matches = book.key.match(/ISBN:([0-9]+)/);
          if (matches && matches[1]) {
            isbn = matches[1];
          }
        }

        if (isbn) {
          const response = await fetch(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
          );
          const data = await response.json();
          const bookData = data[`ISBN:${isbn}`];
          setBookDetails(bookData);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [book]);

  // Handle borrowing a book when user want to borrow a book 
  const handleBorrow = (days) => {
    if (currentUser.borrowedBooks.length >= 2)// the user can only borrow at most 2 books at a time 
     {
      alert('You can only borrow 2 books at a time.');
      return;
    }

    const isBookBorrowed = currentUser.borrowedBooks.some(
      (b) => b.key === book.key
    );
    if (isBookBorrowed) {
      alert('You have already borrowed this book.');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const updatedUser = {
      ...currentUser,
      borrowedBooks: [
        ...currentUser.borrowedBooks,
        { ...book, dueDate: dueDate.toISOString() },
      ],
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    alert(`Book borrowed successfully! Due date: ${dueDate.toDateString()}`);
    
  };
  const handleAddToFavorites = () => { // that handle when user added to their Favorite
    const isBookInFavorites = currentUser.favorites.some(
      (fav) => fav.key === book.key
    );
    if (isBookInFavorites) {
      alert('This book is already in your favorites.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      favorites: [...currentUser.favorites, book],
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    alert('Book added to favorites!');
    //navigate('/home');

  };

  // this function that Handle adding to reading list when user click the button to add the Reading list
  const handleAddToReadingList = () => {
    const isBookInReadingList = currentUser.readingList.some(
      (item) => item.key === book.key
    );
    if (isBookInReadingList) {
      alert('This book is already in your reading list.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      readingList: [...currentUser.readingList, { ...book, status: 'Want to Read' }],
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    alert('Book added to reading list!');
    //navigate('/home');
  };

  // Get the best available ISBN
  const getDisplayISBN = () => {
    if (bookDetails?.isbn) {
      return bookDetails.isbn[0]; // Use the first ISBN from detailed data
    }
    if (book.isbn?.[0]) {
      return book.isbn[0]; // Fallback to search result ISBN
    }
    return 'Not available';
  };

  // Get the best available page count
  const getDisplayPages = () => {
    if (bookDetails?.number_of_pages) {
      return bookDetails.number_of_pages;
    }
    if (book.number_of_pages_median) {
      return book.number_of_pages_median;
    }
    return 'Not available';
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading book details...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
      <button
  onClick={() => navigate("/home")} // Explicitly go to home
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
> Back to Home
</button>
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        
        {book.cover_i && (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
            alt={book.title}
            className="w-48 h-64 object-cover mb-4"
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 mb-2">
              <strong>Author(s):</strong> {book.author_name?.join(', ') || 'Unknown'}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Publisher:</strong> {bookDetails?.publishers?.[0]?.name || book.publisher?.join(', ') || 'Unknown'}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Publication Date:</strong> {book.first_publish_year || 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">
              <strong>ISBN:</strong> {getDisplayISBN()}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Pages:</strong> {getDisplayPages()}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Subjects:</strong> {book.subject?.join(', ') || 'Not available'}
            </p>
          </div>
        </div>

        {bookDetails?.description && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-700">
              {typeof bookDetails.description === 'string' 
                ? bookDetails.description 
                : bookDetails.description?.value || 'No description available'}
            </p>
          </div>
        )};
         {/*User to borrow the searched  Book  e.g for 7 days, 14 days, 30 days*/}
         <div className="border-t pt-4">
  <h2 className="text-xl font-bold mb-2">Borrow This Book</h2>
  <p className="text-gray-700 mb-4">Choose how long you'd like to borrow this book. Remember to return it by the due date.
  </p>
  <div className="relative">
    <select
      onChange={(e) => handleBorrow(Number(e.target.value))}
      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select borrowing period</option>
      <option value="7">7 Days</option>
      <option value="14">14 Days</option>
      <option value="30">30 Days</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
</div>
 <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-2">Add to Collections</h2>
            <div className="flex flex-wrap gap-4">
                 {/* used to add the Book to the favorite list*/}
              <button
                onClick={handleAddToFavorites}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Favorites
              </button>
               {/* this function handles add to reading list */}
              <button
                onClick={handleAddToReadingList}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Add to Reading List
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};
export default BookDetails; 
