## Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)

### Running

1. Start the backend in root folder:

   ```bash
   docker-compose up --build
   ```

2. Start the frontend in another terminal:
   ```bash
   cd frontend
   npm run start
   ```

## urls

Access the application:

Frontend: http://localhost:3000

Backend API: http://localhost:5001

phpMyAdmin: http://localhost:8080 (username: root, password: password)

## Stack

This setup provides a complete full-stack environment with:

Backend: Node.js + Express + MySQL

Frontend: React + Webpack

Development tools: ESLint + Prettier

Containerization: Docker for all services

Database management: phpMyAdmin
