import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider
} from '@mui/material';
import {
  Person,
  Email,
  Add,
  Phone,
  LocationOn,
  Lock,
  Refresh,
  Delete,
  Visibility,
  VisibilityOff,
  Business,
  Save,
  Security,
  Check,
  Info,
  CheckCircle,
  Cancel,
  Warning,
  DeleteForever
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
  logout,
  reset 
} from '../redux/slices/authSlice';
import { getManagerCharity, updateCharityDetails, resetCharityState, createCharity, deleteCharity, reactivateCharity } from '../redux/slices/charitySlice';

// Password validation hook
const usePasswordValidation = (password) => {
  const [validation, setValidation] = useState({
    isValid: false,
    errors: [],
    requirements: {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false
    },
    strength: 'Very Weak'
  });

  useEffect(() => {
    const validatePassword = (pwd) => {
      const errors = [];
      const requirements = {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
      };

      if (!pwd || pwd.length < 8) {
        errors.push('Password must be at least 8 characters long');
      } else {
        requirements.minLength = true;
      }

      if (!/[A-Z]/.test(pwd)) {
        errors.push('Password must include at least one uppercase letter');
      } else {
        requirements.hasUppercase = true;
      }

      if (!/[a-z]/.test(pwd)) {
        errors.push('Password must include at least one lowercase letter');
      } else {
        requirements.hasLowercase = true;
      }

      if (!/\d/.test(pwd)) {
        errors.push('Password must include at least one number');
      } else {
        requirements.hasNumber = true;
      }

      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) {
        errors.push('Password must include at least one special character');
      } else {
        requirements.hasSpecialChar = true;
      }

      const metRequirements = Object.values(requirements).filter(Boolean).length;
      let strength = 'Very Weak';
      
      switch (metRequirements) {
        case 2: strength = 'Weak'; break;
        case 3: strength = 'Fair'; break;
        case 4: strength = 'Good'; break;
        case 5: strength = 'Strong'; break;
      }

      return {
        isValid: errors.length === 0,
        errors,
        requirements,
        strength
      };
    };

    setValidation(validatePassword(password));
  }, [password]);

  return validation;
};

// Password strength indicator component
const PasswordStrengthIndicator = ({ strength, isValid, theme }) => {
  const getStrengthColor = () => {
    switch (strength) {
      case 'Very Weak': return theme.palette.error.main;
      case 'Weak': return theme.palette.warning.main;
      case 'Fair': return theme.palette.info.main;
      case 'Good': return theme.palette.primary.main;
      case 'Strong': return theme.palette.success.main;
      default: return theme.palette.grey[300];
    }
  };

  const getStrengthValue = () => {
    switch (strength) {
      case 'Very Weak': return 20;
      case 'Weak': return 40;
      case 'Fair': return 60;
      case 'Good': return 80;
      case 'Strong': return 100;
      default: return 0;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
          Password Strength:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            color: getStrengthColor()
          }}
        >
          {strength}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={getStrengthValue()}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.grey[300], 0.3),
          '& .MuiLinearProgress-bar': {
            backgroundColor: getStrengthColor(),
            borderRadius: 4,
          }
        }}
      />
    </Box>
  );
};

