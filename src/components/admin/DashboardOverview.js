// src/components/admin/DashboardOverview.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Favorite as CharityIcon,
  Assignment as ProjectIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

import {
  getDashboardStats,
  getAnalytics,
  getSystemHealth
} from '../../redux/slices/adminSlice';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { 
    dashboardStats, 
    analytics, 
    systemHealth, 
    isLoading 
  } = useSelector((state) => state.admin);

  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAnalytics(timeframe));
    dispatch(getSystemHealth());
  }, [dispatch, timeframe]);

  const refreshData = () => {
    dispatch(getDashboardStats());
    dispatch(getAnalytics(timeframe));
    dispatch(getSystemHealth());
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Prepare user role data for pie chart
  const userRoleData = dashboardStats?.usersByRole ? 
    Object.entries(dashboardStats.usersByRole).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: count
    })) : [];

  // Prepare trends data
  const trendsData = dashboardStats?.trends || [];

  if (!dashboardStats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTimeframe('7d')}
            color={timeframe === '7d' ? 'primary' : 'inherit'}
          >
            7D
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTimeframe('30d')}
            color={timeframe === '30d' ? 'primary' : 'inherit'}
          >
            30D
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTimeframe('90d')}
            color={timeframe === '90d' ? 'primary' : 'inherit'}
          >
            90D
          </Button>
          <Tooltip title="Refresh data">
            <IconButton onClick={refreshData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* System Health Alerts */}
      {systemHealth?.alerts && systemHealth.alerts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6">System Alerts</Typography>
          <ul>
            {systemHealth.alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h4">
                        {dashboardStats.overview.totalUsers}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <CharityIcon />
                    </Avatar>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Active Charities
                      </Typography>
                      <Typography variant="h4">
                        {dashboardStats.overview.totalCharities}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                      <PaymentIcon />
                    </Avatar>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Donations
                      </Typography>
                      <Typography variant="h4">
                        {dashboardStats.overview.totalDonations}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="success.main">
                    ${dashboardStats.overview.totalDonationAmount?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: dashboardStats.overview.verificationRate > 90 ? 'success.main' : 'warning.main', 
                      mr: 2 
                    }}>
                      <SecurityIcon />
                    </Avatar>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Verification Rate
                      </Typography>
                      <Typography variant="h4" color={
                        dashboardStats.overview.verificationRate > 90 ? 'success.main' : 'warning.main'
                      }>
                        {dashboardStats.overview.verificationRate?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardStats.overview.verificationRate || 0}
                    color={dashboardStats.overview.verificationRate > 90 ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* User Roles Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              {userRoleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Donation Trends Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Donation Trends ({timeframe})
              </Typography>
              {trendsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'donations' ? value : `$${value.toLocaleString()}`,
                        name === 'donations' ? 'Donations' : 'Amount'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="donations"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">No trend data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              {systemHealth ? (
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Overall Health"
                      secondary={`${systemHealth.healthScores?.overallHealth || 0}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <SecurityIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Verification Rate"
                      secondary={`${systemHealth.healthScores?.verificationRate || 0}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: systemHealth.healthScores?.failureRate > 5 ? 'error.main' : 'success.main' }}>
                        {systemHealth.healthScores?.failureRate > 5 ? <WarningIcon /> : <CheckCircleIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Failure Rate"
                      secondary={`${systemHealth.healthScores?.failureRate || 0}%`}
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography color="textSecondary">Loading health data...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {dashboardStats.recentActivity && dashboardStats.recentActivity.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Donation ID</TableCell>
                        <TableCell>Donor</TableCell>
                        <TableCell>Charity</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardStats.recentActivity.slice(0, 5).map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>#{activity.id}</TableCell>
                          <TableCell>{activity.donor}</TableCell>
                          <TableCell>{activity.charity}</TableCell>
                          <TableCell>
                            {activity.currency} {activity.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={activity.status}
                              color={activity.status === 'SUCCEEDED' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(activity.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No recent activity</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;