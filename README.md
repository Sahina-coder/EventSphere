# EventSphere (ongoing project..)

EventSphere is a full-stack event planning and resource management system built with **React, FastAPI, and PostgreSQL**.

The application provides a centralized platform for managing events, attendees, venues, resources, vendors, bookings, tickets, expenses, feedback, and other event-related operations.

## Tech Stack

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
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
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
