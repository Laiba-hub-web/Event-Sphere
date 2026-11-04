# EventSphere Management

> **Enterprise-Grade MERN Stack Platform for Large-Scale Expos and Industrial Trade Shows**  
> Developed in alignment with the **Aptech eProject** specifications and functional requirements.

---

## 📌 Project Overview

**EventSphere Management** revolutionizes the traditional expo experience by replacing disjointed paper workflows and fragmented communication with an integrated, synchronous digital system. It provides role-tailored portals for **Event Organizers / Admins**, **Exhibitors**, and **Attendees**, complete with interactive floor plans, real-time messaging, digital QR passes, and comprehensive analytics.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, React Router v6, React Hook Form, Recharts, Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js, Socket.io (WebSocket real-time chat), Multer, Nodemailer |
| **Database** | MongoDB with Mongoose ODM (Schemas, Compound Indexes, Hooks) |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js password hashing, Role-based route guards |

---

## 👥 Three Core User Portals

### 1. 🛡️ Organizer / Admin Portal
- **Expo Lifecycle Management**: Create, publish, modify, or archive trade show events with date ranges, themes, venues, and descriptions.
- **Interactive Floor Plan Designer**: Visual booth grid (A-1, A-2... B-1...) with automatic generation, sizing (Small, Medium, Large), pricing, and manual exhibitor allocation.
- **Exhibitor Review Workflow**: Inspect company applications, review product lists and contact details, approve or reject with custom feedback.
- **Schedule Manager**: Create keynote sessions, panel discussions, and workshops; assign speakers, locations, time windows, and attendee seating limits.
- **Analytics & Reporting**: Interactive Recharts dashboards featuring registration growth curves, booth occupancy rates, and session popularity leaderboards.

### 2. 🏪 Exhibitor Portal
- **Profile Showcase**: Configure company branding, pitch summaries, exhibited products, services, website, and direct contact details.
- **Expo Application**: Submit applications to exhibit at published trade shows.
- **Interactive Booth Selection**: View live floor plans; select, reserve, or release exhibition booth spaces.
- **Direct Messaging**: Real-time communication with event organizers and fellow exhibitors for collaboration.

### 3. 🎟️ Attendee Portal
- **Discovery & Search**: Browse published expos with search filtering by title, city, or industrial theme.
- **One-Click Event Pass**: Instant registration with personalized digital badges and unique QR pass codes.
- **Itinerary & Bookmarking**: Bookmark keynote sessions of interest with live seat count tracking.
- **Direct Chat & Reviews**: Send real-time inquiries directly to exhibitors and submit post-event feedback ratings.

---

## 🔑 Pre-Configured Demo Accounts

Run `npm run seed` or double-click `seed-database.bat` to automatically populate the database with these accounts and sample events:

| Role | Email | Password | Pre-configured Data |
|---|---|---|---|
| **Admin / Organizer** | `admin@eventsphere.com` | `Admin123!` | 2 published expos, full floor plan allocations |
| **Exhibitor** | `exhibitor@techcorp.com` | `Exhibitor123!` | Company: *TechCorp Autonomous Systems*, Booth A-1 |
| **Attendee** | `attendee@eventsphere.com` | `Attendee123!` | Registered for Expo 1, bookmarked AI keynotes |

> 💡 **Quick Login**: The Sign-In screen contains quick demo buttons to auto-fill credentials for each role in 1 click!

---

## 🚀 Getting Started & Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server on `mongodb://localhost:27017` or MongoDB Atlas URI in `backend/.env`)

### Method 1: Using Windows Batch Launchers (Recommended)
1. **Seed Sample Data**: Double-click `seed-database.bat`
2. **Start Backend API**: Double-click `start-backend.bat` (runs on `http://localhost:5000`)
3. **Start Frontend Client**: Double-click `start-frontend.bat` (opens `http://localhost:5173`)

