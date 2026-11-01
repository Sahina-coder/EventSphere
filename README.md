# ✦ EventSphere

<p align="center">
  <img src="assets/eventsphere-banner.png" alt="EventSphere 3D Banner" width="100%" />
</p>

<p align="center">
  <strong>Intelligent Event Planning, Resource Management & Decision Support System</strong>
</p>

<p align="center">
  A centralized platform to plan, manage, coordinate, and analyse events — all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" />
</p>

---

## 📌 About the Project

EventSphere is a full-stack **Event Planning and Resource Management System** designed to simplify the process of organising and managing events.

Traditional event management often relies on spreadsheets, notebooks, WhatsApp messages, and phone calls. These disconnected methods can make coordination, tracking, and resource allocation difficult.

EventSphere aims to bring these activities together through a centralized digital platform, supporting the event lifecycle from initial planning to post-event reporting.

The platform includes role-based portals for organisers, attendees, and vendors, helping different users access the features relevant to them.

## ✨ Key Features

- **Event Management:** Create, view, update, and manage events.
- **Venue Management:** Maintain venue details, capacity, location, and availability.
- **Resource Management:** Organise and track event resources such as projectors, microphones, chairs, laptops, and other equipment.
- **Attendee Management:** Maintain attendee information and manage registrations.
- **Vendor Management:** Support vendor-related event coordination.
- **Dashboard & Analytics:** View event-related information through a centralized dashboard and visual reports.
- **Authentication & Authorization:** Secure login and role-based access for different user types.
- **Reports:** Generate useful event and resource-related reports.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| API & Data Fetching | Axios, TanStack Query |
| Visualisation | Recharts, Three.js |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| ORM & Validation | SQLAlchemy 2, Pydantic |
| Authentication | JWT, python-jose, Passlib, bcrypt |
| Database | PostgreSQL |
| Reports & Utilities | ReportLab, qrcode |
| Development Tools | Git, GitHub, VS Code, pgAdmin |

## 🏗️ Project Structure

```text
EventSphere/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── assets/
│   └── eventsphere-banner.png
│
├── ARCHITECTURE.md
├── PROJECT_STATE.md
├── LICENSE
└── README.md
```

*The structure above highlights the main project areas; individual folders and files may evolve during development.*

## 🚀 Getting Started

Follow these instructions to run EventSphere locally.

### Prerequisites

Make sure you have the following installed:

- Python 3.12 or later
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sahina-coder/EventSphere.git
cd EventSphere
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Database Configuration

1. Open PostgreSQL using pgAdmin or your preferred PostgreSQL client.
2. Create a database named `eventsphere`.
3. Create a `.env` file inside the `backend` directory.

Add the following configuration:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/eventsphere
JWT_SECRET_KEY=your-long-random-secret-key
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

**Note:** If your password contains special characters, URL-encode them in the database connection string.

### 4. Run the Backend

From the `backend` directory, run:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

- API: http://127.0.0.1:8000
- API Documentation: http://127.0.0.1:8000/docs

### 5. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd EventSphere/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

http://localhost:5173

**Important:** Keep both the backend and frontend servers running in separate terminals.

## 🌐 Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Public landing page | Public |
| `/login` | User login | Public |
| `/signup` | User registration | Public |
| `/forgot-password` | Password recovery | Public |
| `/dashboard` | Organiser dashboard | Organiser |
| `/attendee` | Attendee portal | Attendee |
| `/vendor` | Vendor portal | Vendor |

## 📚 Project Documentation

For more details about the system:

- [System Architecture](ARCHITECTURE.md) — Project architecture and technical design.
- [Project State](PROJECT_STATE.md) — Current development progress and implementation status.

## 🔮 Future Enhancements

Potential areas for further development include:

- Advanced event analytics and reporting.
- Improved resource allocation and availability tracking.
- QR-based attendee check-in.
- Automated event notifications and reminders.
- Budget tracking and management.
- Enhanced vendor coordination.

## 👩‍💻 Author

**Sahina Khatun**

B.Tech in Information Technology

[GitHub Profile](https://github.com/Sahina-coder)

---

<p align="center">
  <strong>EventSphere — Plan Smarter. Manage Better. Make Every Event Count.</strong>
</p>