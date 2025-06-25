// src/pages/DonorStatsPage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Alert,
  Paper,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  VolunteerActivism,
  Analytics,
  Timeline,
  TrendingUp,
  Favorite,
  Business,
  CalendarToday,
  Download,
  Share,
  Refresh
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import DonorStatsCard from '../components/stats/DonorStatsCard';
import { fetchDonorStats, selectDonorStats } from '../redux/slices/statsSlice';
import Navbar from '../components/layout/Navbar';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: '24px' }}>
    {value === index && children}
  </div>
);

// Helper function to find most active category
const getMostActiveCategory = (donations) => {
  if (!donations || donations.length === 0) return 'N/A';
  
  const categoryCount = {};
  donations.forEach(donation => {
    const category = donation.charity?.category || 'Other';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  const mostActive = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0];
  
  return mostActive ? 
    mostActive[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 
    'N/A';
};

// Helper function to format timestamp
const formatLastDonation = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
};


const DonorStatsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: donorStats, loading, error } = useSelector(selectDonorStats);
  
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.role === 'donor') {
      dispatch(fetchDonorStats(user.id));
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await dispatch(fetchDonorStats(user.id));
    }
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

// Prepare chart data from real donorStats
const prepareDonationTrendsData = () => {
  if (!donorStats?.recentDonations || donorStats.recentDonations.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Monthly Donations',
        data: [0],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4
      }]
    };
  }

  // Group donations by month
  const monthlyData = {};
  
  donorStats.recentDonations.forEach(donation => {
    // Parse the timestamp - format: "2025-06-14T15:01:36.000Z"
    const date = new Date(donation.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { label: monthLabel, amount: 0 };
    }
    
    // Convert amount string to number
    monthlyData[monthKey].amount += parseFloat(donation.amount);
  });

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyData).sort();
  const labels = sortedMonths.map(key => monthlyData[key].label);
  const amounts = sortedMonths.map(key => monthlyData[key].amount);

  return {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [{
      label: 'Monthly Donations (RON)',
      data: amounts.length > 0 ? amounts : [0],
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      fill: true,
      tension: 0.4
    }]
  };
};

const prepareCategoryDistributionData = () => {
  if (!donorStats?.recentDonations || donorStats.recentDonations.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        data: [1],
        backgroundColor: [theme.palette.grey[400]]
      }]
    };
  }

  // Group donations by charity category
  const categoryData = {};
  donorStats.recentDonations.forEach(donation => {
    // Access the nested charity.category property
    const category = donation.charity?.category || 'Other';
    
    if (!categoryData[category]) {
      categoryData[category] = 0;
    }
    categoryData[category] += parseFloat(donation.amount || 0);
  });

  const labels = Object.keys(categoryData);
  const amounts = Object.values(categoryData);
  
  if (labels.length === 0) {
    return {
      labels: ['No Donations Yet'],
      datasets: [{
        data: [1],
        backgroundColor: [theme.palette.grey[400]]
      }]
    };
  }

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main
  ];

  return {
    labels: labels.map(label => 
      // Format category names to be more readable
      label.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    ),
    datasets: [{
      data: amounts,
      backgroundColor: labels.map((_, index) => colors[index % colors.length]),
      borderWidth: 2,
      borderColor: theme.palette.background.paper
    }]
  };
};



