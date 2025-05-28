# GeoBean Application

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm (for local frontend development)

## Quick Start

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd geobean
   ```

2. Start the backend services (database, API, and phpMyAdmin):

   ```bash
   docker-compose up --build
   ```

3. In a new terminal, set up and start the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Available Services

Once the application is running, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Database Management (phpMyAdmin)**: http://localhost:8080
  - Username: `root`
  - Password: `password`

## Development

### Backend

- The backend runs in Docker and auto-reloads when you make changes
- Source code is located in `./backend/src`
- API runs on port 5001

### Frontend

- Built with React + TypeScript
- Development server runs on port 3000
- Available commands:
  ```bash
  npm start    # Start development server
  npm run build # Build for production
  npm run lint  # Run ESLint
  npm run format # Format code with Prettier
  ```

### Database

- MySQL 8.0
- Default database name: `geobean`
- Accessible on port 3306
- Credentials:
  - Root user: `root` / `password`
  - Dev user: `devuser` / `devpass`

## Tech Stack

- **Frontend**: React, TypeScript, Webpack
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL 8.0
- **Tools & DevOps**:
  - Docker and Docker Compose for containerization
  - ESLint and Prettier for code quality
  - phpMyAdmin for database management

## Quick Reference Commands

### Docker Commands

```bash
# Start all services
docker-compose up

# Start all services in detached mode (background)
docker-compose up -d

# Rebuild and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs db

# Remove all containers and volumes
docker-compose down -v
```

### Frontend Commands

```bash
# Install dependencies
cd frontend && npm install

# Start development server
cd frontend && npm start

# Build for production
cd frontend && npm run build

# Run linter
cd frontend && npm run lint

# Format code
cd frontend && npm run format

# Clean install (remove node_modules and reinstall)
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### Combined Quick Start Commands

```bash
# Start everything in one go (run these in separate terminals)
Terminal 1: docker-compose up --build
Terminal 2: cd frontend && npm install && npm start
```
