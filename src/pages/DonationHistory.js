import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  DollarSign, 
  Heart, 
  Shield, 
  TrendingUp, 
  Award, 
  ExternalLink,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Target,
  Building,
  Users,
  Wallet
} from 'lucide-react';

// Import your selectors
import {
  selectUser,
  selectDonationHistory,
  selectDonationHistoryPagination,
  selectDonationHistoryLoading,
  selectDonationHistoryErrors,
  selectDonationHistoryFilters,
  selectImpactOverview,
  selectCharityImpact,
  selectTransparencyScore,
  selectDonationMetrics,
  selectMonthlyTrends,
  selectBlockchainSummary,
  selectBlockchainTransactions
} from '../redux/selectors';

// Import your Redux actions
import {
  fetchDonationHistory,
  fetchDonorImpactStats,
  fetchBlockchainInsights,
  setFilters,
  clearFilters,
  setTimeframe,
  verifyDonationOnBlockchain
} from '../redux/slices/donationHistorySlice';

const DonorDonationHistory = () => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const user = useSelector(selectUser);
  const donations = useSelector(selectDonationHistory);
  const pagination = useSelector(selectDonationHistoryPagination);
  const loading = useSelector(selectDonationHistoryLoading);
  const errors = useSelector(selectDonationHistoryErrors);
  const filters = useSelector(selectDonationHistoryFilters);
  const impactOverview = useSelector(selectImpactOverview);
  const charityImpact = useSelector(selectCharityImpact);
  const transparencyScore = useSelector(selectTransparencyScore);
  const donationMetrics = useSelector(selectDonationMetrics);
  const monthlyTrends = useSelector(selectMonthlyTrends);
  const blockchainSummary = useSelector(selectBlockchainSummary);
  const blockchainTransactions = useSelector(selectBlockchainTransactions);

  // Local state
  const [activeView, setActiveView] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [verifyingDonations, setVerifyingDonations] = useState(new Set());

  // Initialize data on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDonationHistory(filters));
      dispatch(fetchDonorImpactStats(selectedTimeframe));
      dispatch(fetchBlockchainInsights());
    }
  }, [dispatch, user?.id, filters, selectedTimeframe]);

  // Filter donations based on search term
  const filteredDonations = useMemo(() => {
    if (!searchTerm) return donations;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return donations.filter(donation =>
      donation.charity.name.toLowerCase().includes(lowercaseSearch) ||
      donation.project?.title?.toLowerCase().includes(lowercaseSearch) ||
      donation.transactionId.toLowerCase().includes(lowercaseSearch)
    );
  }, [donations, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    dispatch(setFilters({ [filterKey]: value }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  // Handle timeframe change
  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    dispatch(setTimeframe(timeframe));
    dispatch(fetchDonorImpactStats(timeframe));
  };

  // Handle manual verification
  const handleVerifyDonation = async (donationId) => {
    setVerifyingDonations(prev => new Set([...prev, donationId]));
    try {
      await dispatch(verifyDonationOnBlockchain(donationId)).unwrap();
      // Refresh data after verification
      dispatch(fetchDonationHistory(filters));
      dispatch(fetchBlockchainInsights());
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifyingDonations(prev => {
        const newSet = new Set(prev);
        newSet.delete(donationId);
        return newSet;
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get verification status icon and color
  const getVerificationDisplay = (status) => {
    switch (status) {
      case 'VERIFIED':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Verified' };
      case 'PENDING':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Pending' };
      default:
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Not Verified' };
    }
  };

  // Render loading state
  if (loading.history && donations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                Track your charitable impact with blockchain-verified transparency
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => handleTimeframeChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
                <option value="3y">Last 3 Years</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(impactOverview?.totalDonated || 0)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {impactOverview?.totalDonations || 0} donations
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transparency Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {impactOverview?.blockchainMetrics?.transparencyScore || 0}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {impactOverview?.blockchainMetrics?.verifiedDonations || 0} verified
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Charities Supported</p>
                <p className="text-2xl font-bold text-gray-900">
                  {impactOverview?.charitiesSupported || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {impactOverview?.projectsSupported || 0} projects
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Rank</p>
                <p className="text-2xl font-bold text-gray-900">
                  #{impactOverview?.donorRank || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  of {impactOverview?.totalDonors || 0} donors
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'history', label: 'Donation History', icon: Calendar },
                { id: 'impact', label: 'Impact Analysis', icon: Target },
                { id: 'blockchain', label: 'Blockchain Insights', icon: Shield }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeView === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeView === 'overview' && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {donations.slice(0, 5).map((donation) => {
                      const verification = getVerificationDisplay(donation.verificationStatus);
                      const VerificationIcon = verification.icon;
                      
                      return (
                        <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${verification.bg}`}>
                              <VerificationIcon className={`w-4 h-4 ${verification.color}`} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatCurrency(donation.amount, donation.currency)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {donation.charity.name}
                                {donation.project && ` • ${donation.project.title}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(donation.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${verification.bg} ${verification.color}`}>
                              {verification.label}
                            </span>
                            <button
                              onClick={() => setActiveView('history')}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Charities */}
                {charityImpact && charityImpact.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Top Supported Charities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {charityImpact.slice(0, 6).map((charity) => (
                        <div key={charity.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 truncate">{charity.name}</h4>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                              {charity.category}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total donated:</span>
                              <span className="font-medium">{formatCurrency(charity.totalDonated)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Donations:</span>
                              <span className="font-medium">{charity.donationCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Verified:</span>
                              <span className="font-medium">{charity.verificationRate}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === 'history' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search donations, charities, or projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Status</option>
                          <option value="SUCCEEDED">Completed</option>
                          <option value="PENDING">Pending</option>
                          <option value="FAILED">Failed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
                        <select
                          value={filters.verified}
                          onChange={(e) => handleFilterChange('verified', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Verifications</option>
                          <option value="true">Verified</option>
                          <option value="false">Unverified</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={filters.startDate || ''}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={filters.endDate || ''}
                          onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={handleClearFilters}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear all filters</span>
                      </button>
                      <button
                        onClick={() => {/* Add export functionality */}}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Donations Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Charity & Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Impact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verification
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDonations.map((donation) => {
                          const verification = getVerificationDisplay(donation.verificationStatus);
                          const VerificationIcon = verification.icon;
                          const isVerifying = verifyingDonations.has(donation.id);
                          
                          return (
                            <tr key={donation.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatCurrency(donation.amount, donation.currency)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(donation.createdAt)}
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {donation.charity.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {donation.project?.title || 'General donation'}
                                  </div>
                                  <div className="text-xs text-blue-600">
                                    {donation.charity.category}
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                {donation.project && donation.impactMetrics && (
                                  <div>
                                    <div className="text-sm text-gray-900">
                                      {donation.impactMetrics.projectContribution}% of goal
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                      <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${donation.project.progressPercentage}%` }}
                                      ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {donation.project.progressPercentage}% funded
                                    </div>
                                  </div>
                                )}
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <VerificationIcon className={`w-4 h-4 ${verification.color}`} />
                                  <span className={`text-sm ${verification.color}`}>
                                    {verification.label}
                                  </span>
                                </div>
                                {donation.blockchainVerification?.explorerUrl && (
                                  <a
                                    href={donation.blockchainVerification.explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-1"
                                  >
                                    <span>View on Explorer</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  {donation.verificationStatus !== 'VERIFIED' && (
                                    <button
                                      onClick={() => handleVerifyDonation(donation.id)}
                                      disabled={isVerifying}
                                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 flex items-center space-x-1"
                                    >
                                      {isVerifying ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Shield className="w-4 h-4" />
                                      )}
                                      <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
                                    </button>
                                  )}
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page <= 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= pagination.totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing{' '}
                            <span className="font-medium">
                              {(pagination.page - 1) * pagination.limit + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                              {Math.min(pagination.page * pagination.limit, pagination.total)}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">{pagination.total}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => handlePageChange(pagination.page - 1)}
                              disabled={pagination.page <= 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                              const page = i + 1;
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === pagination.page
                                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                            
                            <button
                              onClick={() => handlePageChange(pagination.page + 1)}
                              disabled={pagination.page >= pagination.totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeView === 'impact' && (
              <div className="space-y-6">
                {/* Impact Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">Personal Impact</h3>
                      <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Donated:</span>
                        <span className="font-semibold text-blue-900">
                          {formatCurrency(impactOverview?.totalDonated || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Average per donation:</span>
                        <span className="font-semibold text-blue-900">
                          {formatCurrency(impactOverview?.averageDonation || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Verified amount:</span>
                        <span className="font-semibold text-blue-900">
                          {formatCurrency(impactOverview?.blockchainMetrics?.verifiedAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Organizations</h3>
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-700">Charities supported:</span>
                        <span className="font-semibold text-green-900">
                          {impactOverview?.charitiesSupported || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Projects funded:</span>
                        <span className="font-semibold text-green-900">
                          {impactOverview?.projectsSupported || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Categories:</span>
                        <span className="font-semibold text-green-900">
                          {charityImpact?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-900">Community Rank</h3>
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Your rank:</span>
                        <span className="font-semibold text-purple-900">
                          #{impactOverview?.donorRank || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Total donors:</span>
                        <span className="font-semibold text-purple-900">
                          {impactOverview?.totalDonors || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Transparency score:</span>
                        <span className="font-semibold text-purple-900">
                          {impactOverview?.blockchainMetrics?.transparencyScore || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charity Impact Breakdown */}
                {charityImpact && charityImpact.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Charity Impact Breakdown</h3>
                    <div className="space-y-4">
                      {charityImpact.map((charity, index) => (
                        <div key={charity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">#{index + 1}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{charity.name}</div>
                              <div className="text-sm text-gray-500">{charity.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(charity.totalDonated)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {charity.donationCount} donations • {charity.verificationRate}% verified
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly Trends Chart */}
                {monthlyTrends && monthlyTrends.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
                    <div className="h-64 flex items-end space-x-2">
                      {monthlyTrends.map((trend, index) => {
                        const maxAmount = Math.max(...monthlyTrends.map(t => t.totalAmount));
                        const height = maxAmount > 0 ? (trend.totalAmount / maxAmount) * 200 : 0;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-gray-500 mb-2">
                              {formatCurrency(trend.totalAmount)}
                            </div>
                            <div
                              className="w-full bg-blue-500 rounded-t"
                              style={{ height: `${height}px` }}
                              title={`${trend.formattedMonth}: ${formatCurrency(trend.totalAmount)}`}
                            ></div>
                            <div className="text-xs text-gray-600 mt-2 rotate-45 origin-left">
                              {trend.formattedMonth}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === 'blockchain' && (
              <div className="space-y-6">
                {/* Blockchain Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {blockchainSummary?.verifiedDonations || 0}
                    </div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {blockchainSummary?.pendingVerifications || 0}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {blockchainSummary?.unverifiedDonations || 0}
                    </div>
                    <div className="text-sm text-gray-600">Unverified</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {blockchainSummary?.transparencyScore || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Transparency</div>
                  </div>
                </div>

                {/* Blockchain Transactions */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Blockchain Transactions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction Hash
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount & Charity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Explorer
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blockchainTransactions && blockchainTransactions.map((tx) => (
                          <tr key={tx.donationId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-sm text-gray-900">
                              {tx.transactionHash.substring(0, 10)}...{tx.transactionHash.substring(tx.transactionHash.length - 8)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(tx.amount, tx.currency)}
                              </div>
                              <div className="text-sm text-gray-500">{tx.charity.name}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {formatDate(tx.timestamp)}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={tx.explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <span>View</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Transparency Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">What is Blockchain Verification?</h3>
                  <p className="text-blue-800 mb-4">
                    Every donation on Charitrace is recorded on the blockchain, creating an immutable, 
                    transparent record of your charitable giving. This ensures complete accountability 
                    and allows you to verify that your donations reached their intended recipients.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-900">Immutable Records</div>
                        <div className="text-sm text-blue-700">
                          Once recorded, donation data cannot be altered or deleted
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Eye className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-900">Public Verification</div>
                        <div className="text-sm text-blue-700">
                          Anyone can verify transactions using blockchain explorers
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-900">Impact Tracking</div>
                        <div className="text-sm text-blue-700">
                          Track exactly how your donations create real-world impact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.history && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading donation history</h3>
                <div className="mt-2 text-sm text-red-700">
                  {errors.history}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDonationHistory;