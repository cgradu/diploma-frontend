// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Charity Transparency</h2>
            <p className="text-gray-400">
              Our platform uses blockchain technology to ensure complete transparency in charitable giving.
            </p>
          </div>
          <div>
            <h3 className="text-md font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
              <li><Link to="/blockchain-verification" className="text-gray-400 hover:text-white">Blockchain Verification</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@charitytrans.org</li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Charity Transparency Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;