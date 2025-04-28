
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import PrivateRoute from './components/common/PrivateRoute';// In your App.js or wherever your routes are defined
import Charities from './pages/Charities';
import CharityProfilePage from './pages/CharityProfile';
import DonationPage from './pages/DonationPage';
import DonationHistoryPage from './pages/DonationHistory';
import DonationDetailPage from './pages/DonationDetailPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import EditProjectPage from './pages/EditProjectPage';
import CharityProjectsPage from './pages/CharityProjectsPage';

// In your App.js or wherever your routes are defined

const App = () => {
  return (
    <Provider store={store}>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/charities/:charityId" element={<CharityProfilePage />} />
          <Route path="/charities/:charityId/projects" element={<CharityProjectsPage />} />
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

        <Route path="/donate" element={<DonationPage />} />
        <Route path="/donate/charity/:charityId" element={<DonationPage />} />
        <Route path="/donate/project/:charityId/:projectId" element={<DonationPage />} />
        <Route path="/donations/history" element={<DonationHistoryPage />} />
        <Route path="/donations/:id" element={<DonationDetailPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/dashboard/projects/edit/:id" element={<EditProjectPage />} />
        
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;