### Method 2: Command Line (PowerShell / Terminal)
```bash
# 1. Seed Database with sample events & users
cd backend
node seed.js

# 2. Run Backend Server
npm run dev

# 3. In a separate terminal, run Frontend
cd ../frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 REST API Reference Summary

### Authentication (`/api/auth`)
- `POST /register` — Register user with chosen role (`admin`, `exhibitor`, `attendee`)
- `POST /login` — Authenticate and receive JWT
- `GET /me` — Current authenticated user profile
- `POST /forgot-password` — Generate reset token & send instructions
- `PUT /reset-password/:token` — Set new password
- `PUT /profile` — Update name, email, or avatar
- `PUT /change-password` — Change password securely

### Expos (`/api/expos`)
- `GET /` — List expos (attendees see published; admins see all)
- `GET /:id` — Detailed expo profile
- `POST /` — Create expo & auto-generate booth grid *(Admin)*
- `PUT /:id` — Edit expo details *(Admin)*
- `DELETE /:id` — Delete expo & cascade cleanups *(Admin)*
- `GET /:id/stats` — Quick stats summary *(Admin)*

### Booths (`/api/booths`)
- `GET /expo/:expoId` — Fetch all booth cells for an event floor plan
- `GET /:id` — Single booth details
- `PUT /:id` — Update booth specifications (size, price, notes) *(Admin)*
- `POST /:id/reserve` — Reserve booth space *(Exhibitor)*
- `POST /:id/release` — Release booth back to available *(Exhibitor / Admin)*
- `POST /:id/assign` — Assign booth directly to exhibitor *(Admin)*

### Exhibitors (`/api/exhibitors`)
- `POST /apply/:expoId` — Submit company application *(Exhibitor)*
- `GET /my-applications` — View personal applications *(Exhibitor)*
- `GET /expo/:expoId/applications` — View applications for event *(Admin)*
- `PUT /:id/approve` — Approve application *(Admin)*
- `PUT /:id/reject` — Reject application with reason *(Admin)*
- `GET /profile` & `PUT /profile` — Company profile management

### Sessions & Agendas (`/api/sessions`)
- `GET /expo/:expoId` — Sessions list for an expo
- `POST /` — Create session *(Admin)*
- `PUT /:id` — Edit session *(Admin)*
- `DELETE /:id` — Delete session *(Admin)*
- `POST /:id/bookmark` — Bookmark session *(Attendee)*
- `DELETE /:id/bookmark` — Remove bookmark *(Attendee)*
- `GET /my-bookmarks` — Personal itinerary *(Attendee)*

### Registrations (`/api/registrations`)
- `POST /expo/:expoId` — Register for expo with QR pass generation
- `DELETE /expo/:expoId` — Cancel registration
- `GET /my` — Attendee's passes
- `GET /check/:expoId` — Check registration status

### Real-Time Messaging (`/api/messages` & Socket.io)
- `GET /conversations` — Active conversation partners with unread counts
- `GET /thread/:userId` — Full chronological message history
- `POST /` — Send message (also emitted via Socket.io event `sendMessage`)
- `PUT /read/:userId` — Mark thread as read

### Analytics & Feedback (`/api/analytics` & `/api/feedback`)
- `GET /analytics/expo/:expoId` — Occupancy rate, total signups, KPIs
- `GET /analytics/expo/:expoId/registrations` — Signups over time (for LineChart)
- `GET /analytics/expo/:expoId/sessions` — Attendance distribution (for BarChart)
- `GET /analytics/expo/:expoId/booths` — Utilization breakdown (for PieChart)
- `POST /feedback` — Submit event rating & reviews (1 to 5 stars)
- `GET /feedback/expo/:expoId` — Public / admin review list

---

## 🧪 Build & Quality Verification

- **Backend syntax**: Verified clean with `node --check`
- **Frontend production bundle**: Built cleanly via Vite (`npm run build`) with zero TypeScript/JSX errors
- **Security**: Passwords hashed with Bcrypt (10 salt rounds), JWT authentication middleware, parameterized queries via Mongoose to prevent NoSQL injection.

