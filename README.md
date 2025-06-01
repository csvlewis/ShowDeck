# ShowDeck (WIP)

**ShowDeck** is a full-stack web application for TV show tracking and cast exploration. Built with modern web technologies, it allows users to discover shows, track their watching progress, view detailed cast and crew info, and explore upcoming episode schedules.

## 🚧 Project Status

This project is currently under development. Core scaffolding for the frontend and backend is in place. Features will be added incrementally.

## 🧱 Tech Stack

### Frontend

- React + TypeScript
- TailwindCSS
- Redux Toolkit
- React Router

### Backend

- Node.js with Express
- PostgreSQL
- Drizzle ORM

### APIs

- TMDB API (TV metadata, cast, images)

### DevOps

- Vite for frontend dev server
- Docker for local development (planned)
- CI/CD with GitHub Actions (planned)

## 📁 Monorepo Structure

```
showdeck/
├── backend/        # Fastify server and database schema
├── frontend/       # Vite + React app
├── .env            # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- Docker & Docker Compose

### Local Development

1. Clone the repository
2. Install dependencies in both `frontend/` and `backend/`
3. Create a `.env` file with your TMDB API key and database URL
4. Run the database and services (not added yet):
   ```bash
   docker-compose up
   ```
5. Start the frontend and backend dev servers:
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

## 🧪 Upcoming Features

- User authentication
- Episode tracking with notes and ratings
- Actor/crew profiles
- Cast connection explorer
- Upcoming episode calendar
