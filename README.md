# The Smart Grid Home: IoT-Based Dynamic Load Shedding for Solar Efficiency

A full-stack MERN demo project that simulates a smart home energy system. It monitors solar generation, battery SOC, and load demand; then applies dynamic load shedding by priority to reduce grid dependence.

## Features
- JWT-based authentication (Admin/User)
- Real-time energy updates over WebSocket
- Automatic load shedding (Low -> Medium priority)
- Admin manual override of load relays
- Historical trend chart for solar/demand/battery
- MongoDB persistence for users, loads, energy logs, and load action logs

## Tech Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO
- **Frontend:** React, React-Bootstrap, Recharts
- **Simulation:** Node.js IoT simulator logic

## Project Structure
```
smart-grid-home/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── frontend/
│   └── src/
├── simulation/
│   └── iotSimulator.js
└── sample-data/
```

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/energy/live`
- `GET /api/energy/history`
- `POST /api/load/control` (admin only)
- `GET /api/load/history`

## Setup
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

### Demo credentials
- Email: `admin@smartgrid.com`
- Password: `admin123`

## Load Shedding Logic Summary
1. Read current solar output and battery SOC.
2. Compute total active load demand.
3. If demand exceeds (solar + battery support), shed low priority loads first.
4. If still insufficient, shed medium loads.
5. Keep critical/high loads running.
6. Log every action with timestamp and reason.

## Viva Notes
- The simulator is intentionally simple and heavily commented for explanation.
- `manualOverride` prevents automated logic from immediately reversing an admin decision.
- You can tune `SIMULATION_TICK_MS` for faster/slower updates.
