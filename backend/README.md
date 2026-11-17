# Cafe Management System - Backend API

Production-ready Node.js, Express, and Mongoose REST API powering the Cafe Menu & Order Management System.

---

## Highlights

- **Complete Menu Catalog CRUD**: Category grouping, text search, price & rating sorting, dietary tagging (Vegetarian, Vegan, Gluten-Free).
- **Tamper-Proof Ordering**: Server-side price resolution, automated 8% tax computation, and standardized tracking codes (`ORD-YYYYMMDD-XXXX`).
- **Live Order Tracking**: Customer-facing live tracking by human-friendly `orderNumber`.
- **Order Lifecycle Management**: Transition orders between `pending` -> `preparing` -> `ready` -> `completed` / `cancelled`.
- **Interactive Swagger Documentation**: OpenAPI 3.0 UI mounted at `/api/docs` and raw spec at `/api/docs.json`.
- **Zero-Setup Resilience / Mock Fallback**: If MongoDB Atlas credentials are not yet configured or offline, the server continues running smoothly using an in-memory Mock Store pre-loaded with 20 items.
- **Render Keep-Alive Cron**: Automatic background ping every 14 minutes to prevent Render free-tier instances from idling.

---

## Quick Start

### 1. Install Dependencies
> **Note (Windows)**: Always use `npm.cmd` on Windows.
```bash
cd backend
npm.cmd install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cafe_management?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173,http://localhost:3000
RENDER_EXTERNAL_URL=
```

### 3. Start Development Server
```bash
npm.cmd run dev
```
The server will boot at `http://localhost:5000`.

### 4. Interactive Swagger Documentation
Open in browser:
- **Interactive UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **OpenAPI JSON**: [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)

### 5. Automated Verification Test
Run the end-to-end endpoint verification suite:
```bash
npm.cmd test
```

### 6. Seed Database
To populate MongoDB Atlas with 20 curated cafe menu items:
```bash
npm.cmd run seed
```

---

## API Endpoints Reference

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status, version, and route index |
| `GET` | `/api/health` | Uptime, timestamp, and database connection status |
| `GET` | `/api/docs` | Swagger UI documentation |
| `GET` | `/api/docs.json` | OpenAPI 3.0 specification JSON |

### Menu (`/api/menu`)
| Method | Endpoint | Query / Body Params | Description |
|--------|----------|---------------------|-------------|
| `GET` | `/api/menu` | `?category=&search=&sortBy=&availableOnly=` | Fetch menu items with filter/search/sort |
| `GET` | `/api/menu/categories` | None | Fetch categories with item counts |
| `GET` | `/api/menu/:id` | `id` (Mongo ObjectId) | Get single menu item |
| `POST` | `/api/menu` | JSON payload (validated) | Create new menu item |
| `PUT` | `/api/menu/:id` | JSON payload (validated) | Update existing menu item |
| `DELETE` | `/api/menu/:id` | `id` (Mongo ObjectId) | Delete menu item |

### Orders (`/api/orders`)
| Method | Endpoint | Query / Body Params | Description |
|--------|----------|---------------------|-------------|
| `POST` | `/api/orders` | `customerName`, `customerPhone`, `items`, `tableNumber`, `orderType`, `notes` | Place customer order |
| `GET` | `/api/orders` | `?status=&phone=&date=` | List orders (sorted newest first) |
| `GET` | `/api/orders/:id` | `id` (Mongo ObjectId) | Get order by ID |
| `GET` | `/api/orders/track/:orderNumber` | `orderNumber` (e.g. `ORD-20261117-1234`) | Customer live tracking |
| `PATCH` | `/api/orders/:id/status` | `{ "status": "preparing" }` | Update order status |

---

## Project Structure

```
backend/
├── config/
│   ├── db.js             # Mongoose connection & fallback detection
│   └── swagger.js        # Swagger UI & OpenAPI 3.0 specification
├── controllers/
│   ├── menuController.js # Menu listing, filtering, search, CRUD
│   └── orderController.js# Order placement, price calculation, status
├── cron/
│   └── keepAlive.js      # 14-min cron job for Render free instance
├── data/
│   └── seedData.js       # 20 curated realistic menu items with Unsplash images
├── middleware/
│   ├── errorHandler.js   # 404 handler and central error formatter
│   └── validator.js      # express-validator schemas for Menu & Orders
├── models/
│   ├── MenuItem.js       # Mongoose Schema for Menu Items
│   └── Order.js          # Mongoose Schema for Customer Orders
├── routes/
│   ├── menuRoutes.js     # /api/menu routes
│   └── orderRoutes.js    # /api/orders routes
├── scripts/
│   ├── seed.js           # Database seeder script
│   └── verify.js         # End-to-end API test verification runner
├── services/
│   └── mockStore.js      # In-memory mock store for offline / dev resilience
├── .env                  # Local environment file
├── .env.example          # Environment template
├── package.json
└── server.js             # Application entrypoint
```
