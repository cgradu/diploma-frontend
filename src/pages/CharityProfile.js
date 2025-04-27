// frontend/src/pages/CharityProfilePage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCharityById, reset } from '../redux/slices/charitySlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Spinner from '../components/common/Spinner';

const CharityProfilePage = () => {
  const { charityId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get charity from Redux store with correct state structure based on your slice
  const { 
    charity, 
    isLoading, 
    isError, 
    isSuccess,
    message 
  } = useSelector(state => state.charities);
  
  const { user } = useSelector(state => state.auth);
  
  // Local state for debugging
  const [debugMode, setDebugMode] = useState(false);
  
  // Fetch charity data on mount
  useEffect(() => {
    dispatch(getCharityById(charityId));
    
    // Clean up when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [dispatch, charityId]);

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  
  // Check if user is charity owner - adapting to your data structure
  const isCharityOwner = () => {
    if (!user || !charity) return false;
    // Check if user is charity manager or admin
    return (charity.managerId === user.id) || (user.role === 'admin');
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Charity</h3>
                <p className="text-sm text-red-700 mt-1">{message || "Failed to load charity details. Please try again later."}</p>
                <button 
                  onClick={() => navigate('/charities')}
                  className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Back to Charities
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only render the main content when charity data is loaded
  if (!charity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">No charity data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Hero Section with Charity Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-white text-center mb-3">{charity.name}</h1>
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {charity.category?.replace(/_/g, ' ')}
              </span>
              {charity.foundedYear && (
                <span className="ml-3 bg-white bg-opacity-20 text-white px-3 py-0.5 rounded-full text-sm">
                  Est. {charity.foundedYear}
                </span>
              )}
              <span className="ml-3 bg-green-100 text-green-800 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
            <p className="text-blue-100 text-center max-w-3xl mb-8">{charity.mission}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              to={`/donation?charityId=${charityId}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Donate Now
            </Link>
            
            <Link
              to={`/charities/${charityId}/projects`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              View Projects
            </Link>
            
            {isCharityOwner() && (
              <Link
                to={`/dashboard/charity/edit/${charityId}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Charity
              </Link>
            )}
          </div>
          
          {/* Debug Mode Toggle */}
          {(user?.role === 'admin' || isCharityOwner()) && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={toggleDebugMode}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Debug info */}
        {debugMode && (
          <div className="bg-gray-100 p-4 mb-6 rounded border border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-700">Debug Information</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                Development Mode
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-1"><span className="font-semibold">Loading:</span> {isLoading ? '✓' : '✗'}</div>
                <div className="mb-1"><span className="font-semibold">Error:</span> {isError ? '✓' : '✗'}</div>
                <div className="mb-1"><span className="font-semibold">Success:</span> {isSuccess ? '✓' : '✗'}</div>
                <div className="mb-1"><span className="font-semibold">Error Message:</span> {message || 'None'}</div>
                <div className="mb-1"><span className="font-semibold">Charity ID:</span> {charityId}</div>
                <div className="mb-1"><span className="font-semibold">Is Owner:</span> {isCharityOwner() ? '✓' : '✗'}</div>
              </div>
              <div>
                <div className="mb-1"><span className="font-semibold">Created At:</span> {charity?.createdAt ? formatDate(charity.createdAt) : 'N/A'}</div>
                <div className="mb-1"><span className="font-semibold">Updated At:</span> {charity?.updatedAt ? formatDate(charity.updatedAt) : 'N/A'}</div>
                <div className="mb-1"><span className="font-semibold">Registration ID:</span> {charity?.registrationId || 'N/A'}</div>
                <div className="mb-1"><span className="font-semibold">Manager ID:</span> {charity?.managerId || 'N/A'}</div>
                <div className="mb-1"><span className="font-semibold">Projects Count:</span> {charity?.projects?.length || 'N/A'}</div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="font-semibold mb-1">Raw Charity Data:</div>
              <pre className="bg-white p-2 rounded mb-2 text-xs overflow-auto max-h-60">
                {JSON.stringify(charity, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Mission */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">About Us</h2>
              </div>
              <div className="px-6 py-5">
                <div className="prose max-w-none">
                  {charity.description}
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
              </div>
              <div className="px-6 py-5">
                <div className="prose max-w-none">
                  {charity.mission}
                </div>
              </div>
            </div>
            
            {/* Project Highlights Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Project Highlights</h2>
                <Link
                  to={`/charities/${charityId}/projects`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Projects →
                </Link>
              </div>
              <div className="px-6 py-5">
                {charity.projects && charity.projects.length > 0 ? (
                  <div className="space-y-4">
                    {charity.projects.slice(0, 3).map(project => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        <div className="mt-3">
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                  {Math.round((project.currentAmount / project.goal) * 100)}% Funded
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-gray-600">
                                  {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(project.currentAmount)} / 
                                  {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(project.goal)}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 mt-1">
                              <div 
                                style={{ width: `${Math.min(100, Math.round((project.currentAmount / project.goal) * 100))}%` }} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link
                            to={`/projects/${project.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            View Project →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This charity hasn't created any projects yet.
                    </p>
                    <div className="mt-6">
                      <Link
                        to={`/charities/${charityId}/projects`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Check Projects Page
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Details, Stats & Contact */}
          <div>
            {/* Charity Stats Card */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Charity Stats</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-medium text-gray-900">{charity.foundedYear || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">{charity.category?.replace(/_/g, ' ') || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-medium text-gray-900">{charity.stats?.projectsCount || charity.projects?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Projects</span>
                    <span className="font-medium text-gray-900">
                      {charity.projects?.filter(p => p.status === 'ACTIVE').length || 
                       charity.stats?.projectsByStatus?.ACTIVE || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donations</span>
                    <span className="font-medium text-gray-900">{charity.stats?.donationsCount || 0}</span>
                  </div>
                  
                  {charity.stats?.totalDonationAmount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount Raised</span>
                      <span className="font-medium text-gray-900">
                        {new Intl.NumberFormat('ro-RO', {
                          style: 'currency',
                          currency: 'RON',
                          minimumFractionDigits: 0
                        }).format(charity.stats.totalDonationAmount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration ID</span>
                    <span className="font-medium text-gray-900">{charity.registrationId}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information Card */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mt-1 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href={`mailto:${charity.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {charity.email}
                      </a>
                    </div>
                  </div>
                  
                  {charity.phone && (
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mt-1 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <a href={`tel:${charity.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {charity.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {charity.address && (
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mt-1 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-500">
                          {charity.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <a
                    href={`mailto:${charity.email}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Charity
                  </a>
                </div>
              </div>
            </div>
            
           {/* Blockchain Verification Card */}
           <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Blockchain Verification</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 18.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    This charity has been verified on the blockchain, ensuring transparency and accountability for all donations.
                  </p>
                  <div className="bg-gray-100 rounded-md p-3 text-xs font-mono text-gray-700 overflow-hidden overflow-ellipsis">
                    {charity.registrationId}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    All donations to this charity are recorded on the blockchain for complete transparency.
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/blockchain/verify?charityId=${charityId}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verify on Blockchain
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Updates Section - If your API provides updates */}
            {charity.updates && charity.updates.length > 0 && (
              <div className="bg-white shadow rounded-lg mt-6">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Updates</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {charity.updates.slice(0, 3).map(update => (
                      <div key={update.id} className="border-b border-gray-200 pb-5 last:border-b-0 last:pb-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{update.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{formatDate(update.createdAt)}</p>
                        <p className="text-sm text-gray-600 line-clamp-3">{update.content}</p>
                      </div>
                    ))}
                  </div>
                  {charity.updates.length > 3 && (
                    <div className="mt-4 text-center">
                      <button
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View all updates
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CharityProfilePage;