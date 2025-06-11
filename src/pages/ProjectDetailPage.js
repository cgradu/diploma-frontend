// frontend/src/pages/ProjectDetailPage.js
import React from 'react';
import { Container, Box } from '@mui/material';
import ProjectDetail from '../components/projects/ProjectDetail';
import Navbar from '../components/layout/Navbar';

const ProjectDetailPage = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <ProjectDetail />
        </Box>
      </Container>
    </>
  );
};

export default ProjectDetailPage;