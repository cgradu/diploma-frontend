// src/components/donation/PaymentStripe.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../../redux/slices/donationSlice';

// Replace with your publishable key from Stripe Dashboard
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RByuLJIJuqGirfSmV1VElWUW47yHuFQi9qMSihJoNe96YBnnHuguOi12NHrpiY5T2TUimELhyTLpHwGMpvNmEy300LVAjEPuB');

// Card component style options
const cardStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

// Main payment form component that handles Stripe elements
const CheckoutForm = ({ donationData, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  
  // Get client secret and donation ID from Redux state
  const { clientSecret, donationId, paymentIntentId, isLoading, isError, message } = useSelector(
    (state) => state.donation
  );
  
  // Create payment intent when component mounts
  useEffect(() => {
    if (donationData && donationData.amount > 0) {
      dispatch(createPaymentIntent(donationData));
    }
  }, [dispatch, donationData]);
  
  // Handle changes in the CardElement
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  
// In PaymentStripe.js, update the handleSubmit function:
// In the handleSubmit function of PaymentStripe.js
const handleSubmit = async (event) => {
  event.preventDefault();
  
  console.log("=== Starting Payment Submission ===");
  console.log("Stripe loaded:", !!stripe);
  console.log("Elements loaded:", !!elements);
  console.log("Client secret:", clientSecret ? "Present" : "Missing");
  console.log("Donation ID:", donationId);
  
  if (!stripe || !elements || !clientSecret) {
    console.error("Missing required payment elements");
    return;
  }
  
  setProcessing(true);
  
  try {
    // Confirm card payment
    console.log("Confirming card payment with Stripe...");
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    
    console.log("Stripe response:", payload);
    
    if (payload.error) {
      console.error("Stripe error:", payload.error);
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      return;
    }
    
    console.log("Payment confirmed with Stripe!");
    console.log("PaymentIntent:", payload.paymentIntent);
    
    // Confirm in backend
    console.log("Confirming payment in backend...");
    const confirmData = {
      donationId: donationId,
      paymentIntentId: payload.paymentIntent.id,
    };
    console.log("Confirm data:", confirmData);
    
    const result = await dispatch(confirmPayment(confirmData)).unwrap();
    console.log("Backend confirmation result:", result);
    
    setError(null);
    setProcessing(false);
    setSucceeded(true);
    
    if (onSuccess) {
      onSuccess(donationId);
    }
  } catch (error) {
    console.error("=== Payment Error ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    setError(error.message || 'An error occurred while processing your payment.');
    setProcessing(false);
  }
};
  
  // Handle additional authentication if needed
  useEffect(() => {
    if (clientSecret && stripe) {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case "succeeded":
              setSucceeded(true);
              setError(null);
              setProcessing(false);
              break;
            case "processing":
              setProcessing(true);
              setError("Your payment is processing.");
              break;
            case "requires_payment_method":
              setError("Your payment was not successful, please try again.");
              setProcessing(false);
              break;
            default:
              setError("Something went wrong.");
              setProcessing(false);
              break;
          }
        });
    }
  }, [clientSecret, stripe]);
  
  // Render error message from Redux state
  useEffect(() => {
    if (isError && message) {
      setError(message);
    }
  }, [isError, message]);
  
  // Test card information for development
  const renderTestCardInfo = () => {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
          <p className="font-semibold">Test Card Details:</p>
          <p>Card Number: 4242 4242 4242 4242</p>
          <p>Expiry: Any future date (MM/YY)</p>
          <p>CVC: Any 3 digits</p>
          <p>ZIP: Any 5 digits</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Donation Summary</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span>Amount:</span>
            <span className="font-medium">{donationData.amount} {donationData.currency}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Charity:</span>
            <span className="font-medium truncate max-w-xs">{donationData.charityName}</span>
          </div>
          {donationData.projectName && (
            <div className="flex justify-between">
              <span>Project:</span>
              <span className="font-medium truncate max-w-xs">{donationData.projectName}</span>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
          Credit or debit card
        </label>
        <div className="border border-gray-300 p-4 rounded-md">
          <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        </div>
        
        {renderTestCardInfo()}
        
        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="text-red-500 mt-2 text-sm" role="alert">
            {error}
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={processing || succeeded || isLoading}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={processing || disabled || succeeded || !clientSecret || isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {processing || isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : succeeded ? (
            'Payment Successful!'
          ) : (
            `Pay ${donationData.amount} ${donationData.currency}`
          )}
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Your payment is secure. We use Stripe's secure encryption.</p>
        
        <div className="mt-4 flex justify-center items-center space-x-2">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
          </svg>
          <span>
            Your donation will be recorded on blockchain for full transparency.
          </span>
        </div>
      </div>
    </form>
  );
};

// Wrapper component that provides Stripe context
const PaymentStripe = ({ donationData, onSuccess, onCancel }) => {
  return (
    <div className="max-w-lg mx-auto">
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          donationData={donationData} 
          onSuccess={onSuccess} 
          onCancel={onCancel} 
        />
      </Elements>
    </div>
  );
};

export default PaymentStripe;