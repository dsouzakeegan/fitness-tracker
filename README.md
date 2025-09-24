## Fitness Tracker (MERN)

A full-stack fitness tracker built with the MERN stack (MongoDB, Express, React, Node). This repository contains two main folders:

- `backend/` — Express API, database models, Stripe integration and webhook handling
- `frontend/` — React (Vite) single-page application for UI

This README gives an overview of the code layout, environment variables you need to set, how to run the app locally, and some troubleshooting tips.

## Table of Contents

- Project structure
- Requirements
- Environment variables
- Install & run (development)
- Build & run (production)
- API overview
- Project notes & troubleshooting
- Contributing
- License

## Project structure

- `backend/`
  - `src/server.js` — application entry point for the backend
  - `src/config/stripe.config.js` — stripe configuration
  - `src/controllers/` — route handlers (auth, payment, webhook, workouts, progress, roles, subscription, ...)
  - `src/routes/` — API routes (auth.route.js, payment.route.js, webhook.routes.js, etc.)
  - `src/models/` — Mongoose models (user, workout, progress, payment, subscription, role)
  - `src/services/` — business logic and helpers
  - `src/utils/` — logging, validation and small helpers
  - `.env` — backend environment variables (not committed)

- `frontend/`
  - Vite + React app in `src/`
  - `src/components/` — React components (dashboard, stripe components, forms, layout)
  - `src/contexts/StripeContext.jsx` — Stripe context
  - `src/services/` — API / subscription helpers
  - `package.json` — frontend scripts and dependencies
  - `.env` — frontend environment variables (not committed)

## Requirements

- Node.js (v14+ recommended)
- npm (or yarn)
- MongoDB (remote cluster or local)
- A Stripe account for payments & webhooks (if you plan to use payments)

## Environment variables

Place environment variables in `backend/.env` and `frontend/.env` as required. The repository includes example usage across the codebase; below are common placeholders you should set:

Backend (`backend/.env`) — examples (replace values):

- MONGO_URI=your_mongo_connection_string
- JWT_SECRET=your_jwt_secret
- PORT=5000
- CLIENT_URL=http://localhost:5173
- STRIPE_SECRET_KEY=sk_test_...
- STRIPE_WEBHOOK_SECRET=whsec_...

Frontend (`frontend/.env`) — examples:

- VITE_API_URL=http://localhost:5000  # or whatever API URL your backend uses
- VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

Note: Check `backend/src/server.js`, `backend/src/config/stripe.config.js` and `frontend/src/configs/EnvironmentConfig.js` (or similar) for exact variable names referenced by the code.

## Install & run (development)

Open two terminals (one for backend and one for frontend). In each, run:

1) Backend

```cmd
cd backend
npm install
npm run dev   # or `npm start` — check backend/package.json for exact script names
```

2) Frontend

```cmd
cd frontend
npm install
npm run dev   # Vite dev server; port is typically 5173 unless configured otherwise
```

If you want to run them in a single terminal you can use `start` + `cd` with `&&` or use a process manager (tmux, Windows terminal panes, or tools like `concurrently` / `npm-run-all`).

## Build & run (production)

1) Build frontend

```cmd
cd frontend
npm run build
```

2) Serve frontend build with a static server or host it on a CDN. You can also have the Express server serve the frontend build by copying the `dist` output into `backend/public` (or configuring static serving in `server.js`).

3) Start backend

```cmd
cd backend
npm install --production
npm start
```

## API overview

Common top-level endpoints live under the backend `src/routes/` folder. From the repository they include:

- `POST /api/auth` — authentication (signup/login)
- `GET/POST /api/workouts` — workouts endpoints
- `POST /api/progress` — progress tracking
- `POST /api/payment` — payments / subscription
- `POST /api/webhook` — Stripe webhook handler (verify with STRIPE_WEBHOOK_SECRET)
- `GET /api/role` — role management

Refer to the route files in `backend/src/routes/` for exact routes, required body fields and validation rules.

## Stripe & Webhooks

- The backend integrates with Stripe (see `src/config/stripe.config.js`, `stripe-products.js` and `src/controllers/webhook.controller.js`).
- When developing webhooks locally, either use the Stripe CLI to forward webhooks to your local `backend` server or deploy a test server that Stripe can reach.

Example using Stripe CLI (optional):

```cmd
stripe listen --forward-to localhost:5000/api/webhook
```

## Logging

- Logs are stored under `backend/all_logs/` (files such as `all-logs-auth.log`, `all-logs-payment.log`, `all-logs-workout.log`) — check `src/utils/logger.utils.js` for configuration.

## Tests

There are no automated tests included by default. Adding a small test suite (Jest + Supertest for the backend, React Testing Library for frontend) is a recommended next step.

## Troubleshooting

- If the backend won't start, check `backend/.env` and ensure the `MONGO_URI` and any Stripe keys are set.
- If Stripe webhooks aren't processed, verify the webhook secret and that Stripe can reach your server (use Stripe CLI in local dev).
- If CORS errors appear, check the backend's CORS configuration and `CLIENT_URL` or the origin allowed list.

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes and make a pull request

Please follow code style used in the repository and add tests for new behavior when possible.

## License

This project does not include a LICENSE file by default. If you want to make it open source, add a `LICENSE` (for example MIT) in the repository root.

---

If you'd like, I can also:

- add a sample `.env.example` for `backend` and `frontend` showing the exact variable names used in code
- add a simple `Makefile` or top-level `package.json` script to run both frontend and backend concurrently
- generate a Postman collection or small API doc from the route files

Tell me which of those you'd like next and I will add it.
