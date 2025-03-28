import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../redux/slices/authSlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [profileFetched, setProfileFetched] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Only fetch profile once
    if (!profileFetched) {
      dispatch(getProfile())
        .unwrap()
        .then(() => {
          setProfileFetched(true);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [user, navigate, dispatch, profileFetched]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Show loading state only during initial profile fetch
  if (isLoading && !profileFetched) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
          
          {user && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Welcome, {user.name || 'User'}!</h2>
                <p className="text-gray-600">
                  Account Type: <span className="font-medium">{user.role === 'DONOR' ? 'Donor' : 'Charity Organization'}</span>
                </p>
                <p className="text-gray-600">
                  Email: <span className="font-medium">{user.email}</span>
                </p>
              </div>
              
              {user.role === 'DONOR' ? (
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
                    <p className="text-gray-600">Your profile is incomplete. Please add more details to increase visibility.</p>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Complete Profile
                    </button>
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