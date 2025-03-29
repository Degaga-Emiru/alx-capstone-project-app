import React from "react";
const Borrow = ({ book, onBorrow }) => {
  const handleBorrow = (days) => {
    onBorrow(book, days); 
  };

  return (
    <div className="space-x-2">
      <button
        onClick={() => handleBorrow(7)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > Borrow for 7 Days </button>
      <button
        onClick={() => handleBorrow(14)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Borrow for 14 Days
      </button>
      <button
        onClick={() => handleBorrow(30)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > Borrow for 30 Days
      </button>
    </div>
  );
};

export default Borrow;