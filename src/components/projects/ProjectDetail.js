// frontend/src/components/projects/ProjectDetail.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getProjectById, 
  reset,
  clearProject,
  deleteProject
} from '../../redux/slices/projectSlice';
import { 
  Box, 
  Container,
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress, 
  Divider, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Snackbar,
  Tab,
  Tabs,
  Avatar,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { 
  AccessTime, 
  CalendarToday, 
  MonetizationOn, 
  FavoriteBorder, 
  CreditCard, 
  VerifiedUser, 
  Info, 
  Edit, 
  Delete, 
  ArrowBack,
  ContentCopy,
  Description,
  History,
  Assignment,
  DoneAll,
  ShowChart,
  Business,
  Verified,
  Warning,
  CheckCircle,
  Pause,
  Cancel,
  PlayArrow
} from '@mui/icons-material';
import moment from 'moment';
import Navbar from '../layout/Navbar';

// Status badge component with consistent styling
const StatusBadge = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'ACTIVE':
        return { color: 'success', icon: <PlayArrow sx={{ fontSize: 16 }} /> };
      case 'COMPLETED':
        return { color: 'primary', icon: <CheckCircle sx={{ fontSize: 16 }} /> };
      case 'CANCELLED':
        return { color: 'error', icon: <Cancel sx={{ fontSize: 16 }} /> };
      case 'PAUSED':
        return { color: 'warning', icon: <Pause sx={{ fontSize: 16 }} /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const { color, icon } = getStatusProps();

  return (
    <Chip 
      icon={icon}
      label={status.replace('_', ' ')} 
      color={color} 
      size="medium" 
      sx={{ 
        fontWeight: 'bold',
        fontSize: '0.875rem',
        height: 32
      }}
    />
  );
};

// TabPanel component for tabbed content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { project, isLoading, isError, message } = useSelector(state => state.projects || {});
  const { user } = useSelector(state => state.auth);
  
  // State for UI elements
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch project on mount
  useEffect(() => {
    dispatch(getProjectById(id));
    
    return () => {
      dispatch(reset());
      dispatch(clearProject());
    };
  }, [dispatch, id]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handler for delete confirmation
  const handleDeleteConfirm = () => {
    setOpenDeleteDialog(true);
  };
  
  // Handler for delete action
  const handleDelete = async () => {
    setOpenDeleteDialog(false);
    await dispatch(deleteProject(id));
    navigate('/dashboard');
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date) => {
    return moment(date).format('MMMM D, YYYY');
  };
  
  // Check if user is charity owner
  const isCharityOwner = () => {
    if (!user || !project?.Charity) return false;
    return user.id === project.Charity.userId || user.role === 'admin';
  };
  
  // Check if project has ended
  const hasProjectEnded = () => {
    if (!project) return false;
    if (project.status === 'COMPLETED' || project.status === 'CANCELLED') return true;
    if (project.endDate && new Date(project.endDate) < new Date()) return true;
    return false;
  };
  
  // Copy transaction hash to clipboard
  const copyTransactionHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setShowCopySnackbar(true);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ my: 2 }}>
            Error: {message}
          </Alert>
        </Container>
      </Box>
    );
  }
  
  if (!project) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="info" sx={{ my: 2 }}>
            Project not found
          </Alert>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Navbar />
      
      {/* Hero Section with Project Info */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#ffffff',
          py: 6
        }}
      >
        <Container maxWidth="lg">
          {/* Back button */}
          <Button 
            component={Link} 
            to={project.Charity ? `/charities/${project.Charity.id}/projects` : '/projects'}
            startIcon={<ArrowBack />} 
            sx={{ 
              mb: 4,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {project.Charity ? `Back to ${project.Charity.name} Projects` : 'Back to Projects'}
          </Button>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    flexGrow: 1
                  }}
                >
                  {project.title}
                </Typography>
                <StatusBadge status={project.status} />
              </Box>
              
              {/* Charity link */}
              {project.Charity && (
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  by{' '}
                  <Link 
                    to={`/charities/${project.Charity.id}`} 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'underline',
                      fontWeight: 'bold' 
                    }}
                  >
                    {project.Charity.name}
                  </Link>
                </Typography>
              )}
              
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  lineHeight: 1.6,
                  maxWidth: '600px'
                }}
              >
                {project.description}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* Key metrics card */}
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Project Progress
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {formatCurrency(project.currentAmount)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {project.progressPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(project.progressPercentage, 100)} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5, 
                      mb: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        bgcolor: project.progressPercentage >= 100 ? theme.palette.success.main : theme.palette.primary.main
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    of {formatCurrency(project.goal)} goal
                  </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {project.donationsCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Donors
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                        {project.daysRemaining !== null ? `${project.daysRemaining}` : '∞'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days Left
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Action buttons */}
                <Stack spacing={2}>
                  {(!user || user.role !== 'charity') && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      startIcon={<CreditCard />}
                      component={Link}
                      to={`/donate?projectId=${project.id}&charityId=${project.Charity?.id}`}
                      disabled={project.status !== 'ACTIVE' || hasProjectEnded()}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        bgcolor: theme.palette.secondary.main,
                        '&:hover': {
                          bgcolor: theme.palette.secondary.dark
                        }
                      }}
                    >
                      {project.status === 'ACTIVE' && !hasProjectEnded() ? 'Donate Now' : 'Donations Closed'}
                    </Button>
                  )}
                  
                  {isCharityOwner() && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        component={Link}
                        to={`/projects/edit/${project.id}`}
                        sx={{ 
                          flexGrow: 1,
                          bgcolor: 'white',
                          '&:hover': {
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteConfirm}
                        sx={{ 
                          flexGrow: 1,
                          bgcolor: 'white',
                          '&:hover': {
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Project tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab icon={<Description />} label="Overview" />
                    <Tab icon={<History />} label="Donations" />
                    <Tab icon={<VerifiedUser />} label="Verification" />
                    <Tab icon={<ShowChart />} label="Progress" />
                  </Tabs>
                </Box>
                
                {/* Tab panels */}
                <TabPanel value={tabValue} index={0}>
                  {/* Overview tab */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    About This Project
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    {project.description}
                  </Typography>
                  
                  {/* Key info boxes */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                    Project Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }}
                      >
                        <CalendarToday sx={{ color: theme.palette.primary.main, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Started
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {formatDate(project.startDate)}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.warning.main, 0.05)
                        }}
                      >
                        <AccessTime sx={{ color: theme.palette.warning.main, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {project.daysRemaining !== null ? 'Time Left' : 'No End Date'}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {project.endDate 
                            ? (project.daysRemaining > 0 
                                ? `${project.daysRemaining} days` 
                                : 'Ended')
                            : 'Ongoing'}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.05)
                        }}
                      >
                        <MonetizationOn sx={{ color: theme.palette.success.main, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Goal
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(project.goal)}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.secondary.main, 0.05)
                        }}
                      >
                        <FavoriteBorder sx={{ color: theme.palette.secondary.main, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Donations
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {project.donationsCount || 0}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  {/* Project timeline */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Project Timeline
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Start Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatDate(project.startDate)}
                        </Typography>
                      </Grid>
                      
                      {project.endDate && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            End Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {formatDate(project.endDate)}
                          </Typography>
                        </Grid>
                      )}
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Created At
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatDate(project.createdAt)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Last Updated
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatDate(project.updatedAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Recent Donations and Project Status - Side by Side */}
                  <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Recent Donations
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      {project.recentDonations && project.recentDonations.length > 0 ? (
                        <Box>
                          {project.recentDonations.slice(0, 5).map((donation) => (
                            <Paper
                              key={donation.id}
                              elevation={0}
                              sx={{ 
                                p: 2, 
                                mb: 2, 
                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                borderRadius: 2,
                                '&:last-child': { mb: 0 }
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {donation.donorName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {moment(donation.date).fromNow()}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                                  {formatCurrency(donation.amount)}
                                </Typography>
                                
                                {donation.verified && (
                                  <Tooltip title="Blockchain Verified">
                                    <Chip 
                                      icon={<VerifiedUser />} 
                                      label="Verified" 
                                      color="success" 
                                      size="small" 
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                              
                              {donation.message && (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                  "{donation.message}"
                                </Typography>
                              )}
                            </Paper>
                          ))}
                        </Box>
                      ) : (
                        <Alert 
                          severity="info" 
                          icon={<Info />}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            borderRadius: 2
                          }}
                        >
                          No donations yet. Be the first to donate!
                        </Alert>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Project Status
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Status:</Typography>
                          <StatusBadge status={project.status} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Created:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {moment(project.createdAt).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {moment(project.updatedAt).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Progress:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                            {project.progressPercentage}% funded
                          </Typography>
                        </Box>
                        
                        {project.endDate && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Ends In:</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'medium',
                                color: project.daysRemaining > 0 ? theme.palette.warning.main : theme.palette.error.main
                              }}
                            >
                              {project.daysRemaining > 0 
                                ? `${project.daysRemaining} days` 
                                : 'Campaign ended'}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Quick Stats
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Raised:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                            {formatCurrency(project.currentAmount)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Goal:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatCurrency(project.goal)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Donations:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {project.donationsCount || 0}
                          </Typography>
                        </Box>
                        
                        {project.recentDonations && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Verified:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {project.recentDonations.filter(d => d.verified).length} donations
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  {/* Donations tab with side-by-side layout */}
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Donation History
                      </Typography>
                      
                      {project.recentDonations && project.recentDonations.length > 0 ? (
                        <TableContainer 
                          component={Paper} 
                          elevation={0}
                          sx={{ 
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            mt: 2
                          }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Donor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Verified</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {project.recentDonations.map((donation) => (
                                <TableRow key={donation.id}>
                                  <TableCell>{donation.donorName}</TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                                      {formatCurrency(donation.amount)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{moment(donation.date).format('MMM D, YYYY')}</TableCell>
                                  <TableCell>
                                    {donation.verified ? (
                                      <Tooltip title="Blockchain Verified">
                                        <Chip 
                                          icon={<VerifiedUser />} 
                                          label="Verified" 
                                          color="success" 
                                          size="small" 
                                        />
                                      </Tooltip>
                                    ) : (
                                      <Chip 
                                        label="Pending" 
                                        color="default" 
                                        size="small" 
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Alert 
                          severity="info" 
                          icon={<Info />}
                          sx={{ 
                            mt: 2,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            borderRadius: 2
                          }}
                        >
                          No donations yet. Be the first to donate!
                        </Alert>
                      )}
                      
                      {project.donationsCount > (project.recentDonations?.length || 0) && (
                        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
                          + {project.donationsCount - project.recentDonations.length} more donations not shown
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Project Status
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Status:</Typography>
                          <StatusBadge status={project.status} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Created:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {moment(project.createdAt).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {moment(project.updatedAt).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Progress:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                            {project.progressPercentage}% funded
                          </Typography>
                        </Box>
                        
                        {project.endDate && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Ends In:</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'medium',
                                color: project.daysRemaining > 0 ? theme.palette.warning.main : theme.palette.error.main
                              }}
                            >
                              {project.daysRemaining > 0 
                                ? `${project.daysRemaining} days` 
                                : 'Campaign ended'}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Quick Stats
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Raised:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                            {formatCurrency(project.currentAmount)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Goal:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatCurrency(project.goal)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Donations:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {project.donationsCount || 0}
                          </Typography>
                        </Box>
                        
                        {project.recentDonations && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Verified:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {project.recentDonations.filter(d => d.verified).length} donations
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                      
                      {/* Message Display for Donations */}
                      {project.recentDonations && project.recentDonations.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Recent Messages
                          </Typography>
                          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                            {project.recentDonations
                              .filter(donation => donation.message)
                              .slice(0, 3)
                              .map((donation) => (
                                <Paper
                                  key={donation.id}
                                  elevation={0}
                                  sx={{ 
                                    p: 2, 
                                    mb: 1, 
                                    bgcolor: alpha(theme.palette.secondary.main, 0.02),
                                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                    borderRadius: 2,
                                    '&:last-child': { mb: 0 }
                                  }}
                                >
                                  <Typography variant="caption" color="text.secondary" gutterBottom>
                                    {donation.donorName} - {formatCurrency(donation.amount)}
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    "{donation.message}"
                                  </Typography>
                                </Paper>
                              ))}
                          </Box>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  {/* Verification tab */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUser color="primary" />
                    Blockchain Verification
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    This project's donations are verified on the blockchain for full transparency.
                    Each verified donation includes a unique transaction hash that can be used to verify the donation.
                  </Typography>
                  
                  {project.recentDonations && project.recentDonations.some(d => d.verified) ? (
                    <TableContainer 
                      component={Paper} 
                      elevation={0}
                      sx={{ 
                        mt: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Donor</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Transaction Hash</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {project.recentDonations
                            .filter(d => d.verified)
                            .map((donation) => (
                              <TableRow key={donation.id}>
                                <TableCell>{donation.donorName}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                                    {formatCurrency(donation.amount)}
                                  </Typography>
                                </TableCell>
                                <TableCell>{moment(donation.date).format('MMM D, YYYY')}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ mr: 1, fontFamily: 'monospace' }}>
                                      {donation.transactionHash?.substring(0, 10)}...
                                    </Typography>
                                    <Tooltip title="Copy Transaction Hash">
                                      <IconButton 
                                        size="small"
                                        onClick={() => copyTransactionHash(donation.transactionHash)}
                                      >
                                        <ContentCopy fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert 
                      severity="info" 
                      icon={<Info />} 
                      sx={{ 
                        mt: 2,
                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        borderRadius: 2
                      }}
                    >
                      No blockchain verified donations available yet. Donations are typically verified within 24 hours.
                    </Alert>
                  )}
                  
                  <Paper
                    elevation={0}
                    sx={{ 
                      mt: 4, 
                      p: 3, 
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      borderRadius: 2 
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedUser sx={{ color: theme.palette.success.main }} />
                      Verification Process
                    </Typography>
                    <Typography variant="body2" paragraph>
                      All donations on our platform go through a transparent verification process:
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <ShowChart color="primary" />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">2. Blockchain Mirroring</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Donation details are mirrored to a private blockchain network for immutability.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <DoneAll color="primary" />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">3. Verification</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Once recorded on the blockchain, the donation receives a verification badge.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <VerifiedUser color="primary" />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">4. Transparency</Typography>
                            <Typography variant="body2" color="text.secondary">
                              All verified transactions are publicly available for complete transparency.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </TabPanel>
                
                <TabPanel value={tabValue} index={3}>
                  {/* Progress tab */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Funding Progress
                  </Typography>
                  
                  <Box sx={{ mt: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(project.currentAmount)}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(project.goal)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(project.progressPercentage, 100)} 
                      sx={{ 
                        height: 15, 
                        borderRadius: 8, 
                        mb: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 8,
                          bgcolor: project.progressPercentage >= 100 ? theme.palette.success.main : theme.palette.primary.main
                        }
                      }}
                    />
                    <Typography variant="body1" textAlign="center" sx={{ fontWeight: 'medium' }}>
                      {project.progressPercentage}% of funding goal achieved
                    </Typography>
                  </Box>
                  
                  {/* Progress milestones */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Funding Milestones
                    </Typography>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2
                      }}
                    >
                      <Grid container spacing={3}>
                        {/* 25% Milestone */}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label="25%" 
                              color={project.progressPercentage >= 25 ? "success" : "default"} 
                              size="small" 
                              sx={{ mr: 2, fontWeight: 'bold' }} 
                            />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Initial Funding
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {project.progressPercentage >= 25 
                              ? `✓ Achieved` 
                              : `${formatCurrency(project.goal * 0.25 - project.currentAmount)} needed`}
                          </Typography>
                        </Grid>
                        
                        {/* 50% Milestone */}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label="50%" 
                              color={project.progressPercentage >= 50 ? "success" : "default"} 
                              size="small" 
                              sx={{ mr: 2, fontWeight: 'bold' }} 
                            />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Halfway Mark
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {project.progressPercentage >= 50 
                              ? `✓ Achieved` 
                              : `${formatCurrency(project.goal * 0.5 - project.currentAmount)} needed`}
                          </Typography>
                        </Grid>
                        
                        {/* 75% Milestone */}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label="75%" 
                              color={project.progressPercentage >= 75 ? "success" : "default"} 
                              size="small" 
                              sx={{ mr: 2, fontWeight: 'bold' }} 
                            />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Major Progress
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {project.progressPercentage >= 75 
                              ? `✓ Achieved` 
                              : `${formatCurrency(project.goal * 0.75 - project.currentAmount)} needed`}
                          </Typography>
                        </Grid>
                        
                        {/* 100% Milestone */}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label="100%" 
                              color={project.progressPercentage >= 100 ? "success" : "default"} 
                              size="small" 
                              sx={{ mr: 2, fontWeight: 'bold' }} 
                            />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Fully Funded
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {project.progressPercentage >= 100 
                              ? `✓ Goal Achieved!` 
                              : `${formatCurrency(project.goal - project.currentAmount)} needed`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                  
                  {/* Time progress */}
                  {project.endDate && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Time Progress
                      </Typography>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatDate(project.startDate)}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatDate(project.endDate)}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(
                            100 - (project.daysRemaining / 
                              ((new Date(project.endDate) - new Date(project.startDate)) / 
                                (1000 * 60 * 60 * 24))) * 100, 
                            100
                          )} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4, 
                            mb: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: theme.palette.warning.main
                            }
                          }}
                        />
                        <Typography variant="body1" textAlign="center" sx={{ fontWeight: 'medium' }}>
                          {project.daysRemaining > 0 
                            ? `${project.daysRemaining} days remaining` 
                            : 'Campaign period ended'}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            {/* Charity info card */}
            {project.Charity && (
              <Card 
                elevation={0}
                sx={{ 
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    About the Organization
                  </Typography>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: theme.palette.primary.main,
                        mr: 2
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {project.Charity.name}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip 
                          label={project.Charity.category.replace('_', ' ')} 
                          color="primary" 
                          size="small" 
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip 
                          icon={<Verified sx={{ fontSize: 14 }} />}
                          label="Verified" 
                          color="success" 
                          size="small" 
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Stack>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" paragraph sx={{ lineHeight: 1.6 }}>
                    {project.Charity.description?.substring(0, 150)}
                    {project.Charity.description?.length > 150 ? '...' : ''}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {project.Charity.email && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Email: {project.Charity.email}
                        </Typography>
                      </Grid>
                    )}
                    
                    {project.Charity.phone && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Phone: {project.Charity.phone}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    component={Link}
                    to={`/charities/${project.Charity.id}`}
                    sx={{ borderRadius: 2, fontWeight: 'medium' }}
                  >
                    Visit Charity Page
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Delete Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? 
            {project.donationsCount > 0 ? 
              " Since this project has donations, it will be marked as 'CANCELLED' instead of being permanently deleted." :
              " This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for copy confirmation */}
      <Snackbar
        open={showCopySnackbar}
        autoHideDuration={3000}
        onClose={() => setShowCopySnackbar(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ProjectDetail;