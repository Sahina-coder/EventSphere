# EventSphere

### Intelligent Event Planning, Resource Management & Decision Support System

EventSphere is a centralized platform for managing the complete event lifecycle — from planning and resource allocation to registrations, vendors, analytics, and post-event reporting.

It replaces scattered workflows such as Excel sheets, WhatsApp messages, and phone calls with a single system for managing event data and operations.

**Documentation**

* [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system architecture, project structure, and data flow
* [`PROJECT_STATE.md`](./PROJECT_STATE.md) — current implementation status and remaining work

---

## Tech Stack

| Layer           | Technology                                             |
| --------------- | ------------------------------------------------------ |
| **Frontend**    | React 19, TypeScript, Vite, Tailwind CSS v4            |
| **Routing**     | React Router                                           |
| **Data & API**  | TanStack Query, Axios                                  |
| **Visuals**     | Recharts, Framer Motion, Three.js, Lucide React        |
| **Backend**     | Python 3.12+, FastAPI, SQLAlchemy 2, Pydantic, Uvicorn |
| **Reports**     | ReportLab, QRCode                                      |
| **Database**    | PostgreSQL                                             |
| **Development** | Git, GitHub, VS Code, pgAdmin                          |

---

## Project Structure

The project is split into two main applications:

```text
EventSphere/
│
├── frontend/          # React + TypeScript application
│
├── backend/           # FastAPI + PostgreSQL API
│
├── ARCHITECTURE.md    # System architecture and design decisions
├── PROJECT_STATE.md   # Current implementation status
└── README.md
```

The frontend communicates with the FastAPI backend through HTTP/JSON APIs, while the backend handles database operations through SQLAlchemy.

---

## Quick Start

### 1. Backend

Open a terminal and move into the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
pip install reportlab qrcode[pil] pydantic[email]
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/eventsphere
```

> If your PostgreSQL password contains special characters, URL-encode them.
> For example, `@` becomes `%40`.

Create a PostgreSQL database named `eventsphere` using pgAdmin.

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

---

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

`http://localhost:5173`

### Running the project

Both servers need to be running at the same time:

```text
Terminal 1 → FastAPI backend
Terminal 2 → React frontend
```

---

## Main Routes

| Route              | Description          |
| ------------------ | -------------------- |
| `/`                | Public landing page  |
| `/login`           | Login UI             |
| `/signup`          | Signup UI            |
| `/forgot-password` | Password recovery UI |
| `/dashboard`       | Organizer dashboard  |
| `/attendee`        | Attendee portal      |
| `/vendor`          | Vendor portal        |

> Authentication is currently UI-only. Protected routes and role-based access control have not been implemented yet.

---

## Current Features

### Event Management

* Event CRUD
* Venue management
* Resource inventory
* Venue booking with conflict detection
* Resource allocation
* Event summary reports

### Registration & Vendors

* Attendee registration and validation
* Ticket generation
* QR code generation
* Attendance tracking
* Vendor management
* Vendor assignments

### Intelligence & Decision Support

* Event analytics
* Event Health Score
* Risk detection
* What-If simulation
* Attendance and budget forecasting
* Smart venue recommendations
* Interactive venue map

### Operations

* Budget and expense tracking
* Sponsorship management
* Approval workflow
* Notifications and announcements
* Feedback and evaluation
* Certificate generation and verification
* Lost & Found
* Incident management
* PDF and CSV report export

---

## Development Notes

EventSphere is currently a local development project. The core event-management, registration, vendor, intelligence, and reporting modules are implemented, while authentication, automated testing, database migrations, and deployment are still pending.

For a more detailed breakdown, see [`PROJECT_STATE.md`](./PROJECT_STATE.md).

---

## License / Credits

Built by Sahina as a full-stack event management coursework project.
