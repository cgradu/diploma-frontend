// src/redux/selectors.js
import { createSelector } from '@reduxjs/toolkit';

// ==================== BASIC SELECTORS WITH NULL SAFETY ====================

// Auth selectors
export const selectUser = state => state.auth?.user || null;
export const selectAuthLoading = state => state.auth?.isLoading || false;
export const selectAuthError = state => state.auth?.isError || null;

// Charity selectors
export const selectCharities = state => state.charities?.charities || [];
export const selectCharitiesLoading = state => state.charities?.isLoading || false;
export const selectCharitiesError = state => state.charities?.isError || null;

// Project selectors
export const selectProjects = state => state.projects?.projects || [];
export const selectProjectsLoading = state => state.projects?.isLoading || false;
export const selectProjectsError = state => state.projects?.isError || null;
export const selectSelectedProject = state => state.projects?.selectedProject || null;

// Donation selectors
export const selectDonationState = state => state.donations || {};
export const selectDonationClientSecret = state => state.donations?.clientSecret || null;
export const selectDonationId = state => state.donations?.donationId || null;
export const selectDonationPaymentIntentId = state => state.donations?.paymentIntentId || null;
export const selectCurrentDonation = state => state.donations?.currentDonation || null;
export const selectDonationLoading = state => state.donations?.isLoading || false;
export const selectDonationSuccess = state => state.donations?.isSuccess || false;
export const selectDonationError = state => state.donations?.isError || null;
export const selectDonationMessage = state => state.donations?.message || null;
export const selectBlockchainVerificationData = state => state.donations?.blockchainVerification || null;

// ==================== DONATION HISTORY SELECTORS WITH NULL SAFETY ====================

// Basic donation history selectors
export const selectDonationHistory = state => state.donationHistory?.donations || [];
export const selectDonationHistoryPagination = state => state.donationHistory?.pagination || {};
export const selectDonationHistoryLoading = state => state.donationHistory?.loading || {};
export const selectDonationHistoryErrors = state => state.donationHistory?.errors || {};
export const selectDonationHistoryFilters = state => state.donationHistory?.filters || {};

// Impact statistics selectors
export const selectImpactStats = state => state.donationHistory?.impactStats || {};
export const selectImpactOverview = state => state.donationHistory?.impactStats?.overview || {};
export const selectCharityImpact = state => state.donationHistory?.impactStats?.charityImpact || [];
export const selectCategoryImpact = state => state.donationHistory?.impactStats?.categoryImpact || [];
export const selectProjectImpact = state => state.donationHistory?.impactStats?.projectImpact || [];
export const selectTimeline = state => state.donationHistory?.impactStats?.timeline || [];
export const selectAchievements = state => state.donationHistory?.impactStats?.achievements || [];

// Blockchain insights selectors
export const selectBlockchainInsights = state => state.donationHistory?.blockchainInsights || {};
export const selectBlockchainSummary = state => state.donationHistory?.blockchainInsights?.summary || {};
export const selectBlockchainTransactions = state => state.donationHistory?.blockchainInsights?.transactions || [];
export const selectCharityBreakdown = state => state.donationHistory?.blockchainInsights?.charityBreakdown || [];
export const selectVerificationStatus = state => state.donationHistory?.blockchainInsights?.verificationStatus || {};

// Selected donation and UI state
export const selectSelectedDonationHistory = state => state.donationHistory?.selectedDonation || null;
export const selectActiveTimeframe = state => state.donationHistory?.activeTimeframe || '30d';
export const selectRefreshTrigger = state => state.donationHistory?.refreshTrigger || 0;

// ==================== MEMOIZED SELECTORS WITH NULL SAFETY ====================

// Memoized selectors
export const selectDonationStatus = createSelector(
  [selectDonationLoading, selectDonationSuccess, selectDonationError, selectDonationMessage],
  (isLoading, isSuccess, isError, message) => ({
    isLoading: isLoading || false,
    isSuccess: isSuccess || false,
    isError: isError || false,
    message: message || null
  })
);

// Selector for projects by charity ID
export const selectProjectsByCharity = createSelector(
  [selectProjects, (_, charityId) => charityId],
  (projects, charityId) => {
    if (!charityId || !Array.isArray(projects)) return [];
    return projects.filter(project => project.charityId === parseInt(charityId));
  }
);

// Selector for donation transaction details
export const selectDonationTransaction = createSelector(
  [selectCurrentDonation],
  (donation) => {
    if (!donation) return null;
    
    return {
      amount: donation.amount || 0,
      currency: donation.currency || 'USD',
      status: donation.paymentStatus || 'PENDING',
      transactionId: donation.transactionId || null,
      date: donation.createdAt || null,
      receiptUrl: donation.receiptUrl || null
    };
  }
);

// Selector for blockchain verification status
export const selectBlockchainVerification = createSelector(
  [selectCurrentDonation],
  (donation) => {
    if (!donation?.BlockchainVerification) return null;
    
    return {
      transactionHash: donation.BlockchainVerification.transactionHash || null,
      blockNumber: donation.BlockchainVerification.blockNumber || 0,
      verified: donation.BlockchainVerification.verified || false,
      timestamp: donation.BlockchainVerification.timestamp || null
    };
  }
);

// ==================== DONATION HISTORY MEMOIZED SELECTORS WITH NULL SAFETY ====================

// Verified donations selector
export const selectVerifiedDonations = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return [];
    return donations.filter(d => d?.verificationStatus === 'VERIFIED');
  }
);

// Pending verifications selector
export const selectPendingVerifications = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return [];
    return donations.filter(d => d?.verificationStatus === 'PENDING');
  }
);

// Unverified donations selector
export const selectUnverifiedDonations = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return [];
    return donations.filter(d => d?.verificationStatus === 'NOT_VERIFIED');
  }
);

// Transparency score selector
export const selectTransparencyScore = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations) || donations.length === 0) return 0;
    const verifiedCount = donations.filter(d => d?.verificationStatus === 'VERIFIED').length;
    return Math.round((verifiedCount / donations.length) * 100);
  }
);

// Total donated amount selector
export const selectTotalDonated = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return 0;
    return donations.reduce((total, donation) => total + (donation?.amount || 0), 0);
  }
);

// Charities supported count selector
export const selectCharitiesSupported = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return 0;
    const charityIds = new Set(
      donations
        .filter(d => d?.charity?.id)
        .map(d => d.charity.id)
    );
    return charityIds.size;
  }
);

// Projects supported count selector
export const selectProjectsSupported = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return 0;
    const projectIds = new Set(
      donations
        .filter(d => d?.project?.id)
        .map(d => d.project.id)
    );
    return projectIds.size;
  }
);

// Donation history loading state selector
export const selectDonationHistoryLoadingState = createSelector(
  [selectDonationHistoryLoading],
  (loading) => {
    const loadingState = loading || {};
    return {
      history: loadingState.history || false,
      impactStats: loadingState.impactStats || false,
      blockchainInsights: loadingState.blockchainInsights || false,
      donationDetails: loadingState.donationDetails || false,
      verification: loadingState.verification || false,
      isAnyLoading: Object.values(loadingState).some(Boolean)
    };
  }
);

// Donation history error state selector
export const selectDonationHistoryErrorState = createSelector(
  [selectDonationHistoryErrors],
  (errors) => {
    const errorState = errors || {};
    return {
      ...errorState,
      hasAnyError: Object.values(errorState).some(Boolean)
    };
  }
);

// Donations by status selector
export const selectDonationsByStatus = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return {};
    
    return donations.reduce((acc, donation) => {
      const status = donation?.paymentStatus || 'UNKNOWN';
      if (!acc[status]) acc[status] = [];
      acc[status].push(donation);
      return acc;
    }, {});
  }
);

// Donations by verification status selector
export const selectDonationsByVerificationStatus = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return {};
    
    return donations.reduce((acc, donation) => {
      const status = donation?.verificationStatus || 'UNKNOWN';
      if (!acc[status]) acc[status] = [];
      acc[status].push(donation);
      return acc;
    }, {});
  }
);

