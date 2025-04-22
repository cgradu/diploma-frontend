// frontend/src/pages/ProjectsPage.js
import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import ProjectList from '../components/projects/ProjectList';

const ProjectsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary">Projects</Typography>
        </Breadcrumbs>
        
        {/* Page Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Active Projects
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Browse active charitable projects and make a transparent donation with blockchain verification.
        </Typography>
        
        {/* Projects List */}
        <Box sx={{ mt: 4 }}>
          <ProjectList />
        </Box>
      </Box>
    </Container>
  );
};

export default ProjectsPage;