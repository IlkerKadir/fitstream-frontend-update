// src/pages/trainer/SessionForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, DollarSign, Users } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useNotificationContext } from '../../context/NotificationContext';
import { categories, difficultyLevels } from '../../data/mockData';
import { sessionService } from '../../services';
import Loader from '../../components/common/Loader';

const SessionForm = () => {
  const { showSuccess, showError } = useNotificationContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    scheduledAt: '',
    scheduledTime: '',
    duration: 60,
    tokenCost: 1,
    maxParticipants: 0,
    equipmentRequired: '',
    tags: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  // Load session data if editing
  useEffect(() => {
    const fetchSession = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const sessionData = await sessionService.getSessionById(id);

        // Format date and time for the form
        const scheduledDate = new Date(sessionData.scheduledAt);
        const formattedDate = scheduledDate.toISOString().split('T')[0];
        const formattedTime = scheduledDate.toTimeString().slice(0, 5);

        setFormData({
          title: sessionData.title,
          description: sessionData.description,
          category: sessionData.category,
          difficulty: sessionData.difficulty,
          scheduledAt: formattedDate,
          scheduledTime: formattedTime,
          duration: sessionData.duration,
          tokenCost: sessionData.tokenCost,
          maxParticipants: sessionData.maxParticipants || 0,
          equipmentRequired: sessionData.equipmentRequired ? sessionData.equipmentRequired.join(', ') : '',
          tags: sessionData.tags ? sessionData.tags.join(', ') : ''
        });

      } catch (error) {
        console.error('Error fetching session:', error);
        showError(error.response?.data?.message || 'Failed to load session data');
        navigate('/trainer/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, isEditing, navigate, showError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.description || !formData.category ||
        !formData.difficulty || !formData.scheduledAt || !formData.scheduledTime) {
      showError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare data for API
      const sessionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        scheduledAt: new Date(`${formData.scheduledAt}T${formData.scheduledTime}`).toISOString(),
        duration: parseInt(formData.duration),
        tokenCost: parseInt(formData.tokenCost),
        maxParticipants: parseInt(formData.maxParticipants),
        equipmentRequired: formData.equipmentRequired ? formData.equipmentRequired.split(',').map(item => item.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      // Create or update session via API
      if (isEditing) {
        await sessionService.updateSession(id, sessionData);
        showSuccess('Session updated successfully');
      } else {
        await sessionService.createSession(sessionData);
        showSuccess('Session created successfully');
      }

      navigate('/trainer/dashboard');
    } catch (error) {
      console.error('Error saving session:', error);
      showError(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} session`);
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
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-medium flex items-center"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Session' : 'Create New Session'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? 'Update the details of your training session'
            : 'Fill in the details to create a new training session'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Session Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., HIIT Cardio Blast"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe what participants can expect from this session"
                required
              ></textarea>
            </div>

            {/* Category and Difficulty */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select difficulty level</option>
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="flex items-center">
              <div className="flex-grow">
                <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="scheduledAt"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-grow">
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="scheduledTime"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Duration and Tokens */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="5"
                  max="240"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="tokenCost" className="block text-sm font-medium text-gray-700 mb-1">
                Token Cost <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="tokenCost"
                  name="tokenCost"
                  value={formData.tokenCost}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Participants (0 = unlimited)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Equipment Required */}
            <div>
              <label htmlFor="equipmentRequired" className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Required
              </label>
              <input
                type="text"
                id="equipmentRequired"
                name="equipmentRequired"
                value={formData.equipmentRequired}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Mat, Water bottle"
              />
              <p className="text-sm text-gray-500 mt-1">Comma-separated list of required equipment</p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Cardio, Weight Loss"
              />
              <p className="text-sm text-gray-500 mt-1">Comma-separated tags to help users find your session</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : isEditing ? 'Update Session' : 'Create Session'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export default SessionForm;
