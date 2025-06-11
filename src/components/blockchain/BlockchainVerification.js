// src/components/BlockchainVerification.js
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';

const BlockchainVerification = ({ donationId }) => {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerification = async () => {
      if (!donationId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/donations/${donationId}/verification`);
        setVerification(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching verification:', err);
        setError('Failed to load blockchain verification');
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [donationId]);
  
  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-md flex items-center justify-center" style={{ minHeight: '140px' }}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500 text-sm">Loading verification status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="text-red-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
        <p className="text-gray-600 mt-2 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  // If no verification record exists yet
  if (!verification || !verification.transactionHash) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-yellow-700">Pending Verification</span>
        </div>
        <p className="text-gray-600 text-sm">
          This donation is waiting to be verified on the Sepolia blockchain. This process may take a few minutes.
        </p>
      </div>
    );
  }

  // Not verified yet but has a pending transaction hash
  if (verification && !verification.verified && verification.transactionHash.startsWith('pending_')) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-yellow-700">Verification In Progress</span>
        </div>
        <p className="text-gray-600 text-sm">
          This donation is currently being processed for blockchain verification. The transaction has been submitted and is awaiting confirmation on the Sepolia network.
        </p>
      </div>
    );
  }

  // Create Sepolia Etherscan URL
  const explorerUrl = `https://sepolia.etherscan.io/tx/${verification.transactionHash}`;

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium text-green-700">Verified on Sepolia Blockchain</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <p className="flex justify-between py-1 border-b border-gray-200">
          <span className="text-gray-600">Block Number:</span>
          <span className="font-mono">{verification.blockNumber}</span>
        </p>
        
        <p className="py-1 border-b border-gray-200">
          <span className="text-gray-600 block mb-1">Transaction Hash:</span>
          <a 
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs break-all text-blue-600 hover:text-blue-800"
          >
            {verification.transactionHash}
          </a>
        </p>
        
        <p className="py-1">
          <span className="text-gray-600">Verification Time:</span>
          <span className="ml-2">{new Date(verification.timestamp).toLocaleString()}</span>
        </p>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <a 
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on Sepolia Etherscan
        </a>
      </div>
    </div>
  );
};

export default BlockchainVerification;