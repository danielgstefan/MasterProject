import axios from "./axiosInstance"; // Use axios with interceptor
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
   * @returns {Promise} - A promise that resolves to the response data
   */
  getRecentMessages(page = 0, size = 50) {
    return axios.get(`${API_URL}recent?page=${page}&size=${size}`);
  }

  /**
   * Get chat history in chronological order (oldest first).
   * 
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} - A promise that resolves to the response data
   */
  getChatHistory(page = 0, size = 50) {
    return axios.get(`${API_URL}history?page=${page}&size=${size}`);
  }

  /**
   * Send a new chat message.
   * 
   * @param {string} message - The message content
   * @returns {Promise} - A promise that resolves to the response data
   */
  sendMessage(message) {
    return axios.post(`${API_URL}send`, { message });
  }

  /**
   * Delete a chat message (admin only).
   * 
   * @param {number} id - The message ID
   * @returns {Promise} - A promise that resolves to the response data
   */
  deleteMessage(id) {
    return axios.delete(`${API_URL}${id}`);
  }
}

export default new ChatService();