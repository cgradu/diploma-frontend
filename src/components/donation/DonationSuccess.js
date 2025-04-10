import React from 'react';
import { Link } from 'react-router-dom';

const DonationSuccess = ({ donation }) => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You For Your Donation!</h2>
      <p className="text-gray-600 mb-6">
        Your generous contribution makes a real difference.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-medium text-gray-800 mb-3">Donation Details</h3>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${donation?.amount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-sm">{donation?.transactionId}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{new Date(donation?.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-medium text-gray-800 mb-3">Blockchain Verification</h3>
        <p className="text-gray-600 text-sm mb-3">
          Your donation has been recorded on our blockchain system for full transparency. You can track where your donation goes and how it's being used.
        </p>
        <div className="bg-white p-3 rounded border border-blue-200">
          <p className="font-mono text-xs break-all">
            Transaction Hash: {donation?.BlockchainVerification?.transactionHash || 'Processing...'}
          </p>
        </div>
      </div>
      
      {donation?.receiptUrl && (
        <div className="mb-6">
          <a 
            href={donation.receiptUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            View Receipt
          </a>
        </div>
      )}
      
      <div className="space-y-4">
        <Link 
          to={`/charity/${donation?.charityId}`}
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          View Charity Page
        </Link>
        
        <Link 
          to="/donations/history"
          className="block w-full bg-white hover:bg-gray-50 text-blue-500 font-medium py-2 px-4 rounded-md border border-blue-500"
        >
          View Donation History
        </Link>
      </div>
    </div>
  );
};

export default DonationSuccess;