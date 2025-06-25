// src/components/stats/CharityStatsCard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import {
  Favorite,
  People,
  TrendingUp,
  AttachMoney,
  AccountBalance,
  Verified,
  Timeline,
  AssignmentTurnedIn,
  CalendarToday,
  Business
} from '@mui/icons-material';
import { fetchCharityStats, selectCharityStats } from '../../redux/slices/statsSlice';

const StatItem = ({ icon, label, value, color = 'primary', progress, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: theme.palette[color].main, width: 40, height: 40 }}>
          {icon}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {progress !== undefined && (
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ mt: 1, height: 6, borderRadius: 3 }}
              color={color}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

const CharityStatsCard = ({ charityId, showTitle = true, compact = false, showActions = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: charityStats, loading, error } = useSelector(selectCharityStats);

  useEffect(() => {
    if (charityId) {
      dispatch(fetchCharityStats(charityId));
    }
  }, [dispatch, charityId]);

  if (loading) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading charity statistics...
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
        <Typography color="error" variant="body2">
          Failed to load charity statistics: {error}
        </Typography>
      </Card>
    );
  }

  if (!charityStats) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No donation data available yet.
        </Typography>
      </Card>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate funding efficiency
  const fundingEfficiency = charityStats.flow 
    ? ((charityStats.flow.totalDisbursed / charityStats.flow.totalReceived) * 100) || 0
    : 0;

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

  return (
    <Card>
      <CardContent>
        {showTitle && (
          <>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                <Business />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {charityStats.charity?.name || 'Charity Performance'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {charityStats.charity?.category || 'Organization metrics'}
                </Typography>
              </Box>
              {showActions && (
                <Button variant="outlined" size="small">
                  View Details
                </Button>
              )}
            </Stack>
            <Divider sx={{ mb: 3 }} />
          </>
        )}

        {/* Main Stats Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<AttachMoney />}
              label="Total Received"
              value={formatCurrency(charityStats.donations?.totalAmount || 0)}
              subtitle={`From ${charityStats.donations?.total || 0} donations`}
              color="success"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<People />}
              label="Total Donors"
              value={charityStats.donations?.uniqueDonors || 0}
              subtitle="Supporters"
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<TrendingUp />}
              label="Average Donation"
              value={formatCurrency(charityStats.donations?.averageAmount || 0)}
              color="info"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<AccountBalance />}
              label="Current Balance"
              value={formatCurrency(charityStats.flow?.balance || 0)}
              progress={fundingEfficiency}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Additional Stats */}
        {!compact && (
          <>
            <Divider sx={{ my: 3 }} />
            
            {/* Fund Flow Overview */}
            {charityStats.flow && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Fund Flow Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {formatCurrency(charityStats.flow.totalReceived)}
                      </Typography>
                      <Typography variant="body2">Total Received</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        {formatCurrency(charityStats.flow.totalDisbursed)}
                      </Typography>
                      <Typography variant="body2">Total Disbursed</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="h6" color="info.main" fontWeight="bold">
                        {fundingEfficiency.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">Efficiency Rate</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Activity & Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Activity & Status
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {charityStats.donations?.lastDonationTime && (
                  <Chip
                    icon={<CalendarToday />}
                    label={`Last donation: ${formatTimestamp(charityStats.donations.lastDonationTime)}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {charityStats.source === 'smart_contract' && (
                  <Chip
                    icon={<Verified />}
                    label="Blockchain Verified"
                    color="success"
                    size="small"
                  />
                )}
                <Chip
                  icon={<Timeline />}
                  label={`Active since ${formatDate(charityStats.charity?.createdAt)}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Box>

            {/* Recent Donations Preview */}
            {charityStats.recentDonations && charityStats.recentDonations.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Recent Donations
                </Typography>
                <Stack spacing={1}>
                  {charityStats.recentDonations.slice(0, 3).map((donation, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        borderRadius: 1,
                        border: 1,
                        borderColor: alpha(theme.palette.success.main, 0.1)
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {donation.donor.name || 'Anonymous Donor'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(donation.timestamp)}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {formatCurrency(donation.amount)}
                          </Typography>
                          {donation.isVerified && (
                            <Chip
                              icon={<Verified />}
                              label="Verified"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Stack>
                      {donation.message && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          "{donation.message}"
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CharityStatsCard;