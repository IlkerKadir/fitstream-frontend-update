// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Clock, Award, Calendar, CheckSquare } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import userService from '../services/userService';
import { categories, difficultyLevels } from '../data/mockData';
import Loader from '../components/common/Loader';

const UserProfile = () => {
  const { user } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [completedSessions, setCompletedSessions] = useState([]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });

  // Preferences form state
  const [preferencesForm, setPreferencesForm] = useState({
    preferredCategories: [],
    difficulty: 'Intermediate',
    notifications: {
      email: true,
      sessionReminders: true,
      promotions: false
    }
  });

  // Load user data
  useEffect(() => {
    if (user) {
      // Initialize form with user data
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        bio: user.bio || ''
      });

      // Initialize preferences
      setPreferencesForm({
        preferredCategories: user.preferences?.categories || [],
        difficulty: user.preferences?.difficulty || 'Intermediate',
        notifications: {
          email: user.preferences?.notifications?.email !== false,
          sessionReminders: user.preferences?.notifications?.sessionReminders !== false,
          promotions: user.preferences?.notifications?.promotions === true
        }
      });

      // Fetch completed sessions
      fetchCompletedSessions();
    }
  }, [user]);

  // Fetch user's completed sessions
  const fetchCompletedSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userSessions = await userService.getUserSessions(user._id);
      setCompletedSessions(userSessions.filter(session =>
        session.status === 'completed'
      ));
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
      showError('Failed to load your session history');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle preferences form changes
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'category') {
      const category = value;

      setPreferencesForm(prev => {
        const currentCategories = [...prev.preferredCategories];

        if (checked) {
          if (!currentCategories.includes(category)) {
            currentCategories.push(category);
          }
        } else {
          const index = currentCategories.indexOf(category);
          if (index > -1) {
            currentCategories.splice(index, 1);
          }
        }

        return {
          ...prev,
          preferredCategories: currentCategories
        };
      });
    } else if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1];

      setPreferencesForm(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked
        }
      }));
    } else {
      setPreferencesForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Save profile changes
  const saveProfileChanges = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Update user profile via API
      await userService.updateUserProfile(user._id, {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phoneNumber: profileForm.phone,
        bio: profileForm.bio
      });

      showSuccess('Profile updated successfully');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Save preferences changes
  const savePreferencesChanges = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Update user preferences via API
      await userService.updateUserPreferences(user._id, {
        categories: preferencesForm.preferredCategories,
        difficulty: preferencesForm.difficulty,
        notifications: preferencesForm.notifications
      });

      showSuccess('Preferences updated successfully');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p>Please log in to view your profile.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Profile
        </h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center py-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="bg-indigo-100 px-4 py-2 rounded-full flex items-center">
                <span className="font-medium">{user?.tokens} Tokens</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <nav className="space-y-1">
                <button
                  className={`flex items-center px-4 py-2 w-full text-left rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={18} className="mr-3" />
                  Profile Information
                </button>
                <button
                  className={`flex items-center px-4 py-2 w-full text-left rounded-md ${
                    activeTab === 'preferences'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <Award size={18} className="mr-3" />
                  Preferences
                </button>
                <button
                  className={`flex items-center px-4 py-2 w-full text-left rounded-md ${
                    activeTab === 'sessions'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('sessions')}
                >
                  <Calendar size={18} className="mr-3" />
                  Session History
                </button>
                <button
                  className={`flex items-center px-4 py-2 w-full text-left rounded-md ${
                    activeTab === 'billing'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('billing')}
                >
                  <Briefcase size={18} className="mr-3" />
                  Billing & Tokens
                </button>
              </nav>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {loading && <Loader />}

          {/* Profile Information */}
          {activeTab === 'profile' && !loading && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Profile Information
              </h2>

              <form onSubmit={saveProfileChanges}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us a bit about yourself..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && !loading && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Preferences
              </h2>

              <form onSubmit={savePreferencesChanges}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Training Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          name="category"
                          value={category}
                          checked={preferencesForm.preferredCategories.includes(category)}
                          onChange={handlePreferencesChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={preferencesForm.difficulty}
                    onChange={handlePreferencesChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="notifications.email"
                        checked={preferencesForm.notifications.email}
                        onChange={handlePreferencesChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                        Receive email notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sessionReminders"
                        name="notifications.sessionReminders"
                        checked={preferencesForm.notifications.sessionReminders}
                        onChange={handlePreferencesChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sessionReminders" className="ml-2 text-sm text-gray-700">
                        Receive session reminders (30 minutes before)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="promotions"
                        name="notifications.promotions"
                        checked={preferencesForm.notifications.promotions}
                        onChange={handlePreferencesChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="promotions" className="ml-2 text-sm text-gray-700">
                        Receive special offers and promotions
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Session History */}
          {activeTab === 'sessions' && !loading && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Session History
              </h2>

              <div className="space-y-6">
                {completedSessions && completedSessions.length > 0 ? (
                  completedSessions.map(session => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                          <p className="text-gray-600">with {session.trainer}</p>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 ${i < (session.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Clock size={16} className="mr-1" />
                        <span>
                          {new Date(session.completedAt || session.scheduledAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 p-6 rounded-full inline-flex mb-4">
                      <Calendar size={36} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No completed sessions yet</h3>
                    <p className="text-gray-500">Once you attend a session, it will appear here</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Billing & Tokens */}
          {activeTab === 'billing' && !loading && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Billing & Tokens
              </h2>

              <div className="bg-indigo-50 rounded-lg p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Your Token Balance</h3>
                  <p className="text-gray-600">Use tokens to book training sessions</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <span className="text-2xl font-bold text-indigo-600 mr-4">{user?.tokens} Tokens</span>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/packages'}
                  >
                    Buy More
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase History</h3>

                {/* Purchase history would come from an API in a real app */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tokens
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Apr 1, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Regular Pack
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          10
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $34.99
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Mar 15, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Starter Pack
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $19.99
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>

                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-gray-200 rounded mr-3"></div>
                      <div>
                        <p className="text-gray-900 font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Payment Method
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UserProfile;
