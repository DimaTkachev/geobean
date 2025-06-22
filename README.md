# GeoBean Application

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm

## Quick Start

```bash
# 🚀 Start everything with internet access (recommended)
npm start

# 🛑 Stop everything
npm stop
```

**That's it!** The `npm start` command will:

- Start Backend + Database (Docker)
- Start Frontend development server
- Create internet tunnels automatically
- Show all access URLs and tunnel password

### Manual Setup (alternative)

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

## Main Commands

```bash
# 🚀 Application
npm start                # Start full application + internet tunnels
npm stop                 # Stop everything

# 🌐 Internet Access (manual)
npm run tunnel:start     # Start tunnels only (if app already running)
npm run tunnel:stop      # Close internet access only

# 🔧 Development
npm run lint             # Run linter
npm run build            # Production build
npm run backend:only     # Start only backend (for development)
```

## Advanced Commands

### Backend (Docker)

```bash
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs     # View logs
docker-compose down -v  # Stop and remove volumes
docker-compose exec backend npm run migrate  # Run migrations
```

### Frontend (Manual)

```bash
cd frontend
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

## Internet Access (Tunnels)

### Quick Tunnel Commands

```bash
# 🚀 Start tunnels for internet access
npm run tunnel:start

# 🛑 Stop all tunnels
npm run tunnel:stop
```

### Manual Tunnel Setup

```bash
# Install LocalTunnel globally
sudo npm install -g localtunnel

# Start individual tunnels
lt --port 5001 --subdomain geobean-api    # Backend API
lt --port 3000                            # Frontend (random URL)

# Stop tunnels
pkill -f "lt --port"
```

### Access Points

- **🌐 Internet:** Via tunnel URLs (shown after `npm run tunnel:start`)
- **🏠 Local:** http://localhost:3000
- **📱 Wi-Fi Network:** http://[YOUR_IP]:3000

### Alternative: ngrok (requires signup)

```bash
# Install ngrok
brew install ngrok

# Setup (one time)
ngrok config add-authtoken YOUR_TOKEN

# Start tunnels
ngrok http 3000    # Frontend
ngrok http 5001    # Backend API
```

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MySQL 8.0
- Tunnels: LocalTunnel, ngrok
- Tools: Docker, ESLint, Prettier
