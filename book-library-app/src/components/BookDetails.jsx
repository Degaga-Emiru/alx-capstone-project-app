import { useLocation, useNavigate } from 'react-router-dom';// for navigation 
import useAuthStore from '../components/store';// use zustand store
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
        // First try to get ISBN from the book object
        let isbn = book.isbn?.[0] || '';
        
        // If no ISBN in the book object, try to extract from the key
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

  // Handle borrowing a book
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
    //navigate('/home');
  };

  // Handle adding to favorites
  const handleAddToFavorites = () => {
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

  // Handle adding to reading list
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