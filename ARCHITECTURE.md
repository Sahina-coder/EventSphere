# EventSphere — Architecture

## System Overview

```
┌───────────────────────────────────────────────────────────┐
│                          BROWSER                            │
│                                                               │
│   /            Landing (public, dark theme, 3D hero,          │
│                 glow cursor, pill navbar)                     │
│   /login /signup /forgot-password    Auth UI (real JWT auth)  │
│   /dashboard    Organizer Dashboard — PROTECTED (role:         │
│                 Organizer) — command-center sidebar            │
│   /attendee     Attendee Portal — PROTECTED (role: Attendee)   │
│   /vendor       Vendor Portal — PROTECTED (role: Vendor)        │
│                                                               │
│   Single React app (Vite) · client-side routed via             │
│   react-router-dom · state/cache via TanStack Query ·           │
│   auth state via AuthContext (JWT in localStorage)              │
└─────────────────────────┬─────────────────────────────────┘
                           │  Axios · HTTP/JSON (Bearer token on /auth/me)
                           ▼
┌───────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND                        │
│                                                               │
│  main.py registers ~26 routers, one per domain:                │
│  event · venue · resource · booking · allocation ·             │
│  attendee · ticket · vendor · vendor_assignment ·                │
│  expense · health_score · risk · feedback · certificate ·         │
│  recommendations · notification · venue_map · lost_found ·        │
│  simulator · incident · sponsor · approval · forecast ·           │
│  report_export · auth (JWT register/login/me)                     │
│                                                               │
│  CORS: allow-origin http://localhost:5173                     │
└─────────────────────────┬─────────────────────────────────┘
                           │  SQLAlchemy ORM
                           ▼
┌───────────────────────────────────────────────────────────┐
│                    PostgreSQL DATABASE                        │
│           ~21 tables, foreign-key linked                       │
└───────────────────────────────────────────────────────────┘
```

---

## Backend Pattern

Every feature is exactly 3 files, following the same shape:

```
models/<name>.py     → SQLAlchemy table definition
schemas/<name>.py    → Pydantic request/response models
routers/<name>.py    → FastAPI endpoints (CRUD + any custom logic)
```

Registered in `main.py`:
```python
app.include_router(<name>.router)
```

Tables are auto-created on startup via `Base.metadata.create_all(bind=engine)`. No migration tool (Alembic) is wired in yet — schema changes require a fresh table or manual ALTER.

**Authentication** (`auth.py`) is the one router that departs from pure CRUD:
- `POST /auth/register` — hashes password (bcrypt via passlib), creates a `User` row with a role (Organizer/Attendee/Vendor), returns a JWT
- `POST /auth/login` — verifies password, returns a JWT
- `GET /auth/me` — reads the `Authorization: Bearer <token>` header, decodes the JWT, returns the current user
- Tokens are signed with `JWT_SECRET_KEY` (from `.env`), 7-day expiry, HS256 algorithm

---

## Frontend Pattern

Every feature module is 4 pieces, following the same shape:

```
types/<name>.ts             → TypeScript interfaces (mirrors Pydantic schemas)
services/<name>Service.ts   → Axios calls to the matching backend router
pages/<Name>/<Name>Page.tsx → Full page: stat modules + form + list + search/filter + quick actions
```

Newer "command-center" pages (Events, Venues, Resources, Attendees, Vendors, Assignments, Bookings, Allocations, Budget, Sponsorship, Approvals, Analytics, Health Score, Risks) follow a consistent internal layout:
1. Page heading + one-line description
2. Row of `StatModule` cards (colored icon badge + big number, computed from real data)
3. A 3-column grid: form panel / searchable+filterable list panel / donut-chart breakdown panel
4. A "Quick Actions" panel linking to related pages (via an `onNavigate` prop passed down from `DashboardApp.tsx`)

State/caching: TanStack Query throughout. Mutations call `queryClient.invalidateQueries()` on success to keep the UI in sync with the database.

**Auth state**: `AuthContext` holds `{ user, token }`, persisted to `localStorage` (`es_token`, `es_user`). `ProtectedRoute` wraps `/dashboard`, `/attendee`, `/vendor` and redirects to `/login` if unauthenticated, or to `/` if the logged-in user's role doesn't match the route.

---

## Frontend Folder Map

