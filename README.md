# ⚡ OrbitFlow CRM

> **Premium Lead Management & Client Conversion Platform**

A production-ready, full-stack SaaS CRM application built for agencies, freelancers, startups, consultants, and service-based businesses. OrbitFlow CRM helps you capture, organize, track, nurture, and convert leads through a modern visual workflow.

![OrbitFlow CRM](https://img.shields.io/badge/OrbitFlow-CRM-00E5FF?style=for-the-badge&logo=lightning&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## 🚀 Live Demo

- **Frontend:** `https://your-app.netlify.app`
- **Backend API:** `https://your-api.onrender.com`

**Demo Login:**
```
Username: admin
Password: Admin@2026
```

---

## ✨ Features

### 🎯 Lead Management
- Full lead CRUD with 12+ fields (name, email, phone, company, job title, source, service, budget, priority, status, notes)
- 7 lead sources: Website, LinkedIn, Instagram, Referral, Email Campaign, Facebook, Cold Outreach
- 4 priority levels: Low, Medium, High, Urgent
- Advanced search by name, email, company, source
- Multi-filter: status, source, priority, date range
- Paginated table with 15 leads per page

### 📊 Sales Pipeline (Kanban)
- Drag-and-drop board with 6 stages: New → Contacted → Qualified → Proposal Sent → Converted → Lost
- Real-time optimistic updates
- Color-coded columns with lead counts
- Visual lead cards with priority indicators

### 📈 Analytics Dashboard
- 7 live KPI cards: Total, New, Contacted, Qualified, Converted, Lost, Conversion Rate
- Monthly growth area chart (Recharts)
- Pipeline distribution horizontal bar chart
- Leads by source donut/pie chart
- Conversion funnel with animated progress bars

### 👤 Lead Detail Profile
- Complete contact & deal information
- Tabbed interface: Overview / Follow-ups / Timeline
- Full activity timeline with color-coded events
- Follow-up history with scheduled dates

### 🔔 Follow-up System
- Add follow-up notes with optional next follow-up date
- Timeline view of all follow-ups
- Automatic activity logging when follow-up is added

### 🔐 Authentication
- JWT authentication with 7-day expiry
- bcrypt password hashing (10 salt rounds)
- Persistent sessions via localStorage
- Auto-redirect on token expiry

### 🔔 Notifications
- In-app notification panel (bell icon)
- Triggered on: new lead, status change, conversion, follow-up
- Unread count badge
- Mark all read / clear all

### ⚙️ Settings
- Edit profile (name, email, company, timezone)
- Change password with confirmation
- System information panel

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2 | UI framework |
| Vite | 5.0 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 10 | Animations |
| Lucide React | 0.303 | Icons |
| React Router DOM | 6.21 | Routing |
| @hello-pangea/dnd | 16.5 | Drag & drop |
| Recharts | 2.10 | Charts |
| Axios | 1.6 | HTTP client |
| React Hot Toast | 2.4 | Notifications |
| date-fns | 3.0 | Date formatting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.18 | Web framework |
| MongoDB Atlas | — | Database |
| Mongoose | 8.0 | ODM |
| JWT | 9.0 | Authentication |
| bcryptjs | 2.4 | Password hashing |
| express-validator | 7.0 | Input validation |
| CORS | 2.8 | Cross-origin support |

---

## 📁 Project Structure

```
OrbitFlow CRM/
├── frontend/
│   ├── public/
│   │   ├── orbit-icon.svg
│   │   └── _redirects         # Netlify SPA routing
│   ├── src/
│   │   ├── api/               # Axios API functions
│   │   │   ├── axios.js       # Axios instance + interceptors
│   │   │   ├── auth.js
│   │   │   ├── leads.js
│   │   │   └── followups.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── leads/
│   │   │   │   ├── LeadForm.jsx
│   │   │   │   ├── FollowUpForm.jsx
│   │   │   │   └── ActivityTimeline.jsx
│   │   │   └── ui/
│   │   │       ├── StatCard.jsx
│   │   │       ├── Badge.jsx
│   │   │       └── Modal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Pipeline.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── LeadDetail.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── config/
    │   └── db.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── Admin.js
    │   ├── Lead.js
    │   └── FollowUp.js
    ├── routes/
    │   ├── auth.js
    │   ├── leads.js
    │   └── followups.js
    ├── scripts/
    │   └── seed.js
    ├── server.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier works)

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/orbitflow-crm.git
cd orbitflow-crm
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/orbitflow
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database

```bash
npm run seed
```

This creates the default admin (`admin` / `Admin@2026`) and 8 sample leads.

### 4. Start Backend

```bash
npm run dev    # Development with nodemon
# or
npm start      # Production
```

Backend runs on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 6. Start Frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `super_secret_key` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 📡 API Documentation

### Authentication

#### `POST /api/auth/login`
Login and receive JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "Admin@2026"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

#### `GET /api/auth/me`
Get current authenticated user. Requires `Authorization: Bearer <token>`.

#### `PUT /api/auth/profile`
Update admin profile (fullName, email, company, timezone).

#### `PUT /api/auth/change-password`
Change password. Body: `{ currentPassword, newPassword }`.

---

### Leads

All endpoints require `Authorization: Bearer <token>`.

#### `GET /api/leads`
Get paginated leads with filtering.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Per page (default: 20) |
| `search` | string | Search name/email/company |
| `status` | string | Filter by status |
| `source` | string | Filter by source |
| `priority` | string | Filter by priority |
| `startDate` | ISO date | From date |
| `endDate` | ISO date | To date |
| `sort` | string | Sort field (default: `-createdAt`) |

#### `POST /api/leads`
Create a new lead.

**Required fields:** `fullName`, `email`

#### `GET /api/leads/analytics/summary`
Get dashboard analytics (counts, charts data, pipeline distribution).

#### `GET /api/leads/:id`
Get single lead with full activity history.

#### `PUT /api/leads/:id`
Update lead. Automatically logs activity for status/notes changes.

#### `DELETE /api/leads/:id`
Delete lead and all associated follow-ups.

---

### Follow-ups

#### `POST /api/followups`
Create follow-up.

**Body:**
```json
{
  "leadId": "...",
  "note": "Requested proposal via email",
  "nextFollowUpDate": "2026-06-20"
}
```

#### `GET /api/followups/:leadId`
Get all follow-ups for a lead (sorted newest first).

---

## 🚀 Deployment Guide

### Frontend — Netlify

1. Push frontend to GitHub
2. Connect to Netlify
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. The `public/_redirects` file handles SPA routing automatically

### Backend — Render

1. Push backend to GitHub
2. Create new **Web Service** on Render
3. Settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=<strong-random-string>
   PORT=5000
   FRONTEND_URL=https://your-app.netlify.app
   ```
5. Run seed script after first deploy (via Render shell)

### MongoDB Atlas Setup

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user
3. Add your Render server IP to IP Allowlist (or use 0.0.0.0/0 for all)
4. Get connection string and paste into `MONGODB_URI`

---

## 🔒 Security Features

- **JWT Authentication** — 7-day expiry, stored in localStorage
- **bcrypt Password Hashing** — 10 salt rounds
- **Input Validation** — express-validator on all POST/PUT endpoints
- **CORS Protection** — Restricted to `FRONTEND_URL` only
- **Route Protection** — All lead/follow-up routes require valid JWT
- **Auto-logout** — Automatic redirect to login on 401 response

---

## 📸 Screenshots

> *(Add screenshots here after deployment)*

- Login Page
- Dashboard Overview
- Lead Management Table
- Kanban Pipeline Board
- Lead Detail Profile
- Analytics Charts
- Settings Page

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

---

<div align="center">
  Built with ❤️ by the OrbitFlow Team
  <br/>
  <strong>⚡ OrbitFlow CRM — Elevate Your Sales Game</strong>
</div>
