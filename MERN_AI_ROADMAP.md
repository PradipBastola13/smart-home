# 🏠 Smart Home Automation Simulator: MERN + Python AI Roadmap

A comprehensive, step-by-step implementation guide to evolving the Smart Home platform from **Java Spring Boot** into a modern, decoupled **MERN (MongoDB, Express, React, Node.js)** and **Python AI** architecture.

---

## 🎯 High-Level Vision & Objectives

1. **Keep What Already Works**: Preserve your existing **React 19** frontend and **ESP32** hardware firmware.
2. **Rebuild the Core Backend in JavaScript**: Replace Spring Boot with a lightweight, high-performance **Node.js + Express** server.
3. **Flexible IoT Database**: Transition device persistence to **MongoDB** (using Mongoose).
4. **Add a "Smart Brain" with Python AI**: Build an autonomous **FastAPI** microservice leveraging LLMs (e.g. Gemini API) for natural-language control and predictive automation.
5. **Real-Time Upgrade (Future)**: Evolve from 3-second HTTP polling to sub-20ms **WebSockets (Socket.io)**.

---

## 🏗️ Architecture Comparison

### Current Architecture (Java Monolith)
```text
React 19 (Port 5173) <───HTTP───> Spring Boot (Port 8080) <───JPA───> PostgreSQL 18
                                           ▲
                                           │ HTTP (1s poll / 5s heartbeat)
                                           ▼
                                    ESP32 Hardware
```

### Target Architecture (MERN + Python AI Microservice)
```text
┌────────────────────────────────────────────────────────┐
│         React 19 Dashboard (Port 5173)                 │
│         (Vite + Tailwind CSS + Lucide Icons)           │
└──────────────┬───────────────────────────┬─────────────┘
               │ REST (CRUD / Settings)    │ WebSockets (Instant UI sync)
               ▼                           ▼
┌────────────────────────────────────────────────────────┐
│         Node.js + Express Gateway (Port 5000)          │
│         ├── Express Router (Device REST API)           │
│         ├── Mongoose ODM                               │
│         └── Real-time Event Broadcaster                │
└──────────────┬───────────────────────────┬─────────────┘
               │ Database Queries          │ HTTP (Internal AI Prompts)
               ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│       MongoDB             │ │   Python AI Engine (8000) │
│   (Atlas Cloud / Local)   │ │   FastAPI + Gemini LLM    │
│   • Flexible device docs  │ │   • Natural Language Chat │
│   • Activity logs         │ │   • Habit & Sleep Rules   │
└───────────────────────────┘ └───────────────────────────┘
               ▲
               │ REST (Phase 1) ➔ WebSockets (Phase 6)
               ▼
┌───────────────────────────┐
│   ESP32 Hardware Node     │
│   • Actuator: GPIO 2 LED  │
│   • Future: Relays/Sensors│
└───────────────────────────┘
```

---

## 🗺️ The 6 Implementation Milestones

---

### 📦 Milestone 1: The Node.js & Express Skeleton
> **Goal**: Create an isolated `server/` directory, set up Express, and verify an active HTTP health-check on `http://localhost:5000`.

* [ ] **Step 1.1: Project Initialization**
  * Create a new folder: `server/`.
  * Run `npm init -y` inside `server/` to generate `package.json`.
* [ ] **Step 1.2: Install Core Dependencies**
  * Install runtime dependencies: `npm install express cors dotenv mongoose`.
  * Install development dependency: `npm install -D nodemon` (for hot reloading on file save).
* [ ] **Step 1.3: Create Minimal Server Entrypoint (`server/server.js`)**
  * Initialize Express app.
  * Enable JSON parsing middleware (`express.json()`).
  * Enable CORS middleware (`cors()`) to allow React on `localhost:5173`.
  * Add a health check route: `GET /` ➔ `{ status: "Smart Home API is running" }`.
* [ ] **Step 1.4: Verify Server Execution**
  * Configure `npm run dev` script in `server/package.json`.
  * Start the server and visit `http://localhost:5000` in the browser.

---

### 🗄️ Milestone 2: MongoDB Connection & Data Modeling
> **Goal**: Connect Express to MongoDB using Mongoose, define the `Device` schema, and set up auto-seeding.

* [ ] **Step 2.1: Choose & Configure Database URI**
  * **Option A (Recommended)**: MongoDB Atlas (Free cloud cluster, connection string `mongodb+srv://...`).
  * **Option B**: Local MongoDB Community Server (`mongodb://localhost:27017/smarthome`).
  * Create `server/.env` with `PORT=5000` and `MONGO_URI`.
* [ ] **Step 2.2: Establish Mongoose Database Connection**
  * Import `mongoose` in `server/server.js`.
  * Connect using `mongoose.connect(process.env.MONGO_URI)` with connection error handling.
