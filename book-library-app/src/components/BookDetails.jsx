import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../components/store';
import React, { useState, useEffect } from 'react';
const BookDetails = () => {
  const location = useLocation();
  const { book } = location.state;
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);