import React from 'react';
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
  PersonAddOutlined,
  CheckCircle
} from '@mui/icons-material';
import RegisterForm from '../components/auth/RegisterForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Register = () => {
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

  const benefits = [
    "Track your donations in real-time",
    "See verified impact of your contributions",
    "Connect with trusted charities worldwide",
    "Access detailed transparency reports"
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container 
        component="main" 
        maxWidth="md"
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
            Join the Transparency Revolution
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '500px', mx: 'auto', lineHeight: 1.5 }}
          >
            Create your account and start making transparent, verifiable impact
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Benefits Section - Hidden on mobile */}
          <Box 
            sx={{ 
              flex: 1, 
              display: { xs: 'none', md: 'block' } 
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: 'fit-content',
                position: 'sticky',
                top: 20
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CheckCircle sx={{ color: theme.palette.success.main }} />
                Why Join Charitrace?
              </Typography>
              
              <Stack spacing={2}>
                {benefits.map((benefit, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2 
                    }}
                  >
                    <CheckCircle 
                      sx={{ 
                        color: theme.palette.success.main, 
                        fontSize: 20,
                        mt: 0.1
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Join thousands of donors worldwide
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      12K+
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active Donors
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      $2.4M
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Donated
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Register Form Container */}
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '500px' } }}>
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
                <PersonAddOutlined sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
                >
                  Create Account
                </Typography>
              </Box>

              {/* Register Form Component */}
              <RegisterForm />

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

            {/* Mobile Benefits - Shown only on small screens */}
            <Box 
              sx={{ 
                mt: 4, 
                display: { xs: 'block', md: 'none' } 
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}
                >
                  ✨ Join 12K+ donors creating transparent impact worldwide
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                  Every donation is tracked on the blockchain for complete transparency
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Register;