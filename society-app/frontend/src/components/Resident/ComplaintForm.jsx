
import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const CATEGORIES = [
  { value: "electrical", label: "⚡ Electrical" },
  { value: "plumbing",   label: "🚿 Plumbing" },
  { value: "water",      label: "💧 Water Supply" },
  { value: "cleaning",   label: "🧹 Cleaning" },
  { value: "security",   label: "🔒 Security" },
  { value: "parking",    label: "🚗 Parking" },
  { value: "lift",       label: "🛗 Lift" },
  { value: "other",      label: "📋 Other" },
];

const ComplaintForm = () => {
  const [form, setForm] = useState({
    category: "electrical",
    title: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("category", form.category);
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (image) formData.append("image", image);

      await api.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Complaint submitted successfully!");
      setForm({ category: "electrical", title: "", description: "" });
      setImage(null);
      loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => ({
    open:       "#4299e1",
    assigned:   "#9f7aea",
    inProgress: "#ed8936",
    resolved:   "#48bb78",
    closed:     "#a0aec0",
  }[status] || "#718096");

  return (
    <div style={styles.wrapper}>
      <h2>🔧 My Complaints</h2>

      {}
      <div style={styles.card}>
        <h3 style={{ marginBottom: 20 }}>Raise a New Complaint</h3>

        {success && <div style={styles.success}>{success}</div>}
        {error   && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {}
          <div style={styles.field}>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {}
          <div style={styles.field}>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
              style={styles.input}
            />
          </div>

          {}
          <div style={styles.field}>
            <label>Details (optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the problem in detail..."
              rows={4}
              style={{ ...styles.input, resize: "vertical" }}
            />
          </div>

          {}
          <div style={styles.field}>
            <label>Attach Photo (optional)</label>
            <input
              type="file"
              accept="image}
      <div style={styles.card}>
        <h3 style={{ marginBottom: 16 }}>Complaint History</h3>
        {complaints.length === 0 ? (
          <p style={{ color: "#a0aec0" }}>No complaints yet.</p>
        ) : (
          complaints.map((c) => (
            <div key={c._id} style={styles.complaintRow}>
              <div>
                <strong>{c.title}</strong>
                <div style={{ fontSize: 13, color: "#718096" }}>
                  {c.category} • {new Date(c.createdAt).toLocaleDateString()}
                </div>
                {}
                {c.workNotes?.length > 0 && (
                  <div style={styles.workNote}>
                    📝 Latest update: {c.workNotes[c.workNotes.length - 1].note}
                  </div>
                )}
              </div>
              <span style={{ ...styles.badge, background: statusColor(c.status) + "22", color: statusColor(c.status) }}>
                {c.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: 800, margin: "0 auto", padding: 32, fontFamily: "sans-serif" },
  card: {
    background: "#fff", borderRadius: 12, padding: 28,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 24,
  },
  field: { marginBottom: 18 },
  input: {
    display: "block", width: "100%", padding: "10px 14px", marginTop: 6,
    borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box",
  },
  button: {
    background: "#4299e1", color: "#fff", border: "none", borderRadius: 8,
    padding: "12px 28px", fontSize: 15, cursor: "pointer", marginTop: 8,
  },
  success: {
    background: "#f0fff4", color: "#276749", border: "1px solid #9ae6b4",
    borderRadius: 6, padding: "10px 14px", marginBottom: 16,
  },
  error: {
    background: "#fff5f5", color: "#c53030", border: "1px solid #fed7d7",
    borderRadius: 6, padding: "10px 14px", marginBottom: 16,
  },
  complaintRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "14px 0", borderBottom: "1px solid #f0f4f8",
  },
  badge: {
    padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    marginLeft: 16, whiteSpace: "nowrap",
  },
  workNote: {
    fontSize: 12, color: "#4299e1", marginTop: 4,
    background: "#ebf8ff", padding: "4px 8px", borderRadius: 4, display: "inline-block",
  },
};

export default ComplaintForm;
