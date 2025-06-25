// src/components/donation/PaymentForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  AddressElement
} from '@stripe/react-stripe-js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Grid,
  Paper,
  Divider,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Collapse
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import { confirmPayment } from '../../redux/slices/donationSlice';

const currencyConfig = {
  RON: { symbol: 'lei', flag: '🇷🇴' },
  EUR: { symbol: '€', flag: '🇪🇺' },
  USD: { symbol: '$', flag: '🇺🇸' }
};

const PaymentForm = ({ amount = 0, currency = 'RON', donationId, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  
  const formatCurrency = (amount, currency) => {
    const config = currencyConfig[currency] || currencyConfig.RON;
    return `${amount} ${config.symbol}`;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage(null);
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donation/success`,
      },
      redirect: 'if_required'
    });
    
    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      dispatch(confirmPayment({
        paymentIntentId: paymentIntent.id,
        donationId
      }));
      onSuccess();
    } else {
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };
  
  return (
    <Box>
{/* Header */}
<Box sx={{ mb: 3 }}>
  <Button
    startIcon={<ArrowBackIcon />}
    onClick={onBack}
    sx={{ mb: 2 }}
    color="primary"
  >
    Back to donation details
  </Button>
  <Typography 
    variant="h5" 
    fontWeight="bold" 
    gutterBottom
    sx={{ textAlign: 'center' }}
  >
    Complete Your Payment
  </Typography>
  <Typography 
    variant="body1" 
    color="text.secondary"
    sx={{ textAlign: 'center' }}
  >
    Your donation will be processed securely through Stripe
  </Typography>
</Box>

      {/* Donation Summary */}
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <PaymentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Donation Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review your contribution details
              </Typography>
            </Box>
          </Stack>

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              background: theme.palette.background.paper,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="primary"
              sx={{ mb: 1 }}
            >
              {formatCurrency(amount, currency)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total donation amount
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Chip 
                icon={<SecurityIcon />} 
                label="Secure Payment" 
                color="success" 
                variant="outlined" 
                size="small"
              />
              <Chip 
                icon={<VerifiedIcon />} 
                label="SSL Encrypted" 
                color="primary" 
                variant="outlined" 
                size="small"
              />
            </Box>
          </Paper>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Card Information */}
          <Grid item xs={12} width={{ xs: '100%' }}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                    <CreditCardIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Card Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enter your payment details securely
                    </Typography>
                  </Box>
                </Stack>

                <Box 
                  sx={{ 
                    p: 2, 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    '& .StripeElement': {
                      padding: theme.spacing(2),
                    }
                  }}
                >
                  <PaymentElement 
                    options={{
                      layout: 'tabs'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Billing Address */}
          <Grid item xs={12} width={{ xs: '100%' }}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                    <InfoIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Billing Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Required for payment verification
                    </Typography>
                  </Box>
                </Stack>

                <Box 
                  sx={{ 
                    p: 2, 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    '& .StripeElement': {
                      padding: theme.spacing(1),
                    }
                  }}
                >
                  <AddressElement options={{ mode: 'billing' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Information */}
          <Grid item xs={12} width={{ xs: '100%' }}>
            <Card variant="outlined">
              <CardContent>
                <Button
                  fullWidth
                  onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                  endIcon={showSecurityInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ 
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    color: 'text.primary'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                      <LockIcon fontSize="small" />
                    </Avatar>
                    <Box textAlign="left">
                      <Typography variant="subtitle1" fontWeight="bold">
                        Security & Privacy
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your payment is protected by enterprise-grade security
                      </Typography>
                    </Box>
                  </Stack>
                </Button>

                <Collapse in={showSecurityInfo}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ pl: 6 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • Your payment information is processed by Stripe, a PCI Service Provider Level 1 certified company
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • We never store your complete card details on our servers
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • All data is encrypted using TLS 1.2+ and AES-256 encryption
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Your donation will be recorded on blockchain for full transparency
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>

          {/* Error Display */}
          {errorMessage && (
            <Grid item xs={12}>
              <Alert 
                severity="error" 
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  Payment Error
                </Typography>
                {errorMessage}
              </Alert>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12} width={{ xs: '100%' }}>
            <Box sx={{ position: 'relative' }}>
              {isProcessing && (
                <LinearProgress 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    borderRadius: '4px 4px 0 0'
                  }}
                />
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!stripe || isProcessing}
                sx={{
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                  boxShadow: theme.shadows[6],
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.success.main} 90%)`,
                    boxShadow: theme.shadows[10],
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    transform: 'none',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                startIcon={isProcessing ? null : <SecurityIcon />}
              >
                {isProcessing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        border: '3px solid',
                        borderColor: `currentColor transparent currentColor transparent`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    Processing Payment...
                  </Box>
                ) : (
                  `Donate ${formatCurrency(amount, currency)}`
                )}
              </Button>
            </Box>

            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 2,
                px: 2
              }}
            >
              By completing this payment, you agree to our terms of service. 
              Your payment information is securely processed by Stripe and never stored on our servers.
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PaymentForm;