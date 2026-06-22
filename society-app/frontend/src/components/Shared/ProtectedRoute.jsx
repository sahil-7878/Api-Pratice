
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
