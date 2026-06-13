# voteMe

Multi-tenant TikTok engagement competition platform — admin dashboards, candidate portals, live metric sync, dynamic scoring criteria, and a cinematic winner reveal ceremony.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind 4, shadcn/ui |
| Backend | Django 5 + DRF, JWT, MySQL |
| Media | Cloudinary |
| Metrics | TikTok public URL scraping (no OAuth) |

## Repos (nested)

| Path | Remote | Contents |
|------|--------|----------|
| Repo root | `frontend` → [VoteMe](https://github.com/apexsolutionhub/VoteMe) | Full project |
| `BackEnd/` | `origin` → [VoteMe-BackEnd](https://github.com/apexsolutionhub/VoteMe-BackEnd) | Django API only |

See `BackEnd/README.md` for nested-repo setup.

## Quick start

### Backend

```bash
cd BackEnd
python -m venv venv
.\venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Copy BackEnd/.env.example → BackEnd/venv/.env and fill DB_* vars
python manage.py migrate
python manage.py seed_admin      # demo: ellaVote / 12345678
python manage.py runserver
```

### Frontend

```bash
npm install
# Optional: .env.local with BACKEND_URL=http://127.0.0.1:8000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key routes

| Route | Who | Purpose |
|-------|-----|---------|
| `/Admin` | Admins | Login |
| `/Candidates` | Candidates | Login |
| `/signup` | New orgs | Create workspace (invite code required) |
| `/dashboard/*` | Authenticated | Admin or candidate portal |
| `/o/[slug]/leaderboard` | Public | Results ceremony (after competition ends) |

## Engagement sync (cron)

Schedule periodic sync for live competitions:

```bash
cd BackEnd
python manage.py sync_engagement
```

Recommended: every 5–10 minutes via system cron or cloud scheduler while competitions are live.

## Environment

**Backend** (`BackEnd/venv/.env`): `DB_*`, `SECRET_KEY`, `CORS_ALLOWED_ORIGINS`, `SIGNUP_SECRET_CODE`, optional `BRAND_MENTION_KEYWORD`.

**Frontend** (`.env.local`): `BACKEND_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_PRESET_NAME`.

## Scripts

```bash
npm run dev      # Next.js dev server
npm run build    # Production build + typecheck
npm run lint     # ESLint
```

**Backend tests** (SQLite, no MySQL required):

```bash
cd BackEnd
USE_SQLITE_TEST=true python manage.py test competitions.tests
```

## Features

- Org-scoped JWT auth with admin / candidate roles
- Competition lifecycle: draft → live → ended
- Video eligibility by TikTok publish window
- Dynamic milestones + scoring metrics
- Optional matched-comment scoring with admin approximation warning
- Admin leaderboard ceremony + public shareable results URL
- Candidate analytics, achievements, and post-competition rank cards

## Deploy notes

- Frontend: Vercel (or any Node host) with `BACKEND_URL` pointing at your Django API
- Backend: any WSGI host with MySQL + env vars; run migrations and schedule `sync_engagement`
- Set `SIGNUP_SECRET_CODE` before enabling `/signup` for new clients
