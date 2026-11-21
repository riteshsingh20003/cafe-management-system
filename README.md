# ☕ AromaCraft Cafe — Full-Stack Cafe Management System

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?logo=react&logoColor=black)](#tech-stack)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](#docker-setup)

A full-stack **MERN** application for cafe menu browsing, QR-based dine-in ordering, and kitchen order management — built entirely by me as a personal project.

**Customers** scan a table QR code, browse the menu, add items to cart, and place orders using just their phone number — no sign-up needed. **Staff** manage orders through a 4-stage kitchen pipeline and perform full menu CRUD from a dedicated dashboard.

---

## 🌐 Live Demo

| Component | Link |
| :--- | :--- |
| **Frontend** (Vercel) | [aromacraft-cafe.vercel.app](https://cafe-management-system-gamma-neon.vercel.app/) |
| **Backend API** (Render) | [aromacraft-api.onrender.com](https://aromacraft-api.onrender.com) |
| **Swagger API Docs** | [/api/docs](https://aromacraft-api.onrender.com/api/docs) |
| **Health Check** | [/api/health](https://aromacraft-api.onrender.com/api/health) |

---

## ✨ Key Features

**Customer Side**
- QR code table scanning — auto-assigns dine-in table
- Real-time menu search, category filtering, and dietary badges (Veg / Vegan / GF)
- Interactive cart with live tax & total calculation
- Guest checkout with phone number — no account required
- Live order tracking with a 4-stage progress stepper

**Staff / Kitchen Side**
- Live orders queue with status transitions (Pending → Preparing → Ready → Completed)
- Full menu CRUD — add, edit, delete items and toggle availability
- Daily revenue stats and order counts

**Backend & DevOps**
- RESTful API with input validation (express-validator)
- Interactive Swagger/OpenAPI 3.0 docs at `/api/docs`
- MongoDB Atlas with Mongoose schemas; graceful in-memory fallback if DB is unavailable
- Keep-alive cron job for Render free-tier
- Dockerized with `docker-compose` — single-command full-stack startup
- Deployed: Frontend on Vercel, Backend on Render

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js, Mongoose, express-validator, Swagger UI |
| **Database** | MongoDB Atlas (with in-memory fallback) |
| **DevOps** | Docker, Docker Compose, Nginx, Vercel, Render |

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/riteshsingh20003/cafe-management-system.git
cd cafe-management-system

# 2. Install dependencies
npm run install:all

# 3. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env with your MongoDB URI (or leave blank for mock mode)

# 4. Seed the database (optional)
npm run seed

# 5. Run both servers
npm run dev
```

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/api/docs |

---

## 🐳 Docker Setup

```bash
docker compose up --build
```

Starts MongoDB, the Express API, and the React frontend (via Nginx) together.

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## 📖 API Overview

All endpoints are documented interactively at `/api/docs`.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/menu` | Fetch menu items (filter, search, sort) |
| `GET` | `/api/menu/categories` | List categories with counts |
| `POST` | `/api/menu` | Create a menu item |
| `PUT` | `/api/menu/:id` | Update a menu item |
| `DELETE` | `/api/menu/:id` | Delete a menu item |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | List orders (filter by status/phone) |
| `GET` | `/api/orders/track/:orderNumber` | Track order by order number |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `GET` | `/api/health` | Server health & DB status |

---

## 📁 Project Structure

```
cafe-management-system/
├── backend/              # Express.js REST API
│   ├── controllers/      # Menu & Order business logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── middleware/        # Validation & error handling
│   ├── config/           # DB connection & Swagger setup
│   ├── cron/             # Keep-alive scheduler
│   ├── data/             # Seed data (20 menu items)
│   └── server.js         # App entry point
│
├── frontend/             # React 19 + Vite + Tailwind CSS
│   └── src/
│       ├── components/   # UI components (Cart, Checkout, Menu, Staff Dashboard, etc.)
│       ├── context/      # Cart & Toast state management
│       └── services/     # API client with mock fallback
│
├── scripts/              # Cross-platform dev scripts
├── docker-compose.yml    # Full-stack Docker orchestration
└── render.yaml           # Render deployment blueprint
