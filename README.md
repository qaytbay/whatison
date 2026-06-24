# WhatisOn — WhatsApp Marketing Platform

Full-stack Node.js app with REST API, admin panel, and Arabic RTL dashboard.

## 🚀 Quick Deploy

### Render.com (Recommended — Free tier)
1. Push to GitHub
2. Go to render.com → New → Web Service
3. Connect repo, set:
   - Build: `npm install`
   - Start: `node server.js`
4. Done — live URL in 2 minutes

### Railway.app
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Local
```bash
npm install
node server.js
# Opens at http://localhost:3000
```

## 🔑 Default Credentials
- Admin: `admin@WhatisOn.com` / `admin123`
- Agent: `nada@WhatisOn.com` / `agent123`

## 📊 URLs
- Dashboard: `/`
- Admin Panel: `/admin`
- Login: `/login.html`
- API Base: `/api`

## 🔌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/dashboard/kpis | KPI stats |
| GET/POST | /api/contacts | Contacts CRUD |
| GET/POST | /api/campaigns | Campaigns CRUD |
| POST | /api/campaigns/:id/send | Send campaign |
| GET | /api/automations | List automations |
| PUT | /api/automations/:id/toggle | Toggle on/off |
| GET | /api/admin/overview | Admin stats |
| GET/POST/PUT/DELETE | /api/admin/users | User management |
| GET/PUT | /api/admin/settings | Settings |

## Stack
- **Backend**: Node.js + Express
- **Database**: NeDB (embedded, no setup needed)
- **Auth**: JWT
- **Frontend**: Vanilla JS + RTL Arabic UI
