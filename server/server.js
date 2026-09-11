import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 1. Load environment variables from .env file
dotenv.config();

// 2. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Configure Global Middleware
// Enables CORS so our React frontend (port 5173) can communicate with this API
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Parses incoming requests with JSON payloads (replaces Jackson ObjectMapper in Spring Boot)
app.use(express.json());

// 4. Base Health-Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Home Node.js API is running",
    timestamp: new Date().toISOString()
  });
});

// 5. Start the Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Server running in development mode`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`=========================================`);
});