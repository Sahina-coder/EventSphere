# 🌐 EventSphere

### Intelligent Event Planning, Resource Management & Decision Support System

> **Plan smarter. Manage better. Make data-driven decisions.**

EventSphere is a full-stack platform that brings **event planning, attendees, venues, vendors, resources, budgets, risks, and analytics** into one centralized system.

It is designed to replace scattered workflows such as **Excel sheets, WhatsApp messages, phone calls, and manual records** with a connected digital platform.

🚧 **Status: Ongoing Development**

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## ✨ Features

### 📅 Event Management

Create and manage events throughout their complete lifecycle.

### 📊 Event Health Score

Get a quick overview of an event's operational health using key event metrics.

### 🧠 Smart Recommendations

Generate data-driven recommendations to help organizers make better decisions.

### ⚠️ Risk Management

Identify, track, and monitor potential risks before they affect an event.

### 💰 Budget & Expense Tracking

Monitor event expenses and keep track of financial performance.

### 📦 Resource Management

Track resources and allocate them efficiently across events.

### 🤝 Vendor Management

Manage vendors, assignments, and vendor-related operations.

### 🏢 Venue & Booking Management

Manage venues, availability, and event bookings.

### 🎟️ Ticket Management

Handle event tickets and attendee registrations.

### 👥 Attendee Management

Manage attendee information and participation.

### 📈 Analytics Dashboard

Visualize important event data and performance metrics.

### 👤 Dedicated Portals

Separate experiences for **organizers, attendees, and vendors**.

### 📜 Certificates & Feedback

Manage participation certificates and collect event feedback.

---

## 🧠 Decision Support

EventSphere goes beyond basic event management by connecting information from different modules to provide useful insights.

```text
 Events ───────┐
 Attendees ────┤
 Venues ───────┤
 Vendors ──────┼──► Event Intelligence
 Resources ────┤          │
 Expenses ─────┤          ├──► Health Score
 Risks ────────┤          ├──► Risk Insights
 Feedback ─────┘          └──► Recommendations
```

---

## 🛠️ Tech Stack

### Frontend

**React · TypeScript · Vite · Tailwind CSS · React Router · TanStack Query · Axios · Recharts · React Hook Form · Zod**

### Backend

**FastAPI · Python · SQLAlchemy · PostgreSQL · Pydantic · Alembic · Uvicorn**

---

## 🏗️ Architecture

```text
┌───────────────────────┐
│       Frontend        │
│ React + TypeScript    │
│ Vite + Tailwind CSS   │
└───────────┬───────────┘
            │
            │ REST API
            ▼
┌───────────────────────┐
│        Backend        │
│ FastAPI + Python      │
│ SQLAlchemy + Pydantic │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      PostgreSQL       │
│       Database        │
└───────────────────────┘
```

---

## 📁 Project Structure

```text
EventSphere/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API routes
│   │   ├── main.py
│   │   └── database.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   └── index.css
    └── index.html
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Python 3.10+
* Node.js 18+
* npm
* PostgreSQL
* Git

### Clone the Repository

```bash
git clone https://github.com/Sahina-coder/EventSphere.git
cd EventSphere
```

---

## ⚙️ Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/eventsphere
```

Run migrations:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 🎨 Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

> 💡 **The frontend URL is the main application interface.**
> The backend URL is only needed for API communication and development.

---

## 📦 Frontend Commands

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

---

## 🗺️ Roadmap

### ✅ Core Platform

* [x] Event management
* [x] Attendee management
* [x] Venue & booking management
* [x] Resource allocation
* [x] Vendor management & assignments
* [x] Ticket management
* [x] Expense & budget tracking
* [x] Feedback management
* [x] Certificate management
* [x] Risk management
* [x] Event health scoring
* [x] Smart recommendations
* [x] Organizer dashboard
* [x] Attendee portal
* [x] Vendor portal

### 📊 Intelligence & Analytics

* [ ] Advanced event analytics
* [ ] Real-time event health dashboard
* [ ] Budget burn-rate analysis
* [ ] Resource utilization analytics
* [ ] Vendor performance scoring
* [ ] Attendance & engagement analytics
* [ ] Event performance benchmarking
* [ ] Custom analytics reports
* [ ] Exportable event reports

### 🧠 Smart Decision Support

* [x] **What-If Event Simulator** — compare different planning scenarios before making decisions
* [ ] **Smart Budget Advisor** — detect unusual spending and suggest budget adjustments
* [x] **Risk Prediction** — identify events or areas likely to require attention
* [ ] **Resource Optimization** — recommend better resource allocation
* [ ] **Vendor Recommendation Engine** — rank vendors using cost, reliability, performance, and availability
* [ ] **Venue Recommendation Engine** — recommend venues based on capacity, budget, location, and requirements
* [ ] **Event Readiness Score** — estimate how prepared an event is before launch
* [ ] **Post-Event Intelligence** — compare planned vs actual event performance

### ⚡ Automation

* [ ] Automated email notifications
* [x] Automated attendee reminders
* [ ] Vendor deadline reminders
* [x] Booking conflict detection
* [ ] Budget threshold alerts
* [ ] Risk escalation alerts
* [x] Automated certificate generation
* [ ] Scheduled event reports
* [ ] Recurring task & deadline management

### 🚀 Future / Wow Factors

* [ ] **Event Command Center** — real-time operational view of an ongoing event
* [ ] **Live Event Timeline** — track important activities, deadlines, and incidents
* [ ] **AI Event Copilot** — ask questions about an event and receive insights from its data
* [ ] **Natural Language Analytics** — ask things like *“Where are we overspending?”*
* [ ] **AI-generated Event Summary** — automatically generate executive summaries
* [ ] **Anomaly Detection** — detect unusual expenses, attendance, bookings, or resource usage
* [ ] **Predictive Attendance Forecasting**
* [ ] **Predictive Budget Forecasting**
* [ ] **Digital Event Risk Map** — visualize risks across event areas
* [ ] **Smart Event Checklist** — dynamically generate tasks based on event type
* [ ] **Scenario Comparison** — compare multiple event plans side-by-side
* [ ] **Event Performance Benchmarking** — compare events across historical data

### 📱 Platform Expansion

* [ ] Mobile-responsive experience
* [ ] Progressive Web App (PWA)
* [ ] Push notifications
* [x] Role-based permissions
* [ ] Multi-organization support
* [ ] Audit logs
* [x] API integrations
* [ ] Calendar integration
* [ ] Payment gateway integration
* [ ] QR-based event check-in

### 🌟 Long-Term Vision

* [ ] **AI-assisted event planning**
* [ ] **Automated event optimization**
* [ ] **Predictive risk & budget intelligence**
* [ ] **Cross-event organizational analytics**
* [ ] **Real-time event operations intelligence**
* [ ] **End-to-end intelligent event lifecycle management**


---

## 🌍 Demo

🚧 **Live Demo — Coming Soon**

Once deployed, this section can become:

```text
🚀 Live Demo: https://your-eventsphere-domain.com
📚 API Docs: https://your-api-domain.com/docs
```

> **Note:** `localhost` URLs are for local development only and are not publicly accessible.

---

## 👩‍💻 Author

**Sahina**

[GitHub → Sahina-coder](https://github.com/Sahina-coder)

---

## 📄 License

**License not specified yet.**

This project currently does not have an open-source license.
