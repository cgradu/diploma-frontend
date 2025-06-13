import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Business, Add } from '@mui/icons-material';

const CreateCharityModal = ({ open, onClose, onSubmit, isSubmitting, theme }) => {
  const [charityData, setCharityData] = useState({
    name: '',
    description: '',
    mission: '',
    email: '',
    phone: '',
    registrationId: '',
    category: '',
    address: '',
    foundedYear: ''
  });

  const [errors, setErrors] = useState({});

  const charityCategories = [
    { value: 'EDUCATION', label: 'Education' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'ENVIRONMENT', label: 'Environment' },
    { value: 'HUMANITARIAN', label: 'Humanitarian' },
    { value: 'ANIMAL_WELFARE', label: 'Animal Welfare' },
    { value: 'ARTS_CULTURE', label: 'Arts & Culture' },
    { value: 'DISASTER_RELIEF', label: 'Disaster Relief' },
    { value: 'HUMAN_RIGHTS', label: 'Human Rights' },
    { value: 'COMMUNITY_DEVELOPMENT', label: 'Community Development' },
    { value: 'RELIGIOUS', label: 'Religious' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharityData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!charityData.name.trim()) newErrors.name = 'Organization name is required';
    if (!charityData.email.trim()) newErrors.email = 'Email is required';
    if (!charityData.registrationId.trim()) newErrors.registrationId = 'Registration ID is required';
    if (!charityData.category) newErrors.category = 'Category is required';
    if (!charityData.description.trim()) newErrors.description = 'Description is required';
    if (!charityData.mission.trim()) newErrors.mission = 'Mission statement is required';

    // Email validation
    if (charityData.email && !/\S+@\S+\.\S+/.test(charityData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Founded year validation
    if (charityData.foundedYear) {
      const year = parseInt(charityData.foundedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        newErrors.foundedYear = `Year must be between 1800 and ${currentYear}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(charityData);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCharityData({
        name: '',
        description: '',
        mission: '',
        email: '',
        phone: '',
        registrationId: '',
        category: '',
        address: '',
        foundedYear: ''
      });
      setErrors({});
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
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        pb: 1,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Business sx={{ color: theme.palette.primary.main }} />
        Create Your Charity Organization
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2">
            Please provide accurate information about your charity organization. 
            This information will be reviewed and verified by our administrators.
          </Typography>
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization Name"
                name="name"
                value={charityData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationId"
                value={charityData.registrationId}
                onChange={handleChange}
                required
                error={!!errors.registrationId}
                helperText={errors.registrationId}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Organization Type *</InputLabel>
                <Select
                  name="category"
                  value={charityData.category}
                  onChange={handleChange}
                  label="Organization Type *"
                  required
                  sx={{ borderRadius: 2 }}
                >
                  {charityCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Founded Year"
                name="foundedYear"
                type="number"
                value={charityData.foundedYear}
                onChange={handleChange}
                error={!!errors.foundedYear}
                helperText={errors.foundedYear}
                inputProps={{ min: 1800, max: new Date().getFullYear() }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization Email"
                name="email"
                type="email"
                value={charityData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization Phone"
                name="phone"
                type="tel"
                value={charityData.phone}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={charityData.address}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={charityData.description}
                onChange={handleChange}
                required
                error={!!errors.description}
                helperText={errors.description || "Briefly describe your organization's activities and goals"}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mission Statement"
                name="mission"
                multiline
                rows={4}
                value={charityData.mission}
                onChange={handleChange}
                required
                error={!!errors.mission}
                helperText={errors.mission || "Describe your organization's core mission and purpose"}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Add />}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {isSubmitting ? 'Creating...' : 'Create Organization'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCharityModal;