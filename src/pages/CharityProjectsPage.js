// frontend/src/pages/CharityProjectsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCharityById } from '../redux/slices/charitySlice';
import { getProjectsByCharityId, getProjectStatuses, reset } from '../redux/slices/projectSlice';
import Navbar from '../components/layout/Navbar';

const CharityProjectsPage = () => {
  const { charityId } = useParams();
  const dispatch = useDispatch();
  
  // Get charity and projects from Redux store
  const { 
    charity = null, 
    isLoading: isLoadingCharity = false, 
    isError: isErrorCharity = false, 
    message: charityMessage = ''
  } = useSelector(state => state.charity || {});
  
  const { 
    projects = [], 
    statuses = [], 
    isLoading: isLoadingProjects = false, 
    isError: isErrorProjects = false, 
    message: projectMessage = '' 
  } = useSelector(state => state.projects || []);
  
  const { user } = useSelector(state => state.auth);
  
  // Local state for filtering
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputSearchTerm, setInputSearchTerm] = useState('');
  const [debugMode, setDebugMode] = useState(true); // Set debug mode to true by default
  
  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Fetch charity and projects on mount
  useEffect(() => {
    console.log('Dispatching getCharityById for ID:', charityId);
    dispatch(getCharityById(charityId));
    
    console.log('Dispatching getProjectsByCharityId for charityId:', charityId);
    dispatch(getProjectsByCharityId({ charityId }));
    
    console.log('Dispatching getProjectStatuses');
    dispatch(getProjectStatuses());
  }, [dispatch, charityId]);
  
  // Log whenever projects are updated
  useEffect(() => {
    if (projects && projects.length > 0) {
      const uniqueStatuses = [...new Set(projects.map(p => p.status))];
      console.log('Unique status values in projects:', uniqueStatuses);
    }
    console.log('Projects updated from Redux store:', projects);
    console.log('Projects length:', projects?.length || 0);
    console.log('Projects data structure:', JSON.stringify(projects, null, 2));
  }, [projects]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setInputSearchTerm(e.target.value);
  };
  
  // Handle search input keypress (for Enter key)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(inputSearchTerm);
    }
  };
  
  // Simple status filter change handler
  const handleStatusChange = (e) => {
    const value = e.target.value;
    console.log('Status filter changed to:', value);
    setStatusFilter(value);
  };
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  
  // Check if user is charity owner
  const isCharityOwner = () => {
    if (!user || !charity) return false;
    return user.id === charity.userId || user.role === 'admin';
  };
  
  // Derive loading and error states for UI
  const isLoading = isLoadingCharity || isLoadingProjects;
  const isError = isErrorCharity || isErrorProjects;
  const errorMessage = charityMessage || projectMessage;
  
  // Filter projects directly during render
  const filteredProjects = (() => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      console.log('No projects to filter');
      return [];
    }
    
    console.log('Filtering projects. Total count:', projects.length);
    let filtered = [...projects];
    
    // Apply status filter (if not "All")
    if (statusFilter !== 'All') {
      filtered = filtered.filter(project => project.status === statusFilter);
      console.log(`After status filter (${statusFilter}):`, filtered.length);
    }
    
    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title?.toLowerCase().includes(query) || 
        project.description?.toLowerCase().includes(query)
      );
      console.log(`After search filter (${searchTerm}):`, filtered.length);
    }
    
    console.log('Final filtered projects:', filtered);
    return filtered;
  })();
  
  console.log('Render: filteredProjects.length =', filteredProjects?.length || 0);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {charity ? (
            <>
              <h1 className="text-3xl font-bold text-white text-center">{charity.name}: Projects</h1>
              <p className="text-blue-100 text-center mt-2">
                Browse and support projects by {charity.name}
              </p>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-white text-center">Charity Projects</h1>
          )}
          
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
                    placeholder="Search projects by title or description... (press Enter to search)"
                    value={inputSearchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="sm:w-64">
                <select
                  className="block w-full bg-white bg-opacity-20 border-transparent rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:bg-opacity-30 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value="All" className="text-gray-900">All Statuses</option>
                  {statuses && statuses.length > 0 && (
                    statuses.map((status) => (
                      <option 
                        key={status} 
                        value={status}
                        className="text-gray-900"
                      >
                        {status.replace('_', ' ')}
                      </option>
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
          
          {/* Add Project Button for charity owners */}
          {isCharityOwner() && (
            <div className="mt-4 flex justify-center">
              <Link
                to={`/dashboard/projects/create?charityId=${charity?.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Project
              </Link>
            </div>
          )}
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
                <div className="mb-1"><span className="font-semibold">Error Message:</span> {errorMessage || 'None'}</div>
                <div className="mb-1"><span className="font-semibold">Projects from API:</span> {projects?.length || 0}</div>
                <div className="mb-1"><span className="font-semibold">Projects Array Type:</span> {Array.isArray(projects) ? 'Array' : typeof projects}</div>
                <div className="mb-1"><span className="font-semibold">Filtered Projects:</span> {filteredProjects?.length || 0}</div>
              </div>
              <div>
                <div className="mb-1"><span className="font-semibold">Charity ID:</span> {charityId}</div>
                <div className="mb-1"><span className="font-semibold">Status Filter:</span> {statusFilter}</div>
                <div className="mb-1"><span className="font-semibold">Search Term:</span> {searchTerm || 'None'}</div>
                <div className="mb-1"><span className="font-semibold">Is Owner:</span> {isCharityOwner() ? '✓' : '✗'}</div>
                <div className="mb-1"><span className="font-semibold">Available Statuses:</span> {statuses?.join(', ') || 'None'}</div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="font-semibold mb-1">Redux State Structure:</div>
              <div className="bg-white p-2 rounded mb-2">
                <pre className="text-xs overflow-auto">{JSON.stringify({ charity: !!charity, projects: Array.isArray(projects), statuses }, null, 2)}</pre>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <details>
                <summary className="font-semibold text-gray-700 cursor-pointer">Raw Project Data (click to expand)</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-60 bg-gray-50 p-2 rounded">
                  {JSON.stringify(projects || [], null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
        
        {/* Charity Info Summary (if charity is loaded) */}
        {charity && !isLoading && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{charity.name}</h2>
                <div className="flex items-center mt-2">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {charity.category}
                  </span>
                  <span className="ml-3 text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link 
                  to={`/charities/${charity.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Charity Profile
                </Link>
                
                <Link
                  to={`/donation?charityId=${charity.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Donate to Charity
                </Link>
              </div>
            </div>
            
            {/* Summary stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Projects
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {projects?.length || 0}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Projects
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {projects?.filter(p => p.status === 'ACTIVE').length || 0}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Funding Goal
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {new Intl.NumberFormat('ro-RO', {
                              style: 'currency',
                              currency: 'RON',
                              minimumFractionDigits: 0
                            }).format(projects?.reduce((sum, project) => sum + (project.goal || 0), 0) || 0)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
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
                <p className="text-sm text-red-700">{errorMessage || 'Failed to load data. Please try again later.'}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* No Results State */}
        {!isLoading && (!filteredProjects || filteredProjects.length === 0) && (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter !== 'All' ? `No projects with status "${statusFilter}" found.` : `This charity doesn't have any projects yet.`}
            </p>
            <div className="mt-6">
              {statusFilter !== 'All' && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setStatusFilter('All')}
                >
                  Show all projects
                </button>
              )}
              {isCharityOwner() && (
                <Link
                  to={`/dashboard/projects/create?charityId=${charity?.id}`}
                  className="inline-flex items-center px-4 py-2 ml-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create first project
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Display Projects section with clear visual indication */}
        <div className="border-t-4 border-blue-500 pt-2 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Projects List ({filteredProjects?.length || 0})</h2>
          
          {/* Explicit check for filtered projects */}
          {!isLoading && filteredProjects && filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
                >
                  {/* Project card content - simplified to show essential info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    
                    {/* Status indicator */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-between mt-4">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Details
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link
                        to={`/donation?projectId=${project.id}&charityId=${charityId}`}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                        ${project.status === 'ACTIVE' 
                          ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                          : 'bg-gray-400 cursor-not-allowed'}`}
                        onClick={(e) => {
                          if (project.status !== 'ACTIVE') {
                            e.preventDefault();
                          }
                        }}
                      >
                        Donate
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="bg-yellow-50 p-4 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">No Projects to Display</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>The projects list is currently empty. This could be because:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>No projects exist for this charity</li>
                        <li>The data hasn't been loaded correctly</li>
                        <li>Your current filter settings exclude all projects</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        
        {/* Status Filter Pills */}
        {!isLoading && statuses && statuses.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusFilter === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Projects ({projects?.length || 0})
            </button>
            
            {statuses.map(status => {
              const count = projects?.filter(p => p.status === status).length || 0;
              if (count > 0) {
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.replace('_', ' ')} ({count})
                  </button>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharityProjectsPage;