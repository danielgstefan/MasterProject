import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ component: Component, roleRequired, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const currentUser = AuthService.getCurrentUser();
        const isAuthenticated = AuthService.isAuthenticated();

        if (!isAuthenticated) {
          // Not logged in, redirect to login page
          return <Redirect to="/authentication/sign-in" />;
        }

        // Check if route requires admin role
        if (roleRequired === "ROLE_ADMIN") {
          if (currentUser && currentUser.roles && currentUser.roles.includes("ROLE_ADMIN")) {
            return <Component {...props} />;
          } else {
            // Not admin, redirect to home page
            return <Redirect to="/dashboard" />;
          }
        }

        // If we get here, the user is authenticated and meets any role requirements
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
