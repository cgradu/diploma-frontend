// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Alert,
  Snackbar,
  Fab,
  Badge,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Favorite as CharityIcon,
  Assignment as ProjectIcon,
  Payment as DonationIcon,
  Security as BlockchainIcon,
  Analytics as AnalyticsIcon,
  GetApp as ExportIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Import admin action creators
import {
  getDashboardStats,
  reset
} from '../redux/slices/adminSlice';

// Import admin components
import DashboardOverview from '../components/admin/DashboardOverview';
import UserManagement from '../components/admin/UserManagement';
import CharityManagement from '../components/admin/CharityManagement';
import ProjectManagement from '../components/admin/ProjectManagement';
import DonationManagement from '../components/admin/DonationManagement';
import BlockchainManagement from '../components/admin/BlockchainManagement';
import Navbar from '../components/layout/Navbar';

// Temporary placeholders for components we haven't created yet
const AnalyticsPanel = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>Analytics Dashboard</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">Donation Trends</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Advanced analytics and reporting features coming soon...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">Platform Insights</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              User engagement and platform performance metrics...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

const ExportPanel = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>Data Export</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">User Data</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Export user information and statistics
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="CSV" size="small" />
              <Chip label="Excel" size="small" />
              <Chip label="PDF" size="small" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">Donation Reports</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Financial reports and transaction data
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="CSV" size="small" />
              <Chip label="Excel" size="small" />
              <Chip label="PDF" size="small" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">Blockchain Data</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Verification and transparency reports
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="JSON" size="small" />
              <Chip label="CSV" size="small" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useSelector((state) => state.auth);
  const { 
    dashboardStats, 
    isLoading, 
    isError, 
    isSuccess, 
    message 
  } = useSelector((state) => state.admin);

  const [currentTab, setCurrentTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      // Redirect to unauthorized page or home
      window.location.href = '/';
      return;
    }
  }, [user]);

  // Load dashboard data on mount
  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getDashboardStats());
    }
  }, [dispatch, user]);

  // Handle success/error messages
  useEffect(() => {
    if (isError || isSuccess) {
      setSnackbarOpen(true);
    }
  }, [isError, isSuccess, message]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    dispatch(reset()); // Clear any existing messages when switching tabs
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(reset());
  };

  // Tab configuration
  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      component: <DashboardOverview onTabChange={handleTabChange} />
    },
    {
      label: 'Users',
      icon: <PeopleIcon />,
      component: <UserManagement />,
      badge: dashboardStats?.overview?.totalUsers
    },
    {
      label: 'Charities',
      icon: <CharityIcon />,
      component: <CharityManagement />,
      badge: dashboardStats?.overview?.totalCharities
    },
    {
      label: 'Projects',
      icon: <ProjectIcon />,
      component: <ProjectManagement />,
      badge: dashboardStats?.overview?.totalProjects
    },
    {
      label: 'Donations',
      icon: <DonationIcon />,
      component: <DonationManagement />,
      badge: dashboardStats?.overview?.totalDonations
    },
    {
      label: 'Blockchain',
      icon: <BlockchainIcon />,
      component: <BlockchainManagement />,
      badge: dashboardStats?.blockchain?.pendingVerifications,
      badgeColor: 'warning'
    },
    {
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      component: <AnalyticsPanel />
    },
    {
      label: 'Export',
      icon: <ExportIcon />,
      component: <ExportPanel />
    }
  ];

  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Unauthorized Access</Typography>
          <Typography>You don't have permission to access the admin dashboard.</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Include Navbar */}
      <Navbar />
      
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Manage your charity transparency platform
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        {/* System Health Alert */}
        {dashboardStats?.blockchain?.pendingVerifications > 50 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            High number of pending blockchain verifications ({dashboardStats.blockchain.pendingVerifications}). 
            Please review the Blockchain tab.
          </Alert>
        )}

        {/* Quick Stats Cards */}
        {dashboardStats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {dashboardStats.overview.totalUsers}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {Object.entries(dashboardStats.usersByRole || {}).map(([role, count]) => (
                      <Chip 
                        key={role} 
                        label={`${role}: ${count}`} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Donations
                  </Typography>
                  <Typography variant="h4">
                    {dashboardStats.overview.totalDonations}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    ${dashboardStats.overview.totalDonationAmount?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Verification Rate
                  </Typography>
                  <Typography variant="h4" color={
                    dashboardStats.overview.verificationRate > 90 ? 'success.main' : 'warning.main'
                  }>
                    {dashboardStats.overview.verificationRate?.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="body2">
                    Blockchain verified
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active Charities
                  </Typography>
                  <Typography variant="h4">
                    {dashboardStats.overview.totalCharities}
                  </Typography>
                  <Typography variant="body2">
                    {dashboardStats.overview.totalProjects} projects
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Main Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              aria-label="admin dashboard tabs"
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={
                    tab.badge ? (
                      <Badge 
                        badgeContent={tab.badge} 
                        color={tab.badgeColor || 'primary'}
                        max={999}
                      >
                        {tab.icon}
                      </Badge>
                    ) : (
                      tab.icon
                    )
                  }
                  label={tab.label}
                  id={`admin-tab-${index}`}
                  aria-controls={`admin-tabpanel-${index}`}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={currentTab} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Card>
      </Container>

      {/* Floating Action Button */}
      {currentTab > 0 && currentTab < 6 && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => {
            // Handle adding new items based on current tab
            const actions = {
              1: () => console.log('Add User'),
              2: () => console.log('Add Charity'),
              3: () => console.log('Add Project'),
              4: () => console.log('Add Donation'),
              5: () => console.log('Add Verification')
            };
            actions[currentTab]?.();
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={isError ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;