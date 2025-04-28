// src/redux/selectors.js
import { createSelector } from '@reduxjs/toolkit';

// Auth selectors
export const selectUser = state => state.auth.user;
export const selectAuthLoading = state => state.auth.isLoading;
export const selectAuthError = state => state.auth.isError;

// Charity selectors
export const selectCharities = state => state.charities.charities;
export const selectCharitiesLoading = state => state.charities.isLoading;
export const selectCharitiesError = state => state.charities.isError;

// Project selectors
export const selectProjects = state => state.projects.projects;
export const selectProjectsLoading = state => state.projects.isLoading;
export const selectProjectsError = state => state.projects.isError;
export const selectSelectedProject = state => state.projects.selectedProject;

// Donation selectors
export const selectDonationState = state => state.donation;

export const selectDonationClientSecret = state => state.donation?.clientSecret;
export const selectDonationId = state => state.donation?.donationId;
export const selectCurrentDonation = state => state.donation?.currentDonation;
export const selectDonationLoading = state => state.donation?.isLoading;
export const selectDonationSuccess = state => state.donation?.isSuccess;
export const selectDonationError = state => state.donation?.isError;
export const selectDonationMessage = state => state.donation?.message;

// Memoized selectors
export const selectDonationStatus = createSelector(
  [selectDonationLoading, selectDonationSuccess, selectDonationError, selectDonationMessage],
  (isLoading, isSuccess, isError, message) => ({
    isLoading,
    isSuccess,
    isError,
    message
  })
);

// Selector for projects by charity ID
export const selectProjectsByCharity = createSelector(
  [selectProjects, (_, charityId) => charityId],
  (projects, charityId) => {
    if (!charityId) return [];
    return projects.filter(project => project.charityId === parseInt(charityId));
  }
);

// Selector for donation transaction details
export const selectDonationTransaction = createSelector(
  [selectCurrentDonation],
  (donation) => {
    if (!donation) return null;
    
    return {
      amount: donation.amount,
      currency: donation.currency,
      status: donation.paymentStatus,
      transactionId: donation.transactionId,
      date: donation.createdAt,
      receiptUrl: donation.receiptUrl
    };
  }
);

// Selector for blockchain verification status
export const selectBlockchainVerification = createSelector(
  [selectCurrentDonation],
  (donation) => {
    if (!donation || !donation.BlockchainVerification) return null;
    
    return {
      transactionHash: donation.BlockchainVerification.transactionHash,
      blockNumber: donation.BlockchainVerification.blockNumber,
      verified: donation.BlockchainVerification.verified,
      timestamp: donation.BlockchainVerification.timestamp
    };
  }
);