import axios from "./axiosInstance"; // Use axios with interceptor
import AuthService from "./AuthService"; // Import AuthService for authentication checks
const API_URL = "http://localhost:8081/api/chat/";

/**
 * Service for handling chat API calls to the backend.
 */
class ChatService {
  /**
   * Get recent chat messages (newest first).
   * 
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} - A promise that resolves to the response data or a rejected promise if not authenticated
   */
  getRecentMessages(page = 0, size = 50) {
    // Check if user is authenticated before making the API call
    if (!AuthService.isAuthenticated()) {
      return Promise.reject(new Error("User is not authenticated"));
    }
    return axios.get(`${API_URL}recent?page=${page}&size=${size}`);
  }

  /**
   * Get chat history in chronological order (oldest first).
   * 
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} - A promise that resolves to the response data or a rejected promise if not authenticated
   */
  getChatHistory(page = 0, size = 50) {
    // Check if user is authenticated before making the API call
    if (!AuthService.isAuthenticated()) {
      return Promise.reject(new Error("User is not authenticated"));
    }
    return axios.get(`${API_URL}history?page=${page}&size=${size}`);
  }

  /**
   * Send a new chat message.
   * 
   * @param {string} message - The message content
   * @returns {Promise} - A promise that resolves to the response data or a rejected promise if not authenticated
   */
  sendMessage(message) {
    // Check if user is authenticated before making the API call
    if (!AuthService.isAuthenticated()) {
      return Promise.reject(new Error("User is not authenticated"));
    }
    return axios.post(`${API_URL}send`, { message });
  }

  /**
   * Delete a chat message (admin only).
   * 
   * @param {number} id - The message ID
   * @returns {Promise} - A promise that resolves to the response data or a rejected promise if not authenticated
   */
  deleteMessage(id) {
    // Check if user is authenticated before making the API call
    if (!AuthService.isAuthenticated()) {
      return Promise.reject(new Error("User is not authenticated"));
    }
    return axios.delete(`${API_URL}${id}`);
  }
}

export default new ChatService();
