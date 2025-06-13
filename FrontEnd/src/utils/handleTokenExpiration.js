import AuthService from "../services/AuthService";

export const handleTokenExpiration = (error, history) => {
  // Handle any 401 (Unauthorized) error, regardless of the specific message
  if (error.response && error.response.status === 401) {
    AuthService.logout();
    history.push('/authentication/sign-in');
    return true;
  }

  // Handle specific 403 (Forbidden) errors that might be related to token issues
  if (
    error.response &&
    error.response.status === 403 &&
    error.response.data.message &&
    (error.response.data.message === "Unauthorized error: Full authentication is required to access this resource" ||
     error.response.data.message.includes("JWT expired"))
  ) {
    AuthService.logout();
    history.push('/authentication/sign-in');
    return true;
  }

  return false;
};
