import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Transparent Charity Platform
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Our blockchain-based platform ensures complete transparency in charitable giving.
            Track your donations in real-time and see the impact you're making.
          </p>
          <div className="mt-8 flex space-x-4">
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-6 rounded-md hover:bg-gray-100"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block border border-white text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Complete Transparency</h2>
            <p className="text-gray-600">
              Our blockchain technology ensures that every donation is tracked and verified,
              providing complete transparency from donor to beneficiary.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Real-Time Tracking</h2>
            <p className="text-gray-600">
              Track your donations in real-time and see exactly how your funds are being
              utilized to make a difference.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Verified Impact</h2>
            <p className="text-gray-600">
              We verify the impact of each project, ensuring that your donations are
              creating the change you want to see in the world.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;