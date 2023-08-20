import { Navigate } from 'react-router-dom';
import { useAuth } from '../authProvider';
import SideBar from '../SideBar';

export const ProtectedRoute = () => {
  const { token } = useAuth();
  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  // If authenticated, render the child routes
  return <SideBar />;
};