```
frontend/src/
├── App.tsx                    Router — AuthProvider > AttendeeProvider > VendorProvider > Routes
├── index.css                   Design tokens: dark theme (teal/emerald accent) + global overrides
├── components/
│   ├── layout/Sidebar.tsx        Organizer dashboard nav (grouped: Command Center, Events,
│   │                              Operations, People, Finance, Intelligence, Post-Event, Other)
│   ├── layout/TopHeader.tsx       Search, notification bell, profile dropdown with logout
│   ├── Reveal.tsx                 Scroll-triggered fade/slide-in wrapper (3D rotation on entry)
│   ├── AnimatedCounter.tsx        Count-up-on-view number
│   ├── TiltCard.tsx               Mouse-tracking 3D tilt + glossy shine-sweep wrapper
│   ├── Hero3D.tsx                 Three.js animated wireframe/particle hero scene
│   ├── GradientButton.tsx         Animated gradient-glow CTA button
│   ├── GlowCursor.tsx             WebGL (ogl) glowing mouse-trail effect
│   ├── GlobalCursorGlow.tsx        Renders GlowCursor only on Landing/Auth routes
│   ├── PillNav.tsx                 Pill-shaped floating navbar with GSAP hover-fill animation
│   ├── GlobalNav.tsx                Renders PillNav only on Landing/Auth routes
│   └── ProtectedRoute.tsx           Route guard: requires login + matching role
├── context/
│   ├── AuthContext.tsx             Logged-in user + JWT, persisted to localStorage
│   ├── AttendeeContext.tsx          "Viewing as" attendee identity (within Attendee Portal)
│   └── VendorContext.tsx            "Viewing as" vendor identity (within Vendor Portal)
├── pages/
│   ├── Landing/                     Public marketing page (own CSS, dark theme, 3D hero)
│   ├── Auth/                        AuthScreen.tsx (shared login/signup split-panel UI),
│   │                                 Login.tsx, Signup.tsx, ForgotPassword.tsx
│   ├── Dashboard/DashboardApp.tsx    Organizer sidebar shell + all ~25 module routes
│   ├── Overview/Overview.tsx         Command-center home: featured event, readiness ring,
│   │                                  stat modules, events/venue-pulse/budget panels
│   ├── AttendeePortal/               Attendee-facing routed pages
│   ├── VendorPortal/                 Vendor-facing routed pages
│   └── <Feature>/                    One folder per feature module (Events, Budget, Risks, …)
├── services/                        One Axios file per feature, including authService.ts
└── types/                           One TS interface file per feature
```

---

## Data Flow Example — Logging In

```
User submits AuthScreen login form
        ↓
authService.loginUser() → POST /auth/login { email, password }
        ↓
routers/auth.py: look up User by email, verify bcrypt hash
        ↓
  ├─ Invalid  → 401 → shown inline in the form
  └─ Valid    → sign JWT { sub: user.id, role: user.role } → return { access_token, user }
        ↓
AuthContext.login(token, user) → saved to state + localStorage
        ↓
navigate() to role-based landing route (/dashboard, /attendee, or /vendor)
        ↓
ProtectedRoute on that route checks user.role matches → renders the portal
```

## Data Flow Example — Booking a Venue (unchanged core pattern)

```
User fills BookingForm.tsx
        ↓
bookingService.createBooking() → POST /bookings/
        ↓
routers/booking.py: overlap check against existing bookings
  for that venue_id (start < end AND end > start)
        ↓
  ├─ Conflict found  → 409 + explanatory message → shown in form
  └─ No conflict     → INSERT into bookings table → 200 + booking
        ↓
queryClient invalidates ["bookings"] → BookingsPage re-fetches
        ↓
UI updates automatically
```

This request/response/status-code shape (200/201/400/401/404/409/500) is consistent across all routers.

---

## Cross-Cutting Design Decisions

- **Read-only intelligence endpoints**: What-If Simulator and all recommendation endpoints are GET-only and never write to the database, by design.
- **No hardcoded analytics**: every stat, chart, score, and forecast is computed from real database rows at request time.
- **RBAC via JWT, not sessions**: stateless — the backend never stores session data; every protected request carries the token and the backend decodes it fresh.
- **Attendee/Vendor identity vs. login identity**: a logged-in Attendee/Vendor user still uses an in-portal "viewing as" selector (`AttendeeContext`/`VendorContext`) to pick which `attendees`/`vendors` database row they're acting as, since there is not yet a direct foreign-key link between the `users` table and those tables. This is a known simplification (see `PROJECT_STATE.md`).
- **Landing page isolation**: `Landing.css` + its own dark CSS variables are scoped so the marketing page's styling doesn't interfere with the dashboard's separately-themed dark mode (`index.css`).
- **3D/motion layering**: `TiltCard` (mouse-tracking rotation + shine), `Reveal` (scroll-entry animation with rotation), and `Hero3D` (persistent Three.js scene) are composed together on the landing page but used selectively — dashboard pages use only `TiltCard` on stat cards, not the heavier `Hero3D`/`GlowCursor` effects, to keep dense data screens readable.