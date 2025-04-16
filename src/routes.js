// src/routes.js
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SessionCatalog from './pages/SessionCatalog';
import SessionPage from './pages/SessionPage';
import LiveStream from './pages/LiveStream';
import Packages from './pages/Packages';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerProfile from './pages/trainer/TrainerProfile';
import SessionForm from './pages/trainer/SessionForm';
import TrainerLiveStream from './pages/trainer/TrainerLiveStream';
import SessionAnalytics from './pages/trainer/SessionAnalytics';

// Route configuration with role-based access control
const routes = (isAuthenticated, user) => {
  const isTrainer = user?.role === 'trainer' || user?.role === 'admin';

  return [
    {
      path: '/',
      element: <Home />,
      exact: true
    },
    {
      path: '/auth',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />,
    },
    // User routes
    {
      path: '/dashboard',
      element: isAuthenticated ? (
        isTrainer ? <Navigate to="/trainer/dashboard" /> : <Dashboard />
      ) : <Navigate to="/auth" />,
    },
    {
      path: '/sessions',
      element: <SessionCatalog />,
    },
    {
      path: '/sessions/:id',
      element: <SessionPage />,
    },
    {
      path: '/live/:id',
      element: isAuthenticated ? <LiveStream /> : <Navigate to="/auth" />,
    },
    {
      path: '/packages',
      element: <Packages />,
    },
    {
      path: '/profile',
      element: isAuthenticated ? <UserProfile /> : <Navigate to="/auth" />,
    },
    // Trainer routes
    {
      path: '/trainer/dashboard',
      element: isAuthenticated && isTrainer ? <TrainerDashboard /> : <Navigate to="/auth" />,
    },
    {
      path: '/trainer/profile',
      element: isAuthenticated && isTrainer ? <TrainerProfile /> : <Navigate to="/auth" />,
    },
    {
      path: '/trainer/sessions/create',
      element: isAuthenticated && isTrainer ? <SessionForm /> : <Navigate to="/auth" />,
    },
    {
      path: '/trainer/sessions/edit/:id',
      element: isAuthenticated && isTrainer ? <SessionForm /> : <Navigate to="/auth" />,
    },
    {
      path: '/trainer/sessions/:id/analytics',
      element: isAuthenticated && isTrainer ? <SessionAnalytics /> : <Navigate to="/auth" />,
    },
    {
      path: '/trainer/live/:id',
      element: isAuthenticated && isTrainer ? <TrainerLiveStream /> : <Navigate to="/auth" />,
    },
    // Fallback
    {
      path: '*',
      element: <NotFound />,
    }
  ];
};

export default routes;
