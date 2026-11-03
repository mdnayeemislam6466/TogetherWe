# TogetherWe — Social Development Events Platform

A responsive full-stack community events platform inspired by the B14-A08 Social Development Events Platform brief. People can discover local initiatives, create events, join causes, and manage their own activity.

## Features

- Responsive landing page with community-focused hero, impact stats, feature highlights, and upcoming events.
- Email/password registration and login with bcrypt password hashing and JWT sessions.
- Browse upcoming events, search by title/location/description, and filter by category.
- Event details with date, location, category, description, and join/leave action.
- Authenticated event creation, editing, and deletion; only the creator can edit or delete their event.
- Personal dashboard for created events and joined events.
- Light/dark theme toggle with saved preference.
- MongoDB indexes for user email uniqueness and duplicate join prevention.
- API health endpoint at `/api/health` and user-friendly error messages.

## Tech stack

- Client: React 18, Vite, React Router, Lucide React, React Hot Toast, plain CSS.
- Server: Node.js, Express, MongoDB Node driver, bcryptjs, JSON Web Tokens.
- Database: MongoDB Atlas or local MongoDB.

## Requirements

- Node.js 20 or newer (Node 22 LTS recommended)
- npm
- MongoDB Atlas cluster or local MongoDB instance

## Run locally (Windows / Git Bash)

1. Extract the ZIP and open the `TogetherWe-A8` folder in VS Code.
2. Install root helper dependency:

   ```bash
   npm install
   ```

3. Install backend dependencies:

   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

4. Open `server/.env` and set `MONGODB_URI`, `DB_NAME`, and a long random `JWT_SECRET`. Do not commit `.env` or share your database password.
5. In a terminal at the project root, install client dependencies:

   ```bash
   cd client
   npm install
   cp .env.example .env
   ```

6. Run both apps from the project root:

   ```bash
   npm run dev
   ```

   Or run them in separate terminals:

   ```bash
   # Terminal 1
   cd server && npm run dev

   # Terminal 2
   cd client && npm run dev
   ```

7. Open `http://localhost:5173`. The API runs at `http://localhost:5000`.

## Optional demo events

After configuring the backend `.env`, run:

```bash
cd server
npm run seed
```

This inserts three upcoming sample events. Running it again will not duplicate those demo records.

## Environment variables

### `server/.env`

| Variable | Purpose |
|---|---|
| `PORT` | API port; defaults to 5000 |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name; defaults to `togetherwe` |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLIENT_ORIGIN` | Allowed frontend origin; comma-separated origins are supported |

### `client/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API base URL; defaults to `http://localhost:5000/api` |

## Deployment

Deploy the frontend and backend as two Vercel projects for the simplest setup.

### Backend project

- Import this repository into Vercel.
- Set **Root Directory** to `server`.
- Add `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, and `CLIENT_ORIGIN` in Vercel Environment Variables.
- Deploy and test `https://YOUR-BACKEND.vercel.app/api/health`.

### Frontend project

- Create a second Vercel project from the same repository.
- Set **Root Directory** to `client`.
- Add `VITE_API_URL=https://YOUR-BACKEND.vercel.app/api`.
- Deploy. Add the deployed frontend URL to the backend's `CLIENT_ORIGIN` variable, then redeploy the backend.

The included `server/vercel.json` routes API requests to the serverless handler. The included `client/vercel.json` supports client-side SPA routes.

## API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/auth/me` | Yes | Current account |
| GET | `/api/events` | No | Upcoming events, optional `q` and `category` |
| GET | `/api/events/:id` | No | Event details |
| POST | `/api/events` | Yes | Create event |
| PATCH | `/api/events/:id` | Yes | Update own event |
| DELETE | `/api/events/:id` | Yes | Delete own event |
| GET | `/api/joined` | Yes | Events joined by current user |
| POST | `/api/joined/:id` | Yes | Join event |
| DELETE | `/api/joined/:id` | Yes | Leave event |

Protected endpoints expect `Authorization: Bearer <token>`.

## Important notes before submission

- Replace the demo event images/content with your own final choices if required by your instructor.
- Configure real MongoDB credentials in environment variables; no database secrets are included in this ZIP.
- Test registration, login, create, edit, delete, join, leave, refresh, and mobile layout before submitting.
- Make your own meaningful Git commits as you develop. This ZIP does not fabricate assignment commit history.
