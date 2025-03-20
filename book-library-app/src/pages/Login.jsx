import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    emailOrUsername: '',
    password: '',
  };

  const validationSchema = Yup.object({
    emailOrUsername: Yup.string().required('Email or Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = (values) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
      (user) =>
        user.email === values.emailOrUsername || user.username === values.emailOrUsername
    );

    if (user && user.password === values.password) {
      alert('Login successful!');
      navigate('/');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">Email or Username</label>
                <Field
                  type="text"
                  name="emailOrUsername"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="emailOrUsername" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>

              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  Signup
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;