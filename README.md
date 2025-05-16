# 📅 Booking Platform Monorepo

A simple and flexible SaaS application that allows professionals to share availability and let users book time slots with them.

Built using:

- **Frontend**: React, Tailwind CSS, shadcn/ui, Firebase Auth, TS-REST
- **Backend**: NestJS, PostgreSQL, Prisma, TS-REST
- **Authentication**: Firebase (Auth only — user data stored in our PostgreSQL database)

---

## ✨ Features

- 🔐 Secure login for all users via Firebase
- 👤 Roles: `OWNER` (manages availability), `USER` (books time slots)
- 🗓️ Recurring weekly availability management
- 🏷️ Customizable slot labels (e.g., "Haircut", "Math Level A", "Consultation")
- 📅 Booking UI with real-time slot validation (no double bookings)
- 🧑‍💻 Each OWNER has a public booking page (`/p/:slug`), but requires login to book
- 📊 Dashboards for both `OWNER`s and regular `USER`s

---

## 🧱 Tech Stack

| Layer      | Stack                                          |
| ---------- | ---------------------------------------------- |
| Frontend   | React, Tailwind CSS, shadcn/ui, TS-REST client |
| Backend    | NestJS, Prisma ORM, PostgreSQL, TS-REST server |
| Auth       | Firebase Authentication (email/password)       |
| API Design | Fully typed end-to-end with TS-REST            |
| Monorepo   | Managed manually (no Nx/Turbo)                 |

---

## 📁 Project Structure

```
/
├── backend/        # NestJS backend with TS-REST and Prisma
├── frontend/       # React frontend using TS-REST client
├── ts-rest.config  # Shared TS-REST configuration
└── README.md       # You're here :)
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/renzobeux/booking-platform.git
cd booking-platform
```

### 2. Environment Setup

Create `.env` files for both `frontend` and `backend` with the appropriate config and database credentials.

#### Example `.env` for `frontend/`

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

#### Example `.env` for `backend/`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

#### Firebase Service Account

You must place your Firebase service account JSON file as `service-account.json` in the project root (next to `backend/`).

> The backend will automatically use this file for Firebase admin authentication. If not found, it will fall back to application default credentials.

---

### 3. Start PostgreSQL

If using Docker, create a `docker-compose.yml`:

```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: booking
    ports:
      - "5432:5432"
```

Then run:

```bash
docker-compose up -d
```

---

## 💻 Running the App

### 1. Install dependencies (from the root)

```bash
pnpm install
```

### 2. Set up the database (from the root)

```bash
pnpm --filter backend prisma generate
pnpm --filter backend prisma migrate dev
```

### 3. Run the backend (from the root)

```bash
pnpm --filter backend dev
```

### 4. Run the frontend (from the root)

```bash
pnpm --filter frontend dev
```

> You can run any script for a specific workspace using `pnpm --filter <workspace> <script>`

---

## 🛡️ Security Notes

- All API routes require Firebase ID token authentication.
- Bookings are validated server-side to prevent overlapping or unauthorized access.
- No public endpoints — even `/p/:slug` booking views require login.

---

## 📌 Future Improvements

- Add payment integration
- Reminder emails
- Class history & notes for OWNERs
- Booking reschedule & cancellation features
- Multi-user organizations (e.g., salons with multiple stylists)

---

## 📝 License

MIT — free to use, modify and deploy.
