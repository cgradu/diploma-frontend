// frontend/src/components/projects/EditProjectModal.js
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { Close, Save, Cancel } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { useDispatch, useSelector } from 'react-redux';
import { updateProject } from '../redux/slices/projectSlice';

const PROJECT_STATUSES = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED'];

const EditProjectModal = ({ open, onClose, project, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector(state => state.projects);
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    goal: project?.goal?.toString() || '',
    startDate: project?.startDate ? new Date(project.startDate) : new Date(),
    endDate: project?.endDate ? new Date(project.endDate) : null,
    status: project?.status || 'ACTIVE'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Update form when project changes
  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        goal: project.goal?.toString() || '',
        startDate: project.startDate ? new Date(project.startDate) : new Date(),
        endDate: project.endDate ? new Date(project.endDate) : null,
        status: project.status || 'ACTIVE'
      });
    }
  }, [project]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date ? date.toDate() : null }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
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
    
    return errors;
  };
  
  const handleSubmit = async () => {
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
    
    try {
      await dispatch(updateProject({ 
        id: project.id, 
        projectData 
      })).unwrap();
      
      console.log('Project updated successfully');
      setSubmitting(false);
      onSuccess?.(); // Callback to refresh parent data
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      setSubmitting(false);
    }
  };
  
  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Edit Project
          </Typography>
          <IconButton 
            onClick={handleClose} 
            disabled={submitting}
            sx={{ color: 'grey.500' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {message || 'An error occurred while updating the project'}
          </Alert>
        )}
        
        <LocalizationProvider 
          dateAdapter={AdapterDayjs} 
          adapterLocale="en-gb"
        >
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
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
              />
            </Grid>
            
            {/* Status */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel>Project Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Project Status"
                  disabled={submitting}
                >
                  {PROJECT_STATUSES.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                format="DD/MM/YYYY"
                value={formData.startDate ? dayjs(formData.startDate) : null}
                onChange={(date) => handleDateChange('startDate', date)}
                disabled={submitting}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!formErrors.startDate,
                    helperText: formErrors.startDate
                  }
                }}
              />
            </Grid>
            
            {/* End Date */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date (Optional)"
                format="DD/MM/YYYY"
                value={formData.endDate ? dayjs(formData.endDate) : null}
                onChange={(date) => handleDateChange('endDate', date)}
                disabled={submitting}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.endDate,
                    helperText: formErrors.endDate || "Leave blank for ongoing projects"
                  }
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={submitting}
          startIcon={<Cancel />}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          variant="contained"
          startIcon={submitting ? <CircularProgress size={20} /> : <Save />}
          sx={{ minWidth: 120 }}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;