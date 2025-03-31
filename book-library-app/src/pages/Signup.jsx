import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/store'; // Import Zustand store
import bookIllustration from '../assets/book-illustrations.jpeg'; // Import your image

const Signup = () => {
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp); // Get signUp function from store

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
// Moving text animation content
const movingTexts = [
  "Start your reading journey today",
  "Build your personal library",
  "Track books you've read",
  "Discover new favorites",
  "Join our community of readers"
];
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be 20 characters or less'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
     
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some(
        (user) => user.email === values.email || user.username === values.username
      );

      if (userExists) {
        setMessage({ text: 'User with this email or username already exists!', type: 'error' });
        return;
      }

      // Create user object with default values
      const newUser = {
        username: values.username,
        email: values.email,
        password: values.password,
        favorites: [],
        readingList: [],
        borrowedBooks: []
      };

      // Use Zustand to handle signup
      signUp(newUser);
      
      setMessage({ 
        text: 'Signup successful! Redirecting to login...', 
        type: 'success' 
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage({ 
        text: 'An error occurred during signup. Please try again.', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">SignUp and Join Our Book Library</h2>
        {message.text && (
          <div
            className={`p-4 mb-4 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Enter y username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/> 
                  <ErrorMessage 
                  name="username" 
                  component="div" 
                  className="mt-1 text-sm text-red-600"  />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/> 
                  <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 4 characters </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                <ErrorMessage 
                  name="confirmPassword" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-blue-600 hover:text-blue-500" > Log in
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {/*  this section contains some animation for signup page that consists paragraph and image with animation*/}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Begin Your Reading Adventure</h1>
          <p className="mt-4 text-white">
              Create your account to start building your personal library, track your reading progress,
              and discover new books tailored just for you.
            </p>
        </div>
        <div className="flex justify-center mb-8">
          <img 
            src={bookIllustration} 
            alt="Reading illustration"
            className="w-96 h-96 object-contain"/>
        </div>

        {/* Moving text animation on sign up page*/}
        <div className="absolute bottom-10 left-0 right-0 overflow-hidden text-center">
          <div className="animate-marquee whitespace-nowrap">
            {movingTexts.map((text, index) => (
              <span key={index} className="mx-8 text-2xl font-semibold text-white inline-block">
                {text} •
              </span>
            ))}
          </div>
        </div>
        <div className="text-indigo-100 text-center mb-20">
          <p className="text-lg">"The more that you read, the more things you will know."</p>
          <p className="text-sm mt-2">- Dr. Seuss</p>
        </div>
      </div>

      {/* Add custom animation style using css  */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default Signup;