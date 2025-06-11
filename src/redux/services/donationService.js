// src/redux/services/donationService.js
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
  
  // Get blockchain verification status for a donation
  getBlockchainVerification: async (donationId) => {
    const response = await axios.get(`/donations/${donationId}/blockchain-verification`);
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
    try {
      const response = await axios.get(`/donations/charity/${charityId}/stats`);
      console.log('Charity donation stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching charity donation stats:', error);
      throw error;
    }
  }, 

  // Get donor dashboard stats
  getDonorDashboardStats: async () => {
    try {
      const response = await axios.get('/donations/donor/dashboard-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching donor dashboard stats:', error);
      throw error;
    }
  }
};

export default donationService;