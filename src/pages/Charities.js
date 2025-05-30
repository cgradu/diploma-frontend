import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCharities, getCategories, reset } from '../redux/slices/charitySlice';
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
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import {
  Search,
  LocationOn,
  VolunteerActivism,
  Verified,
  Security,
  ClearAll,
  ExpandMore,
  Visibility,
  Business
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';

const Charities = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const {
    charities, 
    categories,
    pagination,
    isLoading,
    isError,
    message 
  } = useSelector((state) => state.charities);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inputSearchTerm, setInputSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Fetch categories when component mounts
    dispatch(getCategories());
    
    // Fetch initial charities
    dispatch(getCharities());
    
    // Cleanup on unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    // Don't fetch on initial load - that's handled by the first useEffect
    if (currentPage === 1 && searchTerm === '' && selectedCategory === 'All Categories') {
      return;
    }
    
    // Fetch charities whenever filters change
    dispatch(getCharities({
      page: currentPage, 
      category: selectedCategory, 
      search: searchTerm 
    }));
  }, [dispatch, currentPage, selectedCategory, searchTerm]);

  const handleSearchSubmit = () => {
    setSearchTerm(inputSearchTerm);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setInputSearchTerm('');
    setSearchTerm('');
    setSelectedCategory(value);
    setCurrentPage(1);
    
    dispatch(getCharities({ 
      page: 1,
      category: value,
      search: ''
    }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setInputSearchTerm('');
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setCurrentPage(1);
    dispatch(getCharities({ page: 1 }));
  };

  const CharityCard = ({ charity }) => (
    <Card
      elevation={0}
      sx={{
        width: 360, // Fixed width
        height: 440, // Reduced height
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        margin: '0 auto', // Center the card in its grid cell
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.main
        }
      }}
    >
      {/* Charity Header Image */}
      <Box
        sx={{
          height: 100, // Reduced height
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <Business sx={{ fontSize: 32, color: alpha(theme.palette.primary.main, 0.3) }} />
        
        {/* Category Badge */}
        <Chip
          label={charity.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 6,
            left: 6,
            bgcolor: theme.palette.primary.main,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '0.65rem',
            height: 18
          }}
        />
        
        {/* Verification Badge */}
        {charity.verified && (
          <Chip
            icon={<Verified sx={{ fontSize: 12 }} />}
            label="Verified"
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              bgcolor: theme.palette.success.main,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.65rem',
              height: 18
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Charity Name */}
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            lineHeight: 1.2,
            height: '2.4em', // Fixed height for 2 lines
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}
        >
          {charity.name}
        </Typography>

        {/* Location */}
        <Box sx={{ height: '1.2em', mb: 1 }}>
          {charity.address && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LocationOn sx={{ fontSize: 12, color: theme.palette.text.secondary, flexShrink: 0 }} />
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  '-webkit-line-clamp': 1,
                  '-webkit-box-orient': 'vertical',
                  overflow: 'hidden',
                  fontSize: '0.7rem',
                  wordBreak: 'break-word'
                }}
              >
                {charity.address}
              </Typography>
            </Stack>
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            height: '2.4em', // Fixed height for 2 lines
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            lineHeight: 1.2,
            fontSize: '0.8rem',
            wordBreak: 'break-word'
          }}
        >
          {charity.description}
        </Typography>

        {/* Impact Metrics */}
        <Box sx={{ mt: 'auto', mb: 1 }}>
          {charity.impactMetrics && (
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 0.8,
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontSize: '0.8rem' }}>
                    {charity.impactMetrics.projectsCount || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    Projects
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 0.8,
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, fontSize: '0.8rem' }}>
                    {charity.impactMetrics.donationsCount || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    Donations
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Blockchain Verification */}
          {charity.blockchainVerified && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                p: 0.8,
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: 1,
                mt: 1
              }}
            >
              <Security sx={{ fontSize: 12, color: theme.palette.success.main }} />
              <Typography variant="caption" sx={{ fontWeight: 'medium', color: theme.palette.success.main, fontSize: '0.65rem' }}>
                Blockchain Verified
              </Typography>
            </Stack>
          )}
        </Box>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 1.5, pt: 0, justifyContent: 'space-between', flexShrink: 0 }}>
        <Button
          component={Link}
          to={`/charities/${charity.id}`}
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'medium',
            fontSize: '0.7rem',
            px: 1.5,
            py: 0.5,
            minWidth: 'auto'
          }}
        >
          Details
        </Button>
        <Button
          component={Link}
          to={`/donate/${charity.id}`}
          variant="contained"
          size="small"
          startIcon={<VolunteerActivism />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            px: 1.5,
            py: 0.5,
            minWidth: 'auto',
            bgcolor: theme.palette.secondary.main,
            '&:hover': {
              bgcolor: theme.palette.secondary.dark,
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Donate
        </Button>
      </CardActions>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card elevation={0} sx={{ width: 280, height: 360, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, margin: '0 auto' }}>
      <Skeleton variant="rectangular" height={100} />
      <CardContent sx={{ p: 2 }}>
        <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={14} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={12} />
        <Skeleton variant="text" height={12} width="70%" sx={{ mb: 1.5 }} />
        <Box sx={{ mt: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 1.5, pt: 0 }}>
        <Skeleton variant="rectangular" width={60} height={28} />
        <Skeleton variant="rectangular" width={70} height={28} />
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Navbar />
      
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
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Discover Verified Charities
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
              Find and support trusted organizations making real, transparent impact worldwide
            </Typography>
          </Box>

          {/* Search and Filter Section */}
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* Search Input */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search charities by name, location, or cause..."
                  value={inputSearchTerm}
                  onChange={(e) => setInputSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: theme.palette.action.active }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="All Categories">All Categories</MenuItem>
                    {categories && categories.map((category) => (
                      category !== 'All Categories' && (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      )
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSearchSubmit}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    Search
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== 'All Categories') && (
              <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Active filters:
                  </Typography>
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => {
                        setSearchTerm('');
                        setInputSearchTerm('');
                        setCurrentPage(1);
                      }}
                      size="small"
                      color="primary"
                    />
                  )}
                  {selectedCategory !== 'All Categories' && (
                    <Chip
                      label={`Category: ${selectedCategory}`}
                      onDelete={() => {
                        setSelectedCategory('All Categories');
                        setCurrentPage(1);
                      }}
                      size="small"
                      color="primary"
                    />
                  )}
                  <Button
                    startIcon={<ClearAll />}
                    onClick={clearFilters}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Clear All
                  </Button>
                </Stack>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
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
                    <strong>Total Charities:</strong> {charities?.length || 0}<br/>
                    <strong>Current Page:</strong> {currentPage}<br/>
                    <strong>Total Pages:</strong> {pagination?.totalPages || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Selected Category:</strong> {selectedCategory}<br/>
                    <strong>Search Term:</strong> {searchTerm || 'None'}<br/>
                    <strong>Categories:</strong> {categories?.length || 0}<br/>
                    <strong>Message:</strong> {message || 'None'}
                  </Typography>
                </Grid>
              </Grid>
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
              Error Loading Charities
            </Typography>
            <Typography variant="body2">
              {message || 'Failed to load charities. Please try again later.'}
            </Typography>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start' }}>
            {[...Array(8)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </Box>
        )}

        {/* No Results State */}
        {!isLoading && (!charities || charities.length === 0) && (
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
              <VolunteerActivism sx={{ fontSize: 64, color: theme.palette.action.disabled }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              No charities found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Try adjusting your search terms or filters to discover amazing organizations.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ClearAll />}
              onClick={clearFilters}
              sx={{
                borderRadius: 2,
                fontWeight: 'bold',
                px: 4
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        )}

        {/* Charities Grid */}
        {!isLoading && charities && charities.length > 0 && (
          <>
            {/* Results Count */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {pagination?.totalItems || charities.length} Verified Charities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing page {currentPage} of {pagination?.totalPages || 1}
              </Typography>
            </Box>

            {/* Charities Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start', mb: 6 }}>
              {charities.map((charity) => (
                <CharityCard key={charity.id} charity={charity} />
              ))}
            </Box>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 'medium'
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Charities;