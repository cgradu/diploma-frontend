// src/pages/DonationThankYou.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDonationDetails } from '../redux/slices/donationSlice';

const DonationThankYou = () => {
  const { donationId } = useParams();
  const dispatch = useDispatch();
  
  const { selectedDonation, isLoading } = useSelector(state => state.donation);
  
  useEffect(() => {
    if (donationId) {
      dispatch(getDonationDetails(donationId));
    }
  }, [dispatch, donationId]);
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading donation details...</p>
      </div>
    );
  }
  
  if (!selectedDonation) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Donation Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find details for this donation. It may have been removed or the ID is incorrect.</p>
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Donation!</h1>
        <p className="text-gray-600 mb-6">
          Your donation of {selectedDonation.amount} {selectedDonation.currency} to {selectedDonation.charity?.name || 'the charity'} has been successfully processed.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Blockchain Verification Status</h2>
          {selectedDonation.blockchainVerification ? (
            <div>
              <div className="flex items-center justify-center mb-2">
                {selectedDonation.blockchainVerification.verified ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Verified on Blockchain
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Verification in Progress
                  </span>
                )}
              </div>
              {selectedDonation.blockchainVerification.transactionHash && (
                <div className="text-xs font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  {selectedDonation.blockchainVerification.transactionHash}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Your donation is being prepared for blockchain verification. This typically takes 5-10 minutes.
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to={`/donation/details/${donationId}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            View Donation Details
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-2">How Blockchain Verification Works</h3>
        <p className="text-gray-600 mb-4">
          Your donation is being recorded on a secure blockchain. This creates an immutable record of your contribution,
          ensuring complete transparency in how funds are used.
        </p>
        <Link to="/how-it-works" className="text-blue-500 hover:underline">
          Learn more about our transparency system
        </Link>
      </div>
    </div>
  );
};

export default DonationThankYou;