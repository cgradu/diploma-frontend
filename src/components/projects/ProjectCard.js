// frontend/src/components/projects/ProjectCard.js
import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box, LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';

// Project status badges
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ACTIVE':
        return 'success.main';
      case 'COMPLETED':
        return 'info.main';
      case 'CANCELLED':
        return 'error.main';
      case 'PAUSED':
        return 'warning.main';
      default:
        return 'grey.500';
    }
  };

  return (
    <Box
      sx={{
        display: 'inline-block',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: getStatusColor(),
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
      }}
    >
      {status.replace('_', ' ')}
    </Box>
  );
};

const ProjectCard = ({ project, showCharity = false }) => {
  const { 
    id, 
    title, 
    description, 
    goal, 
    currentAmount, 
    startDate,
    endDate,
    status,
    progressPercentage = Math.round((currentAmount / goal) * 100),
    daysRemaining = endDate ? Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))) : null,
    Charity
  } = project;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Truncate description
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Status and category badges */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <StatusBadge status={status} />
          {showCharity && Charity && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: '0.75rem',
              }}
            >
              {Charity.category.replace('_', ' ')}
            </Box>
          )}
        </Box>
        
        {/* Title */}
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        
        {/* Charity name if needed */}
        {showCharity && Charity && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            by <Link to={`/charities/${Charity.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
              {Charity.name}
            </Link>
          </Typography>
        )}
        
        {/* Description */}
        <Typography variant="body2" color="text.secondary" paragraph>
          {truncateText(description)}
        </Typography>
        
        {/* Progress bar */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">
              {formatCurrency(currentAmount)} raised
            </Typography>
            <Typography variant="body2">
              {progressPercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progressPercentage, 100)} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Goal: {formatCurrency(goal)}
            </Typography>
            {daysRemaining !== null ? (
              <Typography variant="body2" color="text.secondary">
                {daysRemaining > 0 
                  ? `${daysRemaining} days left` 
                  : 'Campaign ended'}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No end date
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          component={Link} 
          to={`/projects/${id}`} 
          size="small" 
          color="primary"
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;