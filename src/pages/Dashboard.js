import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../redux/slices/authSlice';
import { getManagerCharity } from '../redux/slices/charitySlice';
import { getProjectsByCharityId } from '../redux/slices/projectSlice';
import { getCharityDonationStats } from '../redux/slices/donationSlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user from auth state
  const { user, isLoading: isLoadingUser } = useSelector((state) => state.auth);
  
  // Get charity data from charities state
  const { managerCharity, isLoading: isLoadingCharity } = useSelector((state) => state.charities || {});
  
  // Get projects from projects state
  const { projects, isLoading: isLoadingProjects } = useSelector((state) => state.projects || { projects: [] });
  
  // Get donation statistics from donation state
  const { charityStats, isLoading: isLoadingStats } = useSelector((state) => state.donation || { charityStats: null });
  
  // Local state for loading states
  const [isDataFetched, setIsDataFetched] = useState(false);
  
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
  
  // Fetch charity-specific data when user is a charity manager
  useEffect(() => {
    const fetchCharityData = async () => {
      if (user && (user.role === 'charity' || user.role === 'admin') && !isDataFetched) {
        setIsDataFetched(true);
        
        try {
          // First get the managed charity
          const charityAction = await dispatch(getManagerCharity());
          
          if (getManagerCharity.fulfilled.match(charityAction) && charityAction.payload) {
            const charityId = charityAction.payload.id;
            
            // Now fetch projects and donation stats in parallel
            await Promise.all([
              dispatch(getProjectsByCharityId({ charityId })),
              dispatch(getCharityDonationStats(charityId))
            ]);
          }
        } catch (error) {
          console.error('Error fetching charity data:', error);
        }
      }
    };
    
    fetchCharityData();
  }, [user, dispatch, isDataFetched]);
  
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
  
  // Calculate charity stats
  const getCharityStats = () => {
    // Default values
    const stats = {
      totalReceived: 0,
      donorCount: 0,
      activeProjectsCount: 0
    };
    
    // Use donation stats if available
    if (charityStats) {
      stats.totalReceived = charityStats.totalAmount || 0;
      stats.donorCount = charityStats.uniqueDonors || 0;
    }
    
    // Count active projects
    if (projects && Array.isArray(projects)) {
      stats.activeProjectsCount = projects.filter(project => project.status === 'ACTIVE').length;
    }
    
    return stats;
  };
  
  // Get formatted charity stats
  const { totalReceived, donorCount, activeProjectsCount } = getCharityStats();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Check if any data is still loading
  const isLoading = isLoadingUser || isLoadingCharity || isLoadingProjects || isLoadingStats;
  
  // Show loading state during initial load or data fetching
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            {user?.role === 'charity' && managerCharity && (
              <Link 
                to={`/charities/${managerCharity.id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                View Public Profile
              </Link>
            )}
          </div>
          
          {user && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Welcome, {user.role === 'charity' && managerCharity ? managerCharity.name : user.name || 'User'}!
                </h2>
                <p className="text-gray-600">
                  Account Type: <span className="font-medium">
                  { user.role === 'donor' ? 'Donor' : user.role === 'admin' ? 'Admin' : 'Charity Organization' }</span>
                </p>
                <p className="text-gray-600">
                  Email: <span className="font-medium">{user.email}</span>
                </p>
                
                {user.role === 'charity' && managerCharity && (
                  <div className="mt-2">
                    <p className="text-gray-600">
                      Registration ID: <span className="font-medium">{managerCharity.registrationId}</span>
                    </p>
                    <p className="text-gray-600">
                      Category: <span className="font-medium">{managerCharity.category}</span>
                    </p>
                  </div>
                )}
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
                      <p className="text-2xl font-bold">{formatCurrency(totalReceived)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded shadow">
                      <h4 className="font-medium text-green-800">Donors</h4>
                      <p className="text-2xl font-bold">{donorCount}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded shadow">
                      <h4 className="font-medium text-purple-800">Active Projects</h4>
                      <p className="text-2xl font-bold">{activeProjectsCount}</p>
                      {managerCharity && (
                        <Link to={`/charities/${managerCharity.id}/projects`} className="text-sm text-purple-600 hover:underline block mt-2">
                          View Projects
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {/* Recent Activity Section */}
                  {managerCharity && managerCharity.recentDonations && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                      {managerCharity.recentDonations.length > 0 ? (
                        <div className="bg-white border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {managerCharity.recentDonations.map((donation) => (
                                <tr key={donation.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {donation.donor?.name || 'Anonymous'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(donation.amount)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {donation.project?.title || 'General Donation'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-600">No recent donations to display.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                      {managerCharity && (
                        <Link 
                          to={`/dashboard/projects/create?charityId=${managerCharity.id}`}
                          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Create New Project
                        </Link>
                      )}
                      
                      <Link 
                        to="/profile"
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Update Profile
                      </Link>
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