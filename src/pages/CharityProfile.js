import React, { useEffect} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCharityById, reset } from '../redux/slices/charitySlice';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import {
  VolunteerActivism,
  Verified,
  Security,
  Email,
  Phone,
  LocationOn,
  TrendingUp,
  People,
  Assignment,
  Edit,
  Launch,
  ExpandMore
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CharityProfilePage = () => {
  const { charityId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { 
    charity, 
    isLoading, 
    isError, 
    isSuccess,
    message 
  } = useSelector(state => state.charities);
  
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getCharityById(charityId));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, charityId]);

  const isCharityOwner = () => {
    if (!user || !charity) return false;
    return (charity.managerId === user.id) || (user.role === 'admin');
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={300} sx={{ mb: 4 }} />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mb: 4 }} />
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={250} sx={{ mb: 4 }} />
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <LoadingSkeleton />
        <Footer />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
            action={
              <Button
                onClick={() => navigate('/charities')}
                variant="contained"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Back to Charities
              </Button>
            }
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Error Loading Charity
            </Typography>
            <Typography variant="body2">
              {message || "Failed to load charity details. Please try again later."}
            </Typography>
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!charity) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
            No charity data available
          </Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  const ProjectCard = ({ project }) => (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {project.title}
          </Typography>
          <Chip
            label={project.status}
            size="small"
            color={
              project.status === 'ACTIVE' ? 'success' :
              project.status === 'COMPLETED' ? 'primary' :
              project.status === 'PAUSED' ? 'warning' : 'error'
            }
            sx={{ ml: 2 }}
          />
        </Stack>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {project.description}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {Math.round((project.currentAmount / project.goal) * 100)}% Funded
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(project.currentAmount)} / {formatCurrency(project.goal)}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (project.currentAmount / project.goal) * 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }}
          />
        </Box>
        
        <Button
          component={Link}
          to={`/projects/${project.id}`}
          variant="outlined"
          size="small"
          endIcon={<Launch />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          View Project
        </Button>
      </CardContent>
    </Card>
  );

  const StatItem = ({ icon, label, value, color = 'primary' }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 2,
        bgcolor: alpha(theme.palette[color].main, 0.02)
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: theme.palette[color].main,
            width: 40,
            height: 40
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette[color].main }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              {/* Charity Header */}
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: alpha('#ffffff', 0.2),
                        color: '#ffffff',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {charity.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          fontSize: { xs: '1.8rem', md: '2.5rem' }
                        }}
                      >
                        {charity.name}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={charity.category?.replace(/_/g, ' ')}
                          sx={{
                            bgcolor: alpha('#ffffff', 0.2),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                        {charity.foundedYear && (
                          <Chip
                            label={`Est. ${charity.foundedYear}`}
                            variant="outlined"
                            sx={{
                              borderColor: alpha('#ffffff', 0.3),
                              color: '#ffffff'
                            }}
                          />
                        )}
                        <Chip
                          icon={<Verified sx={{ color: '#ffffff !important' }} />}
                          label="Verified"
                          sx={{
                            bgcolor: theme.palette.success.main,
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.9,
                      lineHeight: 1.6,
                      maxWidth: '600px'
                    }}
                  >
                    {charity.mission}
                  </Typography>
                </Box>

                {/* Action Buttons */}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {(!user || user.role !== 'charity') && (
                  <Button
                    component={Link}
                    to={`/donate?charityId=${charityId}`}
                    variant="contained"
                    size="large"
                    startIcon={<VolunteerActivism />}
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: theme.palette.secondary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    Donate Now
                  </Button>
                  )}
                  
                  <Button
                    component={Link}
                    to={`/charities/${charityId}/projects`}
                    variant="outlined"
                    size="large"
                    startIcon={<Assignment />}
                    sx={{
                      borderColor: '#ffffff',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#ffffff',
                        bgcolor: alpha('#ffffff', 0.1)
                      }
                    }}
                  >
                    View Projects
                  </Button>
                  
                  {isCharityOwner() && (
                    <Button
                      component={Link}
                      to={`/dashboard/charity/edit/${charityId}`}
                      variant="outlined"
                      size="large"
                      startIcon={<Edit />}
                      sx={{
                        borderColor: alpha('#ffffff', 0.5),
                        color: alpha('#ffffff', 0.8),
                        py: 1.5,
                        px: 3,
                        borderRadius: 3
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* Quick Stats */}
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: alpha('#ffffff', 0.95),
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: theme.palette.text.primary }}>
                  Impact at a Glance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StatItem
                      icon={<Assignment />}
                      label="Projects"
                      value={charity.projects?.length || 0}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatItem
                      icon={<TrendingUp />}
                      label="Active"
                      value={charity.projects?.filter(p => p.status === 'ACTIVE').length || 0}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatItem
                      icon={<People />}
                      label="Donations"
                      value={charity.stats?.donationsCount || 0}
                      color="secondary"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Debug Panel */}
        {(user?.role === 'admin' || isCharityOwner()) && process.env.NODE_ENV === 'development' && (
          <Accordion sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                🔧 Debug Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Loading:</strong> {isLoading ? '✓' : '✗'}<br/>
                    <strong>Error:</strong> {isError ? '✓' : '✗'}<br/>
                    <strong>Success:</strong> {isSuccess ? '✓' : '✗'}<br/>
                    <strong>Charity ID:</strong> {charityId}<br/>
                    <strong>Is Owner:</strong> {isCharityOwner() ? '✓' : '✗'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Created:</strong> {formatDate(charity?.createdAt)}<br/>
                    <strong>Updated:</strong> {formatDate(charity?.updatedAt)}<br/>
                    <strong>Registration ID:</strong> {charity?.registrationId}<br/>
                    <strong>Manager ID:</strong> {charity?.managerId}<br/>
                    <strong>Projects Count:</strong> {charity?.projects?.length || 0}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} lg={8}>
            {/* About Section */}
            <Paper elevation={0} sx={{ p: 4, mb: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                About Us
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}>
                {charity.description}
              </Typography>
            </Paper>

            {/* Mission Section */}
            <Paper elevation={0} sx={{ p: 4, mb: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}>
                {charity.mission}
              </Typography>
            </Paper>

            {/* Projects Section */}
            <Paper elevation={0} sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Project Highlights
                </Typography>
                <Button
                  component={Link}
                  to={`/charities/${charityId}/projects`}
                  variant="outlined"
                  endIcon={<Launch />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  View All Projects
                </Button>
              </Stack>

              {charity.projects && charity.projects.length > 0 ? (
                <Grid container spacing={3}>
                  {charity.projects.slice(0, 3).map(project => (
                    <Grid item xs={12} md={6} key={project.id}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Assignment sx={{ fontSize: 64, color: theme.palette.action.disabled, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    No Projects Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    This charity hasn't created any projects yet.
                  </Typography>
                  <Button
                    component={Link}
                    to={`/charities/${charityId}/projects`}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Check Projects Page
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Contact Information */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Contact Information
              </Typography>
              
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Email sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={
                      <Typography
                        component="a"
                        href={`mailto:${charity.email}`}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {charity.email}
                      </Typography>
                    }
                  />
                </ListItem>
                
                {charity.phone && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Phone sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={
                        <Typography
                          component="a"
                          href={`tel:${charity.phone}`}
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {charity.phone}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
                
                {charity.address && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={charity.address}
                    />
                  </ListItem>
                )}
              </List>

              <Button
                href={`mailto:${charity.email}`}
                fullWidth
                variant="outlined"
                startIcon={<Email />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Contact Charity
              </Button>
            </Paper>

            {/* Blockchain Verification */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Blockchain Verification
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Security sx={{ fontSize: 32 }} />
                </Avatar>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This charity is verified on the blockchain, ensuring complete transparency for all donations.
                </Typography>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {charity.registrationId}
                  </Typography>
                </Paper>
                
                <Button
                  component={Link}
                  to={`/blockchain/verify?charityId=${charityId}`}
                  variant="contained"
                  size="small"
                  startIcon={<Verified />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    bgcolor: theme.palette.success.main,
                    '&:hover': { bgcolor: theme.palette.success.dark }
                  }}
                >
                  Verify on Blockchain
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default CharityProfilePage;