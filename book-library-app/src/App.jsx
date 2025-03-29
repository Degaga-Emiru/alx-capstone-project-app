import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/welcomePage';
import Home from './components/Home';
import BookDetails from './components/BookDetails';
import Favorites from './components/Favorites';
import ReadingList from './components/ReadingList';
import BorrowedBooks from './components/BorrowedBooks';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import useAuthStore from './store/store';

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Protect routes that require authentication
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Welcome Page (Public) */}
        <Route path="/" element={<WelcomePage />} />
        {/* Home Page (Protected) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute> } />
        <Route
          path="/book-details"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>}/>
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }/>
        <Route
          path="/reading-list"
          element={
            <ProtectedRoute>
              <ReadingList />
            </ProtectedRoute> }/>
        <Route
          path="/borrowed-books"
          element={
            <ProtectedRoute>
              <BorrowedBooks />
            </ProtectedRoute>
          }/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;