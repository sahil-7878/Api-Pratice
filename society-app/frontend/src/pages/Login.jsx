
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      redirectByRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, []);

  const redirectByRole = (role) => {
    const routes = {
      admin:       "/admin/dashboard",
      resident:    "/resident/dashboard",
      security:    "/security/dashboard",
      maintenance: "/maintenance/dashboard",
    };
    navigate(routes[role] || "/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏘️ Society Login</h2>
        <p style={styles.subtitle}>Smart Society Management System</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <Link to="/register">New resident? Register here</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100vh", backgroundColor: "#f0f4f8",
  },
  card: {
    background: "#fff", borderRadius: 12, padding: 40,
    width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", marginBottom: 4, color: "#2d3748" },
  subtitle: { textAlign: "center", color: "#718096", marginBottom: 24, fontSize: 14 },
  error: {
    background: "#fff5f5", color: "#c53030", border: "1px solid #fed7d7",
    borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14,
  },
  field: { marginBottom: 16 },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 6,
    border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4,
    boxSizing: "border-box",
  },
  button: {
    width: "100%", padding: "12px", backgroundColor: "#4299e1",
    color: "#fff", border: "none", borderRadius: 6, fontSize: 16,
    cursor: "pointer", marginTop: 8,
  },
};

export default Login;