// Requirements checklist component
const PasswordRequirements = ({ requirements, theme }) => {
  const requirementsList = [
    { key: 'minLength', text: 'At least 8 characters long' },
    { key: 'hasUppercase', text: 'Include uppercase letters (A-Z)' },
    { key: 'hasLowercase', text: 'Include lowercase letters (a-z)' },
    { key: 'hasNumber', text: 'Include at least one number (0-9)' },
    { key: 'hasSpecialChar', text: 'Include at least one special character (!@#$%^&*)' }
  ];

  return (
    <Card
      elevation={0}
      sx={{
        mt: 2,
        bgcolor: alpha(theme.palette.info.main, 0.05),
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info sx={{ color: theme.palette.info.main, fontSize: 18 }} />
          Password Requirements
        </Typography>
        <List dense sx={{ py: 0 }}>
          {requirementsList.map(({ key, text }) => (
            <ListItem key={key} sx={{ py: 0.25, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                {requirements[key] ? (
                  <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
                ) : (
                  <Cancel sx={{ fontSize: 16, color: theme.palette.grey[400] }} />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={text}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { 
                    color: requirements[key] ? theme.palette.success.main : theme.palette.text.secondary 
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const { managerCharity, isLoading: charityLoading } = useSelector((state) => state.charities);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCharityDialogOpen, setDeleteCharityDialogOpen] = useState(false); // Added this state
  
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
  
  // Loading states for different form submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation
  const newPasswordValidation = usePasswordValidation(passwordInfo.newPassword);
  const confirmPasswordMatch = passwordInfo.newPassword && passwordInfo.confirmPassword && 
    passwordInfo.newPassword === passwordInfo.confirmPassword;

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

  const [createCharityOpen, setCreateCharityOpen] = useState(false);
  const [createCharityData, setCreateCharityData] = useState({
    name: '',
    description: '',
    mission: '',
    email: '',
    phone: '',
    registrationId: '',
    category: '',
    address: '',
    foundedYear: ''
  });

  // Fixed delete charity handler
  const handleDeleteCharity = async () => {
    setIsSubmitting(true);
    
    try {
      await dispatch(deleteCharity(charityInfo.id)).unwrap();
      
      toast.success('Charity organization deleted successfully');
      setDeleteCharityDialogOpen(false);
      
      // Reset charity state
      setCharityInfo({
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
      
      // Refresh user profile to get updated role
      dispatch(getProfile());
      
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
      setDeleteCharityDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (user && !profileFetchAttempted) {
      dispatch(getProfile())
        .unwrap()
        .then(() => {
          setProfileFetchAttempted(true);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
        });
      
      if (user.role === 'charity') {
        dispatch(getManagerCharity())
          .unwrap()
          .catch(error => {
            console.error("Error fetching managed charity:", error);
          });
      }
    }
    
    if (user) {
      setGeneralInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [dispatch, user, profileFetchAttempted]);
  
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
  
  useEffect(() => {
    return () => {
      dispatch(resetCharityState());
      dispatch(reset());
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
    
    if (!newPasswordValidation.isValid) {
      toast.error('New password does not meet security requirements');
      setIsSubmitting(false);
      return;
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('New passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (passwordInfo.currentPassword === passwordInfo.newPassword) {
      toast.error('New password must be different from current password');
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
      const updatePromise = dispatch(updateCharityDetails(charityInfo)).unwrap();
      const delayPromise = new Promise(resolve => setTimeout(resolve, 800));
      
      await Promise.all([updatePromise, delayPromise]);
      
      toast.success('Charity information updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    
    try {
      await dispatch(deleteAccount()).unwrap();
      
      toast.success('Account deleted successfully');
      setDeleteDialogOpen(false);
      
      // Navigate to home page after successful deletion
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
      setDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCharity = async (charityData) => {
    setIsSubmitting(true);
    
    try {
      await dispatch(createCharity(charityData)).unwrap();
      
      toast.success('Charity organization created successfully!');
      setCreateCharityOpen(false);
      
      // Reset form data
      setCreateCharityData({
        name: '',
        description: '',
        mission: '',
        email: '',
        phone: '',
        registrationId: '',
        category: '',
        address: '',
        foundedYear: ''
      });
      
      // Refresh the charity data
      dispatch(getManagerCharity());
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCharityDataChange = (e) => {
    setCreateCharityData({
      ...createCharityData,
      [e.target.name]: e.target.value
    });
  };

const handleReactivateCharity = async () => {
  try {
    setIsSubmitting(true);
    await dispatch(reactivateCharity(managerCharity.id)).unwrap();
    
    // Simple alert instead of snackbar
    alert('Charity organization reactivated successfully!');
    
    // Refresh charity data
    dispatch(getManagerCharity());
  } catch (error) {
    alert(error || 'Failed to reactivate charity organization');
  } finally {
    setIsSubmitting(false);
  }
};

const handleCancelCharity = async () => {
  if (window.confirm('Are you sure you want to cancel your charity organization? You can reactivate it later, but it will stop accepting new donations.')) {
    try {
      setIsSubmitting(true);
      await dispatch(deleteCharity(managerCharity.id)).unwrap();
      
      alert('Charity organization cancelled successfully. You can reactivate it anytime.');
      
      // Refresh charity data to show cancelled state
      dispatch(getManagerCharity());
    } catch (error) {
      alert(error || 'Failed to cancel charity organization');
    } finally {
      setIsSubmitting(false);
    }
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

  // Only show 2 tabs instead of 3 (removed donor preferences)
  const tabLabels = [
    'General Information',
    'Security Settings'
  ];

  // Add charity details tab only for charity users
  if (user?.role === 'charity') {
    tabLabels.push('Charity Details');
  }

  const isPasswordFormValid = passwordInfo.currentPassword && 
    newPasswordValidation.isValid && 
    confirmPasswordMatch;

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
                icon={user?.role === 'charity' ? <Business /> : <Person />}
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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

            {/* Security Settings Panel */}
            {activeTab === 1 && (
              <Box>
                {/* Change Password Section */}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                        error={passwordInfo.newPassword && !newPasswordValidation.isValid}
                        helperText={
                          passwordInfo.newPassword && !newPasswordValidation.isValid
                            ? 'Password does not meet requirements'
                            : ''
                        }
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                      
                      {passwordInfo.newPassword && (
                        <PasswordStrengthIndicator 
                          strength={newPasswordValidation.strength}
                          isValid={newPasswordValidation.isValid}
                          theme={theme}
                        />
                      )}
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
                        error={
                          passwordInfo.confirmPassword && 
                          passwordInfo.newPassword && 
                          !confirmPasswordMatch
                        }
                        helperText={
                          passwordInfo.confirmPassword && 
                          passwordInfo.newPassword && 
                          !confirmPasswordMatch
                            ? 'Passwords do not match'
                            : passwordInfo.confirmPassword && confirmPasswordMatch
                            ? 'Passwords match!'
                            : ''
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: theme.palette.action.active }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {passwordInfo.confirmPassword && passwordInfo.newPassword && (
                                  confirmPasswordMatch ? (
                                    <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                  ) : (
                                    <Warning sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                                  )
                                )}
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                  </Grid>

                  {passwordInfo.newPassword && (
                    <PasswordRequirements 
                      requirements={newPasswordValidation.requirements}
                      theme={theme}
                    />
                  )}

                  {passwordInfo.newPassword && passwordInfo.currentPassword && 
                  passwordInfo.newPassword === passwordInfo.currentPassword && (
                    <Alert 
                      severity="warning" 
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      New password must be different from your current password
                    </Alert>
                  )}

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
                        disabled={isSubmitting || !isPasswordFormValid}
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

                {/* Delete Account Section */}
                {user?.role === 'donor' && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteForever sx={{ color: theme.palette.error.main }} />
                        Delete Account
                      </Typography>
                      
                      <Alert 
                        severity="warning" 
                        sx={{ mb: 3, borderRadius: 2 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                          Account Deletion Policy
                        </Typography>
                        <Typography variant="body2">
                          When you delete your account, your personal information will be removed, but your donations will be preserved anonymously to maintain transparency and comply with financial regulations. This action cannot be undone.
                        </Typography>
                      </Alert>

                      <Card
                        elevation={0}
                        sx={{
                          border: `2px solid ${theme.palette.error.main}`,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.error.main, 0.05)
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.error.main, mb: 2 }}>
                            Permanently Delete Account
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            This will permanently delete your account and remove all your personal information. 
                            Your donation history will be preserved anonymously for transparency purposes.
                          </Typography>

                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteForever />}
                            onClick={() => setDeleteDialogOpen(true)}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1.5,
                              fontWeight: 'bold'
                            }}
                          >
                            Delete My Account
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  </>
                )}
              </Box>
            )}

            {/* Charity Details Panel */}
            {activeTab === 2 && user?.role === 'charity' && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ color: theme.palette.primary.main }} />
                  Charity Organization Details
                </Typography>

                {charityLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : !managerCharity ? (
                  // Show Create Charity Section when no charity exists
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Business sx={{ fontSize: 80, color: theme.palette.grey[300], mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'text.secondary' }}>
                      No Charity Organization Found
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500, mx: 'auto' }}>
                      You don't have a charity organization associated with your account yet. 
                      Create one now to start managing your charity's projects and receive donations.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => setCreateCharityOpen(true)}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    >
                      Create My Organization
                    </Button>
                  </Box>
                ) : managerCharity.status === 'CANCELLED' || managerCharity.isCancelled ? (
                  // Show Reactivate Section for cancelled charity
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Business sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                      Charity Organization Cancelled
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.warning.main }}>
                      {managerCharity.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                      Your charity organization was cancelled on{' '}
                      <strong>
                        {managerCharity.deletedAt ? new Date(managerCharity.deletedAt).toLocaleDateString() : 'Unknown date'}
                      </strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                      All donation data and transparency records have been preserved. 
                      You can reactivate your organization at any time to continue accepting donations and managing projects.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Refresh />}
                        onClick={handleReactivateCharity}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 2,
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          bgcolor: theme.palette.success.main,
                          '&:hover': { bgcolor: theme.palette.success.dark }
                        }}
                      >
                        {isSubmitting ? 'Reactivating...' : 'Reactivate Organization'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Info />}
                        onClick={() => {/* Show charity details in read-only mode */}}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 2,
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                    
                    {/* Show charity stats even when cancelled */}
                    <Box sx={{ mt: 4, p: 3, bgcolor: theme.palette.grey[50], borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.secondary' }}>
                        Organization Statistics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Total Donations</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {managerCharity.stats?.donationsCount || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Total Projects</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {managerCharity.stats?.projectsCount || 0}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                ) : (
                  // Existing charity form for active charities
                  <Box>
                    {/* Add status indicator for active charity */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.success.light, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: theme.palette.success.main }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.dark }}>
                        Organization Status: Active
                      </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleCharitySubmit}>
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
                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isSubmitting && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                              Updating charity details...
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
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
                      </Box>
                    </Box>
                    {/* Delete Charity Section */}
                    <Divider sx={{ my: 4 }} />

                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteForever sx={{ color: theme.palette.error.main }} />
                        Delete Organization
                      </Typography>
                      
                      <Alert 
                        severity="warning" 
                        sx={{ mb: 3, borderRadius: 2 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                          Organization Deletion Policy
                        </Typography>
                        <Typography variant="body2">
                          Your organization will be <strong>cancelled</strong> to preserve transparency data. You can reactivate it later.
                          <br />
                          All donation records and transparency data are always preserved for audit purposes.
                        </Typography>
                      </Alert>

                      <Card
                        elevation={0}
                        sx={{
                          border: `2px solid ${theme.palette.error.main}`,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.error.main, 0.05)
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.error.main, mb: 2 }}>
                            Cancel Organization
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            This action will either cancel or permanently delete your charity organization depending on your donation history. 
                            All transparency data will be preserved regardless.
                          </Typography>

                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteForever />}
                            onClick={() => setDeleteCharityDialogOpen(true)}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1.5,
                              fontWeight: 'bold'
                            }}
                          >
                            Cancel My Organization
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Delete Charity Confirmation Dialog */}
        <Dialog
          open={deleteCharityDialogOpen}
          onClose={() => !isSubmitting && setDeleteCharityDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.error.main }}>
            <DeleteForever />
            Confirm Organization Cancellation
          </DialogTitle>
          
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Are you sure you want to proceed with cancelling your charity organization?
            </DialogContentText>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                What will happen:
              </Typography>
              <List dense sx={{ mt: 1 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Info sx={{ fontSize: 16, color: theme.palette.info.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Your organization will be CANCELLED (can be reactivated later)"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="All donation records and transparency data will always be preserved"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Alert>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setDeleteCharityDialogOpen(false)}
              disabled={isSubmitting}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCharity}
              color="error"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <DeleteForever />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {isSubmitting ? 'Processing...' : 'Proceed with Deletion'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Charity Dialog */}
        <Dialog
          open={createCharityOpen}
          onClose={() => !isSubmitting && setCreateCharityOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business sx={{ color: theme.palette.primary.main }} />
            Create Charity Organization
          </DialogTitle>
          
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    name="name"
                    value={createCharityData.name}
                    onChange={handleCreateCharityDataChange}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    name="registrationId"
                    value={createCharityData.registrationId}
                    onChange={handleCreateCharityDataChange}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Organization Type</InputLabel>
                    <Select
                      name="category"
                      value={createCharityData.category}
                      onChange={handleCreateCharityDataChange}
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
                    label="Organization Email"
                    name="email"
                    type="email"
                    value={createCharityData.email}
                    onChange={handleCreateCharityDataChange}
                    required
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
                    value={createCharityData.description}
                    onChange={handleCreateCharityDataChange}
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
                    rows={3}
                    value={createCharityData.mission}
                    onChange={handleCreateCharityDataChange}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setCreateCharityOpen(false)}
              disabled={isSubmitting}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCreateCharity(createCharityData)}
              variant="contained"
              disabled={isSubmitting || !createCharityData.name || !createCharityData.registrationId || !createCharityData.category}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Save />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Profile;