// Alternative version if you want to add more detailed metrics
const prepareImpactMetricsData = () => {
  if (!donorStats?.recentDonations || donorStats.recentDonations.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Your Impact',
        data: [1],
        backgroundColor: [alpha(theme.palette.grey[400], 0.8)],
        borderColor: [theme.palette.grey[400]],
        borderWidth: 2
      }]
    };
  }

  const donations = donorStats.recentDonations;
  
  // Calculate metrics
  const totalDonations = donations.length;
  const uniqueCharities = new Set(donations.map(d => d.charityId).filter(Boolean)).size;
  const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;
  const largestDonation = donations.length > 0 ? Math.max(...donations.map(d => parseFloat(d.amount || 0))) : 0;

  return {
    labels: [
      'Total Donations', 
      'Charities Helped', 
      'Avg Donation (RON)', 
      'Total Amount (RON)', 
      'Largest Donation (RON)'
    ],
    datasets: [{
      label: 'Your Impact Metrics',
      data: [
        totalDonations, 
        uniqueCharities, 
        Math.round(avgDonation),
        Math.round(totalAmount),
        Math.round(largestDonation)
      ],
      backgroundColor: [
        alpha(theme.palette.success.main, 0.8),
        alpha(theme.palette.info.main, 0.8),
        alpha(theme.palette.warning.main, 0.8),
        alpha(theme.palette.primary.main, 0.8),
        alpha(theme.palette.secondary.main, 0.8)
      ],
      borderColor: [
        theme.palette.success.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.primary.main,
        theme.palette.secondary.main
      ],
      borderWidth: 2
    }]
  };
};

  const donationTrendsData = prepareDonationTrendsData();
  const categoryDistributionData = prepareCategoryDistributionData();
  const impactMetricsData = prepareImpactMetricsData();

  if (!user || user.role !== 'donor') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          This page is only accessible to donors. Please log in with a donor account.
        </Alert>
      </Container>
    );
  }

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  let date;
  
  // Handle Unix timestamp (blockchain) - seconds to milliseconds
  if (typeof timestamp === 'number' || (typeof timestamp === 'string' && /^\d{10}$/.test(timestamp))) {
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    date = new Date(timestampNum * 1000);
  }
  // Handle database timestamp string - assume UTC and convert to Romanian time
  else if (typeof timestamp === 'string') {
    // Add Z if not present to indicate UTC
    const utcTimestamp = timestamp.includes('Z') || timestamp.includes('+') ? timestamp : timestamp + 'Z';
    date = new Date(utcTimestamp);
  }
  // Handle Date object
  else {
    date = new Date(timestamp);
  }
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Return in Romanian timezone with Romanian locale
  return date.toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper functions to calculate stats from recentDonations
