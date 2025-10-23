# Docker Todo App

A simple todo application built with Node.js, Express, and PostgreSQL, fully containerized with Docker Compose.

## Features

- Simple and clean UI for managing todos
- PostgreSQL database for persistent storage
- Automatic database initialization
- Fully containerized with Docker

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone this repository or navigate to this directory

2. Start the application:
   ```bash
   docker compose up
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

4. Start adding todos!

## Stopping the Application

To stop the application, press `Ctrl+C` in the terminal, then run:
```bash
docker compose down
```

To remove the database volume as well:
```bash
docker compose down -v
```

## Project Structure

```
.
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Node.js app container definition
├── package.json         # Node.js dependencies
├── server.js           # Express server with todo logic
└── README.md           # This file
```

## Environment Variables

The application uses the following default credentials (defined in `docker-compose.yml`):

- Database: `tododb`
- User: `todouser`
- Password: `todopass`

## Ports

- Application: `3000`
- PostgreSQL: `5432`
