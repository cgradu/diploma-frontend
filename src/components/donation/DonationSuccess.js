// src/components/donation/DonationSuccess.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Stack,
  Avatar,
  Chip,
  Collapse,
  useTheme,
  alpha,
  Fade,
  Grow,
  Zoom,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Favorite as FavoriteIcon,
  Receipt as ReceiptIcon,
  Share as ShareIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Celebration as CelebrationIcon
} from '@mui/icons-material';

const currencyConfig = {
  RON: { symbol: 'lei', flag: '🇷🇴' },
  EUR: { symbol: '€', flag: '🇪🇺' },
  USD: { symbol: '$', flag: '🇺🇸' }
};

const DonationSuccess = ({ donation }) => {
  const theme = useTheme();
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const formatCurrency = (amount, currency = 'RON') => {
    const config = currencyConfig[currency] || currencyConfig.RON;
    return `${amount} ${config.symbol}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just made a donation!',
        text: `I donated ${formatCurrency(donation?.amount, donation?.currency)} to help make a difference!`,
        url: window.location.href
      });
    }
  };

  if (!donation) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Donation details not available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Success Header */}
      <Fade in timeout={800}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Zoom in timeout={1000}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.palette.success.main,
                mx: 'auto',
                mb: 3,
                boxShadow: theme.shadows[8],
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </Zoom>

          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Thank You! 🎉
          </Typography>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
            Your donation has been successfully processed
          </Typography>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              color="success.main"
              sx={{ mb: 1 }}
            >
              {formatCurrency(donation.amount, donation.currency)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              has been donated and will make a real impact!
            </Typography>
          </Paper>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Donation Details */}
        <Grid item xs={12} md={6}>
          <Grow in timeout={1200}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Donation Receipt
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep this for your records
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(donation.amount, donation.currency)}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontFamily="monospace"
                      sx={{ 
                        wordBreak: 'break-all',
                        fontSize: '0.875rem',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        p: 1,
                        borderRadius: 1,
                        mt: 0.5
                      }}
                    >
                      {donation.transactionId}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(donation.createdAt)}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    onClick={() => setShowTransactionDetails(!showTransactionDetails)}
                    endIcon={showTransactionDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ mt: 2 }}
                  >
                    {showTransactionDetails ? 'Hide' : 'Show'} More Details
                  </Button>

                  <Collapse in={showTransactionDetails}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <Divider />
                      
                      {donation.paymentIntentId && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Payment Intent ID
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontFamily="monospace"
                            sx={{ wordBreak: 'break-all' }}
                          >
                            {donation.paymentIntentId}
                          </Typography>
                        </Box>
                      )}

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status
                        </Typography>
                        <Chip 
                          label={donation.paymentStatus || 'SUCCEEDED'} 
                          color="success" 
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Currency
                        </Typography>
                        <Typography variant="body1">
                          {donation.currency} ({currencyConfig[donation.currency]?.symbol})
                        </Typography>
                      </Box>
                    </Stack>
                  </Collapse>
                </Stack>

                {donation.receiptUrl && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      href={donation.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Official Receipt
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Blockchain Verification */}
        <Grid item xs={12} md={6}>
          <Grow in timeout={1400}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Blockchain Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transparent and immutable record
                    </Typography>
                  </Box>
                </Stack>

                <Alert severity="info" sx={{ mb: 3, backgroundColor: 'transparent', border: `1px solid ${alpha(theme.palette.info.main, 0.3)}` }}>
                  <Typography variant="body2">
                    Your donation has been recorded on our private blockchain network for complete transparency and verification.
                  </Typography>
                </Alert>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Blockchain Status
                    </Typography>
                    <Chip 
                      icon={<SecurityIcon />}
                      label={donation.BlockchainVerification ? 'Verified' : 'Processing'}
                      color={donation.BlockchainVerification ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>

                  {donation.BlockchainVerification?.transactionHash && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Transaction Hash
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          mt: 1,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05)
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          fontFamily="monospace"
                          sx={{ 
                            wordBreak: 'break-all',
                            fontSize: '0.75rem'
                          }}
                        >
                          {donation.BlockchainVerification.transactionHash}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Button
                    fullWidth
                    onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
                    endIcon={showBlockchainDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    variant="outlined"
                  >
                    Learn About Blockchain Transparency
                  </Button>

                  <Collapse in={showBlockchainDetails}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mt: 2,
                        backgroundColor: alpha(theme.palette.success.main, 0.05)
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        How Blockchain Ensures Transparency:
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          • Your donation is recorded with an immutable timestamp
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Fund allocation can be tracked in real-time
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Impact reports are verified against blockchain records
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Complete audit trail available for verification
                        </Typography>
                      </Stack>
                    </Paper>
                  </Collapse>
                </Stack>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Message Display */}
        {donation.message && (
          <Grid item xs={12}>
            <Fade in timeout={1600}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                      <FavoriteIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Your Message
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Shared with your donation
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3,
                      backgroundColor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic',
                        lineHeight: 1.6
                      }}
                    >
                      "{donation.message}"
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        )}

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Fade in timeout={1800}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                  What's Next?
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<BusinessIcon />}
                      component={Link}
                      to={`/charities/${donation.charityId}`}
                      sx={{ 
                        py: 1.5,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`
                      }}
                    >
                      View Charity
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<HistoryIcon />}
                      component={Link}
                      to="/donations/history"
                      sx={{ py: 1.5 }}
                    >
                      Donation History
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TimelineIcon />}
                      component={Link}
                      to="/impact"
                      sx={{ py: 1.5 }}
                    >
                      Track Impact
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={handleShare}
                      sx={{ py: 1.5 }}
                    >
                      Share
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Want to make another donation?
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CelebrationIcon />}
                    component={Link}
                    to="/donate"
                    sx={{ 
                      mt: 1,
                      py: 1.5,
                      px: 4,
                      background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                      fontWeight: 'bold'
                    }}
                  >
                    Donate Again
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Footer Message */}
      <Fade in timeout={2000}>
        <Box textAlign="center" sx={{ mt: 4, py: 3 }}>
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            Thank you for making a difference! 💙
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your contribution helps create positive change in the world. 
            We'll keep you updated on how your donation is being used.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default DonationSuccess;