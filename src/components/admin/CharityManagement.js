// src/components/admin/CharityManagement.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  FilterList as FilterIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

import {
  getAllCharitiesAdmin,
  updateCharityAdmin,
  deleteCharity,
  bulkDeleteCharities,
  toggleBulkSelection,
  clearBulkSelection,
  setSelectedEntity,
  setEditMode,
  reset
} from '../../redux/slices/adminSlice';

const CharityManagement = () => {
  const dispatch = useDispatch();
  const { 
    charities, 
    pagination, 
    isLoading, 
    bulkActions,
    selectedEntity,
    editMode 
  } = useSelector((state) => state.admin);

  // Local state
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [charityToDelete, setCharityToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Form state for edit charity
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mission: '',
    email: '',
    phone: '',
    registrationId: '',
    category: 'EDUCATION',
    address: '',
    foundedYear: '',
    status: 'ACTIVE'
  });

  // Load charities on component mount and when filters change
  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      sortBy: orderBy,
      sortOrder: order
    };
    dispatch(getAllCharitiesAdmin(params));
  }, [dispatch, page, rowsPerPage, search, statusFilter, categoryFilter, orderBy, order]);

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // Handle status filter
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Handle category filter
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle bulk selection
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      charities.forEach(charity => {
        if (!bulkActions.selectedIds.includes(charity.id)) {
          dispatch(toggleBulkSelection(charity.id));
        }
      });
    } else {
      dispatch(clearBulkSelection());
    }
  };

  const handleSelectCharity = (charityId) => {
    dispatch(toggleBulkSelection(charityId));
  };

  // Handle menu actions
  const handleMenuClick = (event, charity) => {
    setAnchorEl(event.currentTarget);
    setSelectedCharity(charity);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCharity(null);
  };

  // Handle view details
  const handleViewDetails = (charity) => {
    setSelectedCharity(charity);
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  // Handle edit charity
  const handleOpenDialog = (charity) => {
    setFormData({
      name: charity.name || '',
      description: charity.description || '',
      mission: charity.mission || '',
      email: charity.email || '',
      phone: charity.phone || '',
      registrationId: charity.registrationId || '',
      category: charity.category || 'EDUCATION',
      address: charity.address || '',
      foundedYear: charity.foundedYear || '',
      status: charity.status || 'ACTIVE'
    });
    dispatch(setSelectedEntity(charity));
    dispatch(setEditMode(true));
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
      mission: '',
      email: '',
      phone: '',
      registrationId: '',
      category: 'EDUCATION',
      address: '',
      foundedYear: '',
      status: 'ACTIVE'
    });
    dispatch(reset());
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (selectedEntity) {
      dispatch(updateCharityAdmin({ id: selectedEntity.id, charityData: formData }));
    }
    handleCloseDialog();
  };

  // Handle delete charity
  const handleDeleteClick = (charity) => {
    setCharityToDelete(charity);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (charityToDelete) {
      dispatch(deleteCharity(charityToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setCharityToDelete(null);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (bulkActions.selectedIds.length > 0) {
      dispatch(bulkDeleteCharities(bulkActions.selectedIds));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'SUSPENDED':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleIcon />;
      case 'SUSPENDED':
        return <PauseIcon />;
      case 'CANCELLED':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const numSelected = bulkActions.selectedIds.length;
  const isSelected = (id) => bulkActions.selectedIds.indexOf(id) !== -1;

  return (
    <Box>
      {/* Toolbar */}
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Charity Management
          </Typography>
        )}

        {numSelected > 0 && (
          <Tooltip title="Delete selected">
            <IconButton onClick={handleBulkDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      {/* Filters */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search charities..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="SUSPENDED">Suspended</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="EDUCATION">Education</MenuItem>
            <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
            <MenuItem value="ENVIRONMENT">Environment</MenuItem>
            <MenuItem value="HUMANITARIAN">Humanitarian</MenuItem>
            <MenuItem value="ANIMAL_WELFARE">Animal Welfare</MenuItem>
            <MenuItem value="ARTS_CULTURE">Arts & Culture</MenuItem>
            <MenuItem value="DISASTER_RELIEF">Disaster Relief</MenuItem>
            <MenuItem value="HUMAN_RIGHTS">Human Rights</MenuItem>
            <MenuItem value="COMMUNITY_DEVELOPMENT">Community Development</MenuItem>
            <MenuItem value="RELIGIOUS">Religious</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < charities.length}
                  checked={charities.length > 0 && numSelected === charities.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Charity
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell>Total Donations</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : charities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No charities found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              charities.map((charity) => {
                const isItemSelected = isSelected(charity.id);
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={charity.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleSelectCharity(charity.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {charity.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {charity.id} | Reg: {charity.registrationId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={charity.category?.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {charity.manager?.name || 'No Manager'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {charity.manager?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(charity.status)}
                        label={charity.status}
                        color={getStatusColor(charity.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {charity._count.projects || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary">
                        {(charity._count.donations || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(charity.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, charity)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={pagination.charities?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(selectedCharity)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog(selectedCharity)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedCharity)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Charity Details</DialogTitle>
        <DialogContent>
          {selectedCharity && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedCharity.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {selectedCharity.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>Mission:</Typography>
                    <Typography variant="body2" paragraph>
                      {selectedCharity.mission}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2"><strong>Email:</strong> {selectedCharity.email}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2"><strong>Phone:</strong> {selectedCharity.phone || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2"><strong>Registration ID:</strong> {selectedCharity.registrationId}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2"><strong>Founded:</strong> {selectedCharity.foundedYear || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2"><strong>Address:</strong> {selectedCharity.address || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Charity Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Charity</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mission"
                multiline
                rows={3}
                value={formData.mission}
                onChange={(e) => handleFormChange('mission', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleFormChange('category', e.target.value)}
                >
                  <MenuItem value="EDUCATION">Education</MenuItem>
                  <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
                  <MenuItem value="ENVIRONMENT">Environment</MenuItem>
                  <MenuItem value="HUMANITARIAN">Humanitarian</MenuItem>
                  <MenuItem value="ANIMAL_WELFARE">Animal Welfare</MenuItem>
                  <MenuItem value="ARTS_CULTURE">Arts & Culture</MenuItem>
                  <MenuItem value="DISASTER_RELIEF">Disaster Relief</MenuItem>
                  <MenuItem value="HUMAN_RIGHTS">Human Rights</MenuItem>
                  <MenuItem value="COMMUNITY_DEVELOPMENT">Community Development</MenuItem>
                  <MenuItem value="RELIGIOUS">Religious</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration ID"
                value={formData.registrationId}
                onChange={(e) => handleFormChange('registrationId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Founded Year"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => handleFormChange('foundedYear', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.description}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography gutterBottom>
            Are you sure you want to delete charity "{charityToDelete?.name}"?
          </Typography>
          
          {charityToDelete?.projectsCount > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This charity has {charityToDelete.projectsCount} projects that will also be affected.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CharityManagement;