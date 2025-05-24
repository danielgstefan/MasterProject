import axios from "axios";
import AuthService from "./AuthService";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8081/api",
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = AuthService.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = AuthService.getRefreshToken();

                if (refreshToken) {
                    const response = await AuthService.refreshToken(refreshToken);
                    const newAccessToken = response?.data?.token;

                    if (
                        newAccessToken &&
                        typeof newAccessToken === "string" &&
                        newAccessToken.includes(".")
                    ) {
                        AuthService.setToken(newAccessToken);
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest);
                    } else {
                        console.warn("⚠️ Token reîmprospătat invalid:", response?.data);
                        AuthService.logout();
                    }
                }
            } catch (refreshError) {
                console.error("⚠️ Eroare refresh-token:", refreshError);
                AuthService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
