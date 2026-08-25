## EventSphere (ongoing..)

Intelligent Event Planning, Resource Management & Decision Support System

EventSphere is a full-stack web application that replaces manual event management methods (Excel sheets, WhatsApp, phone calls) with a centralized digital platform. It covers the complete event lifecycle - from planning and venue booking to attendee registration, vendor coordination, budgeting, and intelligent analytics.

## Tech Stack (will be updated later..)

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* TanStack Query
* Axios
* Recharts
* React Hook Form
* Zod

### Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL
* Pydantic
* Alembic
* Uvicorn

## Project Structure

```text
EventSphere/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── routers/         # API route handlers
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/            # Feature pages (Events, Venues, Budget, etc.)
    │   ├── pages/Landing/     # Public landing page
    │   ├── pages/Auth/        # Login / Signup / Forgot Password
    │   ├── pages/Dashboard/   # Organizer dashboard shell
    │   ├── pages/AttendeePortal/
    │   ├── pages/VendorPortal/
    │   ├── components/layout/ # Sidebar, headers
    │   ├── context/           # Attendee/Vendor "viewing as" context
    │   ├── services/          # API call functions per module
    │   ├── types/             # TypeScript interfaces
    │   ├── App.tsx            # Router
    │   └── index.css          # Design tokens
    └── index.html
```

## Features

* Event management
* Attendee management
* Venue management
* Resource management and allocation
* Vendor management and assignments
* Booking management
* Ticket management
* Expense tracking
* Event feedback
* Certificate management
* Risk management
* Event health scoring
* Event recommendations

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Python 3.10+
* Node.js 18+
* npm
* PostgreSQL

### Clone the Repository

```bash
git clone https://github.com/Sahina-coder/EventSphere.git
cd EventSphere
```

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### Database Configuration

Create a PostgreSQL database and configure the database connection in your environment variables.

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/eventsphere
```

Run the database migrations:

```bash
alembic upgrade head
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the URL provided by Vite, usually:

```text
http://localhost:5173
```

## Available Frontend Commands

```bash
npm run dev
```

Start the development server.

```bash
npm run build
```

Create a production build.

```bash
npm run lint
```

Run ESLint.

```bash
npm run preview
```

Preview the production build locally.

## API

The backend exposes REST APIs through FastAPI. The available endpoints are organized by domain, including:

* Events
* Attendees
* Bookings
* Tickets
* Venues
* Resources
* Allocations
* Vendors
* Vendor Assignments
* Expenses
* Feedback
* Certificates
* Risks
* Health Scores
* Recommendations

For a complete list of endpoints and request/response schemas, run the backend and open:

```text
http://127.0.0.1:8000/docs
```

## Development

The project is structured as two independent applications:

* `frontend` handles the user interface and client-side application logic.
* `backend` provides the REST API and database operations.
* PostgreSQL is used for persistent data storage.

When developing locally, both the frontend and backend servers should be running.

## Author

**Sahina**

GitHub: [Sahina-coder](https://github.com/Sahina-coder)

## License

No license has been specified for this project yet.
