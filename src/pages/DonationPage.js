// src/pages/DonationPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import DonationForm from '../components/donation/DonationForm';
import PaymentForm from '../components/donation/PaymentForm';
import DonationSuccess from '../components/donation/DonationSuccess';
import Spinner from '../components/common/Spinner';
import { createPaymentIntent, resetDonationState, clearCurrentDonation } from '../redux/slices/donationSlice';
import Navbar from '../components/layout/Navbar';
import { getCharities } from '../redux/slices/charitySlice';
import { getProjectsByCharityId } from '../redux/slices/projectSlice';
import { 
  selectUser, 
  selectCharities, 
  selectCharitiesLoading,
  selectDonationClientSecret,
  selectDonationId,
  selectCurrentDonation,
  selectDonationLoading,
  selectDonationSuccess,
  selectDonationError,
  selectDonationMessage
} from '../redux/selectors';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51RByuLJIJuqGirfSmV1VElWUW47yHuFQi9qMSihJoNe96YBnnHuguOi12NHrpiY5T2TUimELhyTLpHwGMpvNmEy300LVAjEPuB');

const DonationPage = () => {
  const { charityId, projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [donationData, setDonationData] = useState({
    amount: 25,
    charityId: charityId || '',
    projectId: projectId || '',
    message: '',
    anonymous: false,
    currency: 'RON'
  });
  
  // Use memoized selectors
  const user = useSelector(selectUser);
  const charities = useSelector(selectCharities);
  const charitiesLoading = useSelector(selectCharitiesLoading);
  
  // Donation state with selectors
  const clientSecret = useSelector(selectDonationClientSecret);
  const donationId = useSelector(selectDonationId);
  const currentDonation = useSelector(selectCurrentDonation);
  const isLoading = useSelector(selectDonationLoading);
  const isSuccess = useSelector(selectDonationSuccess);
  const isError = useSelector(selectDonationError);
  const message = useSelector(selectDonationMessage);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch charities if not already fetched
    if (!charities.length) {
      dispatch(getCharities());
    }

    // If charityId is provided, fetch its projects
    if (charityId) {
      dispatch(getProjectsByCharityId(charityId));
    }
  }, [dispatch, charities.length, charityId]);
  
  // Handle payment intent creation success
  useEffect(() => {
    if (isSuccess && clientSecret && step === 1) {
      setStep(2);
      dispatch(resetDonationState());
    }
  }, [isSuccess, clientSecret, step, dispatch]);
  
  // Handle errors
  useEffect(() => {
    if (isError && message) {
      alert(message);
      dispatch(resetDonationState());
    }
  }, [isError, message, dispatch]);
  
  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCurrentDonation());
    };
  }, [dispatch]);
  
  // Handle form completion
  const handleDonationFormComplete = (formData) => {
    const data = {
      ...donationData,
      ...formData
    };
    setDonationData(data);
    dispatch(createPaymentIntent(data));
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    setStep(3);
  };
  
  if (isLoading || charitiesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Spinner />
          <p className="mt-2 text-gray-600">Processing your request...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Make a Donation</h1>
            {step < 3 && (
              <div className="flex justify-center mt-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                } mr-2`}>
                  1
                </div>
                <div className="w-20 h-1 self-center bg-gray-200 mx-2"></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                } mr-2`}>
                  2
                </div>
                <div className="w-20 h-1 self-center bg-gray-200 mx-2"></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
              </div>
            )}
          </div>

          {/* Step 1: Donation Form */}
          {step === 1 && (
            <DonationForm
              initialData={donationData}
              onComplete={handleDonationFormComplete}
            />
          )}

          {/* Step 2: Payment Form */}
          {step === 2 && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                amount={donationData.amount} 
                currency={donationData.currency}
                donationId={donationId}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <DonationSuccess donation={currentDonation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationPage;