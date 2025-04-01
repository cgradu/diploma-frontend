import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Charitrace
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                  isActive('/') ? 'bg-blue-700' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/how-it-works"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                  isActive('/how-it-works') ? 'bg-blue-700' : ''
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/charities"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                  isActive('/charities') ? 'bg-blue-700' : ''
                }`}
              >
                Explore Charities
              </Link>
              <Link
                to="/about"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                  isActive('/about') ? 'bg-blue-700' : ''
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                  isActive('/contact') ? 'bg-blue-700' : ''
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/donate"
                  className="text-blue-600 bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md text-sm font-bold shadow-md"
                >
                  Donate Now
                </Link>
              </>
            ) : (
              <>
                <span className="text-white mr-2">{user.name}</span>
                <Link
                  to="/dashboard"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                    isActive('/dashboard') ? 'bg-blue-700' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${
                    isActive('/profile') ? 'bg-blue-700' : ''
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/donate"
                  className="text-blue-600 bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md text-sm font-bold shadow-md"
                >
                  Donate Now
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link
                to="/donate"
                className="text-blue-600 bg-yellow-400 hover:bg-yellow-500 px-3 py-1.5 rounded-md text-xs font-bold shadow-md mr-2"
              >
                Donate
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            <Link
              to="/"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                isActive('/') ? 'bg-blue-800' : ''
              }`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                isActive('/how-it-works') ? 'bg-blue-800' : ''
              }`}
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link
              to="/charities"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                isActive('/charities') ? 'bg-blue-800' : ''
              }`}
              onClick={toggleMenu}
            >
              Explore Charities
            </Link>
            <Link
              to="/about"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                isActive('/about') ? 'bg-blue-800' : ''
              }`}
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                isActive('/contact') ? 'bg-blue-800' : ''
              }`}
              onClick={toggleMenu}
            >
              Contact
            </Link>

            {/* Mobile Authentication */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
                <Link
                  to="/donate"
                  className="text-blue-600 bg-yellow-400 hover:bg-yellow-500 block px-3 py-2 rounded-md text-base font-bold mt-2"
                  onClick={toggleMenu}
                >
                  Donate Now
                </Link>
              </>
            ) : (
              <>
                <div className="border-t border-blue-800 pt-2 mt-2">
                  <div className="text-white px-3 py-1 text-sm opacity-75">
                    Signed in as: {user.name}
                  </div>
                  <Link
                    to="/dashboard"
                    className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                      isActive('/dashboard') ? 'bg-blue-800' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 ${
                      isActive('/profile') ? 'bg-blue-800' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;