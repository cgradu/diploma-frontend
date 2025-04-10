import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  AddressElement
} from '@stripe/react-stripe-js';
import { confirmPayment } from '../../redux/slices/donationSlice';
import Spinner from '../common/Spinner';

const PaymentForm = ({ amount = 0, currency = 'RON', donationId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };
  
  const handleSubmit = async (event) => {
    // Prevent default form submission
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage(null);
    
    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donation/success`,
      },
      redirect: 'if_required'
    });
    
    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, update in backend
      dispatch(confirmPayment({
        paymentIntentId: paymentIntent.id,
        donationId
      }));
      
      // Notify parent component
      onSuccess();
    } else {
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 p-4 bg-blue-50 rounded-md">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Donation Summary</h2>
        <p className="text-gray-600">
          Amount: <span className="font-medium">{formatCurrency(amount, currency)}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information
          </label>
          <PaymentElement />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Address
          </label>
          <AddressElement options={{ mode: 'billing' }} />
        </div>
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="mt-6 flex flex-col space-y-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-3 px-4 rounded-md shadow-sm font-medium text-white ${
            isProcessing ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <Spinner size="small" /> Processing...
            </span>
          ) : (
            `Donate ${formatCurrency(amount, currency)}`
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Your payment information is securely processed by Stripe. We never store your card details.
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;