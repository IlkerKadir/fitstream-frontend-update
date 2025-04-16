// src/pages/Auth.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, authError, clearAuthError } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Check URL state for initial mode and redirect location
  useEffect(() => {
    if (location.state) {
      if (location.state.mode) {
        setMode(location.state.mode);
      }
    }
  }, [location.state]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they were trying to access or to dashboard
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, location.state]);

  // Show auth error in notification if it exists
  useEffect(() => {
    if (authError && showError) {
      showError(authError);
      clearAuthError();
    }
  }, [authError, showError, clearAuthError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  const validateForm = () => {
    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        showError('Please fill in all fields');
        return false;
      }
    } else {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        showError('Please fill in all fields');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        showError('Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        showSuccess('Login successful');
        // Navigate is handled by the authentication effect
      } else {
        await signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        showSuccess('Account created successfully');
        // Navigate is handled by the authentication effect
      }
    } catch (error) {
      // Error is already handled via authError in the AuthContext
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {mode === 'login' ? 'Sign In' : 'Create an Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === 'login'
                ? 'Sign in to access your account'
                : 'Join FitStream to start your fitness journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
              />
            </div>

            {mode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="mb-6 text-right">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot Password?
                </a>
              </div>
            )}

            <div className="mb-6">
              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <Loader size="sm" color="white" />
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={handleToggleMode}
                className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Auth;
