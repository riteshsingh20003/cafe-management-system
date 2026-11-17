# 🚀 Deployment & DevOps Guide: Cafe Menu & Order Management System

This document outlines everything needed to run, test, and deploy the **Cafe Menu & Order Management System** locally via Docker Compose or in the cloud via Render (Backend) and Vercel (Frontend).

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Local Docker Compose (One-Command Setup)](#2-local-docker-compose-one-command-setup)
3. [Local Development Without Docker](#3-local-development-without-docker)
4. [Backend Deployment on Render](#4-backend-deployment-on-render)
5. [Preventing Render Free-Tier Spin-Downs (Keep-Alive)](#5-preventing-render-free-tier-spin-downs-keep-alive)
6. [Frontend Deployment on Vercel](#6-frontend-deployment-on-vercel)
7. [MongoDB Atlas Setup Guide](#7-mongodb-atlas-setup-guide)
8. [Environment Variables Matrix](#8-environment-variables-matrix)
9. [Troubleshooting & Verification](#9-troubleshooting--verification)

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |       Client Browser        |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v (Port 3000 / Vercel)                        v (Port 5000 / Render)
+-----------------------------+               +-----------------------------+
|    Frontend (React + Vite)  |               |  Backend (Express + Node)   |
|   - Nginx Alpine Container  |               |   - REST API & Swagger UI   |
|   - Single Page App (SPA)   | ------------> |   - In-Memory or MongoDB    |
|   - SPA Fallback Routing    |  HTTP / REST  |   - Health Check & Metrics  |
+-----------------------------+               +--------------+--------------+
                                                             |
                                                             v (Port 27017 / Atlas)
                                              +-----------------------------+
                                              |       MongoDB 7.0           |
                                              |   - Persistent volume data  |
                                              |   - Menu & Orders schema    |
                                              +-----------------------------+
```

---

## 2. Local Docker Compose (One-Command Setup)

The repository provides a unified `docker-compose.yml` that boots MongoDB 7.0, the Express Backend API, and the React Frontend served via Nginx in one command.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Quick Start
From the project root:

```bash
# Build and start all services in foreground
npm run docker:up

# OR start in detached background mode
npm run docker:up:d

# View live streaming logs from all services
npm run docker:logs

# Stop all containers
npm run docker:down
```

### Direct Docker CLI:
```bash
docker compose up --build
```

### Accessing Local Services
| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Application** | [http://localhost:3000](http://localhost:3000) | Responsive React UI served via Nginx |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | Express API endpoints |
| **Backend Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Uptime & database status |
| **Interactive API Docs** | [http://localhost:5000/api/docs](http://localhost:5000/api/docs) | Swagger OpenAPI UI |
| **MongoDB** | `mongodb://localhost:27017/cafe_db` | Database connection |

---

## 3. Local Development Without Docker

Root orchestration scripts support Windows (`npm.cmd` to bypass PowerShell script execution restrictions) and Unix systems:

```bash
# 1. Install dependencies for both backend and frontend
npm run install:all

# 2. Seed initial cafe menu data into database
npm run seed

# 3. Start both backend & frontend concurrently in one terminal
npm run dev
```

Individual service commands:
```bash
# Backend only (http://localhost:5000)
npm run dev:backend

# Frontend only (http://localhost:5173)
npm run dev:frontend

# Production build frontend
npm run build:all
```

---

## 4. Backend Deployment on Render

Render is configured using the included `render.yaml` Blueprint or manually via the Render dashboard.

### Option A: Using Render Blueprints (Recommended)
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), click **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically parse `render.yaml`.
4. Fill in secret environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://your-cafe-app.vercel.app`).
   - `RENDER_EXTERNAL_URL`: Your Render public URL (e.g. `https://cafe-management-api.onrender.com`).
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render, select **New +** -> **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `cafe-management-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `mongodb+srv://...`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `RENDER_EXTERNAL_URL`: `https://cafe-management-api.onrender.com`

---

## 5. Preventing Render Free-Tier Spin-Downs (Keep-Alive)

On Render's Free tier, web services spin down after 15 minutes of inactivity. When a request arrives, users experience a 50-70 second cold-start delay.

### Keep-Alive Solution 1: Built-in Node Cron Self-Pinger (Zero Setup)
The backend includes a self-pinging background job via `node-cron`:
- In your Render service's environment variables, configure:
  ```env
  RENDER_EXTERNAL_URL=https://<your-render-service-name>.onrender.com
  ```
- The backend automatically pings `https://<your-service>/api/health` every 14 minutes, keeping the instance warm.

### Keep-Alive Solution 2: External Health Monitor (Free & Recommended)
Use a free ping monitor to hit your health check endpoint:
1. Go to [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com).
2. Create a new HTTP monitor pointing to:
   ```
   https://<your-service-name>.onrender.com/api/health
   ```
3. Set the interval to **10 minutes** or **14 minutes**.

---

## 6. Frontend Deployment on Vercel

The frontend is optimized for zero-config Vercel deployment with single-page application (SPA) routing in `frontend/vercel.json`.

### Steps:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your repository.
4. Set **Root Directory** to `frontend`.
5. Under **Framework Preset**, verify `Vite` is detected.
6. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://cafe-management-api.onrender.com/api
   ```
7. Click **Deploy**.

### SPA Routing Verification:
The `frontend/vercel.json` rewrites all client-side routes (e.g., `/orders`, `/menu/admin`, etc.) to `/index.html`:
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 7. MongoDB Atlas Setup Guide

If not using local Docker MongoDB, set up a free cloud database on MongoDB Atlas:

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g., `cafe_admin`) with password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so Render can connect.
5. Under **Database** -> **Connect** -> **Drivers**, copy the connection string:
   ```
   mongodb+srv://cafe_admin:<password>@cluster0.abcde.mongodb.net/cafe_management?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your user's password and paste into your `.env` or Render `MONGODB_URI`.

---

## 8. Environment Variables Matrix

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | HTTP port Express listens on | `5000` |
| `NODE_ENV` | Backend | Environment flag | `production` / `development` |
| `MONGODB_URI` | Backend | Connection string to MongoDB | `mongodb://localhost:27017/cafe_db` |
| `CLIENT_URL` | Backend | Allowed CORS origins (comma-delimited) | `http://localhost:3000,http://localhost:5173` |
| `RENDER_EXTERNAL_URL` | Backend | Public Render URL for self-ping cron | `https://cafe-api.onrender.com` |
| `VITE_API_URL` | Frontend | Target backend API base URL | `http://localhost:5000/api` |
| `MONGO_PORT` | Docker | Local port forward for MongoDB | `27017` |
| `BACKEND_PORT` | Docker | Local port forward for Express API | `5000` |
| `FRONTEND_PORT` | Docker | Local port forward for Frontend Nginx | `3000` |

---

## 9. Troubleshooting & Verification

### Test Backend Health Endpoint
```bash
curl -i http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-11-17T10:35:00.000Z"
}
```

### Test Frontend SPA Routing
Navigate directly to a sub-route (e.g. `http://localhost:3000/orders`) or refresh the browser. Nginx's `try_files $uri $uri/ /index.html` ensures the React router receives the route without 404 errors.

### Windows PowerShell Script Execution Policy
If `npm` command fails with `execution of scripts is disabled on this system`, use `npm.cmd` or run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
All repository scripts in `package.json` are pre-configured to use `node scripts/...` which runs natively on Windows without execution policy issues.
