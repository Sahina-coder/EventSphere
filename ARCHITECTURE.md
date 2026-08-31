# EventSphere — Architecture

## 1. System Overview

EventSphere follows a simple three-layer architecture:

```text
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                                                              │
│  React 19 + TypeScript + Vite                               │
│  React Router · TanStack Query · Axios                      │
│                                                              │
│  Landing · Authentication UI · Organizer Dashboard           │
│  Attendee Portal · Vendor Portal                             │
└──────────────────────────────┬───────────────────────────────┘
                               │
                         HTTP / JSON
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                                                              │
│  FastAPI + SQLAlchemy + Pydantic                            │
│                                                              │
│  Event · Venue · Resource · Booking · Allocation             │
│  Attendee · Ticket · Vendor · Expenses · Analytics           │
│  Risk · Forecasting · Recommendations · Reports              │
│  Notifications · Incidents · Simulator · and more            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                         SQLAlchemy ORM
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         DATABASE                             │
│                                                              │
│                         PostgreSQL                           │
│                                                              │
│  Relational tables connected through foreign keys            │
└──────────────────────────────────────────────────────────────┘
```

The frontend is responsible for the user interface and client-side state/cache. The FastAPI backend provides the application API and business logic, while PostgreSQL stores the persistent event data.

---

## 2. Frontend

The frontend is a single React application using client-side routing.

### Main areas

```text
/
├── Landing
├── Authentication UI
│   ├── Login
│   ├── Signup
│   └── Forgot Password
│
├── Organizer
│   └── Dashboard
│
├── Attendee
│   └── Attendee Portal
│
└── Vendor
    └── Vendor Portal
```

### Frontend stack

* React 19
* TypeScript
* Vite
* React Router
* TanStack Query
* Axios
* Tailwind CSS v4
* Recharts
* Framer Motion
* Three.js
* Lucide React

---

## 3. Backend

The backend is built using FastAPI.

`main.py` registers the application routers, with each router representing a functional area of EventSphere.

Current domains include:

```text
event
venue
resource
booking
allocation
attendee
ticket
vendor
vendor_assignment
expense
health_score
risk
feedback
certificate
recommendations
notification
venue_map
lost_found
simulator
incident
sponsor
approval
forecast
report_export
```

The backend currently contains around 25 routers.

CORS is configured for the local frontend:

```text
http://localhost:5173
```

---

## 4. Backend Feature Pattern

Backend features generally follow the same three-part structure:

```text
models/<name>.py
        │
        │  SQLAlchemy table definition
        ▼
schemas/<name>.py
        │
        │  Pydantic request / response models
        ▼
routers/<name>.py
        │
        │  FastAPI endpoints and feature logic
        ▼
     Database
```

Example:

```text
models/booking.py
schemas/booking.py
routers/booking.py
```

A router is registered in `main.py`:

```python
app.include_router(<name>.router)
```

Database tables are currently created when the application starts:

```python
Base.metadata.create_all(bind=engine)
```

There is currently **no Alembic migration setup**. As a result, schema changes may require manual database changes or recreating the affected tables.

---

## 5. Frontend Feature Pattern

Frontend modules generally contain four parts:

```text
types/<name>.ts
        │
        │  TypeScript interfaces
        ▼
services/<name>Service.ts
        │
        │  Axios API calls
        ▼
pages/<Name>/
├── <Name>Form.tsx
└── <Name>List.tsx
```

Not every feature requires both a form and list page.

### Routing

Organizer-facing modules are connected through:

```text
components/layout/Sidebar.tsx
        ↓
pages/Dashboard/DashboardApp.tsx
```

Standalone areas such as the landing page, authentication screens, attendee portal, and vendor portal are connected through the route tree in:

```text
App.tsx
```

### State and caching

TanStack Query handles server state and caching.

After a successful mutation, the relevant query is invalidated:

```text
Mutation
   ↓
Backend update
   ↓
queryClient.invalidateQueries()
   ↓
Fresh data requested
   ↓
UI updates
```

This avoids maintaining a second manual copy of database state in the frontend.

---

## 6. Frontend Folder Map

