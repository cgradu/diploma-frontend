import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile} from '../redux/slices/authSlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Only fetch profile if we don't have detailed user data
    if (user && !user.name) {
      dispatch(getProfile());
    }
  }, [user, navigate, dispatch]);
  
  // Function to check if charity profile is complete
  const isProfileComplete = () => {
    if (!user) return false;
    
    // For charity users
    if (user.role === 'charity') {
      return Boolean(
        user.name && 
        user.email && 
        user.charityName && 
        user.registrationNumber && 
        user.missionStatement && 
        user.organizationType
      );
    }
    
    // For donor users
    if (user.role === 'donor') {
      return Boolean(
        user.name && 
        user.email &&
        user.phone &&
        user.address
      );
    }
    
    return false;
  };
  
  // Show loading state only during initial load
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          
          {user && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Welcome, {user.name || 'User'}!</h2>
                <p className="text-gray-600">
                  Account Type: <span className="font-medium">
                  { user.role === 'donor' ? 'Donor' : user.role === 'admin' ? 'Admin' : 'Charity Organization' }</span>
                </p>
                <p className="text-gray-600">
                  Email: <span className="font-medium">{user.email}</span>
                </p>
              </div>
              
              {user.role === 'donor' ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Donor Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded shadow">
                      <h4 className="font-medium text-blue-800">Total Donations</h4>
                      <p className="text-2xl font-bold">$0.00</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded shadow">
                      <h4 className="font-medium text-green-800">Charities Supported</h4>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded shadow">
                      <h4 className="font-medium text-purple-800">Active Projects</h4>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Recommended Charities</h3>
                    <p className="text-gray-600">No recommended charities yet. Check back soon!</p>
                  </div>
                  
                  {/* Profile completion message for donor */}
                  {!isProfileComplete() && (
                    <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                      <p className="text-gray-600">Complete your profile to get personalized charity recommendations.</p>
                      <Link to="/profile">
                        <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Update Profile
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Charity Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded shadow">
                      <h4 className="font-medium text-blue-800">Total Received</h4>
                      <p className="text-2xl font-bold">$0.00</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded shadow">
                      <h4 className="font-medium text-green-800">Donors</h4>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded shadow">
                      <h4 className="font-medium text-purple-800">Active Projects</h4>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Organization Profile</h3>
                    
                    {isProfileComplete() ? (
                      <div className="bg-green-50 p-4 rounded flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-700">Your profile is complete! This helps donors find and trust your organization.</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600">Your profile is incomplete. Please add more details to increase visibility.</p>
                        <Link to="/profile">
                          <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Complete Profile
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;