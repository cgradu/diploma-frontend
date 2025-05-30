// src/components/common/AdminRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box,
  Alert,
  Button
} from '@mui/material';
import { 
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon 
} from '@mui/icons-material';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AdminIcon 
              sx={{ 
                fontSize: 80, 
                color: 'error.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h4" gutterBottom color="error">
              Access Denied
            </Typography>
            <Typography variant="h6" gutterBottom color="textSecondary">
              Administrator Access Required
            </Typography>
            <Typography variant="body1" paragraph>
              You don't have permission to access the admin dashboard. 
              Only users with administrator privileges can access this area.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Current user:</strong> {user.name} ({user.email})
                <br />
                <strong>Role:</strong> {user.role}
                <br />
                <strong>Required role:</strong> admin
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              If you believe this is an error, please contact your system administrator.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // User is authenticated and has admin role
  return children;
};

export default AdminRoute;