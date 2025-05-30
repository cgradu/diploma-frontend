// src/pages/DonationPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Fade,
  Slide,
  Backdrop,
  CircularProgress,
  Snackbar,
  useTheme,
  useMediaQuery,
  Grow,
  Chip,
  Stack
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

// Import your  components
import DonationForm from '../components/donation/DonationForm';
import PaymentForm from '../components/donation/PaymentForm';
import DonationSuccess from '../components/donation/DonationSuccess';
import Navbar from '../components/layout/Navbar';

import { 
  createPaymentIntent, 
  resetDonationState, 
  clearCurrentDonation 
} from '../redux/slices/donationSlice';
import { getCharities } from '../redux/slices/charitySlice';
import { getProjectsByCharityId } from '../redux/slices/projectSlice';
import { 
  selectUser, 
  selectCharities, 
  selectCharitiesLoading,
  selectDonationClientSecret,
  selectDonationId,
  selectCurrentDonation,
  selectDonationLoading,
  selectDonationError,
  selectDonationMessage
} from '../redux/selectors';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RByuLJIJuqGirfSmV1VElWUW47yHuFQi9qMSihJoNe96YBnnHuguOi12NHrpiY5T2TUimELhyTLpHwGMpvNmEy300LVAjEPuB');

const steps = [
  {
    label: 'Donation Details',
    icon: <FavoriteIcon />,
    description: 'Choose charity and amount'
  },
  {
    label: 'Payment',
    icon: <PaymentIcon />,
    description: 'Secure card payment'
  },
  {
    label: 'Confirmation',
    icon: <CheckCircleIcon />,
    description: 'Blockchain verification'
  }
];

