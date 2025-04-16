// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Package, Menu, X, User, LogOut, Home, Calendar, Play, ShoppingBag } from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-indigo-600">FitStream</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/sessions"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sessions
              </Link>
              <Link
                to="/packages"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Packages
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Token display */}
                <div className="bg-indigo-100 px-4 py-2 rounded-full flex items-center">
                  <Package size={18} className="text-indigo-600 mr-2" />
                  <span className="font-medium">{user?.tokens} Tokens</span>
                </div>

                {/* User Menu (Desktop) */}
                <div className="hidden md:flex items-center">
                  <div className="relative group">
                    <button className="flex items-center focus:outline-none">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-gray-600" />
                        )}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={20} className="mr-2" />
                Home
              </Link>
              <Link
                to="/sessions"
                className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={20} className="mr-2" />
                Sessions
              </Link>
              <Link
                to="/packages"
                className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={20} className="mr-2" />
                Packages
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Play size={20} className="mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    <LogOut size={20} className="mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 mt-2 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      navigate('/auth', { state: { mode: 'login' } });
                      setMobileMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/auth', { state: { mode: 'signup' } });
                      setMobileMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
