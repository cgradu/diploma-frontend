
import axios from '../../utils/axiosConfig';

const donationService = {
  // Create a payment intent
  createPaymentIntent: async (donationData) => {
    const response = await axios.post('/donations/create-payment-intent', donationData);
    return response.data;
  },
  
  // Confirm a successful payment
  confirmPayment: async (paymentData) => {
    const response = await axios.post('/donations/confirm-payment', paymentData);
    return response.data;
  },
  
  // Get donation history for the current user
  getDonationHistory: async () => {
    const response = await axios.get('/donations/history');
    return response.data;
  },
  
  // Get details for a specific donation
  getDonationDetails: async (donationId) => {
    const response = await axios.get(`/donations/${donationId}`);
    return response.data;
  },
  
  // Get donation statistics for a charity
  getCharityDonationStats: async (charityId) => {
    const response = await axios.get(`/donations/charity/${charityId}/stats`);
    return response.data;
  }
};

export default donationService;