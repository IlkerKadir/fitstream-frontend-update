// src/pages/trainer/TrainerProfile.jsx
import React, { useState, useEffect } from 'react';
import { Award, Briefcase, CheckCircle, Image, Clipboard, Star } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { userService, trainerService } from '../../services';
import { categories } from '../../data/mockData';
import Loader from '../../components/common/Loader';

const TrainerProfile = () => {
  const { user } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    specialties: [],
    experience: '',
    certifications: [{ name: '', issuer: '', year: '' }],
    hourlyRate: 0
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Load trainer profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get user profile with trainer details
        const userProfile = await userService.getUserProfile(user._id);

        // Get session stats
        const pastSessions = await trainerService.getPastSessions();

        setCompletedSessions(pastSessions.length);

        // Set form data from profile
        if (userProfile.trainerProfile) {
          setFormData({
            bio: userProfile.trainerProfile.bio || '',
            specialties: userProfile.trainerProfile.specialties || [],
            experience: userProfile.trainerProfile.experience || '',
            certifications: userProfile.trainerProfile.certifications?.length > 0
              ? userProfile.trainerProfile.certifications
              : [{ name: '', issuer: '', year: '' }],
            hourlyRate: userProfile.trainerProfile.hourlyRate || 0
          });
        }
      } catch (error) {
        console.error('Error fetching trainer profile:', error);
        showError('Failed to load trainer profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, showError]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle specialty checkbox changes
  const handleSpecialtyChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(specialty => specialty !== value)
      }));
    }
  };

  // Handle certification field changes
  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [name]: value
    };

    setFormData(prev => ({
      ...prev,
      certifications: updatedCertifications
    }));
  };

  // Add a new certification
  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', year: '' }]
    }));
  };

  // Remove a certification
  const removeCertification = (index) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      certifications: updatedCertifications
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.bio) {
      showError('Please provide a bio');
      return;
    }

    if (formData.specialties.length === 0) {
      showError('Please select at least one specialty');
      return;
    }

    setSubmitting(true);

    try {
      // Update the trainer profile using the API
      await trainerService.updateTrainerProfile({
        trainerProfile: {
          bio: formData.bio,
          specialties: formData.specialties,
          experience: formData.experience,
          certifications: formData.certifications.filter(cert => cert.name.trim() !== ''),
          hourlyRate: parseFloat(formData.hourlyRate)
        }
      });

      showSuccess('Trainer profile updated successfully');
    } catch (error) {
      console.error('Error updating trainer profile:', error);
      showError(error.response?.data?.message || 'Failed to update trainer profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trainer Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your professional information visible to potential clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Left Sidebar - Trainer Stats */}
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
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
                <button className="absolute bottom-3 right-0 bg-indigo-600 text-white p-1.5 rounded-full">
                  <Image size={16} />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center mt-1">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span className="font-medium">{user?.trainerProfile?.rating || '0.0'}</span>
                <span className="text-gray-500 text-sm ml-1">({user?.trainerProfile?.totalRatings || 0} ratings)</span>
              </div>
              {user?.trainerProfile?.verified && (
                <div className="flex items-center mt-2 text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-sm font-medium">Verified Trainer</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sessions</h3>
                <p className="text-lg font-medium text-gray-900">{completedSessions} completed</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                <p className="text-lg font-medium text-gray-900">{formData.experience || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Specialties</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
                <p className="text-lg font-medium text-gray-900">${formData.hourlyRate}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content - Profile Form */}
        <div className="md:col-span-3">
          <Card>
            <form onSubmit={handleSubmit}>
              {/* Bio */}
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your experience, training philosophy, and specialties"
                  required
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">This will be displayed on your profile to potential clients</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 5+ years"
                  required
                />
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">Select the categories you specialize in</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`specialty-${category}`}
                        value={category}
                        checked={formData.specialties.includes(category)}
                        onChange={handleSpecialtyChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`specialty-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="mb-6">
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">This will be your rate for private sessions</p>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Certifications & Qualifications
                  </label>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Certification
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">List your professional fitness certifications</p>

                {formData.certifications.map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <Award size={18} className="text-indigo-600 mr-2" />
                        <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
                      </div>
                      {formData.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`cert-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Certification Name
                        </label>
                        <input
                          type="text"
                          id={`cert-name-${index}`}
                          name="name"
                          value={cert.name}
                          onChange={(e) => handleCertificationChange(index, e)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor={`cert-issuer-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Issuing Organization
                        </label>
                        <input
                          type="text"
                          id={`cert-issuer-${index}`}
                          name="issuer"
                          value={cert.issuer}
                          onChange={(e) => handleCertificationChange(index, e)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor={`cert-year-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          id={`cert-year-${index}`}
                          name="year"
                          value={cert.year}
                          onChange={(e) => handleCertificationChange(index, e)}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default TrainerProfile;
