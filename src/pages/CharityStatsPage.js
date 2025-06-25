// src/pages/CharityStatsPage.js
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  Business,
  Analytics,
  People,
  AttachMoney,
  TrendingUp,
  AccountBalance,
  ContentCopy,
  CalendarToday,
  Download,
  Share,
  Refresh,
  Verified,
  Assignment,
  Schedule
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
import CharityStatsCard from '../components/stats/CharityStatsCard';
import { fetchCharityStats, selectCharityStats } from '../redux/slices/statsSlice';
import { getManagerCharity } from '../redux/slices/charitySlice';
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

const CharityStatsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { managerCharity, charity: charityData } = useSelector((state) => state.charities);
  const { data: charityStats, loading, error } = useSelector(selectCharityStats);
  
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.role === 'charity') {
      dispatch(getManagerCharity());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (managerCharity?.id) {
      dispatch(fetchCharityStats(managerCharity.id));
    }
  }, [dispatch, managerCharity]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (managerCharity?.id) {
      await dispatch(fetchCharityStats(managerCharity.id));
    }
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract data from charities state structure for most tabs
  const donations = charityStats?.donations || {};
  console.log(donations, 'Charity Donations Data'); // Debugging line
  const projects = charityData?.projects || [];
  const recentDonations = charityData?.recentDonations || [];
  const featuredProjects = charityData?.featuredProjects || [];
  const monthlyBreakdown = charityStats?.donations?.monthlyBreakdown || [];
