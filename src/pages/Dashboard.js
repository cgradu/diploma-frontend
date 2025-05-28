import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../redux/slices/authSlice';
import { getManagerCharity } from '../redux/slices/charitySlice';
import { getProjectsByCharityId } from '../redux/slices/projectSlice';
import { getCharityDonationStats } from '../redux/slices/donationSlice';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  VolunteerActivism,
  People,
  Assignment,
  Add,
  Person,
  Visibility,
  CheckCircle,
  Business,
  AccountBalance,
  Timeline,
  Launch,
  Edit,
  Favorite
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Get user from auth state
  const { user, isLoading: isLoadingUser } = useSelector((state) => state.auth);
  
  // Get charity data from charities state
  const { managerCharity, isLoading: isLoadingCharity } = useSelector((state) => state.charities || {});
  
  // Get projects from projects state
  const { projects, isLoading: isLoadingProjects } = useSelector((state) => state.projects || { projects: [] });
  
  // Get donation statistics from donation state
  const { charityStats, isLoading: isLoadingStats } = useSelector((state) => state.donation || { charityStats: null });
  
  // Local state for loading states
  const [isDataFetched, setIsDataFetched] = useState(false);
  
  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Only fetch profile if we don't have detailed user data
    if (user && !user.name) {
      dispatch(getProfile());
    }
  }, [user, navigate, dispatch]);
  
  // Fetch charity-specific data when user is a charity manager
  useEffect(() => {
    const fetchCharityData = async () => {
      if (user && (user.role === 'charity' || user.role === 'admin') && !isDataFetched) {
        setIsDataFetched(true);
        
        try {
          // First get the managed charity
          const charityAction = await dispatch(getManagerCharity());
          
          if (getManagerCharity.fulfilled.match(charityAction) && charityAction.payload) {
            const charityId = charityAction.payload.id;
            
            // Now fetch projects and donation stats in parallel
            await Promise.all([
              dispatch(getProjectsByCharityId({ charityId })),
              dispatch(getCharityDonationStats(charityId))
            ]);
          }
        } catch (error) {
          console.error('Error fetching charity data:', error);
        }
      }
    };
    
    fetchCharityData();
  }, [user, dispatch, isDataFetched]);
  
  // Function to check if charity profile is complete
  const isProfileComplete = () => {
    if (!user) return false;
    
    // For charity users
    if (user.role === 'charity') {
      return Boolean(
        user.name && 
        user.email &&
        user.charityName &&
        user.registrationNumber && 
        user.missionStatement && 
        user.organizationType
      );
    }
    
    // For donor users
    if (user.role === 'donor') {
      return Boolean(
        user.name && 
        user.email &&
        user.phone &&
        user.address
      );
    }
    
    return false;
  };
  
  // Calculate charity stats
  const getCharityStats = () => {
    // Default values
    const stats = {
      totalReceived: 0,
      donorCount: 0,
      activeProjectsCount: 0
    };
    
    // Use donation stats if available
    if (charityStats) {
      stats.totalReceived = charityStats.totalAmount || 0;
      stats.donorCount = charityStats.uniqueDonors || 0;
    }
    
    // Count active projects
    if (projects && Array.isArray(projects)) {
      stats.activeProjectsCount = projects.filter(project => project.status === 'ACTIVE').length;
    }
    
    return stats;
  };
  
  // Get formatted charity stats
  const { totalReceived, donorCount, activeProjectsCount } = getCharityStats();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Check if any data is still loading
  const isLoading = isLoadingUser || isLoadingCharity || isLoadingProjects || isLoadingStats;
  
  // Show loading state during initial load or data fetching
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              Loading dashboard data...
            </Typography>
          </Stack>
        </Box>
        <Footer />
      </Box>
    );
  }

  // Stats card component
  const StatCard = ({ icon, title, value, subtitle, color = 'primary', action }) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette[color].main
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar 
            sx={{ 
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
      {action && (
        <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
          {action}
        </CardActions>
      )}
    </Card>
  );

  // Donor Dashboard
  const DonorDashboard = () => (
    <Stack spacing={4}>
      {/* Welcome Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
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
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Ready to make a transparent impact today?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip
                icon={<Favorite />}
                label="Donor"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              />
              <Chip
                icon={<CheckCircle />}
                label={user?.email}
                variant="outlined"
              />
            </Stack>
          </Box>
          <Button
            component={Link}
            to="/charities"
            variant="contained"
            size="large"
            startIcon={<VolunteerActivism />}
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
            Start Donating
          </Button>
        </Stack>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<VolunteerActivism />}
            title="Total Donations"
            value="$0.00"
            subtitle="Start your giving journey"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<Business />}
            title="Charities Supported"
            value="0"
            subtitle="Discover amazing causes"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<Timeline />}
            title="Active Projects"
            value="0"
            subtitle="Follow your impact"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Profile Completion */}
      {!isProfileComplete() && (
        <Alert
          severity="warning"
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          action={
            <Button
              component={Link}
              to="/profile"
              variant="contained"
              size="small"
              startIcon={<Edit />}
              sx={{ borderRadius: 2 }}
            >
              Complete Profile
            </Button>
          }
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body2">
            Add your contact information to get personalized charity recommendations and tax receipts.
          </Typography>
        </Alert>
      )}

      {/* Recommended Charities */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Recommended for You
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            🌟 Discover verified charities making real impact
          </Typography>
          <Button
            component={Link}
            to="/charities"
            variant="outlined"
            size="large"
            startIcon={<Launch />}
            sx={{ borderRadius: 2 }}
          >
            Explore Charities
          </Button>
        </Box>
      </Paper>
    </Stack>
  );

  // Charity Dashboard
  const CharityDashboard = () => (
    <Stack spacing={4}>
      {/* Welcome Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            {managerCharity?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {managerCharity?.name || user?.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Managing your organization's transparency
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<Business />}
                label="Charity Manager"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              />
              {managerCharity?.registrationId && (
                <Chip
                  label={`ID: ${managerCharity.registrationId}`}
                  variant="outlined"
                />
              )}
              {managerCharity?.category && (
                <Chip
                  label={managerCharity.category}
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
          {managerCharity && (
            <Button
              component={Link}
              to={`/charities/${managerCharity.id}`}
              variant="outlined"
              size="large"
              startIcon={<Visibility />}
              sx={{
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              View Public Profile
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<AccountBalance />}
            title="Total Received"
            value={formatCurrency(totalReceived)}
            subtitle="From generous donors"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<People />}
            title="Active Donors"
            value={donorCount.toString()}
            subtitle="Supporting your cause"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<Assignment />}
            title="Active Projects"
            value={activeProjectsCount.toString()}
            subtitle="Making an impact"
            color="success"
            action={
              managerCharity && (
                <Button
                  component={Link}
                  to={`/charities/${managerCharity.id}/projects`}
                  size="small"
                  endIcon={<Launch />}
                  sx={{ textTransform: 'none' }}
                >
                  View All Projects
                </Button>
              )
            }
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {managerCharity && (
            <Grid item xs={12} sm={6} md={4}>
              <Button
                component={Link}
                to={`/dashboard/projects/create?charityId=${managerCharity.id}`}
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Add />}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  bgcolor: theme.palette.success.main,
                  '&:hover': {
                    bgcolor: theme.palette.success.dark
                  }
                }}
              >
                Create New Project
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              component={Link}
              to="/profile"
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Person />}
              sx={{
                py: 2,
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Profile Status */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Organization Profile
        </Typography>
        {isProfileComplete() ? (
          <Alert
            severity="success"
            sx={{ borderRadius: 2 }}
            icon={<CheckCircle />}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Profile Complete! 🎉
            </Typography>
            <Typography variant="body2">
              Your profile is complete and visible to donors. This helps build trust and increases donations.
            </Typography>
          </Alert>
        ) : (
          <Alert
            severity="warning"
            sx={{ borderRadius: 2 }}
            action={
              <Button
                component={Link}
                to="/profile"
                variant="contained"
                size="small"
                startIcon={<Edit />}
                sx={{ borderRadius: 2 }}
              >
                Complete Profile
              </Button>
            }
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Profile Incomplete
            </Typography>
            <Typography variant="body2">
              Add more details to increase visibility and build trust with potential donors.
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Recent Activity */}
      {managerCharity?.recentDonations && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Recent Activity
          </Typography>
          {managerCharity.recentDonations.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Donor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {managerCharity.recentDonations.map((donation) => (
                    <TableRow key={donation.id} hover>
                      <TableCell>
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {(donation.donor?.name || 'A').charAt(0)}
                          </Avatar>
                          {donation.donor?.name || 'Anonymous'}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatCurrency(donation.amount)}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        {donation.project?.title || 'General Donation'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                No recent donations yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share your profile to start receiving donations
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Stack>
  );
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <DashboardIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Dashboard
            </Typography>
          </Stack>
          <Typography variant="h6" color="text.secondary">
            {user?.role === 'donor' 
              ? 'Track your donations and discover new causes' 
              : 'Manage your organization and track your impact'
            }
          </Typography>
        </Box>

        {/* Dashboard Content */}
        {user?.role === 'donor' ? <DonorDashboard /> : <CharityDashboard />}
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Dashboard;