
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { logout } from "../../redux/slices/authSlice";

const ResidentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [pendingVisitors, setPendingVisitors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billsRes, complaintsRes, noticesRes, visitorsRes] = await Promise.all([
        api.get("/billing"),
        api.get("/complaints"),
        api.get("/notices"),
        api.get("/visitors"),
      ]);

      setBills(billsRes.data);
      setComplaints(complaintsRes.data);
      setNotices(noticesRes.data);
      setPendingVisitors(visitorsRes.data.filter(v => v.approvalStatus === "pending"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleVisitorAction = async (visitorId, status) => {
    try {
      await api.put(`/visitors/${visitorId}/approve`, { status });
      fetchData();
    } catch (error) {
      alert("Failed to update visitor");
    }
  };

  const totalDue = bills
    .filter(b => b.status !== "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1>🏠 My Dashboard</h1>
        <div style={styles.headerRight}>
          <span>Flat {user?.flatNumber} — {user?.name}</span>
          <button onClick={() => { dispatch(logout()); navigate("/login"); }} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {}
        {pendingVisitors.length > 0 && (
          <div style={styles.alertBox}>
            <h3>🔔 Visitor Approval Required ({pendingVisitors.length})</h3>
            {pendingVisitors.map((v) => (
              <div key={v._id} style={styles.visitorRow}>
                <div>
                  <strong>{v.name}</strong> — {v.purpose}
                  <div style={{ fontSize: 12, color: "#718096" }}>{v.phone}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.approveBtn} onClick={() => handleVisitorAction(v._id, "approved")}>
                    ✅ Allow
                  </button>
                  <button style={styles.rejectBtn} onClick={() => handleVisitorAction(v._id, "rejected")}>
                    ❌ Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {}
        <div style={styles.statsGrid}>
          <StatCard label="Amount Due"        value={`₹${totalDue}`}                    color="#e53e3e" />
          <StatCard label="Active Complaints" value={complaints.filter(c => c.status !== "closed").length} color="#ed8936" />
          <StatCard label="Total Bills"       value={bills.length}                       color="#4299e1" />
        </div>

        {}
        <div style={styles.actionsGrid}>
          <ActionBtn label="Pay Bills"        icon="💰" onClick={() => navigate("/resident/billing")} />
          <ActionBtn label="Raise Complaint"  icon="🔧" onClick={() => navigate("/resident/complaints")} />
          <ActionBtn label="Book Facility"    icon="🏊" onClick={() => navigate("/resident/facilities")} />
          <ActionBtn label="View Notices"     icon="📢" onClick={() => navigate("/resident/notices")} />
        </div>

        {}
        <Section title="Recent Bills">
          {bills.slice(0, 3).map((bill) => (
            <div key={bill._id} style={styles.row}>
              <span>{bill.month} {bill.year}</span>
              <span>₹{bill.totalAmount}</span>
              <StatusBadge status={bill.status} />
            </div>
          ))}
          {bills.length === 0 && <p style={styles.empty}>No bills yet</p>}
        </Section>

        {}
        <Section title="My Complaints">
          {complaints.slice(0, 3).map((c) => (
            <div key={c._id} style={styles.row}>
              <span>{c.title}</span>
              <span style={{ color: "#718096", fontSize: 13 }}>{c.category}</span>
              <StatusBadge status={c.status} />
            </div>
          ))}
          {complaints.length === 0 && <p style={styles.empty}>No complaints raised</p>}
        </Section>

        {}
        <Section title="Latest Notices">
          {notices.slice(0, 3).map((n) => (
            <div key={n._id} style={{ ...styles.row, flexDirection: "column", alignItems: "flex-start" }}>
              <strong>{n.title}</strong>
              <span style={{ fontSize: 13, color: "#718096" }}>{n.content}</span>
            </div>
          ))}
        </Section>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div style={{ fontSize: 24, fontWeight: "bold", color }}>{value}</div>
    <div style={{ color: "#718096", fontSize: 13, marginTop: 4 }}>{label}</div>
  </div>
);

const ActionBtn = ({ label, icon, onClick }) => (
  <button style={styles.actionBtn} onClick={onClick}>{icon} {label}</button>
);

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h3 style={{ margin: "0 0 12px" }}>{title}</h3>
    {children}
  </div>
);

const STATUS_COLORS = {
  paid:       { bg: "#f0fff4", text: "#276749" },
  pending:    { bg: "#fffaf0", text: "#c05621" },
  overdue:    { bg: "#fff5f5", text: "#c53030" },
  open:       { bg: "#ebf8ff", text: "#2b6cb0" },
  assigned:   { bg: "#faf5ff", text: "#6b46c1" },
  inProgress: { bg: "#fffff0", text: "#975a16" },
  resolved:   { bg: "#f0fff4", text: "#276749" },
  closed:     { bg: "#f7fafc", text: "#718096" },
};

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || { bg: "#f7fafc", text: "#718096" };
  return (
    <span style={{
      background: colors.bg, color: colors.text,
      padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
    }}>
      {status}
    </span>
  );
};

const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#f7fafc", fontFamily: "sans-serif" },
  header: {
    background: "#276749", color: "#fff", padding: "16px 32px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  logoutBtn: {
    background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
    padding: "6px 16px", borderRadius: 6, cursor: "pointer",
  },
  main: { maxWidth: 960, margin: "0 auto", padding: 32 },
  alertBox: {
    background: "#fffbeb", border: "1px solid #f6e05e", borderRadius: 10,
    padding: 20, marginBottom: 24,
  },
  visitorRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #fef08a",
  },
  approveBtn: {
    background: "#c6f6d5", border: "none", color: "#276749",
    padding: "6px 14px", borderRadius: 6, cursor: "pointer",
  },
  rejectBtn: {
    background: "#fed7d7", border: "none", color: "#c53030",
    padding: "6px 14px", borderRadius: 6, cursor: "pointer",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 },
  statCard: {
    background: "#fff", borderRadius: 10, padding: "18px 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 },
  actionBtn: {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "14px 8px", cursor: "pointer", fontSize: 14, fontWeight: 500,
  },
  section: {
    background: "#fff", borderRadius: 10, padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20,
  },
  row: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #f0f4f8",
  },
  empty: { color: "#a0aec0", textAlign: "center", padding: "16px 0" },
};

export default ResidentDashboard;
