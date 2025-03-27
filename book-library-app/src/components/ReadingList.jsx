import React from "react";
import {  useNavigate } from "react-router-dom";
const ReadingList = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const readingList = currentUser?.readingList || [];
const navigate = useNavigate();
//const location = useLocation();
  const handleUpdateStatus = (book, newStatus) => {
    const updatedReadingList = readingList.map((item) =>
      item.key === book.key ? { ...item, status: newStatus } : item
    );
    const updatedUser = { ...currentUser, readingList: updatedReadingList };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert(`Status updated to "${newStatus}"`);
    window.location.reload(); // Refresh to update the UI
  };