# ✦ EventSphere
<p align="center">
  <img
    src="./assets/eventsphere-banner.png"
    alt="EventSphere 3D Hero Banner"
    width="100%"
  />
</p>
<p align="center">
  <strong>Intelligent Event Planning, Resource Management & Decision Support System</strong>
</p>

<p align="center">
  A centralized platform to plan, manage, and analyze events — replacing scattered spreadsheets, WhatsApp messages, and manual coordination with one connected system.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## ◈ Overview

EventSphere manages the event lifecycle through dedicated portals and centralized resource management.

- **Event Management** — Organize and manage event details.
- **Resource & Venue Management** — Manage venues, equipment, availability, and allocation.
- **Attendee Portal** — Support attendee-facing event activities.
- **Vendor Portal** — Provide a dedicated interface for vendors.
- **Decision Support & Analytics** — Present event data and reporting insights.

## ⬡ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Data Fetching | TanStack Query, Axios |
| Visualizations | Recharts, Three.js, Framer Motion, Lucide React |
| Backend | Python 3.12+, FastAPI, Uvicorn |
| ORM & Validation | SQLAlchemy 2, Pydantic |
| Authentication | JWT, python-jose, Passlib, bcrypt |
| Reports & QR Codes | ReportLab, qrcode |
| Database | PostgreSQL |
| Development Tools | Git, GitHub, VS Code, pgAdmin |

## ⚙️ Getting Started

### Prerequisites

- Python 3.12+
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/EventSphere.git
cd EventSphere
```

Replace `YOUR-USERNAME` with the GitHub repository owner's username.

### 2. Set up the backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/eventsphere
JWT_SECRET_KEY=YOUR_LONG_RANDOM_SECRET
```

Replace the example credentials with your local PostgreSQL credentials. URL-encode special characters in the database password.

Create a PostgreSQL database named `eventsphere` using pgAdmin.

If the following dependencies are not already included in `requirements.txt`, install them:

```powershell
pip install "reportlab" "qrcode[pil]" "pydantic[email]" "python-jose[cryptography]" "passlib[bcrypt]"
```

Start the backend server:

```powershell
uvicorn app.main:app --reload
```

Backend: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

### 3. Set up the frontend

Open a **second terminal** from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

> **Note:** Keep both backend and frontend servers running in separate terminals during development.

## ◇ Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Public landing page | Public |
| `/login` | User login | Public |
| `/signup` | User registration | Public |
| `/forgot-password` | Password recovery | Public |
| `/dashboard` | Organizer dashboard | Organizer |
| `/attendee` | Attendee portal | Attendee |
| `/vendor` | Vendor portal | Vendor |

## ⌘ Project Documentation

- [Architecture](./ARCHITECTURE.md) — System design and architecture.
- [Project State](./PROJECT_STATE.md) — Current implementation status.

---

<p align="center">
  <strong>EventSphere</strong>
  <br />
  Built by Sahina
</p>
