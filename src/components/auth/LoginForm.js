import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../../redux/slices/authSlice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Collapse,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginOutlined
} from '@mui/icons-material';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Enhanced alert state
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'error',
    title: ''
  });
  
  const { email, password } = formData;
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
  
  useEffect(() => {
    if (isError) {
      console.error(message);
      // Show alert for login errors with specific titles
      if (message === 'Invalid credentials') {
        showAlert('Invalid email or password. Please double-check your credentials and try again.', 'error', 'Login Failed');
      } else if (message && message.includes('Network')) {
        showAlert('Unable to connect to the server. Please check your internet connection and try again.', 'error', 'Connection Error');
      } else if (message && message.includes('429')) {
        showAlert('Too many login attempts. Please wait a few minutes before trying again.', 'warning', 'Rate Limited');
      } else {
        showAlert(message || 'Login failed. Please try again.', 'error', 'Error');
      }
    }
    
    // Redirect when logged in
    if (isSuccess || user) {
      showAlert('Welcome back! Redirecting to your dashboard...', 'success', 'Login Successful');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
    
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Auto-hide alert after 5 seconds (except for success which redirects)
  useEffect(() => {
    if (alert.show && alert.type !== 'success') {
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show, alert.type]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      dispatch(login(formData));
    } else {
      showAlert('Please fix the form errors before continuing.', 'warning', 'Form Validation');
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      
      <Stack spacing={3}>
        {/* Email Field */}
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={isLoading}
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
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderWidth: 2,
              }
            }
          }}
          placeholder="Enter your email address"
          autoComplete="email"
          autoFocus
        />

        {/* Password Field */}
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: theme.palette.action.active }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                  disabled={isLoading}
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderWidth: 2,
              }
            }
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {/* Forgot Password */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            component={Link}
            to="/forgot-password"
            variant="text"
            size="small"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Forgot password?
          </Button>
        </Box>

        {/* Login Button */}
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
              <LoginOutlined />
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
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        {/* Sign Up Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            New to Charitrace?{' '}
            <Button
              component={Link}
              to="/register"
              variant="text"
              disabled={isLoading}
              sx={{
                fontWeight: 'bold',
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Create an account
            </Button>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoginForm;