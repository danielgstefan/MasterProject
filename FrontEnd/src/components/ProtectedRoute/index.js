import { Route, Redirect } from "react-router-dom";
import AuthService from "services/AuthService";

const ProtectedRoute = ({ component: Component, roleRequired, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const isAuthenticated = AuthService.isAuthenticated();
        const user = AuthService.getCurrentUser();
        const hasRequiredRole = roleRequired ? user?.roles?.includes(roleRequired) : true;

        if (!isAuthenticated) {
          // Not logged in, redirect to login page
          return <Redirect to="/authentication/sign-in" />;
        }

        if (roleRequired && !hasRequiredRole) {
          // Logged in but doesn't have the required role
          return <Redirect to="/dashboard" />;
        }

        // Authorized, render component
        return <Component {...props} />;
      }}
    />
  );
}

export default ProtectedRoute;
