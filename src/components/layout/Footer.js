import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  Divider,
  Stack,
  IconButton,
  Chip,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  VolunteerActivism,
  Email,
  Phone,
  Security,
  Verified,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  ArrowForward
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { text: 'Home', path: '/' },
    { text: 'Explore Charities', path: '/charities' },
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Login', path: '/login' },
    { text: 'Sign Up', path: '/register' }
  ];

  const resources = [
    { text: 'How It Works', path: '/how-it-works' },
    { text: 'Blockchain Verification', path: '/blockchain-verification' },
    { text: 'Impact Stories', path: '/impact-stories' },
    { text: 'FAQ', path: '/faq' },
    { text: 'Help Center', path: '/help' }
  ];

  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', href: '#' },
    { icon: <Twitter />, label: 'Twitter', href: '#' },
    { icon: <LinkedIn />, label: 'LinkedIn', href: '#' },
    { icon: <Instagram />, label: 'Instagram', href: '#' }
  ];

  const trustBadges = [
    { icon: <Security />, text: 'Blockchain Secured' }
  ];

  const FooterLink = ({ to, children, external = false }) => (
    <Typography
      component={external ? 'a' : Link}
      to={!external ? to : undefined}
      href={external ? to : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      sx={{
        color: theme.palette.text.secondary,
        textDecoration: 'none',
        display: 'block',
        py: 0.5,
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette.primary.main,
          textDecoration: 'none'
        }
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Revolutionizing charitable giving through blockchain transparency. 
                  Every donation is tracked, verified, and creates measurable impact 
                  in communities worldwide.
                </Typography>
                
                {/* Trust Badges */}
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {trustBadges.map((badge, index) => (
                    <Chip
                      key={index}
                      icon={badge.icon}
                      label={badge.text}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        fontWeight: 'medium'
                      }}
                    />
                  ))}
                </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: theme.palette.text.primary
                }}
              >
                Quick Links
              </Typography>
              <List sx={{ p: 0 }}>
                {quickLinks.map((link, index) => (
                  <ListItem key={index} sx={{ p: 0 }}>
                    <FooterLink to={link.path}>
                      {link.text}
                    </FooterLink>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Contact & Newsletter */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: theme.palette.text.primary
                }}
              >
                Get In Touch
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                  <Typography
                    component="a"
                    href="mailto:support@charitrace.org"
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.primary.main }
                    }}
                  >
                    support@charitrace.org
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                  <Typography color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Bottom Footer */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            © {currentYear} Charitrace. All rights reserved. | Built with ❤️ for transparency
          </Typography>
          
          <Stack
            direction="row"
            spacing={3}
            sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/cookies">Cookie Policy</FooterLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;