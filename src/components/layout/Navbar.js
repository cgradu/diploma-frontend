import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Dashboard,
  Explore,
  Person,
  Login,
  PersonAdd,
  Logout,
  Close,
  VolunteerActivism,
  AdminPanelSettings,
  History,
  AccountBalanceWallet,
  Assignment // Add this icon for projects
} from '@mui/icons-material';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    if (user?.role === 'admin') {
      return '/admin';
    }
    return '/dashboard';
  };

  const getDashboardIcon = () => {
    if (user?.role === 'admin') {
      return <AdminPanelSettings sx={{ fontSize: 28 }} />;
    }
    return <Dashboard sx={{ fontSize: 28 }} />;
  };

  // Get charity projects path (assuming you have managedCharity in user object)
  const getCharityProjectsPath = () => {
    if (user?.managedCharity?.id) {
      return `/charities/${user.managedCharity.id}`;
    }
    // Fallback - you might need to adjust this based on your data structure
    return '/my-charity';
  };

  const navigationLinks = [
    { text: 'Home', path: '/', icon: <Home sx={{ fontSize: 28 }} /> },
    ...(user ? [{ 
      text: "Dashboard",
      path: getDashboardPath(), 
      icon: getDashboardIcon() 
    }] : []),
    { text: 'Charities', path: '/charities', icon: <Explore sx={{ fontSize: 28 }} /> }
  ];

  // Enhanced user menu items with role-specific options
  const userMenuItems = user ? [
    { 
      text: 'Dashboard', 
      path: getDashboardPath(), 
      icon: getDashboardIcon() 
    },
    // Add donation history for donors only
    ...(user.role === 'donor' ? [{ 
      text: 'Donation History', 
      path: '/my-donations', 
      icon: <History sx={{ fontSize: 28 }} />,
      description: 'View your donation history & blockchain verification'
    }] : []),
    // Add projects management for charity users only
    ...(user.role === 'charity' ? [{ 
      text: 'My Charity', 
      path: getCharityProjectsPath(), 
      icon: <Assignment sx={{ fontSize: 28 }} />,
      description: 'Manage your charity projects and donations'
    }] : []),
    ...(user.role !== 'admin' ? [{ 
      text: 'Profile', 
      path: '/profile', 
      icon: <Person sx={{ fontSize: 28 }} /> 
    }] : []),
    { text: 'Logout', action: handleLogout, icon: <Logout sx={{ fontSize: 28 }} /> }
  ] : [
    { text: 'Login', path: '/login', icon: <Login sx={{ fontSize: 28 }} /> },
    { text: 'Sign Up', path: '/register', icon: <PersonAdd sx={{ fontSize: 28 }} /> }
  ];

  const NavButton = ({ to, children, active = false, onClick }) => (
    <Button
      component={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      sx={{
        color: active ? theme.palette.primary.main : theme.palette.text.primary,
        fontWeight: active ? 'bold' : 'medium',
        fontSize: '1.125rem',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main
        },
        transition: 'all 0.2s ease-in-out',
        textTransform: 'none',
        minHeight: 48
      }}
    >
      {children}
    </Button>
  );

  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      PaperProps={{
        sx: {
          width: 320,
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Charitrace
          </Typography>
          <IconButton onClick={toggleMobileDrawer} size="large">
            <Close sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        <List sx={{ p: 0 }}>
          {navigationLinks.map((link) => (
            <ListItem
              key={link.text}
              component={Link}
              to={link.path}
              onClick={toggleMobileDrawer}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1.5,
                bgcolor: isActive(link.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08)
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(link.path) ? theme.palette.primary.main : 'inherit',
                minWidth: 48
              }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText 
                primary={link.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive(link.path) ? 'bold' : 'medium',
                    color: isActive(link.path) ? theme.palette.primary.main : 'inherit',
                    fontSize: '1.1rem'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        {user ? (
          <Box>
            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: user.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main, 
                  width: 48,
                  height: 48
                }}>
                  {user.role === 'admin' ? <AdminPanelSettings /> : user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  {user.role === 'admin' && (
                    <Chip 
                      label="Admin" 
                      size="medium"
                      color="error" 
                      sx={{ mt: 0.5, fontSize: '0.8rem', height: 24 }} 
                    />
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Only show donate button for donors */}
            {user.role === 'donor' && (
              <Button
                component={Link}
                to="/donate"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<VolunteerActivism sx={{ fontSize: 24 }} />}
                onClick={toggleMobileDrawer}
                sx={{
                  mb: 3,
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  bgcolor: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark
                  }
                }}
              >
                Donate Now
              </Button>
            )}

            {/* Add donation history button for donors in mobile */}
            {user.role === 'donor' && (
              <Button
                component={Link}
                to="/my-donations"
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<AccountBalanceWallet sx={{ fontSize: 24 }} />}
                onClick={toggleMobileDrawer}
                sx={{
                  mb: 3,
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.dark
                  }
                }}
              >
                My Donations
              </Button>
            )}

            {/* Add my projects button for charity managers in mobile */}
            {user.role === 'charity' && (
              <Button
                component={Link}
                to={getCharityProjectsPath()}
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Assignment sx={{ fontSize: 24 }} />}
                onClick={toggleMobileDrawer}
                sx={{
                  mb: 3,
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.dark
                  }
                }}
              >
                My Charity
              </Button>
            )}

            <List sx={{ p: 0 }}>
              {userMenuItems.map((item) => (
                <ListItem
                  key={item.text}
                  component={item.path ? Link : 'button'}
                  to={item.path}
                  onClick={() => {
                    if (item.action) item.action();
                    else toggleMobileDrawer();
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    py: 1.5,
                    bgcolor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 48,
                    color: isActive(item.path) ? theme.palette.primary.main : 'inherit'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    secondary={item.description}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '1.1rem',
                        fontWeight: isActive(item.path) ? 'bold' : 'medium',
                        color: isActive(item.path) ? theme.palette.primary.main : 'inherit'
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: '0.85rem',
                        color: 'text.secondary'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box>
            <Button
              component={Link}
              to="/donate"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<VolunteerActivism sx={{ fontSize: 24 }} />}
              onClick={toggleMobileDrawer}
              sx={{
                mb: 3,
                py: 2,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                bgcolor: theme.palette.secondary.main,
                '&:hover': {
                  bgcolor: theme.palette.secondary.dark
                }
              }}
            >
              Donate Now
            </Button>

            <Stack spacing={1.5}>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Login sx={{ fontSize: 24 }} />}
                onClick={toggleMobileDrawer}
                sx={{ py: 2, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAdd sx={{ fontSize: 24 }} />}
                onClick={toggleMobileDrawer}
                sx={{ py: 2, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Sign Up
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          minHeight: 96
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            py: 3,
            minHeight: 96
          }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <VolunteerActivism 
                sx={{ 
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  mr: 1.5
                }} 
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  letterSpacing: '-0.5px'
                }}
              >
                Charitrace
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              {navigationLinks.map((link) => (
                <NavButton
                  key={link.text}
                  to={link.path}
                  active={isActive(link.path)}
                >
                  {link.text}
                </NavButton>
              ))}
              
              {/* Add Donation History to desktop navigation for donors */}
              {user?.role === 'donor' && (
                <NavButton
                  to="/my-donations"
                  active={isActive('/my-donations')}
                >
                  My Donations
                </NavButton>
              )}

              {/* Add My Projects to desktop navigation for charity managers */}
              {user?.role === 'charity' && (
                <NavButton
                  to={getCharityProjectsPath()}
                  active={isActive(getCharityProjectsPath())}
                >
                  My Charity
                </NavButton>
              )}
            </Box>

            {/* Desktop Authentication */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {/* Only show donate button for non-admin users */}
              {(!user || user.role === 'donor') && (
                <Button
                  component={Link}
                  to="/donate"
                  variant="contained"
                  size="large"
                  startIcon={<VolunteerActivism sx={{ fontSize: 24 }} />}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark,
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows[4]
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Donate Now
                </Button>
              )}

              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Chip
                    label={`Welcome, ${user.name}`}
                    avatar={
                      <Avatar sx={{ 
                        bgcolor: user.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main,
                        width: 32,
                        height: 32
                      }}>
                        {user.role === 'admin' ? <AdminPanelSettings fontSize="small" /> : user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    sx={{
                      bgcolor: user.role === 'admin' 
                        ? alpha(theme.palette.error.main, 0.1) 
                        : alpha(theme.palette.primary.main, 0.1),
                      color: user.role === 'admin' 
                        ? theme.palette.error.main 
                        : theme.palette.primary.main,
                      fontWeight: 'medium',
                      fontSize: '1rem',
                      height: 48,
                      px: 2
                    }}
                  />
                  {user.role === 'admin' && (
                    <Chip 
                      label="Administrator" 
                      color="error" 
                      size="medium"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        height: 36
                      }}
                    />
                  )}
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0,
                        border: `2px solid ${alpha(
                          user.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main, 
                          0.2
                        )}`,
                        '&:hover': {
                          borderColor: user.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: user.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main,
                        width: 48,
                        height: 48
                      }}>
                        {user.role === 'admin' ? <AdminPanelSettings /> : user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '55px' }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        minWidth: 280,
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    {userMenuItems.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else {
                            navigate(item.path);
                            handleCloseUserMenu();
                          }
                        }}
                        sx={{
                          gap: 2,
                          py: 2,
                          px: 3,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                          },
                          // Highlight special items for better visibility
                          ...((item.text === 'Donation History' || item.text === 'My Charity') && {
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                            ml: 0,
                            pl: 2
                          })
                        }}
                      >
                        <Box sx={{ minWidth: 28, display: 'flex', justifyContent: 'center' }}>
                          {item.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography sx={{ 
                            fontSize: '1.1rem',
                            fontWeight: (item.text === 'Donation History' || item.text === 'My Charity') ? 'bold' : 'normal'
                          }}>
                            {item.text}
                          </Typography>
                          {item.description && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                display: 'block',
                                fontSize: '0.85rem',
                                mt: 0.5
                              }}
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    startIcon={<Login sx={{ fontSize: 24 }} />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    startIcon={<PersonAdd sx={{ fontSize: 24 }} />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5 }}>
              {(!user || user.role === 'donor') && (
                <Button
                  component={Link}
                  to="/donate"
                  variant="contained"
                  size="medium"
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: '#ffffff',
                    fontWeight: 'bold',
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark
                    }
                  }}
                >
                  Donate
                </Button>
              )}
              <IconButton
                size="large"
                onClick={toggleMobileDrawer}
                sx={{
                  color: theme.palette.text.primary,
                  p: 1.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <MobileDrawer />
    </>
  );
};

export default Navbar;