console.log(monthlyBreakdown, 'Monthly Breakdown Data'); // Debugging line
  
  // Calculate project stats from charityData
  const totalProjects = projects.length || 0;
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length || 0;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length || 0;
  const totalFunded = projects.reduce((sum, p) => sum + (p.currentAmount || 0), 0);

  // Prepare chart data from real charityStats
  const prepareDonationTrendsData = () => {
    if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Monthly Donations Received',
          data: [0],
          borderColor: theme.palette.success.main,
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          fill: true,
          tension: 0.4
        }]
      };
    }

    const labels = monthlyBreakdown.map(month => month.month || 'Unknown');

    const receivedAmounts = monthlyBreakdown.map(month => month.amount || 0);
    const donationCounts = monthlyBreakdown.map(month => month.count || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Monthly Donations Amount (RON)',
          data: receivedAmounts,
          borderColor: theme.palette.success.main,
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Number of Donations',
          data: donationCounts,
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          fill: false,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const prepareDonorDemographicsData = () => {
    if (!recentDonations || recentDonations.length === 0) {
      return {
        labels: ['No Donors Yet'],
        datasets: [{
          data: [1],
          backgroundColor: [theme.palette.grey[400]]
        }]
      };
    }

    // Analyze donor distribution by donation amount ranges
    let small = 0, medium = 0, large = 0, major = 0;
    
    recentDonations.forEach(donation => {
      const amount = donation.amount || 0;
      if (amount >= 500) {
        major++; // Major Donors (500+ RON)
      } else if (amount >= 200) {
        large++; // Large Donors (200-499 RON)
      } else if (amount >= 50) {
        medium++; // Medium Donors (50-199 RON)
      } else {
        small++; // Small Donors (1-49 RON)
      }
    });

    const total = small + medium + large + major;
    if (total === 0) {
      return {
        labels: ['No Donors Yet'],
        datasets: [{
          data: [1],
          backgroundColor: [theme.palette.grey[400]]
        }]
      };
    }

    return {
      labels: ['Small Donations (1-49 RON)', 'Medium Donations (50-199 RON)', 'Large Donations (200-499 RON)', 'Major Donations (500+ RON)'],
      datasets: [{
        data: [small, medium, large, major],
        backgroundColor: [
          theme.palette.info.main,
          theme.palette.primary.main,
          theme.palette.warning.main,
          theme.palette.success.main
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper
      }]
    };
  };

  const prepareProjectFundingData = () => {
    if (!projects || projects.length === 0) {
      return {
        labels: ['No Projects'],
        datasets: [{
          label: 'Funding Progress (%)',
          data: [0],
          backgroundColor: [theme.palette.grey[400]]
        }]
      };
    }

    const projectNames = projects.map(project => project.title || project.name || 'Unnamed Project');
    const progressPercentages = projects.map(project => {
      const currentAmount = project.currentAmount || 0;
      const goal = project.goal || 1;
      const progress = Math.min((currentAmount / goal) * 100, 100);
      return progress;
    });

    return {
      labels: projectNames,
      datasets: [{
        label: 'Funding Progress (%)',
        data: progressPercentages,
        backgroundColor: progressPercentages.map(progress => 
          progress >= 80 ? alpha(theme.palette.success.main, 0.8) :
          progress >= 50 ? alpha(theme.palette.warning.main, 0.8) :
          alpha(theme.palette.error.main, 0.8)
        ),
        borderColor: progressPercentages.map(progress => 
          progress >= 80 ? theme.palette.success.main :
          progress >= 50 ? theme.palette.warning.main :
          theme.palette.error.main
        ),
        borderWidth: 2
      }]
    };
  };

  const donationTrendsData = prepareDonationTrendsData();
  const donorDemographicsData = prepareDonorDemographicsData();
  const projectFundingData = prepareProjectFundingData();

  // Prepare recent donors data from charityData.recentDonations
  const recentDonors = recentDonations.slice(0, 5).map(donation => ({
    name: donation.donorName || donation.donor?.name || 'Anonymous',
    amount: donation.amount || 0,
    date: donation.timestamp || donation.createdAt || donation.date,
    verified: donation.verified || donation.isVerified || true,
    message: donation.message || '',
    project: donation.project?.title || donation.projectName || 'General Fund'
  }));

  const getVerificationIcon = (verified) => {
    return verified ? (
      <Chip
        icon={<Verified />}
        label="Verified"
        size="small"
        color="success"
        variant="outlined"
      />
    ) : (
      <Chip
        icon={<Schedule />}
        label="Pending"
        size="small"
        color="warning"
        variant="outlined"
      />
    );
  };

  if (!user || user.role !== 'charity') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          This page is only accessible to charity managers. Please log in with a charity account.
        </Alert>
      </Container>
    );
  }

  if (!managerCharity) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Loading your charity information...
        </Alert>
      </Container>
    );
  }

  return (
    <>
    <Navbar />
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Charity Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your organization's impact and donor engagement
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

        {/* Charity Info Card */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.success.main,
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            >
              {managerCharity.name?.charAt(0) || 'C'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {managerCharity.name} 🏢
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {managerCharity.description || 'Making a difference in the community'}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<Business />}
                  label={managerCharity.category || 'General'}
                  color="success"
                  size="small"
                />
                <Chip
                  icon={<Verified />}
                  label={managerCharity.verified ? 'Verified' : 'Pending Verification'}
                  color={managerCharity.verified ? 'success' : 'warning'}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<CalendarToday />}
                  label={`Since ${managerCharity.foundedYear || new Date(managerCharity.createdAt).getFullYear()}`}
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
          <CharityStatsCard 
            charityId={managerCharity.id} 
            showTitle={true}
            compact={false}
            showActions={true}
          />
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Analytics />} label="Analytics" iconPosition="start" />
          <Tab icon={<People />} label="Donors" iconPosition="start" />
          <Tab icon={<Assignment />} label="Projects" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Analytics Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Donation Trends Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Donation Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={donationTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        }
                      },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Month'
                          }
                        },
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          title: {
                            display: true,
                            text: 'Amount (RON)'
                          },
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => formatCurrency(value)
                          }
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          title: {
                            display: true,
                            text: 'Number of Donations'
                          },
                          beginAtZero: true,
                          grid: {
                            drawOnChartArea: false,
                          },
                          ticks: {
                            callback: (value) => Math.round(value)
                          }
                        }
                      },
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Donor Demographics */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Donor Demographics
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Doughnut
                    data={donorDemographicsData}
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

          {/* Project Funding Progress */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Funding Progress
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={projectFundingData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: (value) => `${value}%`
                          }
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

      {/* Donors Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {/* Recent Donors Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Donors
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Donor</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Verification</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentDonors.map((donor, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {donor.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2">
                                {donor.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" color="success.main">
                              {formatCurrency(donor.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={donor.project}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(donor.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Completed"
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell>
                            {getVerificationIcon(donor.verified)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {recentDonors.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Alert severity="info">
                      No recent donors found. Your supporters will appear here as you receive donations.
                    </Alert>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced Donor Insights */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Donor Insights
                </Typography>
                {recentDonations.length > 0 ? (
                  <Stack spacing={2}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {recentDonations.length}
                      </Typography>
                      <Typography variant="body2">Recent Supporters</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Average donation:</Typography>
                      <Typography variant="subtitle2" color="success.main">
                        {formatCurrency(
                          recentDonations.reduce((sum, d) => sum + (d.amount || 0), 0) / recentDonations.length
                        )}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Total from recent:</Typography>
                      <Typography variant="subtitle2" color="success.main">
                        {formatCurrency(recentDonations.reduce((sum, d) => sum + (d.amount || 0), 0))}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">With messages:</Typography>
                      <Typography variant="subtitle2">
                        {recentDonations.filter(d => d.message).length} donors
                      </Typography>
                    </Box>
                    
                    {recentDonations[0] && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Last donation:</Typography>
                        <Typography variant="subtitle2">
                          {formatTimestamp(recentDonations[0].timestamp || recentDonations[0].createdAt)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Alert severity="info">
                    Donor insights will appear as you receive donations.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Donation Messages */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Messages
                </Typography>
                {recentDonations.filter(d => d.message).length > 0 ? (
                  <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {recentDonations
                      .filter(d => d.message)
                      .slice(0, 5)
                      .map((donation, index) => (
                        <Paper
                          key={index}
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(theme.palette.secondary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                            borderRadius: 2
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {donation.donorName || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatCurrency(donation.amount)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                            "{donation.message}"
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={donation.project?.title || donation.projectName || 'General Fund'}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(donation.timestamp || donation.createdAt)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                  </Stack>
                ) : (
                  <Alert severity="info">
                    Donor messages will appear here when supporters leave comments with their donations.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Projects Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {/* Project Overview */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Portfolio
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <LinearProgress sx={{ width: '100%' }} />
                  </Box>
                ) : projects.length > 0 ? (
                  <Grid container spacing={3}>
                    {projects.map((project, index) => {
                      const progress = project.goal ? Math.min((project.currentAmount / project.goal) * 100, 100) : 0;
                      
                      return (
                        <Grid item xs={12} md={6} key={project.id || index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                {project.title || project.name || 'Unnamed Project'}
                              </Typography>
                              
                              {project.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {project.description.substring(0, 100)}
                                  {project.description.length > 100 ? '...' : ''}
                                </Typography>
                              )}
                              
                              <Stack spacing={2}>
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Progress
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {progress.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={progress}
                                    sx={{ height: 8, borderRadius: 4 }}
                                    color={progress >= 80 ? 'success' : progress >= 50 ? 'warning' : 'error'}
                                  />
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Raised
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {formatCurrency(project.currentAmount || 0)}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Goal
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {formatCurrency(project.goal || 0)}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Donors
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {project.donationsCount || 0}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip 
                                    label={project.status || 'ACTIVE'}
                                    size="small"
                                    color={
                                      project.status === 'COMPLETED' ? 'success' : 
                                      project.status === 'ACTIVE' ? 'primary' : 
                                      project.status === 'PAUSED' ? 'warning' : 'default'
                                    }
                                  />
                                  
                                  {project.endDate && (
                                    <Typography variant="caption" color="text.secondary">
                                      Ends: {formatDate(project.endDate)}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No projects found. Projects will appear here when you create them.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Project Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {totalProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {activeProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {formatCurrency(totalFunded)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Funded
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
    </>
  );
};

export default CharityStatsPage;