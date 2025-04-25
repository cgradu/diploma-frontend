// src/pages/Charities.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCharities, getCategories, reset } from '../redux/slices/charitySlice';
import Navbar from '../components/layout/Navbar';

const Charities = () => {
  const dispatch = useDispatch();
  const {
    charities, 
    categories,
    pagination,
    isLoading,
    isError,
    message 
  } = useSelector((state) => state.charities);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inputSearchTerm, setInputSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  
  // Add debugging
  useEffect(() => {
    console.log('Current Redux state:', { 
      charities: charities?.length || 0, 
      categories, 
      isLoading, 
      isError,
      message
    });
  }, [charities, categories, isLoading, isError, message]);

  useEffect(() => {
    // Fetch categories when component mounts
    console.log('Dispatching getCategories');
    dispatch(getCategories())
      .then(result => {
        console.log('Categories result:', result);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
    
    // Fetch initial charities
    console.log('Dispatching initial getCharities');
    dispatch(getCharities())
      .then(result => {
        console.log('Initial charities result:', result);
      })
      .catch(err => {
        console.error('Error fetching initial charities:', err);
      });
    
    // Cleanup on unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    // Don't fetch on initial load - that's handled by the first useEffect
    if (currentPage === 1 && searchTerm === '' && selectedCategory === 'All Categories') {
      return;
    }
    
    // Fetch charities whenever filters change
    console.log('Filters changed, fetching charities with:', { 
      page: currentPage, 
      category: selectedCategory, 
      search: searchTerm
    });
    
    dispatch(getCharities({
      page: currentPage, 
      category: selectedCategory, 
      search: searchTerm 
    }));
  }, [dispatch, currentPage, selectedCategory, searchTerm]);

  // Handle search input change (just update the input state)
  const handleSearchChange = (e) => {
    setInputSearchTerm(e.target.value);
  };
  
  // Handle search input keypress (for Enter key)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(inputSearchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    console.log('Category changed to:', value);
    
    // Reset search terms when changing category
    setInputSearchTerm('');
    setSearchTerm('');
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filter changes
    
    // Trigger a search with new category but cleared search terms
    dispatch(getCharities({ 
      page: 1,
      category: value,
      search: ''
    }));
  };

  // Handle pagination
  const paginate = (pageNumber) => {  
    console.log('Paginate to:', pageNumber);
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar/>
      {/* Header Banner */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">Explore Verified Charities</h1>
          <p className="text-blue-100 text-center mt-2">
            Find and support trusted organizations making a real difference
          </p>
          
          {/* Search and Filter Section */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full bg-white bg-opacity-20 border-transparent rounded-md py-2 pl-10 pr-3 text-white placeholder-blue-200 focus:outline-none focus:bg-opacity-30 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                    placeholder="Search charities by name, location, or cause... (press Enter to search)"
                    value={inputSearchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="sm:w-64">
                <select
                  className="block w-full bg-white bg-opacity-20 border-transparent rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:bg-opacity-30 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="All Categories" className="text-gray-900">All Categories</option>
                  {categories && categories.length > 0 && (
                    categories.map((category) => (
                      category !== 'All Categories' && (
                        <option 
                          key={category} 
                          value={category}
                          className="text-gray-900"
                        >
                          {category}
                        </option>
                      )
                    ))
                  )}
                </select>
              </div>
              
              {/* Search button */}
              <div className="sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm(inputSearchTerm);
                    setCurrentPage(1); // Reset to first page when search changes
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          
          {/* Debug Mode Toggle */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleDebugMode}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="mb-1"><span className="font-semibold">Error Message:</span> {message || 'None'}</div>
                <div className="mb-1"><span className="font-semibold">Total Charities:</span> {charities?.length || 0}</div>
              </div>
              <div>
                <div className="mb-1"><span className="font-semibold">Current Page:</span> {currentPage}</div>
                <div className="mb-1"><span className="font-semibold">Total Pages:</span> {pagination?.totalPages || 0}</div>
                <div className="mb-1"><span className="font-semibold">Selected Category:</span> {selectedCategory}</div>
                <div className="mb-1"><span className="font-semibold">Search Term:</span> {searchTerm || 'None'}</div>
                <div className="mb-1"><span className="font-semibold">Input Search Term:</span> {inputSearchTerm || 'None'}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="mb-1"><span className="font-semibold">Available Categories:</span> {categories?.join(', ') || 'None'}</div>
              <div className="mb-1"><span className="font-semibold">Pagination Info:</span> {JSON.stringify(pagination || {})}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <details>
                <summary className="font-semibold text-gray-700 cursor-pointer">Raw Charity Data (click to expand)</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-60 bg-gray-50 p-2 rounded">
                  {JSON.stringify(charities || [], null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{message || 'Failed to load charities. Please try again later.'}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* No Results State */}
        {!isLoading && (!charities || charities.length === 0) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No charities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // Clear filters
                  setInputSearchTerm('');
                  setSearchTerm('');
                  setSelectedCategory('All Categories');
                  
                  // Refetch with cleared filters
                  dispatch(getCharities({ page: 1 }));
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
        
        {/* Display Charities */}
        {!isLoading && charities && charities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity) => (
              <div 
                key={charity.id} 
                className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
              >
                {/* Charity Logo/Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {/* {charity.logo ? (
                    <img 
                      src={charity.logo} 
                      alt={`${charity.name} logo`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Charity';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )} */}
                </div>
                
                {/* Charity Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                      {charity.category}
                    </span>
                    {/* {charity.verified && (
                      <span className="flex items-center text-xs text-green-700 font-medium">
                        <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )} */}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{charity.name}</h3>
                  
                  {charity.address && (
                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {charity.address}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {charity.description}
                  </p>
                  
                  {/* Impact metrics (if available) */}
                  {charity.impactMetrics && (
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500">Projects</p>
                        <p className="font-semibold text-gray-900">
                          {charity.impactMetrics.projectsCount || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500">Donations</p>
                        <p className="font-semibold text-gray-900">
                          {charity.impactMetrics.donationsCount || 0}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Blockchain verification (if available) */}
                  {charity.blockchainVerified && (
                    <div className="mb-4 text-sm bg-green-50 p-2 rounded flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-800 font-medium">Blockchain Verified</span>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex justify-between mt-4">
                    <Link 
                      to={`/charities/${charity.id}/projects`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    <Link
                      to={`/donate/${charity.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Donate
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && charities && charities.length > 0 && pagination && (
          <div className="flex justify-center mt-8">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Page {currentPage} of {pagination.totalPages || 1}
              </span>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage >= (pagination.totalPages || 1)}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage >= (pagination.totalPages || 1)
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charities;