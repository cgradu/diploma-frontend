// frontend/src/components/projects/ProjectList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllProjects, 
  getProjectsByCharityId, 
  getProjectStatuses, 
  reset 
} from '../../redux/slices/projectSlice';
import ProjectCard from './ProjectCard';
import { 
  Grid, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Pagination, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  TextField,
  Button
} from '@mui/material';
import { SearchOutlined, FilterListOutlined, RestartAlt } from '@mui/icons-material';

const ProjectList = ({ charityId = null, showFilters = true, limit = 10 }) => {
  const dispatch = useDispatch();
  const { 
    projects = [], 
    pagination = { 
      total: 0, 
      page: 1, 
      limit: 10, 
      totalPages: 0 
    }, 
    statuses = [], 
    isLoading = false, 
    isError = false, 
    message = '' 
  } = useSelector(state => state.project || {});
  
  // Local state for filters
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  // Fetch project statuses on mount
  useEffect(() => {
    dispatch(getProjectStatuses());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  // Fetch projects based on filters
  useEffect(() => {
    if (charityId) {
      dispatch(getProjectsByCharityId({ 
        charityId, 
        status: statusFilter !== 'All' ? statusFilter : undefined 
      }));
    } else {
      dispatch(getAllProjects({ 
        page, 
        limit, 
        filters: {
          status: statusFilter !== 'All' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined,
          ...filters
        }
      }));
    }
  }, [dispatch, page, limit, statusFilter, searchQuery, filters, charityId]);
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // Handle status filter change
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle search submission
  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1); // Reset to first page when search is submitted
  };
  
  // Handle filter reset
  const handleReset = () => {
    setStatusFilter('All');
    setSearchQuery('');
    setFilters({});
    setPage(1);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Alert severity="error">
        Error: {message}
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* Filters */}
      {showFilters && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListOutlined sx={{ mr: 1 }} />
            Filter Projects
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            {/* Status filter */}
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="All">All Statuses</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Search input */}
            <Grid item xs={12} sm={6} md={6}>
              <form onSubmit={handleSearch} style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search projects"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: (
                      <SearchOutlined color="action" />
                    )
                  }}
                />
              </form>
            </Grid>
            
            {/* Reset button */}
            <Grid item xs={12} sm={2} md={3}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAlt />}
                onClick={handleReset}
                fullWidth
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Projects grid */}
      {projects.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {projects.map(project => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard project={project} showCharity={!charityId} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {!charityId && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Alert severity="info">
          No projects found. {showFilters && 'Try adjusting your filters or create a new project.'}
        </Alert>
      )}
    </Box>
  );
};

export default ProjectList;