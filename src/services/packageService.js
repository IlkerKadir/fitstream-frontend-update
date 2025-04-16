// src/services/packageService.js
import api from './api';

const packageService = {
  // Get all packages
  getAllPackages: async () => {
    const response = await api.get('/packages');
    return response.data;
  },

  // Get package by ID
  getPackageById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  // Purchase a package
  purchasePackage: async (packageId, paymentMethod, paymentDetails) => {
    const response = await api.post(`/packages/${packageId}/purchase`, {
      paymentMethod,
      paymentDetails
    });
    return response.data;
  }
};

export default packageService;
