# My Calorie Diary 🍏

A modern calorie diary web app in Hebrew (RTL) built with Vite + React and MUI.

## Project Contents
- Full React client under `client`
- Secure authentication flow via n8n (JWT/session token)
- RTL Hebrew UI with emojis and motivational messages
- Day / Week / Month / Year period views
- Recharts graph, add-meal form, and data management UI
- Static hosting flow for Amazon S3
- Manual registration (email + password) via n8n backend

## Run Locally
1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Create `client/.env.local` with the environment variables below.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`.

## Environment Variables
Create `client/.env.local`:
```
VITE_API_BASE_URL=https://your-n8n-endpoint.example.com
```
- Point this to your n8n workflows base URL. Ensure CORS allows `http://localhost:5173`.
- Required endpoints on n8n:
  - `POST /api/register` → returns `{ token, user }` (auto-login) or success message
  - `POST /api/login` → returns `{ token, user }`
  - `GET /api/stats?period=day|week|month|year`
  - `POST /api/consumption`

## Deploy to Amazon S3
The script `client/scripts/upload-to-s3.sh` builds and uploads:
```bash
cd client
export S3_BUCKET=your-s3-bucket-name
npm run upload
```
Requirements:
- AWS CLI installed and configured with write access to the bucket
- Node.js 20.19+ (as required by Vite)

## Main Folder Structure
```text
client/
  src/
    components/     # Reusable UI (forms, charts, cards)
    context/        # Global state (Auth)
    hooks/          # Custom hooks (useCalorieStats)
    pages/          # App pages (Login, Dashboard)
    services/       # API layer for n8n endpoints
    styles/         # RTL theme + emotion cache
    types/          # Shared TypeScript types
  scripts/          # S3 upload script
```

## Notes
- All UI text is in Hebrew and RTL-aware.
- After login, axios injects `Authorization: Bearer <token>` into requests.
- Data fetching is via `useCalorieStats`, which triggers refresh after adding a meal.
- MUI theme is RTL with a warm green palette and suitable typography (Rubik + Assistant).

Enjoy healthy tracking! 🌿

kdndk34r89icvmds39033