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
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise} - A promise that resolves to the user data
   */
  async login(username, password) {
    try {
      const response = await axios.post(
        API_URL + "signin",
        {
          username,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.token) {
        this.setToken(response.data.token);
        this.setRefreshToken(response.data.refreshToken);

        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles
        };

        this.setUserData(userData);
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Login error response:', error.response.data);
        throw error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw error;
      }
    }
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
    if (token && typeof token === "string" && token.includes(".")) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      console.warn("‼️ Token invalid, nu a fost salvat:", token);
    }
  }

  /**
   * Get the stored access token.
   * @returns {string|null} - The access token or null if not found
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Set the refresh token in storage.
   * @param {string} refreshToken - The refresh token
   */
  setRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
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
  async logout() {
    try {
      await axios.post(API_URL + "signout");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
   * Get the current user data from storage.
   * @returns {Object|null} - The user data or null if not found
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if a user is authenticated.
   * @returns {boolean} - True if authenticated, false otherwise
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Update user profile information.
   * @param {string} username - The new username
   * @param {string} email - The new email
   * @returns {Promise} - A promise that resolves to the response data
   */
  updateProfile(username, email) {
    return axios
      .put(
        API_URL + "profile",
        {
          username,
          email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(response => {
        // Check if the response contains a new token (username was changed)
        if (response.data && response.data.token) {
          // Update tokens in storage
          this.setToken(response.data.token);
          if (response.data.refreshToken) {
            this.setRefreshToken(response.data.refreshToken);
          }

          // Update user data in storage
          const userData = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            roles: response.data.roles
          };
          this.setUserData(userData);
        } else {
          // If no token in response, just update the stored user data
          const userData = this.getCurrentUser();
          if (userData) {
            userData.username = username;
            userData.email = email;
            this.setUserData(userData);
          }
        }
        return response.data;
      })
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
}

export default new AuthService();
