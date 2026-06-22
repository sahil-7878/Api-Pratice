
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Login from "./pages/Login";
import AdminDashboard    from "./components/Admin/AdminDashboard";
import ResidentDashboard from "./components/Resident/ResidentDashboard";
import ComplaintForm     from "./components/Resident/ComplaintForm";
import SecurityDashboard from "./components/Security/SecurityDashboard";
import ProtectedRoute    from "./components/Shared/ProtectedRoute";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {}
          <Route path="/login"    element={<Login />} />
          <Route path="/"         element={<Navigate to="/login" replace />} />

          {}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {}
          <Route path="/resident/dashboard" element={
            <ProtectedRoute roles={["resident"]}>
              <ResidentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/resident/complaints" element={
            <ProtectedRoute roles={["resident"]}>
              <ComplaintForm />
            </ProtectedRoute>
          } />

          {}
          <Route path="/security/dashboard" element={
            <ProtectedRoute roles={["security"]}>
              <SecurityDashboard />
            </ProtectedRoute>
          } />

          {}
          <Route path="/maintenance/dashboard" element={
            <ProtectedRoute roles={["maintenance"]}>
              {}
              <div style={{ padding: 40 }}>
                <h2>🔧 Maintenance Dashboard</h2>
                <p>Your assigned complaints will appear here.</p>
              </div>
            </ProtectedRoute>
          } />

          {}
          <Route path="*" element={
            <div style={{ padding: 60, textAlign: "center" }}>
              <h2>404 — Page Not Found</h2>
              <a href="/login">Go to Login</a>
            </div>
          } />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
