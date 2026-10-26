# ARAN Integrated Technologies — Premium Engineering Website & Portal

A production-ready full-stack web application for **ARAN Integrated Technologies**, specializing in **CCTV Surveillance & Security**, **Solar Power Solutions**, and **Hydraulic Systems & Automation**.

Built with a custom engineering aesthetic combining technical blueprints, glowing orange accents, rich midnight navy backgrounds, smooth Framer Motion animations, a MySQL database backend, and a secure admin portal.

---

## 🏢 Official Business Information (From Business Card)

- **Company Name:** ARAN Integrated Technologies
- **Phone:** `+91 90256 72856`
- **Email:** `aranidts@gmail.com`
- **Address:** `10/264 A3, Kamaraj Nagar North, Pavoorchatram, Tenkasi District, Tamil Nadu 627808`
- **GSTIN:** `33AABPX4889K3ZY`
- **UDYAM Registration:** `TN-37-0063266`
- **WhatsApp Support:** `https://wa.me/919025672856`
- **Operating Hours:** `Monday - Saturday: 9:00 AM - 7:00 PM`

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **React 18+** with **TypeScript** and **Vite**
- **Tailwind CSS** with tailored brand palette:
  - Deep Navy Blue (`#06264D`)
  - Rich Midnight Blue (`#041D3B`)
  - Engineering Orange (`#FF8A00`)
  - Light Gray (`#F3F6FA`)
- **Framer Motion** for staggered entrance, modal transitions, and interactive reveals
- **Lucide React** for consistent industrial icons
- **React Router v6** for client routing
- **React Hook Form + Zod** for client-side validation
- **Axios** with centralized API client

### Backend (`/server`)
- **Node.js** with **Express** & **TypeScript**
- **MySQL 8.0** with **`mysql2/promise`** connection pooling and parameterized queries
- **JWT** (JSON Web Tokens) for admin session authentication
- **bcryptjs** (10 salt rounds) for password hashing
- **Security:** Helmet, CORS, and Express Rate Limiting (dedicated limiters on forms and admin auth)
- **Zod** for server-side request schema validation

---

## 🗄️ MySQL Database Schema

The database `aran_db` contains 8 production-grade tables:

1. **`admins`**: Stores administrative credentials with bcrypt password hashes.
2. **`services`**: Stores core service divisions (CCTV, Solar, Hydraulics), capabilities, and technical specs.
3. **`bookings`**: Stores customer consultation requests with a unique reference code (`ARAN-YYYYMMDD-XXXX`), status (`Pending`, `Contacted`, `Confirmed`, `Completed`, `Cancelled`), appointment date, time slot, and admin notes.
4. **`reviews`**: Stores customer feedback. Submissions default to `pending` moderation and are only shown publicly when approved by an administrator.
5. **`projects`**: Stores representative portfolio installations with categorization, location, and technical specs.
6. **`business_settings`**: Stores editable company phone numbers, address, business hours, and compliance data.
7. **`booking_slots`**: Manages appointment capacity and slot availability.
8. **`audit_logs`**: Immutable security log tracking logins, new bookings, reviews moderated, and configuration changes.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22.15.1)
- **MySQL Server 8.0** running locally on port 3306

### 2. Configure Environment Files

#### Backend (`/server/.env`):
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=aran_db
JWT_SECRET=aran_integrated_tech_super_secure_jwt_secret_2025_engineering
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (`/client/.env`):
```env
VITE_API_URL=/api
```

### 3. Initialize & Seed Database
```powershell
# From the root or inside /server:
cd server
npm install
npm run db:init
npm run db:seed
```
This automatically sets up all 8 tables and seeds verified service divisions, official business card details, and an initial administrator account.

### 4. Start Development Servers

In terminal 1 (Backend API):
```powershell
cd server
npm run dev
# Running on http://localhost:5000
```

In terminal 2 (Frontend Client):
```powershell
cd client
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🔐 Default Admin Portal Credentials

- **URL:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Admin Email:** `admin@aran-tech.com`
- **Password:** `AranAdmin@2025`

*(A one-click "Auto-fill Verified Admin Credentials" button is provided on the login page for convenience).*

### Admin Features:
- **Overview Dashboard:** Live KPI counts for bookings, pending inquiries, reviews to moderate, and projects.
- **Bookings Management:** Search by customer name, phone, or reference code; filter by category/status; update status to `Contacted` or `Confirmed`; log notes.
- **Review Moderation:** Review queue with one-click **Publish Review**, **Reject**, or assign **Verified Client** badge.
- **Project Gallery:** Add new field installations with category, image URL, and technical specifications.
- **Business Settings:** Edit phone, email, address, and business hours directly in MySQL.
- **Audit Logs:** View chronological history of administrative actions.

---

## 📡 REST API Endpoints

### Public Endpoints
- `GET /api/health` — API status and timestamp
- `GET /api/services` — List of all active services
- `GET /api/projects?category=all` — Filtered project portfolio
- `GET /api/reviews` — Approved customer reviews only
- `POST /api/bookings` — Submit a service consultation request
- `GET /api/bookings/track/:ref` — Track booking status by reference code
- `POST /api/reviews` — Submit customer feedback (saved as `pending` moderation)
- `POST /api/contact` — Submit general engineering inquiries
- `GET /api/settings/public` — Official company contact and compliance information

### Admin Endpoints (Require `Authorization: Bearer <token>`)
- `POST /api/admin/auth/login` — Admin login with email and password
- `GET /api/admin/auth/me` — Verify session token
- `GET /api/admin/dashboard` — Live dashboard analytics
- `GET /api/bookings/admin/all` — Searchable and filterable booking records
- `PATCH /api/bookings/admin/:id` — Update booking status and schedule notes
- `DELETE /api/bookings/admin/:id` — Remove booking record
- `GET /api/reviews/admin/all` — List all reviews by status
- `PATCH /api/reviews/admin/:id` — Moderate review (`approved`, `rejected`)
- `DELETE /api/reviews/admin/:id` — Remove review
- `GET /api/projects/admin/all` — List all projects
- `POST /api/projects/admin` — Create project
- `PATCH /api/projects/admin/:id` — Update project
- `DELETE /api/projects/admin/:id` — Delete project
- `GET /api/settings/admin` — Get all settings
- `PATCH /api/settings/admin` — Update settings
- `GET /api/settings/admin/audit-logs` — Activity audit trail

---

## 🧪 Production Build & Validation

Both frontend and backend are configured for production compilation:

```powershell
# Build backend
cd server
npm run build

# Build frontend
cd ../client
npm run build
```

---

## 🛡️ License

Copyright © 2025 ARAN Integrated Technologies. All rights reserved.
