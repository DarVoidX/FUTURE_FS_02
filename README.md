# ⚡ OrbitFlow CRM

> **Premium Lead Management & Client Conversion Platform**

OrbitFlow CRM is a full-stack Customer Relationship Management (CRM) application designed for agencies, freelancers, and service-based businesses. It helps you track, manage, and convert leads through a visual Kanban pipeline and dynamic real-time charts.

🌐 **Live Application URL:** [https://orbitflow-crm.netlify.app/login](https://orbitflow-crm.netlify.app/login)

---

## 📸 Screenshots

Here is a look at the OrbitFlow CRM platform interfaces:

### 🚪 Login Screen (Start Page)
*A secure, visually engaging entry portal to access your client workstation.*
<br/>
<img src="./screenshot/login%20page.png" width="550" alt="Login Screen" style="border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" />

<br/>

### 📊 Dashboard & Workspaces (Light & Dark Themes)
*Real-time database analytics, lead growth statistics, and pipeline stages at a glance.*
<br/>
<table border="0">
  <tr>
    <td valign="top" width="50%">
      <strong>☀️ Light Theme Dashboard</strong><br/>
      <img src="./screenshot/dashboard%20page.png" width="380" alt="Light Dashboard" style="border-radius: 8px; border: 1px solid #e0e0e0;" />
    </td>
    <td valign="top" width="50%">
      <strong>🌙 Midnight Dark Theme</strong><br/>
      <img src="./screenshot/dark%20theme%20dash%20board.png" width="380" alt="Dark Dashboard" style="border-radius: 8px; border: 1px solid #202020;" />
    </td>
  </tr>
</table>

---

## ✨ Core Features

*   🎯 **Lead Management:** Full CRUD operations to add, view, edit, and delete customer profiles.
*   🔀 **Kanban Sales Pipeline:** Drag-and-drop board to advance deals through stages (New → Contacted → Qualified → Proposal Sent → Converted → Lost).
*   📈 **Real-Time Analytics:** Dynamic Recharts graphs showing lead growth trend-lines and pipeline stats.
*   ⚙️ **Security Gate:** Sensitive profile settings and password edits are protected behind a secure PIN code gate.
*   🌓 **Theme Switcher:** Seamless toggle between bright cream and midnight navy layouts.

---

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts, Axios
*   **Backend:** Node.js, Express.js, JWT Authentication
*   **Database:** MongoDB Atlas

---

## ⚙️ Quick Installation

### 1. Database Setup
*   Set up a free cluster on **MongoDB Atlas** and obtain your connection string.

### 2. Backend Setup
```bash
cd backend
npm install
```
*   Create a `.env` file in the `backend` folder and add:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_random_key
    NODE_ENV=production
    FRONTEND_URL=http://localhost:5173
    ```
*   Seed database (adds default admin account and sample leads):
    ```bash
    npm run seed
    ```
*   Start the server:
    ```bash
    npm start
    ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
*   Create a `.env` file in the `frontend` folder and add:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
*   Start the local client:
    ```bash
    npm run dev
    ```

---

## 🔑 Demo Access

To test the live application or your local build, use the following credentials:
*   **Username:** `admin`
*   **Password:** `Admin@2026`
