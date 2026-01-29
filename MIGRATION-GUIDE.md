# PostgreSQL Migration Guide - Multi-Tenant Quiniela

## Overview

This guide covers the migration from JSON file storage to PostgreSQL with multi-tenant support.

## Architecture

```
Frontend (Vercel)          Backend (Railway)           Database (Railway PostgreSQL)
/:brand/quiniela   -->    /api/:brand/*        -->    brands, participants, predictions,
                                                       questions (global), results
```

## New URL Structure

| Old URL | New URL |
|---------|---------|
| `/` | `/:brand` (e.g., `/default`, `/cocacola`) |
| `/quiniela` | `/:brand/quiniela` |
| `/confirmar` | `/:brand/confirmar` |
| `/api/participants` | `/api/:brand/participants` |
| `/api/predictions` | `/api/:brand/predictions` |
| `/api/leaderboard` | `/api/:brand/leaderboard` |
| `/api/admin/*` | `/api/:brand/admin/*` |
| `/api/questions` | `/api/questions` (global, unchanged) |

## Setup Steps

### 1. Create PostgreSQL Database in Railway

1. Go to Railway dashboard
2. Create a new PostgreSQL service
3. Copy the `DATABASE_URL` connection string

### 2. Configure Environment Variables

**Backend (Railway):**
```env
DATABASE_URL=postgresql://...  # From Railway
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
ADMIN_API_KEY=your-secure-key
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://your-backend.railway.app
```

### 3. Install Dependencies and Generate Prisma Client

```bash
cd server
npm install
npx prisma generate
```

### 4. Run Database Migrations

```bash
# Push schema to database (development)
npm run db:push

# Or create a migration (production)
npm run db:migrate

# Seed default questions and brand
npm run db:seed
```

### 5. Migrate Existing Data (Optional)

If you have existing JSON data:

```bash
npm run db:migrate-data
```

This will:
- Create participants from `data/participants.json`
- Migrate predictions from `data/predictions.json`
- Migrate results from `data/results.json`

### 6. Deploy

**Backend:**
```bash
# Railway will run: npm run start
# Which does: npx prisma generate && node src/index.js
```

**Frontend:**
```bash
# Vercel auto-deploys from git
```

## Database Schema

### `brands` (Tenants)
- `id` - UUID primary key
- `slug` - Unique identifier (e.g., "cocacola")
- `name` - Display name
- `logo_url` - Brand logo
- `primary_color` - Theme color
- `admin_api_key` - Unique API key per brand
- `predictions_lock_at` - When predictions close

### `questions` (Global)
- Shared across all brands
- Seeded automatically with Super Bowl questions

### `participants` (Per Brand)
- Email is unique per brand (same email can register for multiple brands)

### `predictions` (Per Brand)
- One prediction per participant per question

### `results` (Per Brand)
- Official answers, admin-only

## Creating a New Brand

```sql
INSERT INTO brands (slug, name, admin_api_key, predictions_lock_at)
VALUES (
  'cocacola',
  'Coca-Cola Super Bowl Party',
  'secure-api-key-for-cocacola',
  '2026-02-08 18:30:00-08'
);
```

Or programmatically:
```javascript
import { prisma } from './src/services/databaseService.js';

await prisma.brand.create({
  data: {
    slug: 'cocacola',
    name: 'Coca-Cola Super Bowl Party',
    logoUrl: 'https://example.com/cocacola-logo.png',
    primaryColor: '#FF0000',
    adminApiKey: 'secure-api-key-for-cocacola',
    predictionsLockAt: new Date('2026-02-08T18:30:00-08:00'),
  },
});
```

## API Authentication

Each brand has its own `admin_api_key`. Admin endpoints require the brand's specific key:

```bash
# Submit results for a brand
curl -X POST https://api.example.com/api/cocacola/admin/results \
  -H "x-api-key: secure-api-key-for-cocacola" \
  -H "Content-Type: application/json" \
  -d '{"results": {"winner": "seahawks"}}'
```

## WebSocket Rooms

Clients subscribe to brand-specific rooms:

```javascript
socket.emit('leaderboard:subscribe', 'cocacola');
// Now receives updates only for the 'cocacola' brand
```

## Files Changed

### Backend (server/)
- `prisma/schema.prisma` - NEW: Database models
- `prisma/seed.js` - NEW: Seeds questions and default brand
- `prisma/migrate-data.js` - NEW: Migrates JSON data
- `src/services/databaseService.js` - NEW: Prisma-based data access
- `src/middleware/brandContext.js` - NEW: Validates brand from URL
- `src/middleware/adminAuth.js` - MODIFIED: Added `brandAdminAuth`
- `src/routes/brand.js` - NEW: Brand info endpoint
- `src/routes/participants.js` - MODIFIED: Uses brandId
- `src/routes/predictions.js` - MODIFIED: Uses brandId
- `src/routes/questions.js` - MODIFIED: Reads from DB
- `src/routes/leaderboard.js` - MODIFIED: Uses brandId
- `src/routes/admin.js` - MODIFIED: Uses brandId
- `src/services/scoringService.js` - MODIFIED: Uses brandId
- `src/websocket/leaderboardEvents.js` - MODIFIED: Brand rooms
- `src/index.js` - MODIFIED: Routes with /:brand prefix

### Frontend (client/)
- `src/context/BrandContext.jsx` - NEW: Brand state management
- `src/hooks/useBrand.js` - NEW: Re-export of useBrand
- `src/App.jsx` - MODIFIED: Routes with /:brand prefix
- `src/services/api.js` - MODIFIED: All calls include brand
- `src/services/socket.js` - MODIFIED: Brand-specific rooms
- `src/hooks/useParticipant.js` - MODIFIED: Brand-scoped storage
- `src/hooks/useLeaderboard.js` - MODIFIED: Uses brand
- `src/hooks/usePredictions.js` - MODIFIED: Uses brand
- `src/pages/Landing.jsx` - MODIFIED: Brand-aware navigation
- `src/pages/Confirmation.jsx` - MODIFIED: Brand-aware navigation

## Verification Checklist

1. [ ] PostgreSQL database created in Railway
2. [ ] `DATABASE_URL` set in Railway backend
3. [ ] `npm run db:push` or `npm run db:migrate` completed
4. [ ] `npm run db:seed` completed
5. [ ] Default brand accessible at `/:brand` (e.g., `/default`)
6. [ ] Participants can register and submit predictions
7. [ ] Admin can submit results with brand-specific API key
8. [ ] Leaderboard updates via WebSocket
9. [ ] Multiple brands isolated (test with a second brand)
