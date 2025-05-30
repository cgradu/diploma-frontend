// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import PrivateRoute from './components/common/PrivateRoute';
import Charities from './pages/Charities';
import CharityProfilePage from './pages/CharityProfile';
import DonationPage from './pages/DonationPage';
import DonationHistoryPage from './pages/DonationHistory';
import DonationDetailPage from './pages/DonationDetailPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import EditProjectPage from './pages/EditProjectPage';
import CharityProjectsPage from './pages/CharityProjectsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/common/AdminRoute';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/charities/:charityId" element={<CharityProfilePage />} />
            <Route path="/charities/:charityId/projects" element={<CharityProjectsPage />} />
            
            {/* Donation Routes */}
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/donate/charity/:charityId" element={<DonationPage />} />
            <Route path="/donate/project/:projectId" element={<DonationPage />} />
            <Route path="/donations/history" element={<DonationHistoryPage />} />
            <Route path="/donations/:id" element={<DonationDetailPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/dashboard/projects/edit/:id" 
              element={
                <PrivateRoute>
                  <EditProjectPage />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;