* [ ] **Step 2.3: Build Device Model (`server/models/Device.js`)**
  * Define Mongoose Schema:
    * `name`: String (e.g. `"Living Room Light"`)
    * `type`: String (e.g. `"Switch"`)
    * `isOn`: Boolean (default: `false`)
    * `lastHeartbeat`: Date (default: `null`)
  * Add a **Virtual Field** `online`:
    * Computed dynamically: `Date.now() - lastHeartbeat < 15000` (matches Spring Boot's dynamic logic).
* [ ] **Step 2.4: Auto-Seeding Logic**
  * If the database collection is empty on startup, automatically seed Device 1 (`"Living Room Light"`).

---

### 🔌 Milestone 3: Building the 4 Core REST Endpoints
> **Goal**: Recreate the exact REST routes expected by both React and ESP32.

* [ ] **Step 3.1: Route Module Setup (`server/routes/deviceRoutes.js`)**
  * Use `express.Router()` and mount it at `/api/devices` in `server.js`.
* [ ] **Step 3.2: `GET /api/devices`**
  * Query MongoDB: `await Device.find()`.
  * Return JSON array including the virtual `online` property.
* [ ] **Step 3.3: `POST /api/devices/:id/toggle`**
  * Find device by ID.
  * Invert state: `device.isOn = !device.isOn`.
  * Save and return the updated device document.
* [ ] **Step 3.4: `GET /api/devices/:id/state` (For ESP32)**
  * Find device by ID.
  * Return raw text response: `"ON"` or `"OFF"`.
* [ ] **Step 3.5: `POST /api/devices/:id/heartbeat` (For ESP32)**
  * Update `lastHeartbeat = new Date()`.
  * Return `{ status: "success", message: "Heartbeat recorded" }`.
* [ ] **Step 3.6: Verify with Browser / Postman**
  * Test all 4 endpoints independently to ensure responses match Spring Boot's format.

---

### 🔗 Milestone 4: Frontend & Hardware Integration
> **Goal**: Switch React and ESP32 to port 5000 and verify the end-to-end loop.

* [ ] **Step 4.1: Update React API Client**
  * In `src/services/api.js`, update `API_BASE_URL` from `http://localhost:8080/api` to `http://localhost:5000/api`.
* [ ] **Step 4.2: Test React Web Dashboard**
  * Open `http://localhost:5173`.
  * Confirm device loads from MongoDB.
  * Click "Turn On" / "Turn Off" and watch state persist in MongoDB.
* [ ] **Step 4.3: Update ESP32 Firmware URL**
  * Update `BACKEND_BASE_URL` in `esp32_smart_home.ino` to point to port `5000`.
  * Upload to ESP32.
  * Verify serial monitor logs: `[Heartbeat] Backend updated` and verify the blue LED responds to React button clicks!

---

### 🧠 Milestone 5: Python AI Service (FastAPI + LLM Copilot)
> **Goal**: Build an intelligent assistant that translates natural language commands into device states.

* [ ] **Step 5.1: Set Up Python AI Microservice (`ai-service/`)**
  * Create `ai-service/` directory.
  * Create Python virtual environment (`venv`).
  * Install dependencies: `fastapi`, `uvicorn`, `google-genai`, `pydantic`.
* [ ] **Step 5.2: Create AI Command Parser Endpoint (`POST /ai/command`)**
  * Use Google Gemini API with **Structured Outputs / Function Calling**.
  * User prompt: *"It's too bright in here, turn off the light"*.
  * LLM output:
    ```json
    {
      "action": "TOGGLE",
      "deviceId": "1",
      "targetState": false,
      "assistantReply": "Turning off the Living Room Light for you."
    }
    ```
* [ ] **Step 5.3: Bridge Express & Python**
  * Add a route in Express: `POST /api/ai/chat` that proxies prompts to Python at `http://localhost:8000/ai/command`.
  * Express executes the returned action on MongoDB and returns the assistant's voice/text reply.
* [ ] **Step 5.4: Add AI Chat Widget in React Dashboard**
  * Add a sleek AI prompt input bar to `Dashboard.jsx`.
  * Type commands in plain English and watch devices physically toggle!

---

### ⚡ Milestone 6: Real-Time WebSockets Upgrade (Future Phase)
> **Goal**: Replace 3-second HTTP polling with sub-20ms real-time event pushing.

* [ ] **Step 6.1: Add Socket.io to Express**
  * Wrap Express server with `http.createServer(app)`.
  * Initialize `new Server(httpServer, { cors: ... })`.
* [ ] **Step 6.2: Connect React Dashboard to Socket.io**
  * Install `socket.io-client` in React.
  * Listen for `device:updated` events to instantly update UI state without polling.
* [ ] **Step 6.3: Upgrade ESP32 to WebSockets (Optional)**
  * Switch ESP32 firmware from HTTP polling to `WebSocketsClient` for instant physical reaction.

---

## 📁 Final Target Project Structure

```text
smart-home/
├── MERN_AI_ROADMAP.md                 <-- This roadmap file
├── README.md
├── start-demo.bat
├── presentation.html
│
├── server/                            <-- Node.js / Express Backend
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── models/
│   │   └── Device.js
│   └── routes/
│       └── deviceRoutes.js
│
├── ai-service/                        <-- Python AI Microservice
│   ├── requirements.txt
│   ├── main.py
│   └── agent.py
│
├── src/                               <-- React Frontend
│   ├── components/
│   ├── pages/
│   ├── services/api.js
│   └── App.jsx
│
├── esp32/                             <-- Microcontroller Firmware
│   └── esp32_smart_home.ino
│
└── backend/                           <-- Original Spring Boot (Preserved for reference)
```

---

## 🚦 How We Proceed

We will tackle this step-by-step. At each stage:
1. You tell me which step to start (e.g. **"Let's do Step 1.1"**).
2. I explain the exact code and concepts.
3. We run and test it together before moving to the next step.
