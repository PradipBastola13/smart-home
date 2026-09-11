# Engineering Dev Log

## [2026-09-11] - Milestone 1: Node.js & Express Skeleton Setup

### Objectives Completed
- Initialized dedicated `server/` module with ES Modules (`type: module`).
- Installed core dependencies: `express`, `cors`, `dotenv`, `mongoose`, and dev-dependency `nodemon`.
- Configured environment variables template (`server/.env.example`).
- Implemented `server.js` with Express application, CORS middleware, and base health-check route `GET /`.
- Verified server starts on port 5000 and returns valid JSON response.

### Key Learnings
- **Runtime Model**: Node.js executes JavaScript on the server using non-blocking asynchronous I/O, replacing the multithreaded JVM model in Spring Boot.
- **Middleware Concept**: Express uses a pipeline of functions (`cors()`, `express.json()`) to process incoming requests before reaching route handlers.
- **Configuration**: Environment variables in `.env` replace `application.properties`, keeping configuration decoupled from source code.

### Branch
- Branch: `feat/express-server-skeleton`