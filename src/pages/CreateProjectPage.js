// frontend/src/pages/CreateProjectPage.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/projects/ProjectForm';

const CreateProjectPage = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Check if user is authorized (charity or admin)
  useEffect(() => {
    if (user && user.role !== 'charity' && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || (user.role !== 'charity' && user.role !== 'admin')) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </MuiLink>
          <Typography color="text.primary">Create Project</Typography>
        </Breadcrumbs>
        
        {/* Page Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Project
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Create a new fundraising project for your charity. Define your goals, timeline, and requirements.
        </Typography>
        
        {/* Project Form */}
        <Box sx={{ mt: 4 }}>
          <ProjectForm />
        </Box>
      </Box>
    </Container>
  );
};

export default CreateProjectPage;