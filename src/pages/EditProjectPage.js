// frontend/src/pages/EditProjectPage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Breadcrumbs, Link as MuiLink, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/projects/ProjectForm';
import { getProjectById, reset } from '../redux/slices/projectSlice';

const EditProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector(state => state.auth);
  const { project, isLoading, isError, message } = useSelector(state => state.project);
  
  // Fetch project
  useEffect(() => {
    dispatch(getProjectById(id));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);
  
  // Check if user is authorized (charity owner or admin)
  useEffect(() => {
    if (project && user) {
      const isOwner = project.Charity && project.Charity.userId === user.id;
      const isAdmin = user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [project, user, navigate]);
  
  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }
  
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (isError) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            Error: {message || 'Could not load project'}
          </Alert>
        </Box>
      </Container>
    );
  }
  
  if (!project) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">
            Project not found
          </Alert>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </MuiLink>
          <MuiLink 
            component={Link} 
            to={`/projects/${id}`} 
            underline="hover" 
            color="inherit"
          >
            {project.title}
          </MuiLink>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
        
        {/* Page Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Project
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Update your project's details, funding goal, or timeline.
        </Typography>
        
        {/* Project Form */}
        <Box sx={{ mt: 4 }}>
          <ProjectForm />
        </Box>
      </Box>
    </Container>
  );
};

export default EditProjectPage;