import axios from 'axios';
import { API_URL } from '../config/api';

const handleError = (error) => {
  // For 401 errors, pass through the original error to allow token refresh to work
  if (error.response && error.response.status === 401) {
    throw error;
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 403) {
      throw new Error(error.response.data || 'Access denied');
    }
    throw new Error(error.response.data || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up request');
  }
};

const getTuningRequests = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tuning/requests/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const createTuningRequest = async (userId, requestData) => {
  const token = localStorage.getItem('user_token');

  // Transform Yes/No values to booleans
  const transformedData = {
    ...requestData,
    removeEmissionControl: requestData.removeEmissionControl === 'Yes',
    wantsSoundClip: requestData.wantsSoundClip === 'Yes',
    needsAlignment: requestData.needsAlignment === 'Yes'
  };

  try {
    const response = await axios.post(`${API_URL}/tuning/request?userId=${userId}`, transformedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const getTuningRequestsByType = async (userId, type) => {
  try {
    const response = await axios.get(`${API_URL}/tuning/requests/${userId}/${type}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export { getTuningRequests, createTuningRequest, getTuningRequestsByType };
