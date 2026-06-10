# Task Management API - SaaS Grade Backend

## Overview

This project is a refactored and enhanced Task Management API, transformed into a professional SaaS-grade backend. It is built with Node.js, Express, and MongoDB, incorporating modern backend best practices for security, scalability, and maintainability. This API is suitable for portfolio demonstrations, freelance client projects, startup MVP deployment, production deployment on Railway, technical interviews, and GitHub showcase projects.

## Features

### Existing Features (Preserved & Enhanced)

*   **Authentication:** User registration, login, and current user retrieval.
*   **Workspaces:** Create, list, and view details of workspaces. Add members to workspaces.
*   **Tasks:** Create, list, update, delete, and view details of tasks.

### New Features & Refactors

1.  **Security Hardening:**
    *   `express-validator` implemented across all endpoints for robust input validation.
    *   `express-mongo-sanitize` to prevent MongoDB injection attacks.
    *   `helmet` for setting various HTTP headers to protect against common vulnerabilities.
    *   **Rate Limiting:**
        *   Auth routes: 5 requests/minute.
        *   API routes: 100 requests/15 minutes.
    *   **CORS Security:** Environment-based whitelist using `CLIENT_URL`.
    *   **Request Size Limit:** JSON payloads limited to 10kb.
    *   **JWT Security:** 7-day expiry with strong secret enforcement and centralized authentication middleware.

2.  **Role-Based Access Control (RBAC):**
    *   Roles: `owner`, `admin`, `member`.
    *   Middleware to enforce access based on user roles.

3.  **User Profile Module:**
    *   `GET /api/users/profile`: Retrieve current user profile.
    *   `PUT /api/users/profile`: Update current user profile.
    *   `PUT /api/users/password`: Change user password.
    *   `DELETE /api/users/account`: Delete user account.

4.  **Workspace Management:**
    *   `PUT /api/workspaces/:id`: Update workspace details.
    *   `DELETE /api/workspaces/:id`: Delete a workspace (owner only).
    *   `DELETE /api/workspaces/:id/members/:userId`: Remove a member from a workspace (owner/admin).

5.  **Advanced Task Management:**
    *   `PATCH /api/tasks/:id/status`: Update task status.
    *   `PATCH /api/tasks/:id/assign`: Assign task to a user.
    *   Added `dueDate`, `priority` (low, medium, high), and `status` (todo, in-progress, completed) fields to tasks.

6.  **Task Search, Filtering, and Pagination:**
    *   `GET /api/tasks?search=keyword`: Search tasks by title/description.
    *   `GET /api/tasks?status=completed&priority=high&assignedTo=userId`: Filter tasks.
    *   `GET /api/tasks?page=1&limit=10`: Paginate task results.

7.  **Task Statistics:**
    *   `GET /api/workspaces/:id/stats`: Get task statistics for a workspace (e.g., tasks by status, by priority).

8.  **Audit Logging:**
    *   Tracks key actions: Login, Failed login, Workspace creation/deletion, Member addition/removal, Task creation/deletion.

9.  **Error Handling:**
    *   Centralized error middleware for consistent error responses.

10. **Health Check Endpoint:**
    *   `GET /health`: Provides API status and timestamp.

11. **Database Improvements:**
    *   Indexes added for `email`, `workspaceId`, `status`, `priority`, `assignedTo` for improved query performance.

12. **API Documentation:**
    *   Implemented with Swagger (`swagger-ui-express`, `swagger-jsdoc`).
    *   Exposed at `GET /api/docs`.

13. **Testing:**
    *   Integration tests using Jest and Supertest.
    *   Targeting 80%+ coverage.

## Architecture

The project follows a modular and layered architecture, promoting separation of concerns and maintainability.

```
src/
├── config/             # Database connection, environment setup
├── controllers/        # Request handling logic
├── routes/             # API endpoints definitions
├── models/             # Mongoose schemas and models
├── middlewares/        # Express middleware (auth, security, error handling)
├── validators/         # Input validation schemas
├── services/           # Business logic and reusable functions (e.g., audit logging)
├── utils/              # Utility functions (e.g., token generation)
├── docs/               # Swagger API documentation setup
├── tests/              # Unit and integration tests
├── app.js              # Express application setup, middleware, and route mounting
└── server.js           # Server entry point, database connection, and listener
```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MIKECHITI/task-management-api.git
    cd task-management-api
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory based on `.env.example`.

4.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
    The API will be running at `http://localhost:5000`.

## Environment Variables

Create a `.env` file in the root of your project and add the following:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

*   `PORT`: The port your server will run on.
*   `NODE_ENV`: Environment mode (e.g., `development`, `production`).
*   `MONGO_URI`: Your MongoDB connection string.
*   `JWT_SECRET`: A strong, secret key for JWT signing.
*   `CLIENT_URL`: Comma-separated list of allowed client origins for CORS.

## API Documentation

Access the interactive API documentation (Swagger UI) at `http://localhost:5000/api/docs` when the server is running.

## Railway Deployment Guide

This project is configured for seamless deployment on Railway. Ensure your `.env` variables are set correctly in Railway's environment settings.

1.  **Create a new project on Railway.**
2.  **Connect your GitHub repository.**
3.  **Railway will automatically detect the Node.js project and deploy it.**
4.  **Configure Environment Variables:** Add the variables from your `.env` file to Railway's variables section.
5.  **Add a MongoDB service:** Link a MongoDB service to your project on Railway, and ensure `MONGO_URI` is correctly set.

## Example Requests

(Coming Soon: Detailed `curl` examples and Postman collection will be provided.)

## Example Responses

(Coming Soon: Sample JSON responses for key endpoints will be provided.)

## Running Tests

To run the integration tests:

```bash
pnpm test
```

To run tests with coverage report:

```bash
pnpm run test:coverage
```

## Senior-Level Recommendations

1.  **Containerization (Docker):** For consistent environments across development, testing, and production, containerize the application using Docker. This would involve creating a `Dockerfile` and `docker-compose.yml` for local development with MongoDB.
2.  **Centralized Configuration Management:** For larger deployments, consider using a dedicated configuration management service (e.g., HashiCorp Vault, AWS Secrets Manager) to manage sensitive environment variables more securely than `.env` files.
3.  **Advanced Logging & Monitoring:** Integrate a more robust logging solution (e.g., Winston, Pino) with a log aggregation service (e.g., ELK Stack, Datadog) for better visibility into application health and issues. Implement APM (Application Performance Monitoring) tools.
4.  **Database Sharding & Replication:** For high-traffic applications, plan for MongoDB sharding and replication to ensure high availability and horizontal scalability.
5.  **Caching:** Implement caching mechanisms (e.g., Redis) for frequently accessed data to reduce database load and improve response times.
6.  **CI/CD Pipeline:** Set up a comprehensive CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins) to automate testing, building, and deployment processes, ensuring faster and more reliable releases.
7.  **Input Sanitization beyond `express-mongo-sanitize`:** While `express-mongo-sanitize` handles MongoDB-specific injections, consider a more generic input sanitization library (e.g., `xss-clean`, `dompurify` for HTML content) if the application handles diverse user inputs that could lead to XSS or other injection attacks.
8.  **GraphQL API:** For more flexible data fetching and reduced over-fetching/under-fetching, consider implementing a GraphQL layer on top of the REST API.
9.  **WebSockets for Real-time Updates:** For features like real-time task updates or notifications, integrate WebSockets (e.g., Socket.IO) to provide a more dynamic user experience.
10. **Idempotency for API Calls:** For critical write operations, implement idempotency keys to prevent duplicate processing of requests due to network issues or client retries.
