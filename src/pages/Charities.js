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
  const { user } = useSelector((state) => state.auth);  
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
        width: 400, // Increased from 400 to 600 (1.5x)
        height: 520, // Increased from 480 to 720 (1.5x)
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
          height: 120, // Increased from 100 to 150 (1.5x)
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <Business sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.3) }} /> {/* Increased from 32 to 48 */}
        
        {/* Category Badge */}
        <Chip
          label={charity.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 6, // Increased from 6 to 9
            left: 6, // Increased from 6 to 9
            bgcolor: theme.palette.primary.main,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '0.6rem', // Increased from 0.65rem to 0.8rem
            height: 18 // Increased from 18 to 27
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}> {/* Increased padding from 2 to 3 */}
        {/* Charity Name */}
        <Typography
          variant="h6" // Changed from subtitle1 to h6 for larger text
          component="h3"
          sx={{
            fontWeight: 'bold',
            mb: 1.5, // Increased from 1 to 1.5
            lineHeight: 1.2,
            height: '3.6em', // Increased from 2.4em to 3.6em (1.5x)
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
        <Box sx={{ height: '1.8em', mb: 1.5 }}> {/* Increased height from 1.2em to 1.8em, margin from 1 to 1.5 */}
          {charity.address && (
            <Stack direction="row" spacing={0.75} alignItems="center"> {/* Increased spacing from 0.5 to 0.75 */}
              <LocationOn sx={{ fontSize: 18, color: theme.palette.text.secondary, flexShrink: 0 }} /> {/* Increased from 12 to 18 */}
              <Typography 
                variant="body2" // Changed from caption to body2
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  '-webkit-line-clamp': 1,
                  '-webkit-box-orient': 'vertical',
                  overflow: 'hidden',
                  fontSize: '0.875rem', // Increased from 0.7rem to 0.875rem
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
          variant="body1" // Changed from body2 to body1
          color="text.secondary"
          sx={{
            mb: 2.25, // Increased from 1.5 to 2.25
            height: '3.6em', // Increased from 2.4em to 3.6em (1.5x)
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            lineHeight: 1.2,
            fontSize: '1rem', // Increased from 0.8rem to 1rem
            wordBreak: 'break-word'
          }}
        >
          {charity.description}
        </Typography>

        {/* Impact Metrics */}
        <Box sx={{ mt: 'auto', mb: 1.5 }}> {/* Increased margin from 1 to 1.5 */}
          {charity.impactMetrics && (
            <Grid container spacing={1.5}> {/* Increased spacing from 1 to 1.5 */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.2, // Increased from 0.8 to 1.2
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontSize: '1.2rem' }}> {/* Increased from subtitle2 and 0.8rem to h6 and 1.2rem */}
                    {charity.impactMetrics.projectsCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}> {/* Changed from caption and increased from 0.65rem to 0.875rem */}
                    Projects
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.2, // Increased from 0.8 to 1.2
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, fontSize: '1.2rem' }}> {/* Increased from subtitle2 and 0.8rem to h6 and 1.2rem */}
                    {charity.impactMetrics.donationsCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}> {/* Changed from caption and increased from 0.65rem to 0.875rem */}
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
              spacing={0.75} // Increased from 0.5 to 0.75
              alignItems="center"
              sx={{
                p: 1.2, // Increased from 0.8 to 1.2
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: 1,
                mt: 1.5 // Increased from 1 to 1.5
              }}
            >
              <Security sx={{ fontSize: 18, color: theme.palette.success.main }} /> {/* Increased from 12 to 18 */}
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.palette.success.main, fontSize: '0.875rem' }}> {/* Changed from caption and increased from 0.65rem to 0.875rem */}
                Blockchain Verified
              </Typography>
            </Stack>
          )}
        </Box>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 2.25, pt: 0, justifyContent: 'space-between', flexShrink: 0 }}> {/* Increased padding from 1.5 to 2.25 */}
        <Button
          component={Link}
          to={`/charities/${charity.id}`}
          variant="outlined"
          size="medium" // Changed from small to medium
          startIcon={<Visibility />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'medium',
            fontSize: '0.875rem', // Increased from 0.7rem to 0.875rem
            px: 2.25, // Increased from 1.5 to 2.25
            py: 0.75, // Increased from 0.5 to 0.75
            minWidth: 'auto'
          }}
        >
          Details
        </Button>
        {(!user || user.role !== 'charity') && (
        <Button
          component={Link}
          to={`/donate/charity/${charity.id}`}
          variant="contained"
          size="medium" // Changed from small to medium
          startIcon={<VolunteerActivism />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem', // Increased from 0.7rem to 0.875rem
            px: 2.25, // Increased from 1.5 to 2.25
            py: 0.75, // Increased from 0.5 to 0.75
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
        )}
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
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={{ xs: 2, sm: 3, md: 4 }}
              sx={{ 
                width: '100%',
                alignItems: 'stretch',
                flex: 1
              }}
            >
              {/* Search Input */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 55%' } }}>
                <TextField
                  fullWidth
                  placeholder="Search charities by name, location, or cause..."
                  value={inputSearchTerm}
                  onChange={(e) => setInputSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: theme.palette.action.active, fontSize: { xs: 20, sm: 24, md: 28 } }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    height: '100%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: { xs: '56px', sm: '60px', md: '68px' },
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    }
                  }}
                />
              </Box>

              {/* Category Filter */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                <FormControl fullWidth sx={{ height: '100%' }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                    sx={{
                      borderRadius: 2,
                      height: { xs: '56px', sm: '60px', md: '68px' },
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
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
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    width: '100%'
                  }}
                >
                  Search
                </Button>
              </Box>
            </Stack>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== 'All Categories') && (
              <Box sx={{ 
                mt: { xs: 3, sm: 4, md: 5 }, 
                pt: { xs: 2, sm: 3 }, 
                borderTop: `1px solid ${theme.palette.divider}`,
                width: '100%'
              }}>
                <Stack 
                  direction="row" 
                  spacing={2} 
                  alignItems="center" 
                  flexWrap="wrap" 
                  useFlexGap
                  sx={{ width: '100%' }}
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
                        setCurrentPage(1);
                      }}
                      size="medium"
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
                      size="medium"
                      color="primary"
                    />
                  )}
                  <Button
                    startIcon={<ClearAll />}
                    onClick={clearFilters}
                    size="medium"
                    sx={{ fontSize: '1rem' }}
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
        {user === 'admin' && (
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