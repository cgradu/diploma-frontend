// frontend/src/components/charity/ProjectsSection.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProjectsByCharityId } from '../../redux/slices/projectSlice';

const ProjectsSection = ({ charityId, maxProjects = 3 }) => {
  const dispatch = useDispatch();
  const { projects, isLoading, isError, message } = useSelector(state => state.project);
  const { user } = useSelector(state => state.auth);
  
  // Fetch projects on mount
  useEffect(() => {
    if (charityId) {
      dispatch(getProjectsByCharityId({ charityId }));
    }
  }, [dispatch, charityId]);
  
  // Calculate progress percentage
  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;
    return Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  };
  
  // Check if user is charity owner
  const isCharityOwner = () => {
    if (!user) return false;
    return user.role === 'charity' || user.role === 'admin';
  };
  
  // Filter for active projects first, then others
  const activeProjects = projects?.filter(p => p.status === 'ACTIVE') || [];
  const otherProjects = projects?.filter(p => p.status !== 'ACTIVE') || [];
  
  // Combine and limit to maxProjects
  const displayProjects = [...activeProjects, ...otherProjects].slice(0, maxProjects);
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        
        {isCharityOwner() && (
          <Link
            to={`/dashboard/projects/create?charityId=${charityId}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Project
          </Link>
        )}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{message || 'Failed to load projects'}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* No Projects State */}
      {!isLoading && (!displayProjects || displayProjects.length === 0) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            This charity doesn't have any projects yet.
          </p>
          {isCharityOwner() && (
            <div className="mt-6">
              <Link
                to={`/dashboard/projects/create?charityId=${charityId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create first project
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Display Projects */}
      {!isLoading && displayProjects && displayProjects.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
              >
                {/* Project Image/Placeholder */}
                <div className="h-40 bg-gray-200 overflow-hidden relative">
                  {/* Project status indicator */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {/* Project image placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                
                {/* Project Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{formatCurrency(project.currentAmount)}</span>
                      <span>{calculateProgress(project.currentAmount, project.goal)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          calculateProgress(project.currentAmount, project.goal) >= 100 
                            ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${calculateProgress(project.currentAmount, project.goal)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end text-xs mt-1">
                      <span className="text-gray-500">Goal: {formatCurrency(project.goal)}</span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-between mt-3">
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
                      className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white 
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
          
          {/* View All Projects button */}
          {projects && projects.length > maxProjects && (
            <div className="flex justify-center mt-6">
              <Link
                to={`/charities/${charityId}/projects`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All {projects.length} Projects
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsSection;