
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { logout } from "../../redux/slices/authSlice";

const SecurityDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", purpose: "guest", flatNumber: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      const { data } = await api.get("/visitors");
      setVisitors(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/visitors", form);
      setMessage("✅ Visitor registered! Waiting for resident approval.");
      setForm({ name: "", phone: "", purpose: "guest", flatNumber: "" });
      loadVisitors();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Failed to register visitor"));
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (visitorId) => {
    try {
      await api.put(`/visitors/${visitorId}/exit`);
      loadVisitors();
    } catch (e) {
      alert("Failed to record exit");
    }
  };

  const insideNow = visitors.filter(v => v.isInside);
  const todayVisitors = visitors.filter(v => {
    const today = new Date().toDateString();
    return new Date(v.entryTime).toDateString() === today;
  });

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1>🔐 Security Gate</h1>
        <div style={styles.headerRight}>
          <span>{user?.name}</span>
          <button onClick={() => { dispatch(logout()); navigate("/login"); }} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.grid}>
          {}
          <div style={styles.card}>
            <h3>Register New Visitor</h3>
            {message && (
              <div style={message.startsWith("✅") ? styles.success : styles.error}>
                {message}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <Field label="Visitor Name">
                <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name" required style={styles.input} />
              </Field>
              <Field label="Phone Number">
                <input name="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit number" required style={styles.input} />
              </Field>
              <Field label="Purpose">
                <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} style={styles.input}>
                  <option value="guest">Guest</option>
                  <option value="delivery">Delivery</option>
                  <option value="service">Service</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Visiting Flat No.">
                <input value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })}
                  placeholder="e.g. A-101" required style={styles.input} />
              </Field>
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Registering..." : "Register & Notify Resident"}
              </button>
            </form>
          </div>

          {}
          <div style={styles.card}>
            <h3>Currently Inside ({insideNow.length})</h3>
            {insideNow.length === 0 ? (
              <p style={styles.empty}>No visitors inside right now</p>
            ) : (
              insideNow.map((v) => (
                <div key={v._id} style={styles.visitorRow}>
                  <div>
                    <strong>{v.name}</strong> → Flat {v.flatNumber}
                    <div style={styles.meta}>
                      {v.purpose} • In at {new Date(v.entryTime).toLocaleTimeString()}
                    </div>
                  </div>
                  <button style={styles.exitBtn} onClick={() => handleExit(v._id)}>
                    Record Exit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {}
        <div style={styles.card}>
          <h3>Today's Visitor Log ({todayVisitors.length})</h3>
          {todayVisitors.length === 0 ? (
            <p style={styles.empty}>No visitors today</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#f7fafc" }}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Flat</th>
                  <th style={styles.th}>Purpose</th>
                  <th style={styles.th}>Entry</th>
                  <th style={styles.th}>Exit</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayVisitors.map((v) => (
                  <tr key={v._id}>
                    <td style={styles.td}>{v.name}</td>
                    <td style={styles.td}>{v.phone}</td>
                    <td style={styles.td}>{v.flatNumber}</td>
                    <td style={styles.td}>{v.purpose}</td>
                    <td style={styles.td}>{new Date(v.entryTime).toLocaleTimeString()}</td>
                    <td style={styles.td}>{v.exitTime ? new Date(v.exitTime).toLocaleTimeString() : "—"}</td>
                    <td style={styles.td}>
                      <span style={{ color: v.approvalStatus === "approved" ? "#276749" : v.approvalStatus === "rejected" ? "#c53030" : "#ed8936" }}>
                        {v.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontSize: 14, color: "#4a5568" }}>{label}</label>
    {children}
  </div>
);

const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#f7fafc", fontFamily: "sans-serif" },
  header: {
    background: "#2d3748", color: "#fff", padding: "16px 32px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  logoutBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 6, cursor: "pointer" },
  main: { maxWidth: 1100, margin: "0 auto", padding: 32 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" },
  input: { display: "block", width: "100%", padding: "9px 12px", marginTop: 4, border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, boxSizing: "border-box" },
  button: { background: "#2b6cb0", color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, cursor: "pointer", marginTop: 8, width: "100%" },
  success: { background: "#f0fff4", color: "#276749", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  error: { background: "#fff5f5", color: "#c53030", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  visitorRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f4f8" },
  meta: { fontSize: 12, color: "#718096", marginTop: 2 },
  exitBtn: { background: "#fed7d7", color: "#c53030", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", whiteSpace: "nowrap" },
  empty: { color: "#a0aec0", textAlign: "center", padding: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 12px", textAlign: "left", fontSize: 13, color: "#718096", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #f0f4f8" },
};

export default SecurityDashboard;
