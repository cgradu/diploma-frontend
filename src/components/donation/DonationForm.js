// src/components/donation/DonationForm.js
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  InputAdornment,
  Fade,
  Grow,
  useTheme,
  alpha,
  Stack,
  Avatar,
  Paper
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  Campaign as CampaignIcon,
  Message as MessageIcon
} from '@mui/icons-material';

// Updated imports to use the new active functions
import { fetchActiveCharities } from '../../redux/slices/charitySlice';
import { fetchActiveProjectsByCharity } from '../../redux/slices/projectSlice';

const presetAmounts = [10, 25, 50, 100];

const DonationForm = ({ initialData, onComplete }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    amount: initialData.amount || 25,
    charityId: initialData.charityId || '',
    projectId: initialData.projectId || '',
    message: initialData.message || '',
    anonymous: initialData.anonymous || false,
    currency: 'RON' // Fixed to RON only
  });

  // Updated selectors to use activeCharities and activeProjects
  const activeCharities = useSelector(state => state.charities.activeCharities || []);
  const activeProjects = useSelector(state => state.projects.activeProjects || []);
  const charitiesLoading = useSelector(state => state.charities.loading);
  const projectsLoading = useSelector(state => state.projects.loading);

  console.log('Active Projects:', activeProjects);
  console.log('Active Charities:', activeCharities);
  
  const [customAmount, setCustomAmount] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  // Updated to use activeCharities
  const selectedCharity = useMemo(() => {
    return activeCharities.find(charity => charity.id.toString() === formData.charityId.toString());
  }, [activeCharities, formData.charityId]);

  // Updated to use activeProjects
  const selectedProject = useMemo(() => {
    return activeProjects.find(project => project.id.toString() === formData.projectId.toString());
  }, [activeProjects, formData.projectId]);

  // Fetch active charities on component mount
  useEffect(() => {
    dispatch(fetchActiveCharities());
  }, [dispatch]);

  // Updated to use fetchActiveProjectsByCharity
  useEffect(() => {
    if (formData.charityId && formData.charityId !== 'undefined') {
      const charityIdValue = parseInt(formData.charityId, 10);
      if (!isNaN(charityIdValue)) {
        dispatch(fetchActiveProjectsByCharity(charityIdValue));
      }
    }
  }, [formData.charityId, dispatch]);

  useEffect(() => {
    if (initialData.charityId && formData.charityId !== initialData.charityId) {
      setFormData(prev => ({
        ...prev,
        charityId: initialData.charityId
      }));
    }
  }, [initialData.charityId, formData.charityId]);

  useEffect(() => {
    if (initialData.projectId && formData.projectId !== initialData.projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: initialData.projectId
      }));
    }
  }, [initialData.projectId, formData.projectId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'charityId' && value !== prev.charityId ? { projectId: '' } : {})
    }));
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount
    }));
    setCustomAmount(false);
    
    if (errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: null
      }));
    }
  };
  
  const handleCustomAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      amount: value
    }));
    
    if (value > 0 && errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.charityId) {
      newErrors.charityId = 'Please select a charity';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };
  
  const isLoading = useMemo(() => 
    charitiesLoading || projectsLoading, 
    [charitiesLoading, projectsLoading]
  );

  const formatAmount = (amount) => {
    return `${amount} lei`;
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={3}>
        {/* Charity Selection */}
        <Grid item xs={12}>
          <Card 
            variant="outlined" 
            sx={{ 
              border: focusedField === 'charity' ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
              transition: 'border 0.2s ease',
              background: selectedCharity ? alpha(theme.palette.primary.main, 0.02) : 'transparent'
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Select Charity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose the organization you want to support
                  </Typography>
                </Box>
              </Stack>

              <FormControl 
                fullWidth 
                error={!!errors.charityId}
                onFocus={() => setFocusedField('charity')}
                onBlur={() => setFocusedField('')}
              >
                <InputLabel>Charity Organization</InputLabel>
                <Select
                  name="charityId"
                  value={formData.charityId}
                  onChange={handleChange}
                  label="Charity Organization"
                  disabled={isLoading}
                  startAdornment={
                    selectedCharity && (
                      <InputAdornment position="start">
                        <FavoriteIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }
                >
                  <MenuItem value="">
                    <em>Select a charity</em>
                  </MenuItem>
                  {/* Updated to use activeCharities */}
                  {activeCharities.map(charity => (
                    <MenuItem key={charity.id} value={charity.id}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {charity.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {charity.category?.replace('_', ' ').toLowerCase()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.charityId && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.charityId}
                  </Typography>
                )}
              </FormControl>

              {selectedCharity && (
                <Fade in timeout={500}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mt: 2, 
                      background: alpha(theme.palette.primary.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {selectedCharity.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedCharity.description || selectedCharity.mission}
                    </Typography>
                    <Chip 
                      label={selectedCharity.category?.replace('_', ' ')} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Paper>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Project Selection - Always Visible */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  <CampaignIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Select Project
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose which specific project to support
                  </Typography>
                </Box>
              </Stack>

              <FormControl fullWidth error={!!errors.projectId}>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  label="Project"
                  disabled={isLoading || !formData.charityId || activeProjects.length === 0}
                >
                  {!formData.charityId ? (
                    <MenuItem value="">
                      <em>First select a charity</em>
                    </MenuItem>
                  ) : activeProjects.length === 0 ? (
                    <MenuItem value="">
                      <em>{isLoading ? 'Loading projects...' : 'No active projects available'}</em>
                    </MenuItem>
                  ) : (
                    /* Updated to use activeProjects */
                    activeProjects.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {project.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Goal: {project.goal} lei • Progress: {project.progressPercentage || ((project.currentAmount / project.goal) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.projectId && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.projectId}
                  </Typography>
                )}
              </FormControl>

              {selectedProject && (
                <Fade in timeout={500}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {selectedProject.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedProject.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${formatAmount(selectedProject.currentAmount)} raised`}
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`${formatAmount(selectedProject.goal)} goal`}
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      {selectedProject.daysRemaining && (
                        <Chip 
                          label={`${selectedProject.daysRemaining} days left`}
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Amount Selection */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Donation Amount
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select an amount or enter a custom value (in RON)
                  </Typography>
                </Box>
              </Stack>

              {/* Preset Amounts */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Quick Select
                </Typography>
                <Grid container spacing={1}>
                  {presetAmounts.map(amount => (
                    <Grid item xs={6} sm={3} key={amount}>
                      <Button
                        fullWidth
                        variant={formData.amount === amount && !customAmount ? 'contained' : 'outlined'}
                        onClick={() => handleAmountSelect(amount)}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          ...(formData.amount === amount && !customAmount && {
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            '&:hover': {
                              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            }
                          })
                        }}
                      >
                        {formatAmount(amount)}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Custom Amount Toggle */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customAmount}
                    onChange={() => setCustomAmount(!customAmount)}
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight="medium">
                    Enter custom amount
                  </Typography>
                }
                sx={{ mb: customAmount ? 2 : 0 }}
              />

              {/* Custom Amount Input */}
              {customAmount && (
                <Grow in timeout={400}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Custom Amount"
                    value={formData.amount}
                    onChange={handleCustomAmountChange}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          lei
                        </InputAdornment>
                      ),
                      inputProps: { min: 1, step: 1 }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        }
                      }
                    }}
                  />
                </Grow>
              )}

              {/* Amount Summary */}
              {formData.amount > 0 && (
                <Fade in timeout={500}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mt: 2, 
                      background: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" color="success.main" textAlign="center">
                      {formatAmount(formData.amount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Your generous contribution
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Message */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <MessageIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Personal Message
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add an optional message with your donation
                  </Typography>
                </Box>
              </Stack>

              <TextField
                fullWidth
                multiline
                rows={3}
                name="message"
                label="Your message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share why this cause matters to you..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Options */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  {formData.anonymous ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Privacy Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose how your donation appears
                  </Typography>
                </Box>
              </Stack>

              <FormControlLabel
                control={
                  <Checkbox
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.warning.main,
                      }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Make this donation anonymous
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your name will not be displayed publicly with this donation
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              boxShadow: theme.shadows[4],
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: theme.palette.grey[300],
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            startIcon={!isLoading && <FavoriteIcon />}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid',
                    borderColor: `${theme.palette.primary.main} transparent ${theme.palette.primary.main} transparent`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                Loading...
              </Box>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DonationForm;