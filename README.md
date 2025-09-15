# Risk Monitoring System - Starter

This is a starter project for a risk monitoring dashboard (Bybit example).
It includes a backend (Node + Express + MongoDB) and a frontend (React + Vite).

## How to run

### Backend
cd backend
cp .env.example .env
# edit .env to add BYBIT keys + MONGODB_URI
npm install
npm run dev   # or npm start

APIs provided:
GET /api/accounts
GET /api/accounts/:accountId
GET /api/cumulative
GET /api/positions

### Frontend
cd frontend
npm install
# optionally set VITE_API_BASE in .env.local if backend is on different host
npm run dev

Open Vite dev server (default http://localhost:5173)