const DonationPage = () => {
  const { charityId, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // URL parameters
  const urlParams = new URLSearchParams(location.search);
  const charityIdParam = charityId || urlParams.get('charityId');
  const projectIdParam = projectId || urlParams.get('projectId');
  
  const [activeStep, setActiveStep] = useState(0);
  const [donationData, setDonationData] = useState({
    amount: 25,
    charityId: charityIdParam || '',
    projectId: projectIdParam || '',
    message: '',
    anonymous: false,
    currency: 'RON'
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Redux selectors
  const user = useSelector(selectUser);
  const charities = useSelector(selectCharities);
  const charitiesLoading = useSelector(selectCharitiesLoading);
  const clientSecret = useSelector(selectDonationClientSecret);
  const donationId = useSelector(selectDonationId);
  const currentDonation = useSelector(selectCurrentDonation);
  const isLoading = useSelector(selectDonationLoading);
  const isError = useSelector(selectDonationError);
  const message = useSelector(selectDonationMessage);

  // Authentication check
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, navigate]);

  // Initial data fetch
  useEffect(() => {
    if (!charities.length && !charitiesLoading) {
      dispatch(getCharities());
    }

    if (charityIdParam) {
      dispatch(getProjectsByCharityId(charityIdParam));
    }
    
    return () => {
      dispatch(clearCurrentDonation());
    };
  }, [dispatch, charities.length, charitiesLoading, charityIdParam]);
  
  // Step management
  useEffect(() => {
    if (clientSecret && activeStep === 0) {
      setActiveStep(1);
      dispatch(resetDonationState());
    }
  }, [clientSecret, activeStep, dispatch]);
  
  // Error handling
  useEffect(() => {
    if (isError && message) {
      setSnackbar({
        open: true,
        message: message,
        severity: 'error'
      });
      dispatch(resetDonationState());
    }
  }, [isError, message, dispatch]);
  
  // Handle donation form completion
  const handleDonationFormComplete = (formData) => {
    const data = {
      ...donationData,
      ...formData
    };
    setDonationData(data);
    
    dispatch(createPaymentIntent(data))
      .unwrap()
      .then(result => {
        if (result.clientSecret) {
          setSnackbar({
            open: true,
            message: 'Payment initialized successfully!',
            severity: 'success'
          });
        } else {
          throw new Error('No client secret received');
        }
      })
      .catch(error => {
        setSnackbar({
          open: true,
          message: error || 'Failed to initialize payment',
          severity: 'error'
        });
      });
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    setActiveStep(2);
    setSnackbar({
      open: true,
      message: 'Payment completed successfully!',
      severity: 'success'
    });
  };
  
  // Handle back navigation
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 1) {
        dispatch(resetDonationState());
      }
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return (
      <Backdrop open={true} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Redirecting to login...
          </Typography>
        </Box>
      </Backdrop>
    );
  }
  
  // Stripe options
  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: theme.palette.primary.main,
        colorBackground: theme.palette.background.paper,
        colorText: theme.palette.text.primary,
        borderRadius: '8px',
      }
    }
  } : {};

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Slide direction="right" in={activeStep === 0} mountOnEnter unmountOnExit>
            <Box>
              <DonationForm
                initialData={donationData}
                onComplete={handleDonationFormComplete}
              />
            </Box>
          </Slide>
        );
      case 1:
        return clientSecret ? (
          <Slide direction="left" in={activeStep === 1} mountOnEnter unmountOnExit>
            <Box>
              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentForm 
                  amount={donationData.amount} 
                  currency={donationData.currency}
                  donationId={donationId}
                  onSuccess={handlePaymentSuccess}
                  onBack={handleBack}
                />
              </Elements>
            </Box>
          </Slide>
        ) : (
          <Alert severity="error" sx={{ mt: 2 }}>
            Payment session not initialized. Please go back and try again.
          </Alert>
        );
      case 2:
        return (
          <Grow in={activeStep === 2}>
            <Box>
              <DonationSuccess donation={currentDonation} />
            </Box>
          </Grow>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.secondary.light}10 100%)`,
      pb: 4
    }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Header Section */}
            <Box 
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              />
              
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                fontWeight="bold" 
                gutterBottom
                sx={{ position: 'relative', zIndex: 1 }}
              >
                Make a Donation
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9, 
                  maxWidth: 600, 
                  mx: 'auto',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Your contribution makes a real difference in people's lives
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="center" 
                sx={{ mt: 3, position: 'relative', zIndex: 1 }}
              >
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Secure Payment" 
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip 
                  icon={<VisibilityIcon />} 
                  label="Full Transparency" 
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Stack>
            </Box>

            {/* Stepper */}
            <Box sx={{ p: 4, pb: 2 }}>
              <Stepper 
                activeStep={activeStep} 
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{
                  '& .MuiStepLabel-root': {
                    '& .MuiStepLabel-iconContainer': {
                      '& .MuiStepIcon-root': {
                        fontSize: '2rem',
                        '&.Mui-active': {
                          color: theme.palette.primary.main,
                        },
                        '&.Mui-completed': {
                          color: theme.palette.success.main,
                        }
                      }
                    }
                  }
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel 
                      icon={activeStep > index ? <CheckCircleIcon /> : step.icon}
                      optional={
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      }
                    >
                      <Typography variant="subtitle1" fontWeight="medium">
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Loading Overlay */}
            {isLoading && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Processing your request...
                </Typography>
              </Box>
            )}

            {/* Step Content */}
            <Box sx={{ p: 4, minHeight: 400, position: 'relative' }}>
              {renderStepContent()}
            </Box>

            {/* Blockchain Info Footer */}
            <Box 
              sx={{ 
                background: theme.palette.grey[50],
                p: 3,
                borderTop: `1px solid ${theme.palette.divider}`
              }}
            >
              <Alert 
                severity="info" 
                icon={<SecurityIcon />}
                sx={{
                  background: 'transparent',
                  border: 'none',
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  🔗 Blockchain Transparency Guarantee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your donation will be recorded on blockchain technology to ensure complete transparency.
                  You'll be able to track exactly how your contribution is used and verify its impact.
                </Typography>
              </Alert>
            </Box>
          </Paper>
        </Fade>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DonationPage;