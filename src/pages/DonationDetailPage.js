import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDonationDetails } from '../redux/slices/donationSlice';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Alert,
  AlertTitle,
  Collapse,
  Card,
  CardContent,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowBack,
  Info,
  Verified,
  Security,
  AccountBalance,
  VolunteerActivism,
  Add,
  Error as ErrorIcon,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import BlockchainVerification from '../components/blockchain/BlockchainVerification';
import axios from '../utils/axiosConfig';

const DonationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { selectedDonation, isLoading } = useSelector((state) => state.donation);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(getDonationDetails(id));
    }
  }, [dispatch, id]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleVerifyOnBlockchain = async () => {
    if (!id) return;
    
    try {
      setIsVerifying(true);
      setVerificationError(null);
      
      await axios.post(`/api/donations/${id}/verify`);
      dispatch(getDonationDetails(id));
      setSuccessAlert(true);
      
      // Hide success alert after 5 seconds
      setTimeout(() => setSuccessAlert(false), 5000);
    } catch (error) {
      console.error('Error verifying donation:', error);
      setVerificationError(
        error.response?.data?.error || 
        'Failed to verify donation on Sepolia blockchain. Please try again later.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      SUCCEEDED: { color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
      PENDING: { color: 'warning', icon: <Schedule sx={{ fontSize: 16 }} /> },
      FAILED: { color: 'error', icon: <ErrorIcon sx={{ fontSize: 16 }} /> }
    };

    const config = statusConfig[status] || statusConfig.FAILED;

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        variant="filled"
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };
  
  if (isLoading || !selectedDonation) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" py={8}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading donation details...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  const donation = selectedDonation;
  const charity = donation.Charity || donation.charity;
  const project = donation.Project || donation.project;
  const verificationData = donation.BlockchainVerification || donation.blockchainVerification;
  const progressPercentage = project ? Math.min(100, (project.currentAmount / project.goal) * 100) : 0;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box maxWidth="900px" mx="auto">
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3" component="h1" fontWeight="bold" color="text.primary">
            Donation Details
          </Typography>
          <Button
            component={Link}
            to="/donations/history"
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Back to History
          </Button>
        </Box>

        {/* Success Alert */}
        <Collapse in={successAlert}>
          <Alert 
            severity="success" 
            onClose={() => setSuccessAlert(false)}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <AlertTitle>Verification Successful!</AlertTitle>
            Your donation has been successfully verified on the blockchain.
          </Alert>
        </Collapse>
        
        {/* Main Content Card */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            mb: 4
          }}
        >
          <Box p={4}>
            {/* Donation Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
              <Box>
                <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                  Donation to {charity?.name || 'Unknown Charity'}
                </Typography>
                {project && (
                  <Typography variant="body1" color="text.secondary">
                    Project: {project.title}
                  </Typography>
                )}
              </Box>
              {getStatusChip(donation.paymentStatus)}
            </Box>
            
            <Grid container spacing={4}>
              {/* Left Column - Donation Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Donation Information
                </Typography>
                <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography color="text.secondary">Amount:</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formatCurrency(donation.amount, donation.currency)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography color="text.secondary">Date:</Typography>
                        <Typography fontWeight="medium">
                          {formatDate(donation.createdAt)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography color="text.secondary">Anonymous:</Typography>
                        <Chip 
                          label={donation.anonymous ? 'Yes' : 'No'} 
                          size="small"
                          color={donation.anonymous ? 'default' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Right Column - Blockchain Verification */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Security color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Blockchain Verification
                    </Typography>
                  </Box>
                  
                  {donation.paymentStatus === 'SUCCEEDED' && 
                   (!verificationData || !verificationData.verified) && (
                    <Button
                      onClick={handleVerifyOnBlockchain}
                      disabled={isVerifying}
                      variant="contained"
                      size="small"
                      startIcon={isVerifying ? <CircularProgress size={16} /> : <Verified />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify on Blockchain'}
                    </Button>
                  )}
                </Box>
                
                {/* Verification Error */}
                {verificationError && (
                  <Alert 
                    severity="error" 
                    onClose={() => setVerificationError(null)}
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    {verificationError}
                  </Alert>
                )}
                
                {/* Blockchain Verification Component */}
                <Box mb={2}>
                  <BlockchainVerification donationId={id} />
                </Box>
                
                {/* Info Card */}
                <Alert 
                  severity="info" 
                  icon={<Info />}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-message': { fontSize: '0.875rem' }
                  }}
                >
                  Each donation is recorded on the Sepolia blockchain network, creating a permanent, 
                  immutable record that can be independently verified. This ensures complete transparency 
                  in how donations are tracked and used.
                </Alert>
              </Grid>
            </Grid>
            
            {/* Donation Message */}
            {donation.message && (
              <Box mt={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your Message
                </Typography>
                <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
                  <CardContent>
                    <Typography 
                      variant="body1" 
                      fontStyle="italic" 
                      color="text.primary"
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        '&::before': { content: '"', fontSize: '1.5rem', color: theme.palette.primary.main },
                        '&::after': { content: '"', fontSize: '1.5rem', color: theme.palette.primary.main }
                      }}
                    >
                      {donation.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Project Details */}
            {project && (
              <Box mt={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Project Details
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {progressPercentage.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressPercentage}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      />
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(project.currentAmount, donation.currency)} raised
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(project.goal, donation.currency)} goal
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </Paper>
        
        {/* Action Buttons */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
        >
          <Button
            component={Link}
            to={`/charity/${charity?.id}`}
            variant="outlined"
            size="large"
            startIcon={<Info />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              minWidth: 200
            }}
          >
            View Charity Page
          </Button>
          
          <Button
            component={Link}
            to="/donate"
            variant="contained"
            size="large"
            startIcon={<VolunteerActivism />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              minWidth: 200,
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[6]
              }
            }}
          >
            Make Another Donation
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default DonationDetailPage;