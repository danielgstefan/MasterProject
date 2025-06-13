import axios from 'axios';
import { API_URL } from '../config/api';

export const getUserByUsername = async (username) => {
  const token = localStorage.getItem('user_token');
  if (!token) {
    throw new Error('You must be logged in to search for users');
  }

  try {
    const response = await axios.get(`${API_URL}/users/search/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('User not found');
    } else if (error.response && error.response.status === 401) {
      throw new Error('Please log in again to continue');
    }
    console.error('Error in getUserByUsername:', error.response || error);
    throw new Error('Error searching for user');
  }
};
