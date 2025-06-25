// src/components/stats/DonorStatsCard.js
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
  alpha
} from '@mui/material';
import {
  VolunteerActivism,
  Business,
  Timeline,
  TrendingUp,
  Favorite,
  Verified,
  CalendarToday,
  AttachMoney
} from '@mui/icons-material';
import { fetchDonorStats, selectDonorStats } from '../../redux/slices/statsSlice';

const StatItem = ({ icon, label, value, color = 'primary', progress }) => {
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

const DonorStatsCard = ({ donorId, showTitle = true, compact = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { firstDonorStats, isLoading: isLoadingDonorStats } = useSelector((state) => state.donations || { firstDonorStats: null });
  const { data: donorStats, loading, error } = useSelector(selectDonorStats);

  useEffect(() => {
    if (donorId) {
      dispatch(fetchDonorStats(donorId));
    }
  }, [dispatch, donorId]);

  if (loading) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading donor statistics...
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
        <Typography color="error" variant="body2">
          Failed to load donor statistics: {error}
        </Typography>
      </Card>
    );
  }

  if (!donorStats) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No donation history yet. Start making an impact!
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

      // Updated timestamp formatting function for Romanian timezone
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
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <VolunteerActivism />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Your Giving Impact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your charitable contributions
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
          </>
        )}

        {/* Main Stats Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<AttachMoney />}
              label="Total Donated"
              value={formatCurrency(donorStats.donations?.totalAmount || 0)}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<Timeline />}
              label="Total Donations"
              value={donorStats.donations?.total || 0}
              color="secondary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<Business />}
              label="Charities Supported"
              value={donorStats.donations?.uniqueCharities || 0}
              color="success"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={compact ? 12 : 6}>
            <StatItem
              icon={<TrendingUp />}
              label="Average Donation"
              value={formatCurrency(donorStats.donations?.averageDonation || 0)}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Additional Stats */}
        {!compact && (
          <>
            <Divider sx={{ my: 3 }} />
            
            {/* Recent Activity */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(donorStats.donations?.lastDonationTime) && (
                  <Chip
                    icon={<CalendarToday />}
                    label={`Last donation: ${formatTimestamp(donorStats.donations?.lastDonationTime)}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {donorStats.source === 'smart_contract' && (
                  <Chip
                    icon={<Verified />}
                    label="Blockchain Verified"
                    color="success"
                    size="small"
                  />
                )}
              </Stack>
            </Box>

            {/* Recent Donations Preview */}
            {donorStats.recentDonations && donorStats.recentDonations.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Recent Verified Donations
                </Typography>
                <Stack spacing={1}>
                  {donorStats.recentDonations.slice(-5).reverse().map((donation, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                        border: 1,
                        borderColor: alpha(theme.palette.primary.main, 0.1)
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {donation.charity.name || 'Charity'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(donation.timestamp)}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" fontWeight="bold" color="primary">
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

export default DonorStatsCard;