const calculateDonationStats = (recentDonations) => {
  if (!recentDonations || recentDonations.length === 0) {
    return {
      total: 0,
      uniqueCharities: 0,
      averageDonation: 0,
      totalAmount: 0
    };
  }

  // Get unique charities
  const uniqueCharityIds = new Set(
    recentDonations.map(donation => donation.charityId).filter(Boolean)
  );

  // Calculate total amount
  const totalAmount = recentDonations.reduce((sum, donation) => {
    return sum + parseFloat(donation.amount || 0);
  }, 0);

  // Calculate average
  const averageDonation = recentDonations.length > 0 ? totalAmount / recentDonations.length : 0;

  return {
    total: recentDonations.length,
    uniqueCharities: uniqueCharityIds.size,
    averageDonation: averageDonation,
    totalAmount: totalAmount
  };
};

  return (
    <>
    <Navbar />
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              My Giving Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your charitable impact and transparency metrics
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        {/* User Info Card */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            >
              {user.name?.charAt(0) || 'D'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Welcome back, {user.name}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Keep making a difference with transparent giving
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<Favorite />}
                  label="Verified Donor"
                  color="primary"
                  size="small"
                />
                <Chip
                  icon={<CalendarToday />}
                  label={`Member since ${new Date(user.createdAt || Date.now()).getFullYear()}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Main Stats Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <DonorStatsCard 
            donorId={user.id} 
            showTitle={true}
            compact={false}
          />
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Analytics />} label="Analytics" iconPosition="start" />
          <Tab icon={<Timeline />} label="Trends" iconPosition="start" />
          <Tab icon={<TrendingUp />} label="Impact" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Analytics Tab */}
      <TabPanel value={activeTab} index={0}>
  <Grid container spacing={3}>
    {/* Donation Trends Chart - Full width on mobile, larger on desktop */}
    <Grid item xs={12} lg={8}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Donation Trends (Last 6 Months)
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <Line
              data={donationTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatCurrency(value)
                    }
                  }
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
    
    {/* Category Distribution - Full width on mobile, smaller on desktop */}
    <Grid item xs={12} lg={4}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Giving by Category
          </Typography>
          <Box sx={{ 
            height: 400, 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <Doughnut
              data={categoryDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</TabPanel>
      {/* Trends Tab */}
<TabPanel value={activeTab} index={1}>
  <Grid container spacing={3}>
    {/* Donation Frequency Analysis - Full width on mobile, half on desktop */}
    <Grid item xs={12} lg={6}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Donation Frequency Analysis
          </Typography>
          {donorStats?.recentDonations && donorStats.recentDonations.length > 0 ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Based on your {donorStats.donations?.total || donorStats.recentDonations.length} donations
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Average per month:</Typography>
                  <Typography variant="subtitle2">
                    {donorStats.donations?.total ? 
                      Math.round(donorStats.donations.total / 6) : 
                      Math.round(donorStats.recentDonations.length / 3)
                    } donations
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Most active category:</Typography>
                  <Typography variant="subtitle2">
                    {getMostActiveCategory(donorStats.recentDonations)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Largest donation:</Typography>
                  <Typography variant="subtitle2" color="primary">
                    {donorStats.recentDonations.length > 0 ? 
                      formatCurrency(Math.max(...donorStats.recentDonations.map(d => parseFloat(d.amount || 0)))) :
                      formatCurrency(0)
                    }
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Last donation:</Typography>
                  <Typography variant="subtitle2">
                    {formatLastDonation(donorStats.recentDonations[0]?.timestamp)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Alert severity="info">
              Start donating to see your giving patterns and trends!
            </Alert>
          )}
        </CardContent>
      </Card>
    </Grid>

    {/* Giving Consistency - Full width on mobile, half on desktop */}
    <Grid item xs={12} lg={6}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Giving Consistency
          </Typography>
          {donorStats?.recentDonations ? (
            <Box>
              {(() => {
                const stats = calculateDonationStats(donorStats.recentDonations);
                
                return (
                  <>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        {stats.uniqueCharities}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Different organizations supported
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Donation Consistency Score
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((stats.total / 10) * 100, 100)} 
                          sx={{ height: 8, borderRadius: 4 }}
                          color="success"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(Math.min((stats.total / 10) * 100, 100))}% - {
                            stats.total >= 10 ? 'Excellent!' :
                            stats.total >= 5 ? 'Good progress' :
                            stats.total >= 1 ? 'Getting started' :
                            'Make your first donation!'
                          }
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Average Donation Size
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(stats.averageDonation)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Total Contributed
                        </Typography>
                        <Typography variant="h6" color="secondary">
                          {formatCurrency(stats.totalAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Charity Diversity
                        </Typography>
                        <Typography variant="body1">
                          {stats.uniqueCharities > 0 ? (
                            `Supporting ${stats.uniqueCharities} ${stats.uniqueCharities === 1 ? 'charity' : 'charities'}`
                          ) : (
                            'No charities supported yet'
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </>
                );
              })()}
            </Box>
          ) : (
            <Alert severity="info">
              No donation data available yet.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Grid>

    {/* Your Giving Journey - Full width always */}
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Giving Journey
          </Typography>
          {donorStats?.recentDonations && donorStats.recentDonations.length > 0 ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Timeline of your charitable contributions
              </Typography>
              
              {/* Responsive layout for donation items */}
              <Grid container spacing={2}>
                {donorStats.recentDonations.slice(0, 6).map((donation, index) => (
                  <Grid item xs={12} md={6} lg={4} key={donation.id || index}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2, 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2,
                        height: '100%',
                        minHeight: 120
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main, 
                          width: 32, 
                          height: 32, 
                          mr: 2,
                          fontSize: '0.8rem',
                          flexShrink: 0
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
                          {donation.charity?.name || 'Unknown Charity'}
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {formatCurrency(donation.amount)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {donation.timestamp ? 
                            new Date(donation.timestamp).toLocaleDateString('ro-RO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) :
                            'Date unavailable'
                          }
                        </Typography>
                        {donation.transactionId && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            ID: {donation.transactionId.substring(0, 8)}...
                          </Typography>
                        )}
                        
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                          {donation.transactionId && (
                            <Chip 
                              label="✓ Verified" 
                              size="small" 
                              color="success" 
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                          <Chip 
                            label={
                              donation.charity?.category ? 
                                donation.charity.category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) :
                                'General'
                            } 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              {/* Show total count if there are more donations */}
              {donorStats.recentDonations.length > 6 && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing 6 of {donorStats.recentDonations.length} donations
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ ml: 2 }}
                    onClick={() => {/* Add logic to show all donations */}}
                  >
                    View All
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info">
              Your giving journey will appear here as you make donations.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</TabPanel>

      {/* Impact Tab */}
      <TabPanel value={activeTab} index={2}>
  <Grid container spacing={3}>
    {/* Impact Metrics Chart - Full width on mobile, half on large screens */}
    <Grid item xs={12} lg={6}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Impact Metrics
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 400, alignItems: 'center' }}>
              <LinearProgress sx={{ width: '80%' }} />
            </Box>
          ) : donorStats?.recentDonations && donorStats.recentDonations.length > 0 ? (
            <Box sx={{ height: 400, width: '100%' }}>
              <Bar
                data={impactMetricsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.dataset.label || '';
                          const value = context.parsed.y;
                          
                          if (context.label.includes('RON')) {
                            return `${label}: ${value} RON`;
                          } else if (context.label.includes('Donations')) {
                            return `${label}: ${value} donation${value !== 1 ? 's' : ''}`;
                          } else if (context.label.includes('Charities')) {
                            return `${label}: ${value} charit${value !== 1 ? 'ies' : 'y'}`;
                          }
                          return `${label}: ${value}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        callback: function(value) {
                          return Number.isInteger(value) ? value : '';
                        }
                      }
                    }
                  },
                  animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                  }
                }}
              />
            </Box>
          ) : (
            <Box sx={{ 
              height: 400, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'grey.300'
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Impact Data Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Your donation metrics will appear here once you make your first contribution
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>

    {/* Real Impact Stories - Full width on mobile, half on large screens */}
    <Grid item xs={12} lg={6}>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Your Impact Stories
          </Typography>
          {donorStats?.recentDonations && donorStats.recentDonations.length > 0 ? (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 300 }}>
                <Stack spacing={3}>
                  {donorStats.recentDonations.slice(-5).reverse().map((donation, index) => {
                    // Calculate a mock progress based on donation amount
                    const progress = Math.min(((parseFloat(donation.amount) / 1000) * 100), 100);
                    const isCompleted = progress >= 90;
                    
                    // Get category from nested charity object
                    const category = donation.charity?.category || 'OTHER';
                    
                    return (
                      <Box key={donation.id || index}>
                        <Typography variant="subtitle2" gutterBottom>
                          {category === 'EDUCATION' ? '🎓' : 
                           category === 'HEALTHCARE' ? '🏥' :
                           category === 'ENVIRONMENT' ? '🌱' :
                           category === 'HUMANITARIAN' ? '💧' : 
                           category === 'ANIMAL_WELFARE' ? '🐾' :
                           category === 'DISASTER_RELIEF' ? '🆘' : '❤️'} {donation.charity?.name || 'Charity Project'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your {formatCurrency(donation.amount)} donation is making a difference.
                          {donation.project?.title && ` Supporting: ${donation.project.title}`}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color={isCompleted ? "success" : progress > 50 ? "primary" : "warning"}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(progress)}%
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip 
                            label={donation.timestamp ? 
                              new Date(donation.timestamp).toLocaleDateString('ro-RO') : 
                              'Date unavailable'
                            } 
                            size="small" 
                            variant="outlined" 
                          />
                          {donation.transactionId && (
                            <Chip label="✓ Verified" size="small" color="success" />
                          )}
                          <Chip 
                            label={category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Stack>
                        {index < 4 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              {/* Overall Impact Summary - Fixed at bottom */}
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  🌟 Total Impact Summary
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      • Total: {formatCurrency(
                        donorStats.recentDonations.reduce((sum, donation) => 
                          sum + parseFloat(donation.amount || 0), 0
                        )
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      • Charities: {
                        new Set(donorStats.recentDonations.map(d => d.charityId).filter(Boolean)).size
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      • Donations: {donorStats.recentDonations.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      • Categories: {
                        new Set(donorStats.recentDonations.map(d => d.charity?.category).filter(Boolean)).size
                      }
                    </Typography>
                  </Grid>
                  {donorStats.recentDonations.some(d => d.transactionId) && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="info.main">
                        • All donations blockchain verified ✓
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          ) : (
            <Alert severity="info">
              Start donating to see your impact stories here!
            </Alert>
          )}
        </CardContent>
      </Card>
    </Grid>

    {/* Additional Impact Visualization - Full width */}
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Impact Timeline
          </Typography>
          {donorStats?.recentDonations && donorStats.recentDonations.length > 0 ? (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 2, minWidth: 'max-content', py: 2 }}>
                {donorStats.recentDonations.map((donation, index) => (
                  <Box
                    key={donation.id || index}
                    sx={{
                      minWidth: 200,
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      textAlign: 'center',
                      position: 'relative',
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      {formatCurrency(donation.amount)}
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                      {donation.charity?.name || 'Unknown Charity'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {donation.timestamp ? 
                        new Date(donation.timestamp).toLocaleDateString('ro-RO', {
                          month: 'short',
                          day: 'numeric'
                        }) : 
                        'Date N/A'
                      }
                    </Typography>
                    <Chip
                      label={donation.charity?.category?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'General'}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 1, fontSize: '0.7rem' }}
                    />
                    
                    {/* Connection line */}
                    {index < donorStats.recentDonations.length - 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          right: -16,
                          width: 32,
                          height: 2,
                          bgcolor: 'primary.main',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            right: -6,
                            top: -3,
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid',
                            borderLeftColor: 'primary.main',
                            borderTop: '4px solid transparent',
                            borderBottom: '4px solid transparent'
                          }
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Alert severity="info">
              Your donation timeline will appear here as you make contributions.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</TabPanel>
    </Container>
    </>
  );
};

export default DonorStatsPage;