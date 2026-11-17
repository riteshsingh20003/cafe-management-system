# AromaCraft Cafe & Roastery — Frontend Application

Modern, high-performance customer ordering experience and staff kitchen management system built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## ✨ Features

### 1. Customer Ordering & QR Code Dine-in Experience
- **Artisan Branding:** Warm aesthetic palette with custom serif & sans typography, coffee bean iconography, and ambient glassmorphic elements.
- **Table QR Dine-in & Takeaway:**
  - Dynamic table assignment via query param (`?table=4`) or manual selection (Tables 1–15).
  - Simulated interactive QR Code visual generator and camera scanner.
  - No customer login required — customers simply provide their name and phone number at checkout for frictionless ordering.
- **Catalog Browsing & Live Filtering:**
  - Category tabs: *All, Coffee, Tea & Beverages, Bakery & Pastries, Breakfast & Brunch, Sandwiches & Savory, Desserts*.
  - Live real-time search with instant clear button.
  - Sorting: *Recommended, Price: Low to High, Price: High to Low, Highest Rated, Prep Time: Quickest*.
  - Dietary chips: *Vegetarian, Vegan, Gluten-Free*.
  - Item cards: high-res visuals, dietary pills, rating stars, prep time badges, quick view modal, and animated in-cart quantity controls.

### 2. Real-Time Shopping Cart & Totals
- Slide-out cart drawer with live badge counter.
- Automated instant calculations:
  - Subtotal
  - Tax (5% Cafe GST)
  - Total Payable
  - Estimated kitchen preparation time
- Persistent storage in `localStorage` so customer selections are never lost on reload.

### 3. Frictionless Checkout & Order Confirmation
- Direct modal form:
  - Customer Full Name
  - Phone Number (with input validation)
  - Dine-in vs Takeaway selector
  - Special preparation requests / dietary notes
- Confirmation screen:
  - Unique order number (e.g. `ORD-20261117-1011`).
  - Itemized receipt breakdown.
  - Live progress stepper: `[Placed] -> [Preparing] -> [Ready] -> [Completed]`.

### 4. Real-Time Customer Order Tracker
- Dedicated tracking modal searchable by **Order Number** or **Customer Phone Number**.
- Live polling and refresh for instantaneous status updates.

### 5. Staff & Kitchen Management Portal
- Switch between **Customer Menu** and **Staff Portal** with a single click.
- **Live Orders Management:**
  - Filter orders by status (*Pending, Preparing, Ready, Completed*).
  - One-click status advances:
    - `[Start Preparing]`
    - `[Mark Ready for Table]`
    - `[Mark Delivered / Served]`
    - Cancel order option.
  - Live dashboard cards: Today's Revenue, Active Kitchen Orders, Ready for Table, Total Orders.
- **Menu Catalog Management:**
  - View all menu items in an interactive table.
  - One-click instant **Availability Toggle** (*In Stock* vs *Sold Out*).
  - **Add New Item** modal with complete field inputs.
  - **Edit Item** modal.
  - **Delete Item** with confirmation dialog.

### 6. Seamless Backend Integration & Graceful Fallback
- Connects to backend API endpoints (`http://localhost:5000/api`).
- Built-in graceful offline/mock fallback: if the backend server is temporarily disconnected or still spinning up, the frontend automatically falls back to an enriched local storage state, ensuring 100% functionality and a flawless demo presentation without crashes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
Test table deep linking: `http://localhost:5173/?table=7`

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                # Header, branding, table badge, cart trigger, staff switch
│   │   ├── MenuSection.jsx           # Categories, search, dietary filters, item grid
│   │   ├── MenuItemCard.jsx          # Food & drink card with add/quantity controls
│   │   ├── ItemQuickViewModal.jsx    # Expanded dish view & quantity selector
│   │   ├── CartDrawer.jsx            # Slide-out drawer with pricing breakdown
│   │   ├── CheckoutModal.jsx         # Guest checkout form (name, phone, table)
│   │   ├── OrderConfirmationModal.jsx# Order receipt & live preparation stepper
│   │   ├── OrderTrackerModal.jsx     # Order lookup & real-time tracker
│   │   ├── QrTableModal.jsx          # Table selector & simulated QR generator/scanner
│   │   ├── StaffDashboard.jsx        # Kitchen dispatch & menu CRUD dashboard
│   │   └── Footer.jsx                # Cafe hours, location, navigation
│   ├── context/
│   │   ├── CartContext.jsx           # Global shopping cart & table state
│   │   └── ToastContext.jsx          # Non-blocking notification toasts
│   ├── data/
│   │   └── defaultMenu.js            # Curated catalog of 20 artisan items
│   ├── services/
│   │   └── api.js                    # API client with automatic offline fallback
│   ├── App.jsx                       # Main application shell
│   ├── index.css                     # Tailwind directives & warm cafe themes
│   └── main.jsx                      # React 19 entry point
├── .env.example
├── tailwind.config.js
├── vercel.json
└── package.json
```
