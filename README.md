# Ai-Voice-Receptionist

AI-powered receptionist platform for clinics and service businesses. It handles customer calls, answers business queries, checks availability, and books appointments through a voice-driven workflow backed by a Node.js + Express + Prisma API.

## Overview

This project includes:
- a backend API for businesses, staff, services, customers, appointments, availability, and conversations
- Prisma models for clinic operations
- a seeded database for realistic testing data
- a documentation file for the API contract used by AI flows and integrations

## Project structure

```text
.
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── API.md
│   ├── docker-compose.yml
│   ├── package.json
│   └── prisma.config.ts
├── README.md
├── progress.md
└── .gitignore
```

## Backend API docs

- API reference: [backend/API.md](backend/API.md)

## Getting started

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Start PostgreSQL

```bash
cd backend
docker compose up -d
```

### 3) Configure environment

Copy the example env file and update it with your local database values:

```bash
cd backend
copy .env.example .env
```

### 4) Run Prisma migration and seed

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 5) Start the API

```bash
cd backend
npm run dev
```

The API is served under:

```text
http://localhost:3000/api
```

## Features

- Business management
- Staff and service catalog management
- Customer records
- Appointment scheduling and status tracking
- Availability management by staff and day
- Conversation logs for voice AI interactions
- Pagination and filtering on list endpoints
- Zod request validation
- Centralized API error and response handling

## Tech stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker Compose
- Zod

## Notes

- The project includes a seeded dataset for testing appointment and AI booking workflows.
- The API docs in [backend/API.md](backend/API.md) include request and response examples for each endpoint.
- Progress notes are intentionally kept out of Git tracking via the root ignore file.
