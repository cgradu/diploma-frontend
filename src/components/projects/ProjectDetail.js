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
  Tabs
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
  ChevronLeft,
  ContentCopy,
  Description,
  History,
  Assignment,
  DoneAll,
  ShowChart
} from '@mui/icons-material';
import moment from 'moment';

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      case 'PAUSED':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip 
      label={status.replace('_', ' ')} 
      color={getStatusColor()} 
      size="small" 
      sx={{ fontWeight: 'bold' }}
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
  const { project, isLoading, isError, message } = useSelector(state => state.projects || {});
  console.log(project);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error: {message}
      </Alert>
    );
  }
  
  if (!project) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Project not found
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* Back button */}
      <Button 
        component={Link} 
        to={project.charity ? `/charities/${project.charity.id}` : '/projects'}
        startIcon={<ChevronLeft />} 
        sx={{ mb: 2 }}
      >
        {project.charity ? `Back to ${project.charity.name}` : 'Back to Projects'}
      </Button>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {/* Header with title and status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {project.title}
                </Typography>
                <StatusBadge status={project.status} />
              </Box>
              
              {/* Charity link */}
              {project.Charity && (
                <Typography variant="subtitle1" gutterBottom>
                  by{' '}
                  <Link 
                    to={`/charities/${project.Charity.id}`} 
                    style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                  >
                    {project.Charity.name}
                  </Link>
                </Typography>
              )}
              
              {/* Project tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
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
                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>
                
                {/* Key info boxes */}
                <Grid container spacing={2} sx={{ my: 3 }}>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <CalendarToday color="primary" />
                      <Typography variant="body2" color="text.secondary">Started</Typography>
                      <Typography variant="subtitle2">{formatDate(project.startDate)}</Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <AccessTime color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {project.daysRemaining !== null ? 'Time Left' : 'No End Date'}
                      </Typography>
                      <Typography variant="subtitle2">
                        {project.endDate 
                          ? (project.daysRemaining > 0 
                              ? `${project.daysRemaining} days left` 
                              : 'Campaign ended')
                          : 'Ongoing'}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <MonetizationOn color="primary" />
                      <Typography variant="body2" color="text.secondary">Goal</Typography>
                      <Typography variant="subtitle2">{formatCurrency(project.goal)}</Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <FavoriteBorder color="primary" />
                      <Typography variant="body2" color="text.secondary">Donations</Typography>
                      <Typography variant="subtitle2">{project.donationsCount || 0}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Progress bar */}
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">
                      {formatCurrency(project.currentAmount)} raised
                    </Typography>
                    <Typography variant="h6">
                      {project.progressPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(project.progressPercentage, 100)} 
                    sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    color={project.progressPercentage >= 100 ? "success" : "primary"}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="body2" color="text.secondary">
                      of {formatCurrency(project.goal)} goal
                    </Typography>
                  </Box>
                </Box>
                
                {/* Project time info */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Project Timeline
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(project.startDate)}
                      </Typography>
                    </Grid>
                    
                    {project.endDate && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          End Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(project.endDate)}
                        </Typography>
                      </Grid>
                    )}
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(project.createdAt)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(project.updatedAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {/* Donations tab */}
                <Typography variant="h6" gutterBottom>
                  Donation History
                </Typography>
                
                {project.recentDonations && project.recentDonations.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Donor</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Message</TableCell>
                          <TableCell>Verified</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {project.recentDonations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell>{donation.donorName}</TableCell>
                            <TableCell>{formatCurrency(donation.amount)}</TableCell>
                            <TableCell>{moment(donation.date).format('MMM D, YYYY')}</TableCell>
                            <TableCell>
                              {donation.message || <Typography variant="body2" color="text.secondary">No message</Typography>}
                            </TableCell>
                            <TableCell>
                              {donation.verified ? (
                                <Tooltip title="Blockchain Verified">
                                  <VerifiedUser color="success" />
                                </Tooltip>
                              ) : (
                                <Typography variant="body2" color="text.secondary">Pending</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info" icon={<Info />}>
                    No donations yet. Be the first to donate!
                  </Alert>
                )}
                
                {project.donationsCount > (project.recentDonations?.length || 0) && (
                  <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
                    + {project.donationsCount - project.recentDonations.length} more donations not shown
                  </Typography>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                {/* Verification tab */}
                <Typography variant="h6" gutterBottom>
                  <VerifiedUser fontSize="small" sx={{ mr: 1 }} />
                  Blockchain Verification
                </Typography>
                
                <Typography variant="body2" paragraph>
                  This project's donations are verified on the blockchain for full transparency.
                  Each verified donation includes a unique transaction hash that can be used to verify the donation.
                </Typography>
                
                {project.recentDonations && project.recentDonations.some(d => d.verified) ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Donor</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Transaction Hash</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {project.recentDonations
                          .filter(d => d.verified)
                          .map((donation) => (
                            <TableRow key={donation.id}>
                              <TableCell>{donation.donorName}</TableCell>
                              <TableCell>{formatCurrency(donation.amount)}</TableCell>
                              <TableCell>{moment(donation.date).format('MMM D, YYYY')}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ mr: 1 }}>
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
                  <Alert severity="info" icon={<Info />} sx={{ mt: 2 }}>
                    No blockchain verified donations available yet. Donations are typically verified within 24 hours.
                  </Alert>
                )}
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <VerifiedUser fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                    Verification Process
                  </Typography>
                  <Typography variant="body2" paragraph>
                    All donations on our platform go through a transparent verification process:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Assignment color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold">1. Transaction Recording</Typography>
                      </Box>
                      <Typography variant="body2">
                        Donations are securely recorded in our database with a unique transaction ID.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <ShowChart color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold">2. Blockchain Mirroring</Typography>
                      </Box>
                      <Typography variant="body2">
                        Donation details are mirrored to a private blockchain network for immutability.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <DoneAll color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold">3. Verification</Typography>
                      </Box>
                      <Typography variant="body2">
                        Once recorded on the blockchain, the donation receives a verification badge.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <VerifiedUser color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold">4. Transparency</Typography>
                      </Box>
                      <Typography variant="body2">
                        All verified transactions are publicly available for complete transparency.
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                {/* Progress tab */}
                <Typography variant="h6" gutterBottom>
                  Funding Progress
                </Typography>
                
                <Box sx={{ mt: 2, mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Current Amount: {formatCurrency(project.currentAmount)}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Goal: {formatCurrency(project.goal)}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(project.progressPercentage, 100)} 
                    sx={{ height: 15, borderRadius: 5, mb: 1 }}
                    color={project.progressPercentage >= 100 ? "success" : "primary"}
                  />
                  <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                    {project.progressPercentage}% of funding goal achieved
                  </Typography>
                </Box>
                
                {/* Progress milestones */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Funding Milestones
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {/* 25% Milestone */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label="25%" 
                            color={project.progressPercentage >= 25 ? "success" : "default"} 
                            size="small" 
                            sx={{ mr: 1 }} 
                          />
                          <Typography variant="body2" fontWeight="bold">
                            Initial Funding
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {project.progressPercentage >= 25 
                            ? `Achieved on ${formatDate(project.updatedAt)}` 
                            : `${formatCurrency(project.goal * 0.25)} needed`}
                        </Typography>
                      </Grid>
                      
                      {/* 50% Milestone */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label="50%" 
                            color={project.progressPercentage >= 50 ? "success" : "default"} 
                            size="small" 
                            sx={{ mr: 1 }} 
                          />
                          <Typography variant="body2" fontWeight="bold">
                            Halfway Mark
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {project.progressPercentage >= 50 
                            ? `Achieved on ${formatDate(project.updatedAt)}` 
                            : `${formatCurrency(project.goal * 0.5)} needed`}
                        </Typography>
                      </Grid>
                      
                      {/* 75% Milestone */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label="75%" 
                            color={project.progressPercentage >= 75 ? "success" : "default"} 
                            size="small" 
                            sx={{ mr: 1 }} 
                          />
                          <Typography variant="body2" fontWeight="bold">
                            Major Progress
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {project.progressPercentage >= 75 
                            ? `Achieved on ${formatDate(project.updatedAt)}` 
                            : `${formatCurrency(project.goal * 0.75)} needed`}
                        </Typography>
                      </Grid>
                      
                      {/* 100% Milestone */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label="100%" 
                            color={project.progressPercentage >= 100 ? "success" : "default"} 
                            size="small" 
                            sx={{ mr: 1 }} 
                          />
                          <Typography variant="body2" fontWeight="bold">
                            Fully Funded
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {project.progressPercentage >= 100 
                            ? `Achieved on ${formatDate(project.updatedAt)}` 
                            : `${formatCurrency(project.goal)} needed`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
                
                {/* Time progress */}
                {project.endDate && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Time Progress
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {formatDate(project.startDate)}
                        </Typography>
                        <Typography variant="body2">
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
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        {project.daysRemaining > 0 
                          ? `${project.daysRemaining} days remaining` 
                          : 'Campaign period ended'}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </TabPanel>
              
              {/* Call to action button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              {(!user || user.role !== 'charity') && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  startIcon={<CreditCard />}
                  component={Link}
                  to={`/donate?projectId=${project.id}&charityId=${project.Charity?.id}`}
                  disabled={project.status !== 'ACTIVE' || hasProjectEnded()}
                >
                  Donate Now
                </Button>
                )}
              </Box>
              
              {/* Edit/Delete buttons for charity owners */}
              {isCharityOwner() && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Tooltip title="Edit Project">
                    <IconButton 
                      component={Link}
                      to={`/projects/edit/${project.id}`}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete Project">
                    <IconButton 
                      color="error" 
                      onClick={handleDeleteConfirm}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Charity info card */}
          {project.Charity && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About the Organization
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  {project.Charity.name}
                </Typography>
                
                <Chip 
                  label={project.Charity.category.replace('_', ' ')} 
                  color="primary" 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" paragraph>
                  {project.Charity.description?.substring(0, 150)}
                  {project.Charity.description?.length > 150 ? '...' : ''}
                </Typography>
                
                <Grid container spacing={1} sx={{ mb: 2 }}>
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
                >
                  Visit Charity Page
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Recent donations card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Donations
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              {project.recentDonations && project.recentDonations.length > 0 ? (
                <Box>
                  {project.recentDonations.slice(0, 5).map((donation) => (
                    <Box key={donation.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {donation.donorName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {moment(donation.date).fromNow()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                       <Typography variant="body1" fontWeight="bold">
                         {formatCurrency(donation.amount)}
                       </Typography>
                       
                       {donation.verified && (
                         <Tooltip title="Blockchain Verified">
                           <VerifiedUser color="success" fontSize="small" />
                         </Tooltip>
                       )}
                     </Box>
                     
                     {donation.message && (
                       <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                         "{donation.message}"
                       </Typography>
                     )}
                   </Box>
                 ))}
                 
                 {project.donationsCount > 5 && (
                   <Box sx={{ textAlign: 'center' }}>
                     <Button 
                       size="small" 
                       onClick={() => setTabValue(1)} 
                       sx={{ textTransform: 'none' }}
                     >
                       View all {project.donationsCount} donations
                     </Button>
                   </Box>
                 )}
               </Box>
             ) : (
               <Alert severity="info" icon={<Info />}>
                 No donations yet. Be the first to donate!
               </Alert>
             )}
           </CardContent>
         </Card>
         
         {/* Call to action card */}
        {(!user || user.role !== 'charity') && (
         <Card sx={{ mt: 3, display: { xs: 'block', md: 'none' } }}>
           <CardContent>
             <Typography variant="h6" gutterBottom>
               Support This Project
             </Typography>
             
             <Box sx={{ mt: 2 }}>
               <Button 
                 variant="contained" 
                 color="primary" 
                 size="large" 
                 startIcon={<CreditCard />}
                 component={Link}
                 to={`/donate?projectId=${project.id}&charityId=${project.Charity?.id}`}
                 disabled={project.status !== 'ACTIVE' || hasProjectEnded()}
                 fullWidth
               >
                 Donate Now
               </Button>
             </Box>
           </CardContent>
         </Card>
        )}
         
         {/* Project status card */}
         <Card sx={{ mt: 3 }}>
           <CardContent>
             <Typography variant="h6" gutterBottom>
               Project Status
             </Typography>
             
             <Divider sx={{ mb: 2 }} />
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
               <Typography variant="body2" color="text.secondary">Status:</Typography>
               <StatusBadge status={project.status} />
             </Box>
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
               <Typography variant="body2" color="text.secondary">Created:</Typography>
               <Typography variant="body2">{moment(project.createdAt).format('MMM D, YYYY')}</Typography>
             </Box>
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
               <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
               <Typography variant="body2">{moment(project.updatedAt).format('MMM D, YYYY')}</Typography>
             </Box>
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
               <Typography variant="body2" color="text.secondary">Progress:</Typography>
               <Typography variant="body2">{project.progressPercentage}% funded</Typography>
             </Box>
             
             {project.endDate && (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                 <Typography variant="body2" color="text.secondary">Ends In:</Typography>
                 <Typography variant="body2">
                   {project.daysRemaining > 0 
                     ? `${project.daysRemaining} days` 
                     : 'Campaign ended'}
                 </Typography>
               </Box>
             )}
             
             <Divider sx={{ my: 2 }} />
             
             <Typography variant="subtitle2" gutterBottom>
               Quick Stats
             </Typography>
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography variant="body2" color="text.secondary">Raised:</Typography>
               <Typography variant="body2">{formatCurrency(project.currentAmount)}</Typography>
             </Box>
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography variant="body2" color="text.secondary">Goal:</Typography>
               <Typography variant="body2">{formatCurrency(project.goal)}</Typography>
             </Box>
             
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography variant="body2" color="text.secondary">Donations:</Typography>
               <Typography variant="body2">{project.donationsCount || 0}</Typography>
             </Box>
             
             {project.recentDonations && (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                 <Typography variant="body2" color="text.secondary">Verified:</Typography>
                 <Typography variant="body2">
                   {project.recentDonations.filter(d => d.verified).length} donations
                 </Typography>
               </Box>
             )}
           </CardContent>
         </Card>
       </Grid>
     </Grid>
     
     {/* Delete confirmation dialog */}
     <Dialog
       open={openDeleteDialog}
       onClose={() => setOpenDeleteDialog(false)}
     >
       <DialogTitle>Delete Project</DialogTitle>
       <DialogContent>
         <DialogContentText>
           Are you sure you want to delete this project? 
           {project.donationsCount > 0 ? 
             " Since this project has donations, it will be marked as 'CANCELLED' instead of being permanently deleted." :
             " This action cannot be undone."}
         </DialogContentText>
       </DialogContent>
       <DialogActions>
         <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
         <Button onClick={handleDelete} color="error" variant="contained">
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