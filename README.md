# Orbit Notes — Personal Observatory

A full-stack astronomy logbook and space-science observatory: sky events, space-science discoveries, source links, and dated daily reports.

## Project Layout

```text
orbit-notes/
├── frontend/   # React + Vite user interface (Cosmic theme, Pure Vanilla CSS)
└── backend/    # Node.js + Express MVC API with Supabase Postgres & RSS Collector
```

The backend follows MVC: routes dispatch to controllers, controllers validate and authenticate requests, and models read and write Supabase tables with per-account ownership enforcement.

---

## What is Included

- **Authentication**: Signup and login with bcrypt password hashing (12 rounds) and JWT session tokens.
- **Per-Account Ownership**: Protected API routes ensuring users can only delete and modify their own records.
- **Supabase Persistence**: Postgres schema with Row Level Security (RLS) enabled on all tables (`users`, `events`, `discoveries`, `reports`).
- **Official RSS Automation**:
  - Daily 8:00 AM India Standard Time (`Asia/Kolkata`) automated collection from official NASA, JPL, and ESA feeds.
  - Manual **"Sync official feeds"** action with real-time feedback and count of new discoveries.
  - Automatic dated daily report generation when new space discoveries published that day are collected.
- **Sky Events Catalog**:
  - Log meteor showers, planetary conjunctions, lunar/solar eclipses, comets, and transits.
  - Observation metadata: peak times, visibility conditions, required optical equipment, Bortle scale, celestial coordinates, and ephemeris source URLs.
- **Multi-Platform Social Media Streams**:
  - **YouTube**: Open public feeds and official videos from NASA, ESA, James Webb Space Telescope, and Anton Petrov Astrophysics (plus optional YouTube Data API v3).
  - **Reddit**: Real-time astronomy discussions and findings from `r/astronomy`, `r/space`, and `r/spacenews`.
  - **Bluesky**: Open AT Protocol dispatches from verified space accounts (`@nasa.gov`, `@esa.int`).
  - **X (Twitter)**: Integrated support via X API v2 Bearer Token in `backend/.env`.
  - **Zero Password Sharing**: All social feeds operate safely through open XML/JSON feeds and developer API keys without exposing personal passwords.
- **Space-Science Discovery Library**:
  - Filter by scientific discipline (Astrophysics, Exoplanets, Cosmology, Solar System, Deep Sky, Missions).
  - Filter by source (NASA, ESA, YouTube, Reddit, Bluesky, X).
  - Save external source URLs from journals, space agencies, observatories, and social platforms.
- **Dated Daily Reports**:
  - Atmospheric seeing conditions (Bortle Class 1–9, seeing in arcseconds, transparency, cloud cover).
  - Executive syntheses, observational highlights, and instrument calibration notes.


---

## API Endpoints

- `GET /api/health` — Observatory status, uptime, Supabase connection, and RSS scheduler details
- `POST /api/auth/signup` — Register astronomer account (12 rounds bcrypt hash)
- `POST /api/auth/login` — Sign in and issue JWT token
- `GET /api/auth/me` — Authenticated profile details
- `GET /api/events` — Retrieve sky observation events
- `POST /api/events` — Log a new sky event
- `GET /api/discoveries` — Search and filter discoveries by category or source
- `POST /api/discoveries` — Archive a space-science discovery
- `POST /api/discoveries/sync` — Manually trigger official NASA/JPL & ESA feed collection
- `GET /api/reports` — List dated observatory daily reports
- `POST /api/reports` — File a new dated daily report
- `POST /api/reports/generate-today` — Automatically compile today's dispatch from active items
- `DELETE /api/:kind/:id` — Delete a user's own record where `:kind` is `events`, `discoveries`, or `reports`

---

## Quick Start

### 1. Database Setup
The database schema has already been executed on your Supabase project (`rumsebnrigshnqraawlv`).
The full DDL and RLS policies are available at [`backend/supabase/schema.sql`](backend/supabase/schema.sql).

### 2. Environment Configuration
- Backend: [`backend/.env`](backend/.env) (configured with Supabase URL, keys, and JWT secret)
- Frontend: [`frontend/.env`](frontend/.env) (`VITE_API_URL=http://localhost:5000/api`)

### 3. Running Locally
In one terminal:
```bash
cd backend
npm install
npm run dev
```

In another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
