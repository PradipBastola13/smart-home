# Smart Home Automation Simulator 🏠⚡

An end-to-end full-stack IoT platform for smart home appliance monitoring, local automation simulation, and physical hardware control.

---

## 🌟 System Architecture

```text
+-------------------------------------------------------------+
|                     HOST MACHINE                            |
|                                                             |
|   +-------------------+              +------------------+   |
|   |  React Dashboard  | <---REST---> |   Spring Boot    |   |
|   |    (Port 5173)    |    (JSON)    |   (Port 8080)    |   |
|   +-------------------+              +--------+---------+   |
|                                               |             |
|                                        Spring Data JPA      |
|                                               |             |
|                                      +--------v---------+   |
|                                      |  PostgreSQL 18   |   |
|                                      |   (Port 5432)    |   |
|                                      +------------------+   |
+-----------------------------------------------+-------------+
                                                ^
                                      REST / Plain Text
                                      (Wi-Fi 2.4 GHz)
                                                v
                                       +------------------+
                                       | ESP32 DevKit v1  |
                                       |   (Actuator:     |
                                       |   GPIO 2 LED)    |
                                       +------------------+
```

### Port Allocation & Networking
* **React Dashboard**: Runs on `http://localhost:5173` (Vite dev server)
* **Spring Boot API**: Runs on `http://localhost:8080` (Embedded Tomcat)
* **PostgreSQL Database**: Windows Service on `localhost:5432` (Database: `smarthome`)
* **ESP32 Hardware Node**: Standalone device on local 2.4 GHz Wi-Fi acting as an **HTTP Client** communicating directly with the backend at `http://<HOST_IP>:8080`.

---

## 🚀 Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons
* **Backend**: Java 21+, Spring Boot 3.4 / 4.x, Spring Data JPA, Hibernate, Maven
* **Database**: PostgreSQL 18
* **Hardware Firmware**: ESP32 DevKit v1, C++ (Arduino Framework), `WiFi.h`, `HTTPClient.h`

---

## 📂 Project Structure

```text
smart-home/
├── backend/                             # Java Spring Boot REST API
│   ├── src/main/java/com/smarthome/backend/
│   │   ├── config/CorsConfig.java       # CORS configuration for localhost:5173
│   │   ├── controller/DeviceController.java # REST endpoints
│   │   ├── model/Device.java            # JPA Entity & dynamic liveness logic
│   │   ├── repository/DeviceRepository.java # Spring Data JPA repository
│   │   └── service/DeviceService.java   # Business logic & auto-seeding
│   ├── src/main/resources/application.properties # DB connection config
│   ├── pom.xml
│   └── mvnw.cmd
├── src/                                 # React Frontend (Vite)
│   ├── components/                      # Reusable UI components (DeviceCard, etc.)
│   ├── pages/                           # Dashboard & Devices views
│   ├── services/api.js                  # Axios/Fetch API client
│   └── App.jsx
├── esp32/                               # Microcontroller Firmware
│   └── esp32_smart_home.ino             # Arduino sketch for ESP32 DevKit v1
├── presentation.html                    # Interactive Project Defence Presentation
├── start-demo.bat                       # One-click startup script (Backend + Frontend)
├── package.json
└── README.md
```

---

## ⚡ Quick Start / Running the Project

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL 18 is running on port 5432 and create the database:
```sql
CREATE DATABASE smarthome;
```
*(Credentials can be configured in `backend/src/main/resources/application.properties`)*

### 2. One-Click Launch (Windows)
Double-click `start-demo.bat` in the project root. This opens two terminal windows:
* One for the **Spring Boot backend** on `localhost:8080`
* One for the **React frontend** on `localhost:5173`

### 3. Manual Launch

**Start Backend**:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Start Frontend**:
```powershell
npm install
npm run dev
```

### 4. Flash ESP32 Firmware
1. Open `esp32/esp32_smart_home.ino` in the Arduino IDE.
2. Select board **DOIT ESP32 DEVKIT V1** (or ESP32 Dev Module).
3. Set your 2.4 GHz Wi-Fi SSID and Password.
4. Set `BACKEND_BASE_URL` to your laptop's local IP (e.g., `http://192.168.1.73:8080/api/devices/1`).
5. Upload to your ESP32 board over USB.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/devices` | Returns JSON array of all registered devices with live online status |
| `GET` | `/api/devices/{id}` | Returns single device JSON object |
| `POST` | `/api/devices/{id}/toggle` | Toggles device state (`isOn: true/false`) in database |
| `GET` | `/api/devices/{id}/state` | Returns raw plain-text `"ON"` or `"OFF"` (optimized for ESP32) |
| `POST` | `/api/devices/{id}/heartbeat` | Updates `last_heartbeat` timestamp to keep device **Online** |

---

## 📊 Presentation Deck
Open `presentation.html` in any web browser to view the interactive presentation deck designed with 20px+ projector typography, architectural Mermaid diagrams, and navigation controls.
