// src/components/sessions/SessionFilters.jsx
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { categories, difficultyLevels, trainers } from '../../data/mockData';

const SessionFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    trainer: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newFilters = {
      ...filters,
      [name]: value
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      difficulty: '',
      trainer: ''
    };

    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search for trainers, sessions, or categories..."
        />
      </div>

      {/* Filters Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleFilters}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <Filter size={18} className="mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {(filters.category || filters.difficulty || filters.trainer) && (
          <button
            onClick={clearFilters}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
          >
            <X size={16} className="mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Levels</option>
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Trainer Filter */}
            <div>
              <label htmlFor="trainer" className="block text-sm font-medium text-gray-700 mb-2">
                Trainer
              </label>
              <select
                id="trainer"
                name="trainer"
                value={filters.trainer}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Trainers</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.firstName} {trainer.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.category || filters.difficulty || filters.trainer) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.category && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              {filters.category}
              <button
                onClick={() => {
                  const newFilters = { ...filters, category: '' };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.difficulty && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              {filters.difficulty}
              <button
                onClick={() => {
                  const newFilters = { ...filters, difficulty: '' };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {filters.trainer && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
              {trainers.find(t => t.id === parseInt(filters.trainer, 10))?.firstName} {trainers.find(t => t.id === parseInt(filters.trainer, 10))?.lastName}
              <button
                onClick={() => {
                  const newFilters = { ...filters, trainer: '' };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionFilters;
