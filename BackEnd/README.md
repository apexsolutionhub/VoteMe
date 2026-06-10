# voteMe Backend (Django)

## Setup

```bash
cd BackEnd
python -m venv venv
.\venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Configure `BackEnd/venv/.env` (see `.env.example`).

## Database

Uses MySQL (Aiven). Required env vars:

- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

## Commands

```bash
python manage.py migrate
python manage.py seed_admin      # creates ellaVote / 12345678
python manage.py runserver
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup/` | POST | Create organization + owner admin |
| `/api/auth/login/` | POST | Login (`username`, `password`, `role`, `organization_slug`) |
| `/api/auth/refresh/` | POST | Refresh access token |
| `/api/auth/me/` | GET/PATCH | Current user |
| `/api/auth/change-password/` | POST | Change password |
| `/api/organizations/me/` | GET | Organization + competition context |
| `/api/organizations/competition/` | GET/PATCH | Competition settings |
| `/api/organizations/competition/status/` | POST | Set competition status |
| `/api/organizations/competition/sync/` | POST | Sync engagement metrics |
| `/api/organizations/candidates/` | GET/POST | Org-scoped candidates |
| `/api/organizations/candidates/<id>/` | DELETE | Delete candidate profile |
| `/api/candidate/me/profile/` | GET/PATCH | Candidate profile |
| `/api/candidate/me/stats/` | GET | Candidate engagement stats |
| `/api/candidate/me/videos/` | GET/POST | Competition video links |
| `/api/public/<slug>/leaderboard/` | GET | Public live leaderboard |

## Engagement sync

```bash
python manage.py sync_engagement
```

Run on a schedule (cron) for live competitions with tracking enabled.

## Environment variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_SIGNUP_ENABLED` | `true` to allow `/signup` (default `false`, invitation-only) |
| `TIKTOK_CLIENT_KEY` | TikTok Login Kit client key |
| `TIKTOK_CLIENT_SECRET` | TikTok client secret |
| `TIKTOK_REDIRECT_URI` | OAuth callback (default `http://localhost:3000/dashboard/tiktok/callback`) |
| `BRAND_MENTION_KEYWORD` | Keyword to count in comments (default `ellaresort`) |
| `TIKTOK_RESEARCH_CLIENT_KEY` | Optional Research API for comment text ingestion |

When onboarding a paid client, set `PUBLIC_SIGNUP_ENABLED=true`, send them `https://yoursite.com/signup`, then disable again after registration.
