// src/components/admin/BlockchainManagement.js
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
  Stack,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  Link as LinkIcon
} from '@mui/icons-material';

import {
  getAllVerificationsAdmin,
  updateVerificationAdmin,
  deleteVerificationAdmin,
  toggleBulkSelection,
  clearBulkSelection,
  setSelectedEntity,
  setEditMode,
  reset
} from '../../redux/slices/adminSlice';

const BlockchainManagement = () => {
  const dispatch = useDispatch();
  const { 
    verifications, 
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
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [verificationToDelete, setVerificationToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Form state for edit verification
  const [formData, setFormData] = useState({
    verified: false,
    transactionHash: '',
    blockNumber: '',
    timestamp: ''
  });

  // Load verifications on component mount and when filters change
  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search,
      verified: statusFilter === 'verified' ? true : statusFilter === 'unverified' ? false : undefined,
      sortBy: orderBy,
      sortOrder: order
    };
    dispatch(getAllVerificationsAdmin(params));
  }, [dispatch, page, rowsPerPage, search, statusFilter, orderBy, order]);

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
      verifications.forEach(verification => {
        if (!bulkActions.selectedIds.includes(verification.id)) {
          dispatch(toggleBulkSelection(verification.id));
        }
      });
    } else {
      dispatch(clearBulkSelection());
    }
  };

  const handleSelectVerification = (verificationId) => {
    dispatch(toggleBulkSelection(verificationId));
  };

  // Handle menu actions
  const handleMenuClick = (event, verification) => {
    setAnchorEl(event.currentTarget);
    setSelectedVerification(verification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVerification(null);
  };

  // Handle view details
  const handleViewDetails = (verification) => {
    setSelectedVerification(verification);
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  // Handle edit verification
  const handleOpenDialog = (verification) => {
    setFormData({
      verified: verification.verified || false,
      transactionHash: verification.transactionHash || '',
      blockNumber: verification.blockNumber || '',
      timestamp: verification.timestamp ? new Date(verification.timestamp).toISOString().slice(0, 16) : ''
    });
    dispatch(setSelectedEntity(verification));
    dispatch(setEditMode(true));
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      verified: false,
      transactionHash: '',
      blockNumber: '',
      timestamp: ''
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
      const updateData = {
        ...formData,
        timestamp: formData.timestamp ? new Date(formData.timestamp).toISOString() : null,
        blockNumber: formData.blockNumber ? parseInt(formData.blockNumber) : null
      };
      dispatch(updateVerificationAdmin({ id: selectedEntity.id, verificationData: updateData }));
    }
    handleCloseDialog();
  };

  // Handle delete verification
  const handleDeleteClick = (verification) => {
    setVerificationToDelete(verification);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (verificationToDelete) {
      dispatch(deleteVerificationAdmin(verificationToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setVerificationToDelete(null);
  };

  // Handle bulk verification
  const handleBulkVerify = () => {
    // This would typically call a batch verification API
    console.log('Bulk verify:', bulkActions.selectedIds);
  };

  // Get verification status color
  const getVerificationStatusColor = (verified) => {
    return verified ? 'success' : 'warning';
  };

  // Get verification status icon
  const getVerificationStatusIcon = (verified) => {
    return verified ? <CheckCircleIcon /> : <PendingIcon />;
  };

  // Truncate hash for display
  const truncateHash = (hash, length = 10) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
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
            Blockchain Verification Management
          </Typography>
        )}

        {numSelected > 0 && (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Bulk verify">
              <IconButton onClick={handleBulkVerify}>
                <VerifiedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete selected">
              <IconButton onClick={() => console.log('Bulk delete')}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Toolbar>

      {/* System Status Alert */}
      <Box sx={{ p: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Blockchain verification ensures donation transparency. Unverified transactions should be reviewed promptly.
          </Typography>
        </Alert>
      </Box>

      {/* Filters */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by transaction hash or donation ID..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 350 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="unverified">Unverified</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < verifications.length}
                  checked={verifications.length > 0 && numSelected === verifications.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  Verification ID
                </TableSortLabel>
              </TableCell>
              <TableCell>Donation</TableCell>
              <TableCell>Transaction Hash</TableCell>
              <TableCell>Block Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={orderBy === 'timestamp' ? order : 'asc'}
                  onClick={() => handleRequestSort('timestamp')}
                >
                  Blockchain Time
                </TableSortLabel>
              </TableCell>
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
            ) : verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No blockchain verifications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => {
                const isItemSelected = isSelected(verification.id);
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={verification.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleSelectVerification(verification.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <SecurityIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          #{verification.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {verification.donation?.transactionId || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ${(verification.donation?.amount || 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontFamily="monospace">
                          {truncateHash(verification.transactionHash)}
                        </Typography>
                        {verification.transactionHash && (
                          <Tooltip title="Copy hash">
                            <IconButton 
                              size="small"
                              onClick={() => navigator.clipboard.writeText(verification.transactionHash)}
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {verification.blockNumber || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getVerificationStatusIcon(verification.verified)}
                        label={verification.verified ? 'Verified' : 'Pending'}
                        color={getVerificationStatusColor(verification.verified)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {verification.timestamp ? new Date(verification.timestamp).toLocaleDateString() : 'N/A'}
                      </Typography>
                      {verification.timestamp && (
                        <Typography variant="caption" color="textSecondary">
                          {new Date(verification.timestamp).toLocaleTimeString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(verification.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, verification)}
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
        count={pagination.verifications?.total || 0}
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
        <MenuItem onClick={() => handleViewDetails(selectedVerification)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog(selectedVerification)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedVerification)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Blockchain Verification Details</DialogTitle>
        <DialogContent>
          {selectedVerification && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Verification #{selectedVerification.id}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Status:</strong> {selectedVerification.verified ? 'Verified' : 'Pending'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Block Number:</strong> {selectedVerification.blockNumber || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Transaction Hash:</strong>
                        </Typography>
                        <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all', mt: 0.5 }}>
                          {selectedVerification.transactionHash || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Blockchain Timestamp:</strong> {selectedVerification.timestamp ? new Date(selectedVerification.timestamp).toLocaleString() : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Created:</strong> {new Date(selectedVerification.createdAt).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Associated Donation */}
                    {selectedVerification.donation && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Associated Donation
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Transaction ID:</strong> {selectedVerification.donation.transactionId}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Amount:</strong> ${selectedVerification.donation.amount?.toLocaleString()} {selectedVerification.donation.currency}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Donor:</strong> {selectedVerification.donation.anonymous ? 'Anonymous' : (selectedVerification.donation.donor?.name || 'Unknown')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Payment Status:</strong> {selectedVerification.donation.paymentStatus}
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
          {selectedVerification?.transactionHash && (
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => navigator.clipboard.writeText(selectedVerification.transactionHash)}
            >
              Copy Hash
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Verification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Blockchain Verification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Verification Status</InputLabel>
                <Select
                  value={formData.verified}
                  label="Verification Status"
                  onChange={(e) => handleFormChange('verified', e.target.value)}
                >
                  <MenuItem value={false}>Pending</MenuItem>
                  <MenuItem value={true}>Verified</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction Hash"
                value={formData.transactionHash}
                onChange={(e) => handleFormChange('transactionHash', e.target.value)}
                placeholder="0x..."
                helperText="Blockchain transaction hash"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Block Number"
                type="number"
                value={formData.blockNumber}
                onChange={(e) => handleFormChange('blockNumber', e.target.value)}
                helperText="Block number where transaction was mined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Blockchain Timestamp"
                type="datetime-local"
                value={formData.timestamp}
                onChange={(e) => handleFormChange('timestamp', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="When the transaction was confirmed on blockchain"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.transactionHash}
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
            This action cannot be undone and will remove blockchain verification data.
          </Alert>
          <Typography gutterBottom>
            Are you sure you want to delete verification #{verificationToDelete?.id}?
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            The associated donation will remain, but will lose its blockchain verification status.
          </Alert>
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

export default BlockchainManagement;