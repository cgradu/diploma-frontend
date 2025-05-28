import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDonationDetails } from '../redux/slices/donationSlice';
import Spinner from '../components/common/Spinner';
import BlockchainVerification from '../components/blockchain/BlockchainVerification';
import axios from '../utils/axiosConfig';

const DonationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedDonation, isLoading } = useSelector((state) => state.donation);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  
  useEffect(() => {
    if (id) {
      dispatch(getDonationDetails(id));
    }
  }, [dispatch, id]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVerifyOnBlockchain = async () => {
    if (!id) return;
    
    try {
      setIsVerifying(true);
      setVerificationError(null);
      
      await axios.post(`/api/donations/${id}/verify`);
      dispatch(getDonationDetails(id));
    } catch (error) {
      console.error('Error verifying donation:', error);
      setVerificationError(
        error.response?.data?.error || 
        'Failed to verify donation on Sepolia blockchain. Please try again later.'
      );
    } finally {
      setIsVerifying(false);
    }
  };
  
  if (isLoading || !selectedDonation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Spinner />
          <p className="mt-2 text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }
  
  const donation = selectedDonation;
  const charity = donation.Charity || donation.charity;
  const project = donation.Project || donation.project;
  const verificationData = donation.BlockchainVerification || donation.blockchainVerification;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Donation Details</h1>
          <Link
            to="/donations/history"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to History
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Donation to {charity?.name || 'Unknown Charity'}
                </h2>
                {project && (
                  <p className="text-gray-600">
                    Project: {project.title}
                  </p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                donation.paymentStatus === 'SUCCEEDED' ? 'bg-green-100 text-green-800' : 
                donation.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {donation.paymentStatus}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Donation Information</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <p className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: donation.currency || 'USD'
                      }).format(donation.amount)}
                    </span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Date:</span>
                    <span>{formatDate(donation.createdAt)}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{donation.transactionId}</span>
                  </p>
                  <p className="flex justify-between py-2">
                    <span className="text-gray-600">Anonymous:</span>
                    <span>{donation.anonymous ? 'Yes' : 'No'}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Sepolia Blockchain Verification</h3>
                  
                  {donation.paymentStatus === 'SUCCEEDED' && 
                   (!verificationData || !verificationData.verified) && (
                    <button
                      onClick={handleVerifyOnBlockchain}
                      disabled={isVerifying}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        isVerifying 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {isVerifying ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        'Verify on Blockchain'
                      )}
                    </button>
                  )}
                </div>
                
                {verificationError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm mb-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {verificationError}
                    </div>
                  </div>
                )}
                
                <BlockchainVerification donationId={id} />
                
                <div className="mt-3 bg-blue-50 p-3 rounded-md text-xs text-blue-800">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>
                      Each donation is recorded on the Sepolia blockchain network, creating a permanent, 
                      immutable record that can be independently verified. This ensures complete transparency 
                      in how donations are tracked and used.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {donation.message && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Your Message</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 italic">"{donation.message}"</p>
                </div>
              </div>
            )}
            
            {project && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Project Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">{project.title}</h4>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (project.currentAmount / project.goal) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${project.currentAmount.toFixed(2)} raised</span>
                    <span>${project.goal.toFixed(2)} goal</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/charity/${charity?.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Charity Page
          </Link>
          
          <Link
            to="/donate"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Make Another Donation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailPage;