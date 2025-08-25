// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import SideNavBar from './SideNavbar';

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <SideNavBar />
      <div className="flex-grow">
        <Outlet /> {/* Render child routes here */}
      </div>
    </div>
  );
};

export default ProtectedRoute;
