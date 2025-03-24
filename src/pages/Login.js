import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Charity Transparency Platform
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
          <div className="text-center mt-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;