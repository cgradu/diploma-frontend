import React, { useState, useEffect } from 'react';
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
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

const DonationHistoryDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [blockchainInsights, setBlockchainInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    timeframe: 'all',
    verified: 'all'
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      setLoading(true);
      
      // Mock donation history
      const mockDonations = [
        {
          id: 1,
          amount: 100,
          currency: 'USD',
          transactionId: 'don_abc123',
          paymentStatus: 'SUCCEEDED',
          createdAt: '2024-01-15T10:30:00Z',
          charity: {
            id: 1,
            name: 'Education For All',
            category: 'EDUCATION'
          },
          project: {
            id: 1,
            title: 'School Supplies Program',
            goal: 25000,
            currentAmount: 15000,
            progressPercentage: 60
          },
          blockchainVerification: {
            verified: true,
            transactionHash: '0x1234567890abcdef',
            blockNumber: 12345678,
            explorerUrl: 'https://etherscan.io/tx/0x1234567890abcdef'
          },
          verificationStatus: 'VERIFIED',
          impactMetrics: {
            projectContribution: 0.4,
            verified: true
          }
        },
        {
          id: 2,
          amount: 250,
          currency: 'USD',
          transactionId: 'don_def456',
          paymentStatus: 'SUCCEEDED',
          createdAt: '2024-01-10T14:20:00Z',
          charity: {
            id: 2,
            name: 'Clean Water Initiative',
            category: 'HUMANITARIAN'
          },
          project: {
            id: 2,
            title: 'Well Construction Project',
            goal: 50000,
            currentAmount: 30000,
            progressPercentage: 60
          },
          blockchainVerification: {
            verified: false,
            transactionHash: 'pending_abc123',
            blockNumber: 0
          },
          verificationStatus: 'PENDING',
          impactMetrics: {
            projectContribution: 0.5,
            verified: false
          }
        }
      ];

      // Mock impact statistics
      const mockImpactStats = {
        overview: {
          totalDonated: 1250,
          totalDonations: 8,
          averageDonation: 156.25,
          charitiesSupported: 5,
          projectsSupported: 12,
          donorRank: 15,
          totalDonors: 1250,
          blockchainMetrics: {
            verifiedDonations: 6,
            verifiedAmount: 950,
            transparencyScore: 75,
            verificationRate: 75
          }
        },
        charityImpact: [
          {
            id: 1,
            name: 'Education For All',
            category: 'EDUCATION',
            totalDonated: 400,
            donationCount: 3,
            verificationRate: 100
          },
          {
            id: 2,
            name: 'Clean Water Initiative',
            category: 'HUMANITARIAN',
            totalDonated: 350,
            donationCount: 2,
            verificationRate: 50
          }
        ],
        categoryImpact: [
          {
            category: 'EDUCATION',
            totalDonated: 500,
            donationCount: 4,
            charitiesCount: 2,
            verificationRate: 80
          },
          {
            category: 'HUMANITARIAN',
            totalDonated: 450,
            donationCount: 3,
            charitiesCount: 2,
            verificationRate: 66.7
          }
        ],
        achievements: [
          {
            projectId: 1,
            projectTitle: 'School Supplies Program',
            charityName: 'Education For All',
            donorContribution: 150,
            donorImpactPercentage: 0.6
          }
        ]
      };

      // Mock blockchain insights
      const mockBlockchainInsights = {
        summary: {
          totalDonations: 8,
          verifiedDonations: 6,
          pendingVerifications: 1,
          unverifiedDonations: 1,
          transparencyScore: 75,
          totalVerifiedAmount: 950
        },
        transactions: [
          {
            donationId: 1,
            amount: 100,
            transactionHash: '0x1234567890abcdef',
            explorerUrl: 'https://etherscan.io/tx/0x1234567890abcdef',
            charity: { name: 'Education For All' },
            timestamp: '2024-01-15T10:35:00Z'
          }
        ]
      };

      setDonations(mockDonations);
      setImpactStats(mockImpactStats);
      setBlockchainInsights(mockBlockchainInsights);
      setLoading(false);
    };

    fetchData();
  }, [filters]);

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donation Impact</h1>
          <p className="text-gray-600">Track your charitable giving with blockchain-verified transparency</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'history', label: 'Donation History', icon: Calendar },
              { id: 'impact', label: 'Impact Statistics', icon: BarChart3 },
              { id: 'blockchain', label: 'Blockchain Insights', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === id
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

        {/* Content based on active tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Donated</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(impactStats?.overview.totalDonated || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Charities Supported</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {impactStats?.overview.charitiesSupported || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Transparency Score</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {impactStats?.overview.blockchainMetrics.transparencyScore || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Donor Rank</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      #{impactStats?.overview.donorRank || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="SUCCEEDED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>

                <select
                  value={filters.verified}
                  onChange={(e) => setFilters({...filters, verified: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Verifications</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>

                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Donation History Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
              </div>
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
                        Blockchain Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
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
                          {donation.project && (
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
                            {getVerificationIcon(donation.verificationStatus)}
                            <span className={`text-sm ${
                              donation.verificationStatus === 'VERIFIED' 
                                ? 'text-green-600' 
                                : donation.verificationStatus === 'PENDING'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}>
                              {donation.verificationStatus}
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
                          <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-6">
            {/* Impact Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Charity Impact Breakdown</h3>
                <div className="space-y-4">
                  {impactStats?.charityImpact.map((charity) => (
                    <div key={charity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{charity.name}</div>
                        <div className="text-sm text-gray-500">{charity.category}</div>
                        <div className="text-sm text-green-600">{charity.donationCount} donations</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(charity.totalDonated)}
                        </div>
                        <div className="text-sm text-blue-600">
                          {charity.verificationRate}% verified
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
                <div className="space-y-4">
                  {impactStats?.categoryImpact.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {category.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(category.totalDonated)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(category.totalDonated / Math.max(...impactStats.categoryImpact.map(c => c.totalDonated))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{category.charitiesCount} charities</span>
                        <span>{category.verificationRate}% verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Project Achievements</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {impactStats?.achievements.map((achievement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Project Completed</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{achievement.projectTitle}</div>
                    <div className="text-xs text-gray-500">{achievement.charityName}</div>
                    <div className="mt-2 text-sm font-medium text-green-600">
                      Your impact: {achievement.donorImpactPercentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparency Score */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transparency Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {impactStats?.overview.blockchainMetrics.transparencyScore}%
                  </div>
                  <div className="text-sm text-gray-600">Transparency Score</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Based on blockchain verification
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {impactStats?.overview.blockchainMetrics.verifiedDonations}
                  </div>
                  <div className="text-sm text-gray-600">Verified Donations</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Out of {impactStats?.overview.totalDonations} total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatCurrency(impactStats?.overview.blockchainMetrics.verifiedAmount || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Verified Amount</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Confirmed on blockchain
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blockchain' && (
          <div className="space-y-6">
            {/* Blockchain Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Verification Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {blockchainInsights?.summary.verifiedDonations}
                  </div>
                  <div className="text-sm text-green-700">Verified</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {blockchainInsights?.summary.pendingVerifications}
                  </div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {blockchainInsights?.summary.unverifiedDonations}
                  </div>
                  <div className="text-sm text-red-700">Unverified</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {blockchainInsights?.summary.transparencyScore}%
                  </div>
                  <div className="text-sm text-blue-700">Transparency</div>
                </div>
              </div>
            </div>

            {/* Blockchain Transactions */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Blockchain Transactions</h3>
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
                        Verification Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Explorer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blockchainInsights?.transactions.map((tx) => (
                      <tr key={tx.donationId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm text-gray-900">
                          {tx.transactionHash.substring(0, 10)}...{tx.transactionHash.substring(tx.transactionHash.length - 8)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(tx.amount)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistoryDashboard;