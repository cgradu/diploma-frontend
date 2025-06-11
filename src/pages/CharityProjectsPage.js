// frontend/src/pages/CharityProjectsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCharityById } from '../redux/slices/charitySlice';
import { getProjectsByCharityId, getProjectStatuses, deleteProject, reset } from '../redux/slices/projectSlice';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  InputAdornment,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Skeleton,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search,
  VolunteerActivism,
  Verified,
  ClearAll,
  ExpandMore,
  Visibility,
  Business,
  FolderOpen,
  CheckCircle,
  Pause,
  Cancel,
  PlayArrow,
  Add,
  ArrowBack,
  CalendarToday,
  Edit,
  Delete,
  Warning
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import EditProjectModal from './EditProjectModal';
import CreateProjectModal from './CreateProjectModal';

const CharityProjectsPage = () => {
  const { charityId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get charity and projects from Redux store
  const { 
    charity = null, 
    isLoading: isLoadingCharity = false, 
    isError: isErrorCharity = false, 
    message: charityMessage = ''
  } = useSelector(state => state.charities || {});

  const { 
    projects = [], 
    statuses = [], 
    isLoading: isLoadingProjects = false, 
    isError: isErrorProjects = false, 
    message: projectMessage = '' 
  } = useSelector(state => state.projects || {});
  
  const { user } = useSelector(state => state.auth);
  
  // Local state for filtering
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputSearchTerm, setInputSearchTerm] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    projectId: null,
    projectTitle: ''
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  
  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Fetch charity and projects on mount
  useEffect(() => {
    console.log('Dispatching getCharityById for ID:', charityId);
    dispatch(getCharityById(charityId));
    
    console.log('Dispatching getProjectsByCharityId for charityId:', charityId);
    dispatch(getProjectsByCharityId({ charityId }));
    
    console.log('Dispatching getProjectStatuses');
    dispatch(getProjectStatuses());
  }, [dispatch, charityId]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setInputSearchTerm(e.target.value);
  };
  
  // Handle search input keypress (for Enter key)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(inputSearchTerm);
    }
  };
  
  // Simple status filter change handler
  const handleStatusChange = (e) => {
    const value = e.target.value;
    console.log('Status filter changed to:', value);
    setStatusFilter(value);
    setSearchTerm('');
    setInputSearchTerm('');
  };

  const handleSearchSubmit = () => {
    setSearchTerm(inputSearchTerm);
  };

  const clearFilters = () => {
    setInputSearchTerm('');
    setSearchTerm('');
    setStatusFilter('All');
  };
  
  // Check if user is charity owner
  const isCharityOwner = () => {
    if (!user || !charity) return false;
    console.log('Checking if user is charity owner:', charity.id , user.managedCharity.id);
    return user.managedCharity.id === charity.id || user.role === 'admin';
  };

// Alternative version using Redux action (if you have a delete action)
const handleDeleteProject = async (projectId) => {
  try {
    console.log('Deleting project with ID:', projectId);
    
    // If you have a deleteProject action in your Redux slice
    const result = await dispatch(deleteProject(projectId));
    
    if (result.type.endsWith('/fulfilled')) {
      console.log('Delete successful');
      
      // Refresh projects list
      dispatch(getProjectsByCharityId({ charityId }));
      
      // Close dialog
      setDeleteDialog({ open: false, projectId: null, projectTitle: '' });
    } else {
      console.error('Delete failed:', result);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};

  // Open delete confirmation dialog
  const openDeleteDialog = (projectId, projectTitle) => {
    setDeleteDialog({
      open: true,
      projectId,
      projectTitle
    });
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      projectId: null,
      projectTitle: ''
    });
  };
  
  // Derive loading and error states for UI
  const isLoading = isLoadingCharity || isLoadingProjects;
  const isError = isErrorCharity || isErrorProjects;
  const errorMessage = charityMessage || projectMessage;
  
  // Filter projects directly during render
  const filteredProjects = (() => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return [];
    }

    let filtered = [...projects];
    
    // Apply status filter (if not "All")
    if (statusFilter !== 'All') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title?.toLowerCase().includes(query) || 
        project.description?.toLowerCase().includes(query)
      );
    }
    return filtered;
  })();

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <PlayArrow sx={{ fontSize: 16 }} />;
      case 'COMPLETED': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'PAUSED': return <Pause sx={{ fontSize: 16 }} />;
      case 'CANCELLED': return <Cancel sx={{ fontSize: 16 }} />;
      default: return <FolderOpen sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'primary';
      case 'PAUSED': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateProgress = (current, goal) => {
    if (!goal) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const handleEditClick = (project) => {
  setSelectedProject(project);
  setEditModalOpen(true);
};

const handleEditModalClose = () => {
  setEditModalOpen(false);
  setSelectedProject(null);
};

const handleEditSuccess = () => {
  // Refresh projects data after successful edit
  dispatch(getProjectsByCharityId({ charityId }));
};

const handleCreateClick = () => {
  setCreateModalOpen(true);
};

const handleCreateModalClose = () => {
  setCreateModalOpen(false);
};

const handleCreateSuccess = () => {
  // Refresh projects data after successful creation
  dispatch(getProjectsByCharityId({ charityId }));
};


  const ProjectCard = ({ project }) => (
    <Card
      elevation={0}
      sx={{
        width: 400,
        height: 520,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        margin: '0 auto',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.main
        }
      }}
    >
      {/* Project Header */}
      <Box
        sx={{
          height: 120,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <FolderOpen sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.3) }} />
        
        {/* Status Badge */}
        <Chip
          icon={getStatusIcon(project.status)}
          label={project.status}
          size="small"
          color={getStatusColor(project.status)}
          sx={{
            position: 'absolute',
            top: 6,
            left: 6,
            fontWeight: 'bold',
            fontSize: '0.6rem',
            height: 18
          }}
        />
        
        {/* Days Remaining Badge */}
        {project.daysRemaining !== null && project.status === 'ACTIVE' && (
          <Chip
            icon={<CalendarToday sx={{ fontSize: 12 }} />}
            label={`${project.daysRemaining}d`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: theme.palette.info.main,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              height: 24
            }}
          />
        )}

        {/* Management Buttons for Charity Owners */}
        {isCharityOwner() && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              display: 'flex',
              gap: 0.5
            }}
          >
           <Tooltip title="Edit Project">
            <IconButton
              onClick={() => handleEditClick(project)} // CHANGED: from Link to onClick
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
              }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

            <Tooltip title="Delete Project">
              <IconButton
                onClick={() => openDeleteDialog(project.id, project.title)}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: theme.palette.error.main,
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 1)',
                    color: theme.palette.error.dark
                  }
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Project Title */}
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            lineHeight: 1.2,
            height: '2.4em',
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}
        >
          {project.title}
        </Typography>

        {/* Project Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.25,
            height: '3.6em',
            display: '-webkit-box',
            '-webkit-line-clamp': 3,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            lineHeight: 1.2,
            fontSize: '1rem',
            wordBreak: 'break-word'
          }}
        >
          {project.description}
        </Typography>

        {/* Progress Section */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {calculateProgress(project.currentAmount, project.goal)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateProgress(project.currentAmount, project.goal)}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: theme.palette.primary.main
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formatCurrency(project.currentAmount)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatCurrency(project.goal)}
            </Typography>
          </Box>
        </Box>

        {/* Project Metrics */}
        <Box sx={{ mt: 'auto', mb: 1 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.2,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontSize: '0.9rem' }}>
                  {project.donationsCount || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Donors
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.2,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, fontSize: '0.9rem' }}>
                  {project.progressPercentage || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Funded
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.2,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.success.main, fontSize: '0.9rem' }}>
                  {project.daysRemaining || '∞'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Days
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 2.25, pt: 0, justifyContent: 'space-between', flexShrink: 0 }}>
        <Button
          component={Link}
          to={`/projects/${project.id}`}
          variant="outlined"
          size="medium"
          startIcon={<Visibility />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'medium',
            fontSize: '0.875rem',
            px: 2.25,
            py: 0.75,
            minWidth: 'auto'
          }}
        >
          Details
        </Button>
        
        {/* Management Buttons */}
        {isCharityOwner() ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => handleEditClick(project)} // CHANGED: from Link to onClick
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto'
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => openDeleteDialog(project.id, project.title)}
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Delete />}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto'
              }}
            >
              Delete
            </Button>
          </Box>
        ) : (
          (!user || user.role !== 'charity') && (
            <Button
              component={Link}
              to={`/donate?projectId=${project.id}&charityId=${charityId}`}
              variant="contained"
              size="medium"
              startIcon={<VolunteerActivism />}
              disabled={project.status !== 'ACTIVE'}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 2.25,
                py: 0.75,
                minWidth: 'auto',
                bgcolor: project.status === 'ACTIVE' ? theme.palette.secondary.main : undefined,
                '&:hover': {
                  bgcolor: project.status === 'ACTIVE' ? theme.palette.secondary.dark : undefined,
                  transform: project.status === 'ACTIVE' ? 'translateY(-1px)' : 'none',
                  boxShadow: project.status === 'ACTIVE' ? theme.shadows[4] : undefined
                }
              }}
            >
              {project.status === 'ACTIVE' ? 'Donate' : 'N/A'}
            </Button>
          )
        )}
      </CardActions>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card elevation={0} sx={{ width: 400, height: 480, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, margin: '0 auto' }}>
      <Skeleton variant="rectangular" height={80} />
      <CardContent sx={{ p: 2 }}>
        <Skeleton variant="text" height={20} width="85%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={14} width="90%" />
        <Skeleton variant="text" height={14} width="75%" sx={{ mb: 1.5 }} />
        <Skeleton variant="text" height={12} width="60%" sx={{ mb: 0.5 }} />
        <Skeleton variant="rectangular" height={6} sx={{ mb: 0.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Skeleton variant="text" width="35%" />
          <Skeleton variant="text" width="25%" />
        </Box>
        <Grid container spacing={1}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={4} key={index}>
              <Skeleton variant="rectangular" height={45} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 1.5, pt: 0 }}>
        <Skeleton variant="rectangular" width={70} height={28} />
        <Skeleton variant="rectangular" width={80} height={28} />
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Navbar />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Confirm Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the project "{deleteDialog.projectTitle}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. If the project has donations, it will be cancelled instead of deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteProject(deleteDialog.projectId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#ffffff',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {charity ? (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {charity.name} Projects
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Browse and support projects by {charity.name}
                </Typography>
              </>
            ) : (
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Charity Projects
              </Typography>
            )}
          </Box>

          {/* Search and Filter Section */}
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              width: '100%'
            }}
          >
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={{ xs: 2, sm: 3, md: 4 }}
              sx={{ alignItems: 'stretch' }}
            >
              {/* Search Input */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' } }}>
                <TextField
                  fullWidth
                  placeholder="Search projects by title or description..."
                  value={inputSearchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: theme.palette.action.active, fontSize: { xs: 20, sm: 24, md: 28 } }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: { xs: '56px', sm: '60px', md: '68px' },
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    }
                  }}
                />
              </Box>

              {/* Status Filter */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusChange}
                    sx={{
                      borderRadius: 2,
                      height: { xs: '56px', sm: '60px', md: '68px' },
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    }}
                  >
                    <MenuItem value="All">All Statuses</MenuItem>
                    {statuses && statuses.length > 0 && (
                      statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Box>

              {/* Search Button */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 15%' } }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearchSubmit}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    height: { xs: '56px', sm: '60px', md: '68px' },
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                  }}
                >
                  Search
                </Button>
              </Box>
            </Stack>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== 'All') && (
              <Box sx={{ 
                mt: { xs: 3, sm: 4, md: 5 }, 
                pt: { xs: 2, sm: 3 }, 
                borderTop: `1px solid ${theme.palette.divider}`
              }}>
                <Stack 
                  direction="row" 
                  spacing={2} 
                  alignItems="center" 
                  flexWrap="wrap" 
                  useFlexGap
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Active filters:
                  </Typography>
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => {
                        setSearchTerm('');
                        setInputSearchTerm('');
                      }}
                      size="medium"
                      color="primary"
                    />
                  )}
                  {statusFilter !== 'All' && (
                    <Chip
                      label={`Status: ${statusFilter}`}
                      onDelete={() => setStatusFilter('All')}
                      size="medium"
                      color="primary"
                    />
                  )}
                  <Button
                    startIcon={<ClearAll />}
                    onClick={clearFilters}
                    size="medium"
                  >
                    Clear All
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ 
              mt: { xs: 3, sm: 4 }, 
              pt: { xs: 2, sm: 3 }, 
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Button
                component={Link}
                to={charity ? `/charities/${charity.id}` : '/charities'}
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)'
                  }
                }}
              >
                Back to {charity ? 'Charity Profile' : 'Charities'}
              </Button>

              {isCharityOwner() && (
                <Button
                  onClick={handleCreateClick} // CHANGED: from Link to onClick
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    bgcolor: theme.palette.success.main,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark
                    }
                  }}
                >
                  Add New Project
                </Button>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Charity Info Summary */}
        {charity && !isLoading && (
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              mb: 4,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: theme.palette.primary.main,
                  mr: 2
                }}
              >
                <Business sx={{ fontSize: 24 }} />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {charity.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={charity.category}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}
                  />
                  <Chip
                    icon={<Verified sx={{ fontSize: 14 }} />}
                    label="Verified"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}
                  />
                </Stack>
              </Box>
              {(!user || user.role !== 'charity') && (
              <Button
                component={Link}
                to={`/donate?charityId=${charity.id}`}
                variant="contained"
                size="medium"
                startIcon={<VolunteerActivism />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  bgcolor: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark
                  }
                }}
              >
                Donate
              </Button>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Summary Statistics */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 0.5 }}>
                    {projects?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.success.main, mb: 0.5 }}>
                    {projects?.filter(p => p.status === 'ACTIVE').length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Projects
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 0.5 }}>
                    {formatCurrency(projects?.reduce((sum, project) => sum + (project.goal || 0), 0) || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Funding Goal
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Debug Panel */}
        {user?.role === 'admin' && (
          <Accordion sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                🔧 Debug Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Loading:</strong> {isLoading ? '✓' : '✗'}<br/>
                    <strong>Error:</strong> {isError ? '✓' : '✗'}<br/>
                    <strong>Projects from API:</strong> {projects?.length || 0}<br/>
                    <strong>Filtered Projects:</strong> {filteredProjects?.length || 0}<br/>
                    <strong>Projects Array Type:</strong> {Array.isArray(projects) ? 'Array' : typeof projects}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Charity ID:</strong> {charityId}<br/>
                    <strong>Status Filter:</strong> {statusFilter}<br/>
                    <strong>Search Term:</strong> {searchTerm || 'None'}<br/>
                    <strong>Is Owner:</strong> {isCharityOwner() ? '✓' : '✗'}<br/>
                    <strong>Available Statuses:</strong> {statuses?.join(', ') || 'None'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Redux State Structure:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                    {JSON.stringify({ charity: !!charity, projects: Array.isArray(projects), statuses }, null, 2)}
                  </Typography>
                </Paper>
              </Box>
              
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Raw Project Data (click to expand)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 240, overflow: 'auto' }}>
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.7rem' }}>
                      {JSON.stringify(projects || [], null, 2)}
                    </Typography>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Error State */}
        {isError && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Error Loading Projects
            </Typography>
            <Typography variant="body2">
              {errorMessage || 'Failed to load projects. Please try again later.'}
            </Typography>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start' }}>
            {[...Array(6)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </Box>
        )}

        {/* No Results State */}
        {!isLoading && (!filteredProjects || filteredProjects.length === 0) && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}
          >
            <Box sx={{ mb: 3 }}>
              <FolderOpen sx={{ fontSize: 64, color: theme.palette.action.disabled }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              No projects found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {statusFilter !== 'All' 
                ? `No projects with status "${statusFilter}" found.` 
                : `This charity doesn't have any projects yet.`
              }
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              {statusFilter !== 'All' && (
                <Button
                  variant="contained"
                  startIcon={<ClearAll />}
                  onClick={() => setStatusFilter('All')}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    px: 4
                  }}
                >
                  Show all projects
                </Button>
              )}
              {isCharityOwner() && (
                <Button
                  onClick={handleCreateClick} // CHANGED: from Link to onClick
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    px: 4,
                    bgcolor: theme.palette.success.main,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark
                    }
                  }}
                >
                  Create first project
                </Button>
              )}
            </Stack>
          </Paper>
        )}

        {/* Projects Grid */}
        {!isLoading && filteredProjects && filteredProjects.length > 0 && (
          <>
            {/* Results Count */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''} Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {statusFilter !== 'All' && `Filtered by status: ${statusFilter}`}
                {searchTerm && ` • Search: "${searchTerm}"`}
              </Typography>
            </Box>

            {/* Projects Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start', mb: 6 }}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Box>

            {/* Status Filter Pills */}
            {statuses && statuses.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Filter by Status
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={2} 
                  justifyContent="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    label={`All Projects (${projects?.length || 0})`}
                    onClick={() => setStatusFilter('All')}
                    color={statusFilter === 'All' ? 'primary' : 'default'}
                    variant={statusFilter === 'All' ? 'filled' : 'outlined'}
                    sx={{
                      fontWeight: statusFilter === 'All' ? 'bold' : 'medium',
                      fontSize: '0.9rem',
                      height: 36,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: statusFilter === 'All' ? undefined : alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  />
                  
                  {statuses.map(status => {
                    const count = projects?.filter(p => p.status === status).length || 0;
                    if (count > 0) {
                      return (
                        <Chip
                          key={status}
                          label={`${status.replace('_', ' ')} (${count})`}
                          onClick={() => setStatusFilter(status)}
                          color={statusFilter === status ? getStatusColor(status) : 'default'}
                          variant={statusFilter === status ? 'filled' : 'outlined'}
                          icon={statusFilter === status ? getStatusIcon(status) : undefined}
                          sx={{
                            fontWeight: statusFilter === status ? 'bold' : 'medium',
                            fontSize: '0.9rem',
                            height: 36,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: statusFilter === status ? undefined : alpha(theme.palette[getStatusColor(status)].main, 0.1)
                            }
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </Stack>
              </Paper>
            )}
          </>
        )}

        {/* Call to Action Section */}
        {!isLoading && charity && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              textAlign: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: theme.palette.primary.main }}>
              Support {charity.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: '500px', mx: 'auto' }}>
              Your donation helps fund these important projects and makes a real difference in the community.
              Every contribution is tracked transparently on the blockchain.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1.5} 
              justifyContent="center"
              alignItems="center"
            >
              {(user.role === 'donor') && (
              <Button
                component={Link}
                to={`/donate?charityId=${charity.id}`}
                variant="contained"
                size="medium"
                startIcon={<VolunteerActivism />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  bgcolor: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                    transform: 'translateY(-1px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                Donate to Charity
              </Button>
              )}
              <Button
                component={Link}
                to={`/charities/${charity.id}`}
                variant="outlined"
                size="large"
                startIcon={<Visibility />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'medium',
                  px: 3,
                  py: 1
                }}
              >
                View Profile
              </Button>
            </Stack>
          </Paper>
        )}
      </Container>
      <EditProjectModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        project={selectedProject}
        onSuccess={handleEditSuccess}
      />
      <CreateProjectModal
        open={createModalOpen}
        onClose={handleCreateModalClose}
        charity={charity}
        onSuccess={handleCreateSuccess}
      />

    </Box>
  );
};

export default CharityProjectsPage;