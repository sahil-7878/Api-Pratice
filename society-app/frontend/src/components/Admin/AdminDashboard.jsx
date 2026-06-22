
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { logout } from "../../redux/slices/authSlice";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    residents: 0,
    openComplaints: 0,
    pendingBills: 0,
    visitorsToday: 0,
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [residentsRes, complaintsRes, billsRes, noticesRes] = await Promise.all([
        api.get("/residents"),
        api.get("/complaints"),
        api.get("/billing"),
        api.get("/notices"),
      ]);

      setStats({
        residents: residentsRes.data.length,
        openComplaints: complaintsRes.data.filter(c => c.status === "open").length,
        pendingBills: billsRes.data.filter(b => b.status === "pending").length,
        visitorsToday: 0,
      });

      setNotices(noticesRes.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.wrapper}>
      {}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>🏘️ Society Admin</h1>
        <div style={styles.headerRight}>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <h2>Dashboard Overview</h2>

        {}
        <div style={styles.statsGrid}>
          <StatCard label="Total Residents"  value={stats.residents}        color="#4299e1" icon="👥" />
          <StatCard label="Open Complaints"  value={stats.openComplaints}   color="#e53e3e" icon="🔧" />
          <StatCard label="Pending Bills"    value={stats.pendingBills}     color="#ed8936" icon="💰" />
          <StatCard label="Visitors Today"   value={stats.visitorsToday}    color="#48bb78" icon="🚶" />
        </div>

        {}
        <h3 style={{ marginTop: 32 }}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <ActionCard title="Manage Residents"  icon="👥" onClick={() => navigate("/admin/residents")} />
          <ActionCard title="View Complaints"   icon="🔧" onClick={() => navigate("/admin/complaints")} />
          <ActionCard title="Billing"           icon="💰" onClick={() => navigate("/admin/billing")} />
          <ActionCard title="Visitor Logs"      icon="🚶" onClick={() => navigate("/admin/visitors")} />
          <ActionCard title="Facilities"        icon="🏊" onClick={() => navigate("/admin/facilities")} />
          <ActionCard title="Post Notice"       icon="📢" onClick={() => navigate("/admin/notices")} />
        </div>

        {}
        {notices.length > 0 && (
          <>
            <h3 style={{ marginTop: 32 }}>Latest Notices</h3>
            {notices.map((notice) => (
              <div key={notice._id} style={styles.noticeCard}>
                <strong>{notice.title}</strong>
                <span style={styles.noticeBadge}>{notice.type}</span>
                <p style={{ margin: "4px 0 0", color: "#718096", fontSize: 14 }}>{notice.content}</p>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div style={{ fontSize: 32 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: "bold", color }}>{value}</div>
    <div style={{ color: "#718096", fontSize: 14 }}>{label}</div>
  </div>
);

const ActionCard = ({ title, icon, onClick }) => (
  <div style={styles.actionCard} onClick={onClick}>
    <div style={{ fontSize: 28 }}>{icon}</div>
    <div style={{ marginTop: 8, fontWeight: 500 }}>{title}</div>
  </div>
);

const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#f7fafc", fontFamily: "sans-serif" },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  header: {
    background: "#2b6cb0", color: "#fff", padding: "16px 32px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  headerTitle: { margin: 0, fontSize: 22 },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  logoutBtn: {
    background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
    padding: "6px 16px", borderRadius: 6, cursor: "pointer",
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: 32 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 20 },
  statCard: {
    background: "#fff", borderRadius: 12, padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)", textAlign: "center",
  },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 },
  actionCard: {
    background: "#fff", borderRadius: 12, padding: 24, textAlign: "center",
    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    transition: "transform 0.1s",
  },
  noticeCard: {
    background: "#fff", borderRadius: 8, padding: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 10,
    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
  },
  noticeBadge: {
    background: "#ebf8ff", color: "#2b6cb0", padding: "2px 8px",
    borderRadius: 4, fontSize: 12,
  },
};

export default AdminDashboard;