// Recent donations selector (last 5)
export const selectRecentDonations = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations)) return [];
    return donations.slice(0, 5);
  }
);

// High impact donations selector (top 10% by amount)
export const selectHighImpactDonations = createSelector(
  [selectDonationHistory],
  (donations) => {
    if (!Array.isArray(donations) || donations.length === 0) return [];
    
    const validDonations = donations.filter(d => d?.amount && typeof d.amount === 'number');
    const sorted = [...validDonations].sort((a, b) => b.amount - a.amount);
    const topCount = Math.max(1, Math.ceil(validDonations.length * 0.1));
    return sorted.slice(0, topCount);
  }
);

// Donations by timeframe selector
export const selectDonationsByTimeframe = createSelector(
  [selectDonationHistory, (_, timeframe) => timeframe],
  (donations, timeframe) => {
    if (!Array.isArray(donations)) return [];
    if (timeframe === 'all') return donations;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case '3y':
        startDate.setFullYear(now.getFullYear() - 3);
        break;
      default:
        return donations;
    }
    
    return donations.filter(d => {
      if (!d?.createdAt) return false;
      return new Date(d.createdAt) >= startDate;
    });
  }
);

// Filtered donations selector (respects current filters)
export const selectFilteredDonations = createSelector(
  [selectDonationHistory, selectDonationHistoryFilters],
  (donations, filters) => {
    if (!Array.isArray(donations)) return [];
    
    let filtered = [...donations];
    const filtersObj = filters || {};
    
    // Filter by status
    if (filtersObj.status && filtersObj.status !== 'all') {
      filtered = filtered.filter(d => d?.paymentStatus === filtersObj.status);
    }
    
    // Filter by charity
    if (filtersObj.charityId) {
      filtered = filtered.filter(d => d?.charity?.id === filtersObj.charityId);
    }
    
    // Filter by project
    if (filtersObj.projectId) {
      filtered = filtered.filter(d => d?.project?.id === filtersObj.projectId);
    }
    
    // Filter by verification status
    if (filtersObj.verified && filtersObj.verified !== 'all') {
      const isVerified = filtersObj.verified === 'true';
      if (isVerified) {
        filtered = filtered.filter(d => d?.verificationStatus === 'VERIFIED');
      } else {
        filtered = filtered.filter(d => d?.verificationStatus !== 'VERIFIED');
      }
    }
    
    // Filter by date range
    if (filtersObj.startDate && filtersObj.endDate) {
      const start = new Date(filtersObj.startDate);
      const end = new Date(filtersObj.endDate);
      filtered = filtered.filter(d => {
        if (!d?.createdAt) return false;
        const donationDate = new Date(d.createdAt);
        return donationDate >= start && donationDate <= end;
      });
    }
    
    return filtered;
  }
);

// Donation metrics selector (calculated from filtered donations)
export const selectDonationMetrics = createSelector(
  [selectFilteredDonations],
  (donations) => {
    if (!Array.isArray(donations) || donations.length === 0) {
      return {
        totalAmount: 0,
        totalDonations: 0,
        averageDonation: 0,
        verifiedAmount: 0,
        verifiedCount: 0,
        transparencyScore: 0,
        charitiesSupported: 0,
        projectsSupported: 0
      };
    }

    const validDonations = donations.filter(d => d?.amount && typeof d.amount === 'number');
    const totalAmount = validDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalDonations = validDonations.length;
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;
    
    const verifiedDonations = validDonations.filter(d => d?.verificationStatus === 'VERIFIED');
    const verifiedAmount = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);
    const verifiedCount = verifiedDonations.length;
    const transparencyScore = totalDonations > 0 ? (verifiedCount / totalDonations) * 100 : 0;
    
    const uniqueCharities = new Set(
      donations
        .filter(d => d?.charity?.id)
        .map(d => d.charity.id)
    );
    const uniqueProjects = new Set(
      donations
        .filter(d => d?.project?.id)
        .map(d => d.project.id)
    );
    
    return {
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalDonations,
      averageDonation: Math.round(averageDonation * 100) / 100,
      verifiedAmount: Math.round(verifiedAmount * 100) / 100,
      verifiedCount,
      transparencyScore: Math.round(transparencyScore * 100) / 100,
      charitiesSupported: uniqueCharities.size,
      projectsSupported: uniqueProjects.size
    };
  }
);

// Monthly donation trends selector
export const selectMonthlyTrends = createSelector(
  [selectTimeline],
  (timeline) => {
    if (!Array.isArray(timeline) || timeline.length === 0) return [];
    
    return timeline.map(item => ({
      month: item?.month || '',
      totalAmount: item?.totalAmount || 0,
      donationCount: item?.donationCount || 0,
      verifiedAmount: item?.verifiedAmount || 0,
      verifiedCount: item?.verifiedCount || 0,
      verificationRate: (item?.donationCount || 0) > 0 
        ? Math.round(((item?.verifiedCount || 0) / item.donationCount) * 100)
        : 0,
      formattedMonth: item?.month 
        ? new Date(item.month + '-01').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
          })
        : ''
    })).filter(item => item.month); // Remove items with invalid months
  }
);

// Top charity impact selector
export const selectTopCharityImpact = createSelector(
  [selectCharityImpact],
  (charityImpact) => {
    if (!Array.isArray(charityImpact) || charityImpact.length === 0) return null;
    
    return charityImpact.reduce((top, charity) => {
      if (!charity?.totalDonated || typeof charity.totalDonated !== 'number') return top;
      return (!top || charity.totalDonated > top.totalDonated) ? charity : top;
    }, null);
  }
);

// Blockchain verification summary selector
export const selectBlockchainVerificationSummary = createSelector(
  [selectBlockchainSummary, selectDonationHistory],
  (summary, donations) => {
    const donationsArray = Array.isArray(donations) ? donations : [];
    
    if (!summary || Object.keys(summary).length === 0) {
      // Calculate from donation history if summary not available
      const total = donationsArray.length;
      const verified = donationsArray.filter(d => d?.verificationStatus === 'VERIFIED').length;
      const pending = donationsArray.filter(d => d?.verificationStatus === 'PENDING').length;
      const unverified = total - verified - pending;
      
      return {
        totalDonations: total,
        verifiedDonations: verified,
        pendingVerifications: pending,
        unverifiedDonations: unverified,
        transparencyScore: total > 0 ? Math.round((verified / total) * 100) : 0,
        totalVerifiedAmount: donationsArray
          .filter(d => d?.verificationStatus === 'VERIFIED' && d?.amount)
          .reduce((sum, d) => sum + d.amount, 0)
      };
    }
    
    return summary;
  }
);

// Is data fresh selector (check if data needs refresh)
export const selectIsDataFresh = createSelector(
  [selectRefreshTrigger, selectDonationHistoryLoadingState],
  (refreshTrigger, loadingState) => {
    // Data is considered fresh if not currently loading and refresh trigger is recent
    const trigger = refreshTrigger || 0;
    const loading = loadingState?.isAnyLoading || false;
    return !loading && trigger > 0;
  }
);

// Safe array selector helper
export const createSafeArraySelector = (selector) => createSelector(
  [selector],
  (data) => Array.isArray(data) ? data : []
);

// Safe object selector helper
export const createSafeObjectSelector = (selector) => createSelector(
  [selector],
  (data) => (data && typeof data === 'object') ? data : {}
);

// Export safe versions of commonly problematic selectors
export const selectSafeDonationHistory = createSafeArraySelector(selectDonationHistory);
export const selectSafeCharities = createSafeArraySelector(selectCharities);
export const selectSafeProjects = createSafeArraySelector(selectProjects);
export const selectSafeTimeline = createSafeArraySelector(selectTimeline);
export const selectSafeCharityImpact = createSafeArraySelector(selectCharityImpact);