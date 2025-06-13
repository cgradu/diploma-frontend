// src/components/admin/DonationManagement.js
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
  CardContent,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

import {
  getAllDonationsAdmin,
  updateDonationAdmin,
  toggleBulkSelection,
  clearBulkSelection,
  setSelectedEntity,
  setEditMode,
  reset
} from '../../redux/slices/adminSlice';

const DonationManagement = () => {
  const dispatch = useDispatch();
  const { 
    donations, 
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
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Form state for edit donation
  const [formData, setFormData] = useState({
    paymentStatus: 'PENDING',
    message: '',
    anonymous: false
  });

  // Load donations on component mount and when filters change
  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search,
      paymentStatus: statusFilter !== 'all' ? statusFilter : undefined,
      verified: verificationFilter === 'verified' ? true : verificationFilter === 'unverified' ? false : undefined,
      sortBy: orderBy,
      sortOrder: order
    };
    dispatch(getAllDonationsAdmin(params));
  }, [dispatch, page, rowsPerPage, search, statusFilter, verificationFilter, orderBy, order]);

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

  // Handle verification filter
  const handleVerificationFilterChange = (event) => {
    setVerificationFilter(event.target.value);
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
      donations.forEach(donation => {
        if (!bulkActions.selectedIds.includes(donation.id)) {
          dispatch(toggleBulkSelection(donation.id));
        }
      });
    } else {
      dispatch(clearBulkSelection());
    }
  };

  const handleSelectDonation = (donationId) => {
    dispatch(toggleBulkSelection(donationId));
  };

  // Handle menu actions
  const handleMenuClick = (event, donation) => {
    setAnchorEl(event.currentTarget);
    setSelectedDonation(donation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDonation(null);
  };

  // Handle view details
  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  // Handle edit donation
  const handleOpenDialog = (donation) => {
    setFormData({
      paymentStatus: donation.paymentStatus || 'PENDING',
      message: donation.message || '',
      anonymous: donation.anonymous || false
    });
    dispatch(setSelectedEntity(donation));
    dispatch(setEditMode(true));
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      paymentStatus: 'PENDING',
      message: '',
      anonymous: false
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
      dispatch(updateDonationAdmin({ id: selectedEntity.id, donationData: formData }));
    }
    handleCloseDialog();
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'success';
      case 'PROCESSING':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      case 'REFUNDED':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get payment status icon
  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircleIcon />;
      case 'PROCESSING':
        return <RefreshIcon />;
      case 'PENDING':
        return <PendingIcon />;
      case 'FAILED':
        return <ErrorIcon />;
      case 'REFUNDED':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
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
            Donation Management
          </Typography>
        )}

        {numSelected > 0 && (
          <Tooltip title="Bulk actions">
            <IconButton onClick={() => console.log('Bulk actions')}>
              <MoreIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      {/* Filters */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search donations..."
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
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={statusFilter}
            label="Payment Status"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="SUCCEEDED">Succeeded</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="REFUNDED">Refunded</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Blockchain Status</InputLabel>
          <Select
            value={verificationFilter}
            label="Blockchain Status"
            onChange={handleVerificationFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="unverified">Unverified</MenuItem>
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
                  indeterminate={numSelected > 0 && numSelected < donations.length}
                  checked={donations.length > 0 && numSelected === donations.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'transactionId'}
                  direction={orderBy === 'transactionId' ? order : 'asc'}
                  onClick={() => handleRequestSort('transactionId')}
                >
                  Transaction
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleRequestSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>Donor</TableCell>
              <TableCell>Charity</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Blockchain</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No donations found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => {
                const isItemSelected = isSelected(donation.id);
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={donation.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleSelectDonation(donation.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PaymentIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {donation.transactionId}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {donation.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" color="primary">
                        {formatCurrency(donation.amount, donation.currency)}
                      </Typography>
                      {donation.anonymous && (
                        <Chip label="Anonymous" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {donation.donor?.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {donation.donor?.email || 'No email'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {donation.charity?.name || 'Direct Donation'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {donation.charity?.category?.replace('_', ' ')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {donation.project?.title || 'General Fund'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getPaymentStatusIcon(donation.paymentStatus)}
                        label={donation.paymentStatus}
                        color={getPaymentStatusColor(donation.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {donation.blockchainVerification ? (
                        <Chip
                          icon={<SecurityIcon />}
                          label={donation.blockchainVerification.verified ? 'Verified' : 'Pending'}
                          color={donation.blockchainVerification.verified ? 'success' : 'warning'}
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="No Verification"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(donation.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, donation)}
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
        count={pagination.donations?.total || 0}
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
        <MenuItem onClick={() => handleViewDetails(selectedDonation)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog(selectedDonation)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {selectedDonation?.receiptUrl && (
          <MenuItem onClick={() => window.open(selectedDonation.receiptUrl, '_blank')}>
            <ListItemIcon>
              <ReceiptIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Receipt</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Donation Details</DialogTitle>
        <DialogContent>
          {selectedDonation && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transaction: {selectedDonation.transactionId}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Amount:</strong> {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Payment Status:</strong> {selectedDonation.paymentStatus}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Donor:</strong> {selectedDonation.anonymous ? 'Anonymous' : (selectedDonation.donor?.name || 'Unknown')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Email:</strong> {selectedDonation.anonymous ? 'Hidden' : (selectedDonation.donor?.email || 'N/A')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Charity:</strong> {selectedDonation.charity?.name || 'Direct Donation'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Project:</strong> {selectedDonation.project?.title || 'General Fund'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Payment Intent:</strong> {selectedDonation.paymentIntentId || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Date:</strong> {new Date(selectedDonation.createdAt).toLocaleString()}
                        </Typography>
                      </Grid>
                      {selectedDonation.message && (
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Message:</strong> {selectedDonation.message}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Blockchain Verification */}
                    {selectedDonation.blockchainVerification && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Blockchain Verification
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Transaction Hash:</strong> {selectedDonation.blockchainVerification.transactionHash}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Block Number:</strong> {selectedDonation.blockchainVerification.blockNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Verified:</strong> {selectedDonation.blockchainVerification.verified ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Timestamp:</strong> {new Date(selectedDonation.blockchainVerification.timestamp).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedDonation?.receiptUrl && (
            <Button
              variant="outlined"
              startIcon={<ReceiptIcon />}
              onClick={() => window.open(selectedDonation.receiptUrl, '_blank')}
            >
              View Receipt
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Donation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Donation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={formData.paymentStatus}
                  label="Payment Status"
                  onChange={(e) => handleFormChange('paymentStatus', e.target.value)}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="SUCCEEDED">Succeeded</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                  <MenuItem value="REFUNDED">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={3}
                value={formData.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Anonymous</InputLabel>
                <Select
                  value={formData.anonymous}
                  label="Anonymous"
                  onChange={(e) => handleFormChange('anonymous', e.target.value)}
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationManagement;