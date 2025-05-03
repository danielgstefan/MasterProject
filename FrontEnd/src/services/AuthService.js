import axios from "axios";

const API_URL = "http://localhost:8081/api/auth/";
const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Service for handling authentication API calls to the backend.
 */
class AuthService {
  constructor() {
    // Add request interceptor to add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              if (response.data.token) {
                this.setToken(response.data.token);
                return axios(originalRequest);
              }
            }
          } catch (err) {
            this.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login a user.
   * @param {string} identifier - The username OR email
   * @param {string} password - The password
   * @returns {Promise} - A promise that resolves to the user data
   */
  login(identifier, password) {
    return axios.post(API_URL + "signin", {
      username: identifier,
      password
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      if (response.data.token) {
        this.setToken(response.data.token);
        this.setRefreshToken(response.data.refreshToken);
        this.setUserData(response.data.user);
      }
      return response.data;
    });
  }

  /**
   * Refresh the access token using the refresh token.
   * @param {string} refreshToken - The refresh token
   * @returns {Promise} - A promise that resolves to the new token data
   */
  refreshToken(refreshToken) {
    return axios.post(API_URL + "refresh-token", {
      refreshToken
    });
  }

  /**
   * Set the access token in storage.
   * @param {string} token - The access token
   */
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get the stored access token.
   * @returns {string|null} - The access token or null if not found
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set the refresh token in storage.
   * @param {string} refreshToken - The refresh token
   */
  setRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Get the stored refresh token.
   * @returns {string|null} - The refresh token or null if not found
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Set the user data in storage.
   * @param {Object} userData - The user data
   */
  setUserData(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  /**
   * Logout the current user.
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Register a new user.
   * @param {string} username - The username
   * @param {string} email - The email
   * @param {string} password - The password
   * @returns {Promise} - A promise that resolves to the response data
   */
  register(username, email, password) {
    return axios
      .post(
        API_URL + "signup",
        {
          username,
          email,
          password
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .catch(error => {
        if (error.response) {
          // Server responded with error
          console.error("Server error:", error.response.data);
          console.error("Status:", error.response.status);
        } else if (error.request) {
          // Request was made but no response
          console.error("No response received:", error.request);
        } else {
          // Error in request setup
          console.error("Request setup error:", error.message);
        }
        throw error;
      });
  }

  /**
   * Get the current user from local storage.
   * @returns {Object|null} - The current user or null if not logged in
   */
  getCurrentUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if the user is authenticated.
   * @returns {boolean} - True if the user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  }
}

export default new AuthService();
