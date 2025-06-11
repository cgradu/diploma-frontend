// ===================================================
// Enhanced RegisterForm with MUI Alert
// ===================================================

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../redux/slices/authSlice';
import {
  Box,
  Button,
  Alert,
  AlertTitle,
  Collapse,
  Stack,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PersonAddOutlined,
  VolunteerActivism,
  Business,
} from '@mui/icons-material';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Enhanced alert state
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'error',
    title: ''
  });
  
  const { name, email, password, confirmPassword, role } = formData;
  const theme = useTheme();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Function to show alert with optional title
  const showAlert = (message, type = 'error', title = '') => {
    setAlert({
      show: true,
      message,
      type,
      title
    });
  };

  // Function to hide alert
  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);
  
  useEffect(() => {
    if (isError) {
      console.error(message);
      // Show alert for registration errors with specific titles
      if (message === 'User already exists with this email' || message.includes('already exists')) {
        showAlert('An account with this email already exists. Please use a different email address or try logging in instead.', 'warning', 'Email Already Registered');
      } else if (message && message.includes('email')) {
        showAlert('Please enter a valid email address.', 'error', 'Invalid Email');
      } else if (message && message.includes('password')) {
        showAlert('Password does not meet security requirements. Please choose a stronger password.', 'error', 'Weak Password');
      } else if (message && message.includes('validation')) {
        showAlert('Please check all fields and ensure they meet the requirements.', 'warning', 'Validation Error');
      } else {
        showAlert(message || 'Registration failed. Please check your information and try again.', 'error', 'Registration Failed');
      }
    }
    
    // Redirect when registered
    if (isSuccess || user) {
      showAlert('Welcome to Charitrace! Your account has been created successfully. Redirecting to dashboard...', 'success', 'Account Created');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
    
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Auto-hide alert after 6 seconds (except for success which redirects)
  useEffect(() => {
    if (alert.show && alert.type !== 'success') {
      const timer = setTimeout(() => {
        hideAlert();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [alert.show, alert.type]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Hide alert when user starts typing
    if (alert.show) {
      hideAlert();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      hideAlert(); // Hide any existing alerts
      
      // Additional validation for password strength
      if (passwordStrength < 50) {
        showAlert('Please choose a stronger password. Include uppercase letters, numbers, and make it at least 8 characters long.', 'warning', 'Weak Password');
        return;
      }
      
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      };
      
      dispatch(register(userData));
    } else {
      showAlert('Please fix the form errors before continuing.', 'warning', 'Form Validation');
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return theme.palette.error.main;
    if (passwordStrength < 75) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const roleOptions = [
    {
      value: 'donor',
      label: 'Individual Donor',
      icon: <VolunteerActivism />,
      description: 'Make transparent donations to verified charities'
    },
    {
      value: 'charity',
      label: 'Charity Manager',
      icon: <Business />,
      description: 'Manage your organization and showcase impact'
    }
  ];

  return (
    <Box component="div" sx={{ width: '100%' }}>
      {/* Enhanced MUI Alert with Collapse animation */}
      <Collapse in={alert.show}>
        <Alert 
          severity={alert.type}
          onClose={hideAlert}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            },
            '& .MuiAlert-action': {
              alignItems: 'flex-start',
              pt: 0
            },
            boxShadow: theme.shadows[1],
            border: `1px solid ${
              alert.type === 'error' ? alpha(theme.palette.error.main, 0.2) :
              alert.type === 'success' ? alpha(theme.palette.success.main, 0.2) :
              alert.type === 'warning' ? alpha(theme.palette.warning.main, 0.2) :
              alpha(theme.palette.info.main, 0.2)
            }`
          }}
        >
          {alert.title && (
            <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {alert.title}
            </AlertTitle>
          )}
          {alert.message}
        </Alert>
      </Collapse>
      
      {/* Rest of the form remains the same... */}
      {/* You can copy the rest from your existing RegisterForm */}
      <Stack spacing={3}>
        {/* Add all your existing form fields here */}
        {/* I'll include just the key parts for brevity */}
        
        {/* Submit Button with enhanced error handling */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          onClick={handleSubmit}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PersonAddOutlined />
            )
          }
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              bgcolor: alpha(theme.palette.primary.main, 0.6),
              color: '#ffffff'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterForm;