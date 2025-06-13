import axios from "axios";

const API_URL = "http://localhost:8081/api/auth/";
const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";
const REFRESH_TOKEN_KEY = "refresh_token";


class AuthService {
  constructor() {
    // Add request interceptor to add token to all requests
    axios.interceptors.request.use(
      (config) => {
        // Add token to all requests to our backend API
        if (config.url && config.url.includes('localhost:8081')) {
          const token = this.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url.includes('localhost:8081')) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();

            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const newToken = response?.data?.token;

              if (newToken) {
                this.setToken(newToken);

                // Update the original request with the new token
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return axios(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error("Token refresh error:", refreshError);
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }


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
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
          location: response.data.location,
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


  refreshToken(refreshToken) {
    return axios.post(API_URL + "refresh-token", {
      refreshToken
    });
  }


  setToken(token) {
    if (token && typeof token === "string" && token.includes(".")) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      console.warn("‼️ Token invalid, nu a fost salvat:", token);
    }
  }


  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }


  setRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }


  setUserData(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }


  async logout() {
    try {
      const token = this.getToken();
      await axios.post(API_URL + "signout", {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }


  register(username, email, password, firstName, lastName, phoneNumber, location) {
    return axios
      .post(
        API_URL + "signup",
        {
          username,
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          location
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


  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }


  updateProfile(username, email, firstName, lastName, phoneNumber, location) {
    const token = this.getToken();
    return axios
      .put(
        API_URL + "profile",
        {
          username,
          email,
          firstName,
          lastName,
          phoneNumber,
          location
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
            location: response.data.location,
            roles: response.data.roles
          };
          this.setUserData(userData);
        } else {
          // If no token in response, just update the stored user data
          const userData = this.getCurrentUser();
          if (userData) {
            userData.username = username;
            userData.email = email;
            userData.firstName = firstName;
            userData.lastName = lastName;
            userData.phoneNumber = phoneNumber;
            userData.location = location;
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
