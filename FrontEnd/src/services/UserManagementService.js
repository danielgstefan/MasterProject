import axios from "axios";
import AuthService from "./AuthService";

const API_URL = "http://localhost:8081/api/users/";

class UserManagementService {
  getAllUsers() {
    const token = AuthService.getToken();
    return axios.get(API_URL + "all", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  updateUserRole(userId, newRole) {
    const token = AuthService.getToken();
    return axios.put(API_URL + `${userId}/role`, { role: newRole }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  deleteUser(userId) {
    const token = AuthService.getToken();
    return axios.delete(API_URL + `${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  banUser(userId) {
    const token = AuthService.getToken();
    return axios.put(API_URL + `${userId}/ban`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  unbanUser(userId) {
    const token = AuthService.getToken();
    return axios.put(API_URL + `${userId}/unban`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}

export default new UserManagementService();
