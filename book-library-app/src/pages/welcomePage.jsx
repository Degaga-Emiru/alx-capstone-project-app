import React from 'react';
import welcomeBackground from "../assets/welcome-background.jpeg"; // Ensure this path is correct

const WelcomePage = () => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        backgroundImage: `url(${welcomeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay to darken the background image for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 max-w-4xl text-center p-6">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Discover a World<br />
          of Knowledge<br />
          at Your Fingertips
        </h1>

        {/* Button */}
        <button
          className="bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-md hover:bg-blue-600 focus:outline-none mt-8"
        >
          Get Started
        </button>

        {/* Paragraph */}
        <p className="text-base md:text-lg mt-8">
          Welcome to Book Library! A gateway to endless knowledge and imagination. Whether you’re a curious learner, an avid reader, or a casual browser, our library helps you explore millions of books effortlessly. Search, borrow, and enjoy your favorite books anytime, anywhere. From timeless classics to the latest bestsellers, your reading journey begins here. Discover, learn, and grow with us.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;