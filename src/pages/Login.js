import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reset } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  VolunteerActivism,
  Security,
  Verified,
  ArrowBack,
  LoginOutlined
} from '@mui/icons-material';
import LoginForm from '../components/auth/LoginForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Login = () => {
  const theme = useTheme();

  const trustFeatures = [
    {
      icon: <Security sx={{ fontSize: 20 }} />,
      text: "Blockchain Secured",
      color: theme.palette.success.main
    },
    {
      icon: <Verified sx={{ fontSize: 20 }} />,
      text: "Verified Impact",
      color: theme.palette.primary.main
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 8
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Brand Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <VolunteerActivism 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main,
                mr: 1
              }} 
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                letterSpacing: '-0.5px'
              }}
            >
              Charitrace
            </Typography>
          </Box>

          {/* Trust Badges */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            sx={{ mb: 4 }}
          >
            {trustFeatures.map((feature, index) => (
              <Chip
                key={index}
                icon={feature.icon}
                label={feature.text}
                size="small"
                sx={{
                  bgcolor: alpha(feature.color, 0.1),
                  color: feature.color,
                  border: `1px solid ${alpha(feature.color, 0.2)}`,
                  fontWeight: 'medium'
                }}
              />
            ))}
          </Stack>

          {/* Page Title */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 2
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '400px', mx: 'auto', lineHeight: 1.5 }}
          >
            Sign in to continue your transparent giving journey
          </Typography>
        </Box>

        {/* Login Form Container */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Form Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LoginOutlined sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
            >
              Sign In
            </Typography>
          </Box>

          {/* Login Form Component */}
          <LoginForm />

          {/* Divider */}
          <Divider sx={{ my: 3 }} />
          {/* Additional Actions */}
            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<ArrowBack />}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium',
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              
              Back to Home
            </Button>
        </Paper>

        {/* Bottom Info */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            ✨ Join thousands of donors creating transparent impact
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Every donation is tracked on the blockchain for complete transparency
          </Typography>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Login;