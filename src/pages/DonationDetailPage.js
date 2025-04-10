import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDonationDetails } from '../redux/slices/donationSlice';
import Spinner from '../components/common/Spinner';

const DonationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedDonation, isLoading } = useSelector((state) => state.donation);
  
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
  
  const {
    amount,
    currency,
    transactionId,
    paymentStatus,
    message,
    anonymous,
    createdAt,
    receiptUrl,
    Charity,
    Project,
    BlockchainVerification
  } = selectedDonation;
  
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
                  Donation to {Charity.name}
                </h2>
                {Project && (
                  <p className="text-gray-600">
                    Project: {Project.title}
                  </p>
                )}
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium" 
                   style={{
                     backgroundColor: paymentStatus === 'SUCCEEDED' ? '#d1fae5' : 
                                      paymentStatus === 'PENDING' ? '#fef3c7' : '#fee2e2',
                     color: paymentStatus === 'SUCCEEDED' ? '#065f46' : 
                            paymentStatus === 'PENDING' ? '#92400e' : '#b91c1c'
                   }}>
                {paymentStatus}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Donation Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency || 'USD'
                    }).format(amount)}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Date:</span>
                    <span>{formatDate(createdAt)}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{transactionId}</span>
                  </p>
                  <p className="flex justify-between py-2">
                    <span className="text-gray-600">Anonymous:</span>
                    <span>{anonymous ? 'Yes' : 'No'}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Blockchain Verification</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {BlockchainVerification ? (
                    <>
                      <p className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${BlockchainVerification.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {BlockchainVerification.verified ? 'Verified' : 'Pending'}
                        </span>
                      </p>
                      <p className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Block Number:</span>
                        <span className="font-mono">{BlockchainVerification.blockNumber}</span>
                      </p>
                      <p className="py-2">
                        <span className="text-gray-600 block mb-1">Transaction Hash:</span>
                        <span className="font-mono text-xs break-all">{BlockchainVerification.transactionHash}</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-600 py-4 text-center">
                      Blockchain verification pending
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {message && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Your Message</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 italic">"{message}"</p>
                </div>
              </div>
            )}
            
            {Project && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Project Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">{Project.title}</h4>
                  <p className="text-gray-700 mb-4">{Project.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (Project.currentAmount / Project.goal) * 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${Project.currentAmount.toFixed(2)} raised</span>
                    <span>${Project.goal.toFixed(2)} goal</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {receiptUrl && (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Download Receipt
            </a>
          )}
          
          <Link
            to={`/charity/${Charity.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Charity Page
          </Link>
          
          <Link
            to="/donate"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Make Another Donation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailPage;