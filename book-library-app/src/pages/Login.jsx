import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/store'; // Import Zustand store

const Login = () => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Get login function from store

  const initialValues = {
    emailOrUsername: '',
    password: '',
  };

  const validationSchema = Yup.object({
    emailOrUsername: Yup.string().required('Email or Username is required'),
    password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        (user) =>
          user.email === values.emailOrUsername || 
          user.username === values.emailOrUsername
      );

      if (!user) {
        setMessage({ text: 'User not found!', type: 'error' });
        return;
      }

      if (user.password !== values.password) {
        setMessage({ text: 'Invalid password!', type: 'error' });
        return;
      }

      // Successful login
      login(user); // Update Zustand store
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      
      // Redirect to /home after 1.5 seconds
      setTimeout(() => {
        navigate('/home'); // Changed from '/' to '/home'
      }, 1500);

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back to Book Library</h2>
        
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
                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">
                  Email or Username
                </label>
                <Field
                  type="text"
                  name="emailOrUsername"
                  placeholder="Enter your email or username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage 
                  name="emailOrUsername" 
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
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;