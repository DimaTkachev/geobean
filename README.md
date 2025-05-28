# GeoBean Application

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm

## Quick Start

```bash
# 1. Start backend services (first time with build)
docker-compose up -d --build

# 2. Start frontend
cd frontend
npm install
npm start
```

## Access Points

- Frontend: http://localhost:3000
- API: http://localhost:5001 (auto-reloads on changes)
- Database Admin: http://localhost:8080 (root/password)
- Database: localhost:3306 (devuser/devpass)

## Database Info

- Name: geobean
- Root User: root/password
- Dev User: devuser/devpass

## Common Commands

### Backend (Docker)

```bash
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs     # View logs
docker-compose down -v  # Stop and remove volumes
```

### Frontend

```bash
npm start               # Development server (with hot reload)
npm run build          # Production build
npm run lint           # Run linter
npm run format         # Format code
# Clean install (if having dependency issues):
rm -rf node_modules package-lock.json && npm install
```

### DTO Generation

```bash
cd scripts
npm install
npm run generate       # Updates frontend/src/types/dtos.ts
```

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MySQL 8.0
- Tools: Docker, ESLint, Prettier
