import axios from "./axiosInstance"; // Use axios with interceptor
import AuthService from "./AuthService"; // Import AuthService for authentication checks
const API_URL = "http://localhost:8081/api/chat/";
const WS_URL = "http://localhost:8081/ws";
import SockJS from "sockjs-client";

// Note: You need to install the STOMP client library:
// npm install @stomp/stompjs
// This is a placeholder for the STOMP client that should be imported
import { Client } from '@stomp/stompjs';

/**
 * Service for handling chat API calls to the backend.
 * Also provides WebSocket functionality for real-time chat.
 */
class ChatService {
  constructor() {
    this.stompClient = null;
    this.subscription = null;
    this.connected = false;
    this.messageHandlers = [];
  }

  /**
   * Connect to the WebSocket server.
   * 
   * @param {function} onMessageReceived - Callback function for when a message is received
   * @returns {Promise} - A promise that resolves when connected or rejects on error
   */
  connect(onMessageReceived) {
    // Check if user is authenticated before connecting
    if (!AuthService.isAuthenticated()) {
      return Promise.reject(new Error("User is not authenticated"));
    }

    // Add the message handler
    if (onMessageReceived) {
      this.messageHandlers.push(onMessageReceived);
    }

    // If already connected, return a resolved promise
    if (this.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // This is a placeholder for the actual WebSocket connection code
      // You need to install the STOMP client library and uncomment this code


      // Create a new STOMP client
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: {
          Authorization: `Bearer ${AuthService.getToken()}`
        },
        debug: function (str) {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });

      // Define what happens on connect
      this.stompClient.onConnect = (frame) => {
        this.connected = true;
        console.log('Connected to WebSocket: ' + frame);

        // Subscribe to the public topic
        this.subscription = this.stompClient.subscribe('/topic/public', (message) => {
          const chatMessage = JSON.parse(message.body);

          // Call all message handlers
          this.messageHandlers.forEach(handler => handler(chatMessage));
        });

        // Send a message to the server that the user has joined
        this.stompClient.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({ type: 'JOIN' })
        });

        resolve();
      };

      // Define what happens on error
      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        reject(new Error('Error connecting to WebSocket'));
      };

      // Activate the client
      this.stompClient.activate();
    });
  }

  /**
   * Disconnect from the WebSocket server.
   */
  disconnect() {
    if (this.stompClient) {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
  }

  /**
   * Send a message via WebSocket.
   * 
   * @param {string} message - The message content
   * @returns {Promise} - A promise that resolves when the message is sent or rejects on error
   *                     If falling back to REST API, resolves with the response from the API
   */
  sendMessageWs(message) {
    // Check if user is authenticated before sending
    if (!AuthService.isAuthenticated()) {
      return Promise.reject(new Error("User is not authenticated"));
    }

    return new Promise((resolve, reject) => {
      // If connected to WebSocket, use it
      if (this.stompClient && this.connected) {
        try {
          // Create a temporary message object to add to the UI immediately
          const tempMessage = {
            id: 'temp-' + Date.now(),
            message: message,
            senderUsername: AuthService.getCurrentUser().username,
            timestamp: new Date().toISOString()
          };

          this.stompClient.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify({ message: message })
          });

          // Resolve with the temporary message
          resolve({ data: tempMessage });
        } catch (error) {
          console.error('Error sending message via WebSocket:', error);
          // Fall back to REST API if WebSocket send fails
          this.sendMessage(message)
            .then(resolve)
            .catch(reject);
        }
      } else {
        // Not connected to WebSocket, fall back to REST API
        console.warn('Not connected to WebSocket, falling back to REST API');
        this.sendMessage(message)
          .then(resolve)
          .catch(reject);
      }
    });
  }
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
