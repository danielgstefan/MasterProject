/**
 * Function to get the authorization header for API requests.
 * @returns {Object} - The authorization header or an empty object if not logged in
 */
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    // For Spring Boot backend
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}