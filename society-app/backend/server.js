
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/residents",   require("./routes/residentRoutes"));
app.use("/api/visitors",    require("./routes/visitorRoutes"));
app.use("/api/complaints",  require("./routes/complaintRoutes"));
app.use("/api/billing",     require("./routes/billingRoutes"));
app.use("/api/facilities",  require("./routes/facilityRoutes"));
app.use("/api/notices",     require("./routes/noticeRoutes"));
app.use("/api/polls",       require("./routes/pollRoutes"));

app.get("/", (req, res) => res.json({ message: "Society API is running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
