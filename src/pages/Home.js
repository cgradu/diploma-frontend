import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Visibility,
  TrackChanges,
  VerifiedUser,
  Favorite,
  TrendingUp,
  Security,
  AccountBalance,
  Groups,
  ArrowForward,
  PlayArrow,
  Analytics,
  MonetizationOn,
  Timeline,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchHomepageStats, selectHomepageStats } from '../redux/slices/statsSlice';

const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: statsData, loading: statsLoading } = useSelector(selectHomepageStats);
  
  const [latestDonation, setLatestDonation] = useState(null);

  useEffect(() => {
    if (statsData) {
      console.log('📊 Complete Stats Data Structure:', statsData);
      console.log('📊 Totals:', statsData.totals);
      console.log('📊 Blockchain:', statsData.blockchain);
      console.log('📊 Recent Donations:', statsData.recent);
      console.log('📊 Top Charities:', statsData.topCharities);
    }
  }, [statsData]);

  useEffect(() => {
    if (!statsData || (statsData.lastUpdated && 
        (new Date() - new Date(statsData.lastUpdated)) > 5 * 60 * 1000)) {
      console.log('🔄 Homepage: Fetching fresh stats via Redux...');
      dispatch(fetchHomepageStats());
    }
  }, [dispatch, statsData]);

  useEffect(() => {
    if (statsData?.recent && statsData.recent.length > 0) {
      setLatestDonation(statsData.recent[statsData.recent.length - 1]);
    }
  }, [statsData]);

  const features = [
    {
      icon: <Visibility sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Complete Transparency",
      description: "Every donation is tracked on our blockchain, providing unprecedented visibility into how your funds create real impact.",
      highlight: "100% Traceable"
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: "Verified Impact",
      description: "All charities are thoroughly vetted and impact metrics are independently verified for maximum trust.",
      highlight: "Verified Results"
    }
  ];

  const formatCurrency = (amount) => {
    if (!amount) return 'RON 0';
    if (amount >= 1000000) {
      return `RON ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `RON ${(amount / 1000).toFixed(1)}K`;
    }
    return `RON ${amount.toLocaleString()}`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return `${num}+`;
  };

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

  const formatTimestampFull = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    let date;
    
    if (typeof timestamp === 'number' || (typeof timestamp === 'string' && /^\d{10}$/.test(timestamp))) {
      const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
      date = new Date(timestampNum * 1000);
    } else if (typeof timestamp === 'string') {
      const utcTimestamp = timestamp.includes('Z') || timestamp.includes('+') ? timestamp : timestamp + 'Z';
      date = new Date(utcTimestamp);
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Full Romanian format with seconds
    return date.toLocaleString('ro-RO', {
      timeZone: 'Europe/Bucharest',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const platformStats = [
    { 
      label: "Verified Charities", 
      value: statsLoading ? '...' : formatNumber(statsData?.totals?.totalCharities || 0), 
      icon: <AccountBalance />,
      subtext: "All have blockchain verification"
    },
    { 
      label: "Total Donated", 
      value: statsLoading ? '...' : formatCurrency(statsData?.totals?.totalAmount || 0), 
      icon: <TrendingUp />,
      subtext: `Avg: ${formatCurrency(statsData?.totals?.averageDonation || 0)}`
    },
    { 
      label: "Active Donors", 
      value: statsLoading ? '...' : formatNumber(statsData?.totals?.totalDonors || 0), 
      icon: <Groups />,
      subtext: `${statsData?.totals?.totalDonations || 0} total donations`
    },
    { 
      label: "Blockchain Verified", 
      value: statsLoading ? '...' : `${statsData?.blockchain?.verificationRate || 0}%`, 
      icon: <Security />,
      subtext: `${statsData?.blockchain?.verifiedCount || 0} transactions`
    }
  ];

  const blockchainStats = [
    {
      label: "Verified Transactions",
      value: statsData?.blockchain?.verifiedCount || 0,
      icon: <CheckCircle sx={{ color: theme.palette.success.main }} />,
      color: 'success'
    },
    {
      label: "Pending Verification", 
      value: statsData?.blockchain?.pendingCount || 0,
      icon: <Schedule sx={{ color: theme.palette.warning.main }} />,
      color: 'warning'
    },
    {
      label: "Verification Rate",
      value: `${statsData?.blockchain?.verificationRate || 0}%`,
      icon: <Analytics sx={{ color: theme.palette.info.main }} />,
      color: 'info'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: '#f8f9fa',
          color: theme.palette.text.primary,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center" sx={{ py: { xs: 8, md: 12 } }}>
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                <Box>
                  <Chip 
                    label="🌟 Blockchain-Powered Transparency" 
                    sx={{ 
                      mb: 2, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 'bold'
                    }} 
                  />
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      lineHeight: 1.1,
                      mb: 3
                    }}
                  >
                    See Exactly Where Your{' '}
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block'
                      }}
                    >
                      Donation Goes
                    </Box>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.9,
                      maxWidth: '600px',
                      lineHeight: 1.6,
                      fontWeight: 400
                    }}
                  >
                    Join thousands of donors using blockchain technology to ensure their charitable contributions create verified, measurable impact in communities worldwide.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[8]
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Start Donating
                  </Button>
                  <Button
                    component={Link}
                    to="/charities"
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        color: theme.palette.primary.dark,
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Explore Charities
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '60%',
                    height: '60%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                  }
                }}
              >
                <Paper
                  elevation={20}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: '#ffffff',
                    border: `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Favorite sx={{ color: theme.palette.secondary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                        Real-Time Impact
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: theme.palette.divider }} />
                    
                    {/* Latest Donation */}
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                        Latest Donation
                      </Typography>
                      {latestDonation ? (
                        <>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            {formatCurrency(latestDonation.amount)} → {latestDonation.charity?.name || 'General Fund'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {formatTimestampFull(latestDonation.timestamp || latestDonation.createdAt)}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            {statsLoading ? 'Loading...' : 'No recent donations'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {statsLoading ? 'Loading real-time data' : 'Check back soon for updates'}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Platform Metrics */}
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                        Platform Metrics
                      </Typography>
                      <Stack direction="row" spacing={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            {formatCurrency(statsData?.totals?.averageDonation || 0)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Avg Donation
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                            {statsData?.blockchain?.verificationRate || 0}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Verified
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {platformStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mb: 2,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  {stat.icon}
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {statsLoading ? <CircularProgress size={24} /> : stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.label}
                </Typography>
                {stat.subtext && (
                  <Typography variant="caption" color="text.secondary">
                    {stat.subtext}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Blockchain Statistics Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Blockchain Transparency
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real-time verification ensuring every donation is tracked and transparent
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Blockchain Stats */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {blockchainStats.map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      {stat.icon}
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Recent Donations */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Recent Donations
                </Typography>
                <List sx={{ p: 0 }}>
                  {statsData?.recent?.slice(-5).reverse().map((donation, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.success.main,
                        fontSize: '0.75rem'
                      }}
                    >
                      ✓
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={formatCurrency(donation.amount)}
                    secondary={`${donation.charity?.name || 'Anonymous'} • ${formatTimestamp(donation.timestamp || donation.createdAt)}`}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </ListItem>
              )) || (
                    <ListItem>
                      <ListItemText 
                        primary="No recent donations"
                        secondary="Check back soon for updates"
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              Why Choose Charitrace?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Experience the future of charitable giving with unprecedented transparency and verified impact
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12],
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                      <Chip
                        label={feature.highlight}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 2, fontWeight: 'bold' }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Ready to Make a Difference?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}
          >
            Join our community of transparent donors and start creating verified impact today
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontWeight: 'bold',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              Start Your Journey
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontWeight: 'bold'
              }}
            >
              Already Have Account?
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};


export default Home;