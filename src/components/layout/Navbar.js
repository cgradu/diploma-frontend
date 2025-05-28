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
  VolunteerActivism
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

  const navigationLinks = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Explore Charities', path: '/charities', icon: <Explore /> }
  ];

  const userMenuItems = user ? [
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Profile', path: '/profile', icon: <Person /> },
    { text: 'Logout', action: handleLogout, icon: <Logout /> }
  ] : [
    { text: 'Login', path: '/login', icon: <Login /> },
    { text: 'Sign Up', path: '/register', icon: <PersonAdd /> }
  ];

  const NavButton = ({ to, children, active = false, onClick }) => (
    <Button
      component={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      sx={{
        color: active ? theme.palette.primary.main : theme.palette.text.primary,
        fontWeight: active ? 'bold' : 'medium',
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main
        },
        transition: 'all 0.2s ease-in-out',
        textTransform: 'none'
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
          width: 280,
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Charitrace
          </Typography>
          <IconButton onClick={toggleMobileDrawer} size="small">
            <Close />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        <List sx={{ p: 0 }}>
          {navigationLinks.map((link) => (
            <ListItem
              key={link.text}
              component={Link}
              to={link.path}
              onClick={toggleMobileDrawer}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActive(link.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08)
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(link.path) ? theme.palette.primary.main : 'inherit' }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText 
                primary={link.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive(link.path) ? 'bold' : 'medium',
                    color: isActive(link.path) ? theme.palette.primary.main : 'inherit'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {user ? (
          <Box>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              component={Link}
              to="/donate"
              fullWidth
              variant="contained"
              startIcon={<VolunteerActivism />}
              onClick={toggleMobileDrawer}
              sx={{
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                bgcolor: theme.palette.secondary.main,
                '&:hover': {
                  bgcolor: theme.palette.secondary.dark
                }
              }}
            >
              Donate Now
            </Button>

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
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
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
              startIcon={<VolunteerActivism />}
              onClick={toggleMobileDrawer}
              sx={{
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                bgcolor: theme.palette.secondary.main,
                '&:hover': {
                  bgcolor: theme.palette.secondary.dark
                }
              }}
            >
              Donate Now
            </Button>

            <Stack spacing={1}>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="outlined"
                startIcon={<Login />}
                onClick={toggleMobileDrawer}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                fullWidth
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={toggleMobileDrawer}
                sx={{ py: 1.5, borderRadius: 2 }}
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
          color: theme.palette.text.primary
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
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
                  fontSize: 32, 
                  color: theme.palette.primary.main,
                  mr: 1
                }} 
              />
              <Typography
                variant="h5"
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
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navigationLinks.map((link) => (
                <NavButton
                  key={link.text}
                  to={link.path}
                  active={isActive(link.path)}
                >
                  {link.text}
                </NavButton>
              ))}
            </Box>

            {/* Desktop Authentication */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/donate"
                variant="contained"
                startIcon={<VolunteerActivism />}
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: '#ffffff',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
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

              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`Welcome, ${user.name}`}
                    avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>{user.name?.charAt(0).toUpperCase()}</Avatar>}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 'medium'
                    }}
                  />
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': {
                          borderColor: theme.palette.primary.main
                        }
                      }}
                    >
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        minWidth: 200,
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
                          py: 1.5,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                          }
                        }}
                      >
                        {item.icon}
                        <Typography>{item.text}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    startIcon={<Login />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    startIcon={<PersonAdd />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      fontWeight: 'bold'
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <Button
                component={Link}
                to="/donate"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: '#ffffff',
                  fontWeight: 'bold',
                  minWidth: 'auto',
                  px: 2,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark
                  }
                }}
              >
                Donate
              </Button>
              <IconButton
                size="large"
                onClick={toggleMobileDrawer}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <MenuIcon />
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