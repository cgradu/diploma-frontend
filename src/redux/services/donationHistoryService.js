// services/donationHistoryService.js
import api from '../utils/axiosConfig';

class DonationHistoryService {
  /**
   * Fetch donation history with filters and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with donation history
   */
  async getDonationHistory(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'all',
        charityId,
        projectId,
        startDate,
        endDate,
        verified,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        sortBy,
        sortOrder
      });

      // Add optional parameters
      if (charityId) queryParams.append('charityId', charityId.toString());
      if (projectId) queryParams.append('projectId', projectId.toString());
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (verified !== undefined && verified !== 'all') {
        queryParams.append('verified', verified.toString());
      }

      const response = await api.get(`/donation/stats/${user.id}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Fetch comprehensive donor impact statistics
   * @param {string} timeframe - Time period for statistics (30d, 90d, 1y, 3y, all)
   * @returns {Promise} API response with impact statistics
   */
  async getDonorImpactStats(timeframe = 'all') {
    try {
      const response = await api.get(`/donations/impact/stats?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Fetch blockchain-specific insights and transparency data
   * @returns {Promise} API response with blockchain insights
   */
  async getBlockchainInsights() {
    try {
      const response = await api.get('/donations/blockchain/insights');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get details for a specific donation
   * @param {number} donationId - ID of the donation
   * @returns {Promise} API response with donation details
   */
  async getDonationDetails(donationId) {
    try {
      const response = await api.get(`/donations/${donationId}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get blockchain verification status for a donation
   * @param {number} donationId - ID of the donation
   * @returns {Promise} API response with verification status
   */
  async getVerificationStatus(donationId) {
    try {
      const response = await api.get(`/donations/${donationId}/verification`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Manually trigger blockchain verification for a donation
   * @param {number} donationId - ID of the donation
   * @returns {Promise} API response with verification result
   */
  async verifyDonationOnBlockchain(donationId) {
    try {
      const response = await api.post(`/donations/${donationId}/verify`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get blockchain statistics (admin only)
   * @returns {Promise} API response with blockchain statistics
   */
  async getBlockchainStats() {
    try {
      const response = await api.get('/donations/blockchain/stats');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get charity donation statistics
   * @param {number} charityId - ID of the charity
   * @returns {Promise} API response with charity stats
   */
  async getCharityDonationStats(charityId) {
    try {
      const response = await api.get(`/donations/charity/${charityId}/stats`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Export donation data
   * @param {Object} filters - Export filters
   * @param {string} format - Export format (csv, json)
   * @returns {Promise} API response with export data
   */
  async exportDonationData(filters = {}, format = 'csv') {
    try {
      const queryParams = new URLSearchParams({ 
        format,
        ...filters 
      });

      const response = await api.get(`/donations/export?${queryParams}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });

      if (format === 'csv') {
        // Handle CSV download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `donations-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Export downloaded successfully' };
      }

      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get donation context for forms (charity or project info)
   * @param {string} type - 'charity' or 'project'
   * @param {number} id - ID of charity or project
   * @returns {Promise} API response with context data
   */
  async getDonationContext(type, id) {
    try {
      const response = await api.get(`/donations/create/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get donation summary statistics for dashboard
   * @param {string} timeframe - Time period for summary
   * @returns {Promise} Processed summary data
   */
  async getDonationSummary(timeframe = '30d') {
    try {
      const [impactStats, blockchainInsights] = await Promise.all([
        this.getDonorImpactStats(timeframe),
        this.getBlockchainInsights()
      ]);

      return {
        overview: impactStats.data.overview,
        transparency: {
          score: blockchainInsights.data.summary.transparencyScore,
          verifiedDonations: blockchainInsights.data.summary.verifiedDonations,
          totalDonations: blockchainInsights.data.summary.totalDonations,
          verifiedAmount: blockchainInsights.data.summary.totalVerifiedAmount
        },
        topCharities: impactStats.data.charityImpact.slice(0, 5),
        recentTransactions: blockchainInsights.data.transactions.slice(0, 5)
      };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Search donations with advanced filters
   * @param {Object} searchParams - Advanced search parameters
   * @returns {Promise} API response with search results
   */
  async searchDonations(searchParams) {
    try {
      const {
        query,
        charityName,
        projectTitle,
        minAmount,
        maxAmount,
        dateFrom,
        dateTo,
        categories = [],
        verificationStatus = 'all',
        page = 1,
        limit = 10
      } = searchParams;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (query) params.append('query', query);
      if (charityName) params.append('charityName', charityName);
      if (projectTitle) params.append('projectTitle', projectTitle);
      if (minAmount) params.append('minAmount', minAmount.toString());
      if (maxAmount) params.append('maxAmount', maxAmount.toString());
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (verificationStatus !== 'all') params.append('verified', verificationStatus);
      
      categories.forEach(category => params.append('categories', category));

      const response = await api.get(`/donations/search?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get donation trends for charts
   * @param {string} timeframe - Time period for trends
   * @param {string} groupBy - Group by period (day, week, month)
   * @returns {Promise} Processed trend data
   */
  async getDonationTrends(timeframe = '1y', groupBy = 'month') {
    try {
      const impactStats = await this.getDonorImpactStats(timeframe);
      const timeline = impactStats.data.timeline;

      // Process timeline data based on groupBy
      const processedData = timeline.map(item => ({
        period: this.formatPeriod(item.month, groupBy),
        totalAmount: item.totalAmount,
        donationCount: item.donationCount,
        verifiedAmount: item.verifiedAmount || 0,
        verifiedCount: item.verifiedCount || 0,
        verificationRate: item.donationCount > 0 
          ? Math.round((item.verifiedCount || 0) / item.donationCount * 100)
          : 0
      }));

      return {
        trends: processedData,
        summary: {
          totalAmount: processedData.reduce((sum, item) => sum + item.totalAmount, 0),
          totalDonations: processedData.reduce((sum, item) => sum + item.donationCount, 0),
          averageVerificationRate: processedData.length > 0
            ? Math.round(processedData.reduce((sum, item) => sum + item.verificationRate, 0) / processedData.length)
            : 0
        }
      };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Bulk verify multiple donations
   * @param {number[]} donationIds - Array of donation IDs
   * @returns {Promise} API response with bulk verification results
   */
  async bulkVerifyDonations(donationIds) {
    try {
      const verificationPromises = donationIds.map(id => 
        this.verifyDonationOnBlockchain(id).catch(error => ({
          donationId: id,
          success: false,
          error: error.message
        }))
      );

      const results = await Promise.all(verificationPromises);
      
      const successful = results.filter(r => r.success !== false);
      const failed = results.filter(r => r.success === false);

      return {
        successful: successful.length,
        failed: failed.length,
        total: donationIds.length,
        results
      };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Get donation analytics for specific charity/project
   * @param {Object} params - Analytics parameters
   * @returns {Promise} Processed analytics data
   */
  async getDonationAnalytics(params) {
    try {
      const { type, id, timeframe = '1y' } = params;
      
      let endpoint;
      if (type === 'charity') {
        endpoint = `/donations/charity/${id}/stats`;
      } else if (type === 'project') {
        endpoint = `/donations/project/${id}/stats`;
      } else {
        throw new Error('Invalid analytics type. Must be "charity" or "project"');
      }

      const response = await api.get(`${endpoint}?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Helper methods

  /**
   * Format period for display
   * @param {string} period - ISO period string
   * @param {string} groupBy - Grouping type
   * @returns {string} Formatted period
   */
  formatPeriod(period, groupBy) {
    const date = new Date(period + '-01');
    
    switch (groupBy) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'week':
        return `Week of ${date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
      default:
        return period;
    }
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - API error
   * @returns {Error} Processed error
   */
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 
                     error.response.data?.message || 
                     'An error occurred while processing your request';
      const status = error.response.status;
      
      const apiError = new Error(message);
      apiError.status = status;
      apiError.code = error.response.data?.code;
      return apiError;
    } else if (error.request) {
      // Request made but no response received
      const networkError = new Error('Network error: Unable to connect to server');
      networkError.status = 0;
      networkError.code = 'NETWORK_ERROR';
      return networkError;
    } else {
      // Something else happened
      return error;
    }
  }

  /**
   * Check if user has permission for blockchain operations
   * @param {string} operation - Operation type
   * @returns {boolean} Permission status
   */
  hasBlockchainPermission(operation) {
    const userRole = localStorage.getItem('userRole');
    
    switch (operation) {
      case 'verify':
        return ['donor', 'admin'].includes(userRole);
      case 'stats':
        return userRole === 'admin';
      case 'export':
        return ['donor', 'charity', 'admin'].includes(userRole);
      default:
        return false;
    }
  }

  /**
   * Validate donation filters
   * @param {Object} filters - Filter object to validate
   * @returns {Object} Validated and sanitized filters
   */
  validateFilters(filters) {
    const validatedFilters = {};
    
    // Validate page and limit
    if (filters.page) {
      validatedFilters.page = Math.max(1, parseInt(filters.page) || 1);
    }
    
    if (filters.limit) {
      validatedFilters.limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 10));
    }
    
    // Validate status
    const validStatuses = ['all', 'PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED'];
    if (filters.status && validStatuses.includes(filters.status)) {
      validatedFilters.status = filters.status;
    }
    
    // Validate verification status
    const validVerificationStatuses = ['all', 'true', 'false'];
    if (filters.verified && validVerificationStatuses.includes(filters.verified.toString())) {
      validatedFilters.verified = filters.verified;
    }
    
    // Validate dates
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      if (!isNaN(startDate.getTime())) {
        validatedFilters.startDate = startDate.toISOString().split('T')[0];
      }
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      if (!isNaN(endDate.getTime())) {
        validatedFilters.endDate = endDate.toISOString().split('T')[0];
      }
    }
    
    // Validate numeric IDs
    if (filters.charityId) {
      const charityId = parseInt(filters.charityId);
      if (!isNaN(charityId) && charityId > 0) {
        validatedFilters.charityId = charityId;
      }
    }
    
    if (filters.projectId) {
      const projectId = parseInt(filters.projectId);
      if (!isNaN(projectId) && projectId > 0) {
        validatedFilters.projectId = projectId;
      }
    }
    
    // Validate sort parameters
    const validSortFields = ['createdAt', 'amount', 'charityName', 'verificationStatus'];
    if (filters.sortBy && validSortFields.includes(filters.sortBy)) {
      validatedFilters.sortBy = filters.sortBy;
    }
    
    const validSortOrders = ['asc', 'desc'];
    if (filters.sortOrder && validSortOrders.includes(filters.sortOrder)) {
      validatedFilters.sortOrder = filters.sortOrder;
    }
    
    return validatedFilters;
  }

  /**
   * Calculate donation metrics from raw data
   * @param {Array} donations - Array of donation objects
   * @returns {Object} Calculated metrics
   */
  calculateMetrics(donations) {
    if (!donations || donations.length === 0) {
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

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalDonations = donations.length;
    const averageDonation = totalAmount / totalDonations;
    
    const verifiedDonations = donations.filter(d => d.verificationStatus === 'VERIFIED');
    const verifiedAmount = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);
    const verifiedCount = verifiedDonations.length;
    const transparencyScore = (verifiedCount / totalDonations) * 100;
    
    const uniqueCharities = new Set(donations.map(d => d.charity.id));
    const uniqueProjects = new Set(
      donations.filter(d => d.project).map(d => d.project.id)
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

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date string
   */
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  }

  /**
   * Get verification status color and icon
   * @param {string} status - Verification status
   * @returns {Object} Color and icon information
   */
  getVerificationDisplay(status) {
    switch (status) {
      case 'VERIFIED':
        return {
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: 'CheckCircle',
          label: 'Verified'
        };
      case 'PENDING':
        return {
          color: 'yellow',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: 'Clock',
          label: 'Pending'
        };
      case 'FAILED':
        return {
          color: 'red',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: 'XCircle',
          label: 'Failed'
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: 'AlertCircle',
          label: 'Not Verified'
        };
    }
  }

  /**
   * Generate blockchain explorer URL
   * @param {string} transactionHash - Transaction hash
   * @param {string} network - Blockchain network
   * @returns {string} Explorer URL
   */
  getExplorerUrl(transactionHash, network = 'ethereum') {
    if (!transactionHash || transactionHash.startsWith('pending_') || transactionHash.startsWith('failed_')) {
      return null;
    }

    const explorers = {
      ethereum: 'https://etherscan.io/tx/',
      sepolia: 'https://sepolia.etherscan.io/tx/',
      polygon: 'https://polygonscan.com/tx/',
      bsc: 'https://bscscan.com/tx/'
    };

    const baseUrl = explorers[network] || explorers.ethereum;
    return `${baseUrl}${transactionHash}`;
  }

  /**
   * Cache management for frequently accessed data
   */
  cache = new Map();
  
  /**
   * Get cached data or fetch new data
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to fetch data if not cached
   * @param {number} ttl - Time to live in milliseconds
   * @returns {Promise} Cached or fresh data
   */
  async getCached(key, fetchFn, ttl = 5 * 60 * 1000) { // 5 minutes default
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.data;
    }
    
    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: now });
    
    return data;
  }

  /**
   * Clear cache for specific key or all cache
   * @param {string} key - Specific key to clear (optional)
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Export a singleton instance
const donationHistoryService = new DonationHistoryService();
export default donationHistoryService;