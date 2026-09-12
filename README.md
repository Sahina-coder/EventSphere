# EventSphere

**Intelligent Event Planning, Resource Management & Decision Support System**

EventSphere replaces manual event management (Excel sheets, WhatsApp, phone calls) with a centralized digital platform — covering the full event lifecycle from planning through post-event analytics, with role-based portals for organizers, attendees, and vendors.

📄 See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for system design and [`PROJECT_STATE.md`](./PROJECT_STATE.md) for current build status.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Routing | React Router |
| Data | TanStack Query, Axios |
| Visuals | Recharts, Framer Motion, Three.js, Lucide React |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Backend | Python 3.12+, FastAPI, SQLAlchemy 2, Pydantic, Uvicorn |
| Reports | qrcode, reportlab |
| Database | PostgreSQL |
| Tools | Git, GitHub, VS Code, pgAdmin |

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install reportlab qrcode[pil] pydantic[email] python-jose[cryptography] passlib[bcrypt]
```

Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/eventsphere
JWT_SECRET_KEY=any-long-random-string-you-make-up
```
> URL-encode special characters in your password (`@` → `%40`).

Create a database named `eventsphere` in pgAdmin, then:
```bash
uvicorn app.main:app --reload
```
→ `http://127.0.0.1:8000` · Docs at `/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```
→ `http://localhost:5173`

**Both servers must run simultaneously** in separate terminals.

---

## Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Public landing page (dark, animated, 3D) | Public |
| `/login` `/signup` `/forgot-password` | Authentication | Public |
| `/dashboard` | Organizer command-center dashboard | Requires login, role = Organizer |
| `/attendee` | Attendee portal | Requires login, role = Attendee |
| `/vendor` | Vendor portal | Requires login, role = Vendor |

---

## License / Credits

Built by Team EventSphere as a full-stack event management project.