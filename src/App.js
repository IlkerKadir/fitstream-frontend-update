// src/App.jsx
// Update to include the user object for role-based routing
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import routes from './routes';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/common/Notification';

function App() {
  const { isAuthenticated, user, loading } = useAuthContext();

  // Display loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const appRoutes = routes(isAuthenticated, user);

  return (
    <NotificationProvider>
      <BrowserRouter>
        <NotificationContainer />
        <Routes>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
              exact={route.exact}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
