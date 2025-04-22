// frontend/src/components/projects/ProjectForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createProject, 
  getProjectById, 
  updateProject, 
  reset, 
  getProjectStatuses 
} from '../../redux/slices/projectSlice';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save, Cancel, Event } from '@mui/icons-material';
import moment from 'moment';

const ProjectForm = ({ charity = null }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { project, statuses, isLoading, isError, isSuccess, message } = useSelector(state => state.project);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    startDate: new Date(),
    endDate: null,
    status: 'ACTIVE',
    charityId: charity?.id || ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch project data if editing
  useEffect(() => {
    if (id) {
      dispatch(getProjectById(id));
    }
    
    dispatch(getProjectStatuses());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);
  
  // Set form data when project is fetched
  useEffect(() => {
    if (id && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        goal: project.goal?.toString() || '',
        startDate: project.startDate ? new Date(project.startDate) : new Date(),
        endDate: project.endDate ? new Date(project.endDate) : null,
        status: project.status || 'ACTIVE',
        charityId: project.charityId || charity?.id || ''
      });
    } else if (charity) {
      setFormData(prev => ({ ...prev, charityId: charity.id }));
    }
  }, [id, project, charity]);
  
  // Handle successful submission
  useEffect(() => {
    if (isSuccess && submitting) {
      navigate(charity ? `/charities/${charity.id}` : '/dashboard');
    }
  }, [isSuccess, submitting, navigate, charity]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.goal) {
      errors.goal = 'Funding goal is required';
    } else if (isNaN(formData.goal) || Number(formData.goal) <= 0) {
      errors.goal = 'Funding goal must be a positive number';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!formData.charityId) {
      errors.charityId = 'Charity is required';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitting(true);
    
    const projectData = {
      ...formData,
      goal: parseFloat(formData.goal)
    };
    
    if (id) {
      // Update existing project
      await dispatch(updateProject({ id, projectData }));
    } else {
      // Create new project
      await dispatch(createProject(projectData));
    }
    
    setSubmitting(false);
  };
  
  // Handle cancel button
  const handleCancel = () => {
    navigate(charity ? `/charities/${charity.id}` : '/dashboard');
  };
  
  if (isLoading && !submitting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {id ? 'Edit Project' : 'Create New Project'}
          </Typography>
          
          {isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Project Title */}
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Project Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                />
              </Grid>
              
              {/* Project Description */}
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Project Description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              
              {/* Funding Goal */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="goal"
                  label="Funding Goal"
                  fullWidth
                  required
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">RON</InputAdornment>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                  value={formData.goal}
                  onChange={handleChange}
                  error={!!formErrors.goal}
                  helperText={formErrors.goal}
                />
              </Grid>
              
              {/* Status (for editing only) */}
              {id && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.status}>
                    <InputLabel id="status-label">Project Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Project Status"
                    >
                      {statuses.map(status => (
                        <MenuItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.status && (
                      <FormHelperText>{formErrors.status}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              
              {/* Start Date */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newDate) => handleDateChange('startDate', newDate)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!formErrors.startDate}
                      helperText={formErrors.startDate}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <Event color="action" />
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* End Date (optional) */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date (Optional)"
                  value={formData.endDate}
                  onChange={(newDate) => handleDateChange('endDate', newDate)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.endDate}
                      helperText={formErrors.endDate || "Leave blank for ongoing projects"}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <Event color="action" />
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* Charity ID (if not provided as prop) */}
              {!charity && (
                <Grid item xs={12}>
                  <TextField
                    name="charityId"
                    label="Charity ID"
                    fullWidth
                    required
                    type="number"
                    value={formData.charityId}
                    onChange={handleChange}
                    error={!!formErrors.charityId}
                    helperText={formErrors.charityId}
                    disabled={id} // Can't change charity when editing
                  />
                </Grid>
              )}
              
              {/* Form Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Saving...
                      </>
                    ) : (
                      id ? 'Update Project' : 'Create Project'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default ProjectForm;