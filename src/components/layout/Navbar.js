import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                Charity Transparency
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          {user && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="text-white mr-4">{user.name}</div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;