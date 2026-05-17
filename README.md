# Task Management API

A RESTful API for agile teams to manage tasks across shared workspaces. Built with **Node.js**, **Express**, and **MongoDB**.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)

---

## Features

- 🔐 JWT authentication (register, login, protected routes)
- 🗂️ Workspaces — shared team environments
- ✅ Full task CRUD — with status, priority, due dates, and assignees
- 🔍 Query filtering by status, priority, and assignee
- 🛡️ Security — Helmet, CORS, rate limiting (100 req/15min)
- ⚡ Indexed MongoDB queries for performance
- 🧪 Jest + Supertest test suite

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))

### Installation

```bash
git clone https://github.com/MIKECHITI/task-management-api.git
cd task-management-api
npm install
cp .env.example .env   # fill in your values
npm run dev
```

The server starts at `http://localhost:5000`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |

---

## API Endpoints

All protected routes require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive token |
| GET | `/api/auth/me` | Private | Get current user profile |

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Michael Mwombe",
  "email": "michael@example.com",
  "password": "securepassword"
}
```

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "Michael Mwombe", "email": "michael@example.com", "role": "member" }
}
```

---

### Workspaces

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/workspaces` | Private | List my workspaces |
| POST | `/api/workspaces` | Private | Create a workspace |
| GET | `/api/workspaces/:id` | Private | Get a workspace |
| POST | `/api/workspaces/:id/members` | Private (owner) | Add a member |

#### Create Workspace
```http
POST /api/workspaces
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sprint Team Alpha",
  "description": "Q3 product sprint workspace"
}
```

---

### Tasks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/workspaces/:wId/tasks` | Private | List tasks (filterable) |
| POST | `/api/workspaces/:wId/tasks` | Private | Create a task |
| GET | `/api/workspaces/:wId/tasks/:id` | Private | Get a task |
| PUT | `/api/workspaces/:wId/tasks/:id` | Private | Update a task |
| DELETE | `/api/workspaces/:wId/tasks/:id` | Private | Delete a task |

#### Create Task
```http
POST /api/workspaces/64abc123/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement login page",
  "description": "Build responsive login with form validation",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-08-01",
  "assignedTo": "64user456"
}
```

#### Filter Tasks
```
GET /api/workspaces/:wId/tasks?status=in-progress&priority=high
GET /api/workspaces/:wId/tasks?assignedTo=<userId>
```

---

## Data Models

### Task
| Field | Type | Values |
|---|---|---|
| title | String | required, max 100 |
| description | String | optional, max 500 |
| status | Enum | `todo` · `in-progress` · `done` |
| priority | Enum | `low` · `medium` · `high` |
| dueDate | Date | optional |
| assignedTo | ObjectId → User | optional |
| tags | [String] | optional |

---

## Running Tests

```bash
npm test
```

---

## Deployment

Recommended: [Railway](https://railway.app) or [Render](https://render.com) (both have free tiers).

1. Push to GitHub
2. Connect repo to Railway/Render
3. Set environment variables in the dashboard
4. Deploy — done!

---

## Project Structure

```
src/
├── config/       # Database connection
├── controllers/  # Route handler logic
├── middleware/   # Auth, error handling
├── models/       # Mongoose schemas
├── routes/       # Express routers
└── utils/        # JWT helper
tests/            # Jest + Supertest
```

---

Built by [Michael Mwombe](https://mwombemichael.vercel.app)
