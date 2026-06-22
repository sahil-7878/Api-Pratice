# 🏘️ Smart Society Management System

A full-stack MERN app to manage a residential society.

---

## 📁 Project Structure

```
society-app/
├── backend/                  ← Node.js + Express API
│   ├── server.js             ← Entry point, mounts all routes
│   ├── config/db.js          ← MongoDB connection
│   ├── middleware/auth.js    ← JWT protect + role authorize
│   ├── models/               ← Mongoose schemas (data shapes)
│   │   ├── User.js           ← All users (admin/resident/security/maintenance)
│   │   ├── Resident.js       ← Extra resident info (family, vehicles)
│   │   ├── Visitor.js        ← Gate entry/exit records
│   │   ├── Complaint.js      ← Issues raised by residents
│   │   ├── Bill.js           ← Monthly maintenance bills
│   │   ├── Facility.js       ← Bookable facilities + bookings
│   │   └── Notice.js         ← Announcements + Polls
│   ├── controllers/          ← Business logic functions
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── visitorController.js
│   │   └── billingController.js
│   └── routes/               ← URL → controller mapping
│       ├── authRoutes.js
│       ├── residentRoutes.js
│       ├── visitorRoutes.js
│       ├── complaintRoutes.js
│       ├── billingRoutes.js
│       ├── facilityRoutes.js
│       ├── noticeRoutes.js
│       └── pollRoutes.js
│
└── frontend/                 ← React app
    └── src/
        ├── App.jsx           ← All routes defined here
        ├── redux/
        │   ├── store.js      ← Redux store
        │   └── slices/
        │       └── authSlice.js ← Login/logout state
        ├── utils/api.js      ← Axios with auto JWT header
        ├── pages/
        │   └── Login.jsx
        └── components/
            ├── Admin/
            │   └── AdminDashboard.jsx
            ├── Resident/
            │   ├── ResidentDashboard.jsx
            │   └── ComplaintForm.jsx
            ├── Security/
            │   └── SecurityDashboard.jsx
            └── Shared/
                └── ProtectedRoute.jsx
```

---

## 🚀 How to Run

### 1. Backend Setup

```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env and fill in MONGO_URI and JWT_SECRET

npm run dev   # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start     # Starts on http://localhost:3000
```

---

## 🔑 How Auth Works

1. User logs in → backend verifies password → returns JWT token
2. Frontend saves token to localStorage via Redux
3. Every API request attaches `Authorization: Bearer <token>` automatically (see utils/api.js)
4. Backend `protect` middleware verifies the token on protected routes
5. `authorize("admin")` checks the user's role

---

## 👤 User Roles & Dashboards

| Role        | Dashboard URL             | What they can do                         |
|-------------|---------------------------|------------------------------------------|
| admin       | /admin/dashboard          | Everything — manage all modules          |
| resident    | /resident/dashboard       | Bills, complaints, bookings, visitors    |
| security    | /security/dashboard       | Register visitors, log exits             |
| maintenance | /maintenance/dashboard    | View & update assigned complaints        |

---

## 📡 API Endpoints

| Method | URL                          | Who can use          | What it does                     |
|--------|------------------------------|----------------------|----------------------------------|
| POST   | /api/auth/register           | Public               | Create account                   |
| POST   | /api/auth/login              | Public               | Login, get token                 |
| GET    | /api/auth/profile            | Logged in            | Get own profile                  |
| GET    | /api/residents               | Admin                | List all residents               |
| GET    | /api/visitors                | Admin/Security/Resident | Visitor log                   |
| POST   | /api/visitors                | Security             | Register new visitor             |
| PUT    | /api/visitors/:id/approve    | Resident             | Approve/reject visitor           |
| PUT    | /api/visitors/:id/exit       | Security             | Record visitor exit              |
| GET    | /api/complaints              | Admin/Resident/Staff | List complaints (filtered)       |
| POST   | /api/complaints              | Resident             | Submit new complaint             |
| PUT    | /api/complaints/:id/assign   | Admin                | Assign to maintenance staff      |
| PUT    | /api/complaints/:id/update   | Maintenance          | Update status, add work note     |
| GET    | /api/billing                 | Admin/Resident       | View bills                       |
| POST   | /api/billing/generate        | Admin                | Generate a bill for a flat       |
| PUT    | /api/billing/:id/pay         | Resident             | Mark bill as paid                |
| GET    | /api/facilities              | All                  | List bookable facilities         |
| POST   | /api/facilities/book         | Resident             | Book a time slot                 |
| GET    | /api/notices                 | All                  | View society notices             |
| POST   | /api/notices                 | Admin                | Post a notice                    |
| POST   | /api/polls/:id/vote          | Resident             | Vote on a poll                   |

---


