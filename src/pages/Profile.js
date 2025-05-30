import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Lock,
  Visibility,
  VisibilityOff,
  Business,
  Save,
  Security,
  Favorite,
  Check,
  Info
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProfile, updateProfile, updateProfileDetails, changePassword } from '../redux/slices/authSlice';
import { getManagerCharity, updateCharityDetails, resetCharityState } from '../redux/slices/charitySlice';

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const { managerCharity, isLoading: charityLoading } = useSelector((state) => state.charities);
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Create separate states for different form sections
  const [generalInfo, setGeneralInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Charity information state (for charity managers)
  const [charityInfo, setCharityInfo] = useState({
    id: '',
    name: '',
    description: '',
    mission: '',
    email: '',
    phone: '',
    registrationId: '',
    category: '',
    address: '',
    foundedYear: '',
  });
  
  // Donor preferences state (for donors)
  const [donorInfo, setDonorInfo] = useState({
    preferredCauses: [],
    donationPreferences: '',
  });
  
  // Loading states for different form submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charityCategories = [
    { value: 'EDUCATION', label: 'Education' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'ENVIRONMENT', label: 'Environment' },
    { value: 'HUMANITARIAN', label: 'Humanitarian' },
    { value: 'ANIMAL_WELFARE', label: 'Animal Welfare' },
    { value: 'ARTS_CULTURE', label: 'Arts & Culture' },
    { value: 'DISASTER_RELIEF', label: 'Disaster Relief' },
    { value: 'HUMAN_RIGHTS', label: 'Human Rights' },
    { value: 'COMMUNITY_DEVELOPMENT', label: 'Community Development' },
    { value: 'RELIGIOUS', label: 'Religious' },
    { value: 'OTHER', label: 'Other' }
  ];

  const donorCauses = [
    'Education', 'Healthcare', 'Environment', 'Animal Welfare',
    'Human Rights', 'Disaster Relief', 'Poverty Reduction', 'Other'
  ];
  
  useEffect(() => {
    // Only fetch profile once and only if the user is logged in
    if (user && !profileFetchAttempted) {
      dispatch(getProfile())
        .unwrap()
        .then(() => {
          setProfileFetchAttempted(true);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
        });
      
      // If user is a charity manager, fetch their managed charity
      if (user.role === 'charity') {
        dispatch(getManagerCharity())
          .unwrap()
          .catch(error => {
            console.error("Error fetching managed charity:", error);
          });
      }
    }
    
    // Populate form with user data when available
    if (user) {
      setGeneralInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      
      // Set donor info if user is a donor
      if (user.role === 'donor') {
        setDonorInfo({
          preferredCauses: user.preferredCauses || [],
          donationPreferences: user.donationPreferences || '',
        });
      }
    }
  }, [dispatch, user, profileFetchAttempted]);
  
  // Update charity form when charity data is loaded
  useEffect(() => {
    if (managerCharity) {
      setCharityInfo({
        id: managerCharity.id || '',
        name: managerCharity.name || '',
        description: managerCharity.description || '',
        mission: managerCharity.mission || '',
        email: managerCharity.email || '',
        phone: managerCharity.phone || '',
        registrationId: managerCharity.registrationId || '',
        category: managerCharity.category || '',
        address: managerCharity.address || '',
        foundedYear: managerCharity.foundedYear || '',
      });
    }
  }, [managerCharity]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetCharityState());
    };
  }, [dispatch]);
  
  const handleGeneralInfoChange = (e) => {
    setGeneralInfo({
      ...generalInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleCharityInfoChange = (e) => {
    setCharityInfo({
      ...charityInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleDonorInfoChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: value,
    });
  };
  
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updatePromise = dispatch(updateProfile(generalInfo)).unwrap();
      const delayPromise = new Promise(resolve => setTimeout(resolve, 800));
      
      await Promise.all([updatePromise, delayPromise]);
      
      toast.success('Profile information updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate password inputs
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('New passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const updatePromise = dispatch(changePassword(passwordInfo)).unwrap();
      const delayPromise = new Promise(resolve => setTimeout(resolve, 800));
      
      await Promise.all([updatePromise, delayPromise]);
      
      toast.success('Password changed successfully');
      
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCharitySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(updateCharityDetails(charityInfo)).unwrap();
      toast.success('Charity information updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(updateProfileDetails(donorInfo)).unwrap();
      toast.success('Donor preferences updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !profileFetchAttempted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Container>
        <Footer />
      </Box>
    );
  }

  const tabLabels = [
    'General Information',
    'Change Password',
    user?.role === 'charity' ? 'Charity Details' : 'Donor Preferences'
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: '#ffffff'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
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
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                My Profile
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                Welcome back, {user?.name}!
              </Typography>
              <Chip
                icon={user?.role === 'charity' ? <Business /> : <Favorite />}
                label={user?.role === 'charity' ? 'Charity Organization' : 'Donor'}
                sx={{
                  bgcolor: alpha('#ffffff', 0.2),
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Profile Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  py: 3
                }
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab key={index} label={label} />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box sx={{ p: 4 }}>
            {/* General Information Panel */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleGeneralSubmit}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: theme.palette.primary.main }} />
                  General Information
                </Typography>
                
                <Grid container spacing={3} direction={'column'}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={generalInfo.name}
                      onChange={handleGeneralInfoChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={generalInfo.email}
                      onChange={handleGeneralInfoChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={generalInfo.phone}
                      onChange={handleGeneralInfoChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      multiline
                      rows={3}
                      value={generalInfo.address}
                      onChange={handleGeneralInfoChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <LocationOn sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {isSubmitting && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Updating your profile...
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ ml: 'auto' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold'
                      }}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Information'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Password Panel */}
            {activeTab === 1 && (
              <Box component="form" onSubmit={handlePasswordSubmit}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ color: theme.palette.primary.main }} />
                  Change Password
                </Typography>
                
                <Grid container spacing={3} direction={'column'}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordInfo.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                            >
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordInfo.newPassword}
                      onChange={handlePasswordChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordInfo.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: theme.palette.action.active }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Password Requirements */}
                <Card
                  elevation={0}
                  sx={{
                    mt: 3,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Info sx={{ color: theme.palette.info.main }} />
                      Password Requirements
                    </Typography>
                    <List dense>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="At least 8 characters long" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Include uppercase and lowercase letters" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Include at least one number" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Include at least one special character" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {isSubmitting && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Updating password...
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ ml: 'auto' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Security />}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold'
                      }}
                    >
                      {isSubmitting ? 'Updating...' : 'Change Password'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Role-specific Panel */}
            {activeTab === 2 && user && (
              <>
                {user.role === 'charity' && (
                  <Box component="form" onSubmit={handleCharitySubmit}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business sx={{ color: theme.palette.primary.main }} />
                      Charity Organization Details
                    </Typography>

                    {charityLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : !managerCharity ? (
                      <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        No charity organization found. Please contact an administrator if you believe this is an error.
                      </Alert>
                    ) : (
                      <>
                        <Grid container spacing={3} direction={'column'}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Organization Name"
                              name="name"
                              value={charityInfo.name}
                              onChange={handleCharityInfoChange}
                              required
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Registration Number"
                              name="registrationId"
                              value={charityInfo.registrationId}
                              onChange={handleCharityInfoChange}
                              required
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel>Organization Type</InputLabel>
                              <Select
                                name="category"
                                value={charityInfo.category}
                                onChange={handleCharityInfoChange}
                                label="Organization Type"
                                required
                                sx={{ borderRadius: 2 }}
                              >
                                {charityCategories.map((category) => (
                                  <MenuItem key={category.value} value={category.value}>
                                    {category.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Founded Year"
                              name="foundedYear"
                              type="number"
                              value={charityInfo.foundedYear}
                              onChange={handleCharityInfoChange}
                              inputProps={{ min: 1800, max: new Date().getFullYear() }}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Organization Email"
                              name="email"
                              type="email"
                              value={charityInfo.email}
                              onChange={handleCharityInfoChange}
                              required
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Organization Phone"
                              name="phone"
                              type="tel"
                              value={charityInfo.phone}
                              onChange={handleCharityInfoChange}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              name="address"
                              value={charityInfo.address}
                              onChange={handleCharityInfoChange}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Description"
                              name="description"
                              multiline
                              rows={3}
                              value={charityInfo.description}
                              onChange={handleCharityInfoChange}
                              required
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Mission Statement"
                              name="mission"
                              multiline
                              rows={4}
                              value={charityInfo.mission}
                              onChange={handleCharityInfoChange}
                              required
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            disabled={isSubmitting}
                            sx={{
                              borderRadius: 2,
                              px: 4,
                              py: 1.5,
                              fontWeight: 'bold'
                            }}
                          >
                            {isSubmitting ? 'Updating...' : 'Update Charity Information'}
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                )}

                {user.role === 'donor' && (
                  <Box component="form" onSubmit={handleDonorSubmit}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Favorite sx={{ color: theme.palette.primary.main }} />
                      Donor Preferences
                    </Typography>

                    <Grid container spacing={3} direction={'column'}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Preferred Causes</InputLabel>
                          <Select
                            multiple
                            name="preferredCauses"
                            value={donorInfo.preferredCauses}
                            onChange={handleDonorInfoChange}
                            input={<OutlinedInput label="Preferred Causes" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                            sx={{ borderRadius: 2 }}
                          >
                            {donorCauses.map((cause) => (
                              <MenuItem key={cause} value={cause}>
                                {cause}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Donation Preferences"
                          name="donationPreferences"
                          multiline
                          rows={4}
                          value={donorInfo.donationPreferences}
                          onChange={handleDonorInfoChange}
                          placeholder="Any specific preferences for your donations..."
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontWeight: 'bold'
                        }}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Preferences'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Profile;