```text
frontend/src/
│
├── App.tsx
│   └── Top-level route configuration
│
├── index.css
│   └── Global styles and design tokens
│
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   │
│   ├── Reveal.tsx
│   ├── AnimatedCounter.tsx
│   ├── TiltCard.tsx
│   ├── Hero3D.tsx
│   └── GradientButton.tsx
│
├── context/
│   ├── AttendeeContext.tsx
│   └── VendorContext.tsx
│
├── pages/
│   ├── Landing/
│   ├── Auth/
│   ├── Dashboard/
│   ├── AttendeePortal/
│   ├── VendorPortal/
│   └── <Feature>/
│
├── services/
│   └── One Axios service per feature
│
└── types/
    └── One TypeScript interface file per feature
```

### Component notes

| Component             | Purpose                            |
| --------------------- | ---------------------------------- |
| `Sidebar.tsx`         | Organizer dashboard navigation     |
| `Reveal.tsx`          | Scroll-triggered animation wrapper |
| `AnimatedCounter.tsx` | Count-up statistics                |
| `TiltCard.tsx`        | Mouse-based 3D card effect         |
| `Hero3D.tsx`          | Three.js landing-page scene        |
| `GradientButton.tsx`  | Reusable animated CTA              |

---

## 7. Data Flow Example — Venue Booking

A typical booking request follows this flow:

```text
User
 │
 │ fills out BookingForm.tsx
 ▼
bookingService.createBooking()
 │
 │ POST /bookings/
 ▼
routers/booking.py
 │
 │ checks existing bookings
 │
 │ overlap condition:
 │ start < existing_end
 │ AND
 │ end > existing_start
 │
 ├─────────────── Conflict ────────────────┐
 │                                         │
 │  HTTP 409                               │
 │  explanatory message                    │
 │                                         ▼
 │                                  BookingForm.tsx
 │
 └──────────── No Conflict ────────────────┐
                                           │
                                           ▼
                                    INSERT booking
                                           │
                                           ▼
                                      HTTP 200
                                           │
                                           ▼
                             queryClient.invalidateQueries()
                                           │
                                           ▼
                                  BookingList.tsx
                                           │
                                           ▼
                                      Updated UI
```

The API follows a consistent status-code approach across the application, including:

```text
200  Success
201  Created
400  Bad Request
404  Not Found
409  Conflict
500  Server Error
```

---

## 8. Database

PostgreSQL is used as the primary database.

Current tables include:

```text
events
venues
resources
bookings
allocations
attendees
tickets
vendors
vendor_assignments
expenses
sponsors
approval_requests
feedback
certificates
notifications
venue_map_points
lost_found_items
incidents
```

The tables are connected using foreign-key relationships where required.

---

## 9. Cross-Cutting Design Decisions

### Read-only intelligence

The What-If Simulator and recommendation endpoints are designed as read-only operations.

They calculate results from current database data without modifying the underlying records.

```text
Database
   ↓
GET request
   ↓
Calculation / recommendation
   ↓
Response
```

### Database-driven analytics

Analytics, scores, forecasts, and risk results are calculated from database records rather than being hardcoded.

This applies to:

* Analytics Dashboard
* Event Health Score
* Risk Detection
* Forecasting
* Recommendations

### Identity switching

The Attendee and Vendor portals currently use client-side identity selection instead of real authentication.

```text
AttendeeContext
      ↓
"Viewing as" attendee

VendorContext
      ↓
"Viewing as" vendor
```

There is currently no JWT/session-based authentication layer.

This is documented as a known limitation in [`PROJECT_STATE.md`](./PROJECT_STATE.md).

### Landing page isolation

The landing page has its own styling through `Landing.css` and scoped dark-theme variables.

The dashboard uses the global theme defined through `index.css`.

This keeps the landing page's dark marketing design from affecting the dashboard styling.

---

## 10. Current Architecture Limitations

The current architecture is suitable for the project's development stage, but several production-level pieces are still missing:

* Real authentication and role-based access control
* Automated tests
* Database migration management with Alembic
* Production deployment
* CI/CD pipeline
* Production environment configuration

These are tracked in [`PROJECT_STATE.md`](./PROJECT_STATE.md).
