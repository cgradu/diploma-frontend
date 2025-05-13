// src/pages/DonationPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import DonationForm from '../components/donation/DonationForm';
import PaymentForm from '../components/donation/PaymentForm';
import DonationSuccess from '../components/donation/DonationSuccess';
import Spinner from '../components/common/Spinner';
import { 
  createPaymentIntent, 
  resetDonationState, 
  clearCurrentDonation 
} from '../redux/slices/donationSlice';
import Navbar from '../components/layout/Navbar';
import { getCharities } from '../redux/slices/charitySlice';
import { getProjectsByCharityId } from '../redux/slices/projectSlice';
import { 
  selectUser, 
  selectCharities, 
  selectCharitiesLoading,
  selectDonationClientSecret,
  selectDonationId,
  selectDonationPaymentIntentId,
  selectDonationState,
  selectCurrentDonation,
  selectDonationLoading,
  selectDonationSuccess,
  selectDonationError,
  selectDonationMessage
} from '../redux/selectors';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RByuLJIJuqGirfSmV1VElWUW47yHuFQi9qMSihJoNe96YBnnHuguOi12NHrpiY5T2TUimELhyTLpHwGMpvNmEy300LVAjEPuB');

// Debug component to display state information
const DebugInfo = ({ state }) => {
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="mt-4 p-2 border border-gray-300 bg-gray-50 rounded text-xs">
      <details>
        <summary className="cursor-pointer font-medium">Debug Info</summary>
        <pre className="mt-2 overflow-auto max-h-40">
          {JSON.stringify({
            step: state.step,
            clientSecret: state.clientSecret ? `${state.clientSecret.substring(0, 10)}...` : null,
            donationId: state.donationId,
            paymentIntentId: state.paymentIntentId,
            isLoading: state.isLoading,
            isSuccess: state.isSuccess, 
            isError: state.isError,
            message: state.message
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

const DonationPage = () => {
  const { charityId, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get URL parameters
  const urlParams = new URLSearchParams(location.search);
  const charityIdParam = charityId || urlParams.get('charityId');
  const projectIdParam = projectId || urlParams.get('projectId');
  
  const [step, setStep] = useState(1);
  const [donationData, setDonationData] = useState({
    amount: 25,
    charityId: charityIdParam || '',
    projectId: projectIdParam || '',
    message: '',
    anonymous: false,
    currency: 'RON'
  });
  
  // Use memoized selectors
  const user = useSelector(selectUser);
  const charities = useSelector(selectCharities);
  const charitiesLoading = useSelector(selectCharitiesLoading);
  const stateDonation = useSelector(selectDonationState);
  
  // Donation state with selectors
  const clientSecret = useSelector(selectDonationClientSecret);
  const donationId = useSelector(selectDonationId);
  const paymentIntentId = useSelector(selectDonationPaymentIntentId);
  const currentDonation = useSelector(selectCurrentDonation);
  const isLoading = useSelector(selectDonationLoading);
  const isSuccess = useSelector(selectDonationSuccess);
  const isError = useSelector(selectDonationError);
  const message = useSelector(selectDonationMessage);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch charities if not already fetched
    if (!charities.length && !charitiesLoading) {
      dispatch(getCharities());
    }

    // If charityId is provided, fetch its projects
    if (charityIdParam) {
      dispatch(getProjectsByCharityId(charityIdParam));
    }
    
    // Clear donation state when component unmounts
    return () => {
      dispatch(clearCurrentDonation());
    };
  }, [dispatch, charities.length, charitiesLoading, charityIdParam]);
  
  // Watch for changes in clientSecret and manage step transitions
  useEffect(() => {
    console.log("Donation state updated:", stateDonation)
    console.log("Checking for client secret:", { 
      clientSecret: clientSecret ? `${clientSecret.substring(0, 10)}...` : null,
      isSuccess, 
      step 
    });
    
    if (clientSecret && step === 1) {
      console.log("Moving to payment step with client secret");
      setStep(2);
      // Reset only flags but keep client secret and IDs
      dispatch(resetDonationState());
    }
  }, [stateDonation, clientSecret, step, dispatch, isSuccess]);
  
  // Handle errors
  useEffect(() => {
    if (isError && message) {
      // Show error with more user-friendly approach
      setErrorMessage(message);
      dispatch(resetDonationState());
    }
  }, [isError, message, dispatch]);
  
  // Error messaging
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Handle form completion
  const handleDonationFormComplete = (formData) => {
    console.log("Donation form completed with data:", formData);
    setErrorMessage(null);
    const data = {
      ...donationData,
      ...formData
    };
    setDonationData(data);
    
    // Dispatch the action and handle the response
    dispatch(createPaymentIntent(data))
      .unwrap()
      .then(result => {
        console.log("Payment intent created successfully:", result);
        if (result.clientSecret) {
          console.log("Client secret received:", result.clientSecret.substring(0, 10) + "...");
          // No need to setStep here as the useEffect will handle it
        } else {
          console.error("No client secret in response!");
          setErrorMessage("Payment initialization failed: No client secret received");
        }
      })
      .catch(error => {
        console.error("Payment intent creation failed:", error);
        setErrorMessage(error || "Failed to initialize payment");
      });
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    setStep(3);
  };
  
  // Handle going back to donation form
  const handleBackToDonationForm = () => {
    setStep(1);
    dispatch(resetDonationState());
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Spinner />
          <p className="mt-2 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  // Stripe options
  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3b82f6', // Tailwind blue-500
        colorBackground: '#ffffff',
        colorText: '#1f2937', // Tailwind gray-800
      }
    }
  } : {};
  
  console.log("Current step:", step);
  console.log("Client secret available:", !!clientSecret);
  
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
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium">Error</p>
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner />
              <p className="ml-2">Processing your request...</p>
            </div>
          )}

          {/* Step 1: Donation Form */}
          {step === 1 && !isLoading && (
            <DonationForm
              initialData={donationData}
              onComplete={handleDonationFormComplete}
            />
          )}

          {/* Step 2: Payment Form */}
          {step === 2 && clientSecret && (
            <div>
              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentForm 
                  amount={donationData.amount} 
                  currency={donationData.currency}
                  donationId={donationId}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
              
              <div className="mt-4">
                <button
                  onClick={handleBackToDonationForm}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  ← Back to donation details
                </button>
              </div>
            </div>
          )}
          
          {/* Fallback message if client secret is not available in step 2 */}
          {step === 2 && !clientSecret && !isLoading && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Payment session not initialized correctly.</p>
              <button
                onClick={handleBackToDonationForm}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Back to donation form
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <DonationSuccess donations={currentDonation} />
          )}
          
          {/* Blockchain Transparency Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
            <h3 className="font-medium text-gray-800">Transparent Donation Tracking</h3>
            <p className="mt-1">
              Your donation will be recorded on blockchain technology to ensure complete transparency.
              You'll be able to track exactly how your contribution is used and verify its impact.
            </p>
          </div>
          
          {/* Debug Info */}
          {process.env.NODE_ENV !== 'production' && (
            <DebugInfo state={{
              step,
              clientSecret,
              donationId,
              paymentIntentId,
              isLoading,
              isSuccess,
              isError,
              message
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationPage;