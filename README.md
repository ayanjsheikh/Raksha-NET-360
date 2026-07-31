# 🚑 RakshaNet - Unified Emergency & Healthcare Platform

RakshaNet integrates a modern React frontend and FastAPI backend into a single monorepo for seamless emergency response, health tracking, and hospital mapping.

---

## 🏗️ Repository Architecture

```text
Rakshanet/
├── rakshanet_backend/     # Python FastAPI application
│   ├── main.py            # Main API entry point & router setup
│   ├── database/          # SQLite DB configuration & models
│   ├── routes/            # User, SOS, Hospital, Health & Auth routes
│   └── requirements.txt   # Python dependencies
├── rakshanet_frontend/    # React 19 + Vite + TypeScript frontend
│   ├── src/               # UI components, pages & services
│   ├── ai-engine/         # AI models & predictive services
│   └── member4/           # Caregiver & hardware integration modules
├── package.json           # Monorepo root launcher (concurrent execution)
└── .env.example           # Environment template
```

---

## 🚀 Quick Start Guide

### 1. Prerequisite Setup

- **Node.js** (v18+)
- **Python** (v3.9+)

### 2. Install Dependencies

Install root orchestrator tools and frontend packages:
```bash
npm run install:all
```

Install backend Python requirements:
```bash
cd rakshanet_backend
pip install -r requirements.txt
cd ..
```

### 3. Run Monorepo (Frontend + Backend Simultaneously)

From the root directory, simply run:
```bash
npm run dev
```

This starts:
- ⚡ **Backend API**: `http://127.0.0.1:8000` (Swagger docs: `http://127.0.0.1:8000/docs`)
- 💻 **Frontend Web App**: `http://localhost:5173`

---

## 📡 API Endpoints Summary

- `GET /` - Health check & server status
- `POST /api/auth/*` - User authentication & registration
- `POST /api/sos/send` - Send emergency SOS alert
- `GET /api/hospitals/nearby` - Find nearest hospitals
- `GET /api/health/{user_id}` - Health metrics and history
