#include <WiFi.h>
#include <HTTPClient.h>

// ================= USER WI-FI SETTINGS =================
// Note: ESP32 only supports 2.4 GHz Wi-Fi networks
const char* WIFI_SSID     = "YOUR_WIFI_SSID";       
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   

// ================= BACKEND CONFIGURATION =================
// Replace with your laptop's local Wi-Fi IP address on Port 8080
const char* BACKEND_BASE_URL = "http://10.27.196.2:8080/api/devices/1";

// Pin Configuration:
// GPIO 2 is the built-in Blue LED on ESP32 DevKit v1
const int OUTPUT_PIN = 2;

// Set to true for standard Active-HIGH Relay or Built-in LED
// (Set to false if you use an Active-LOW Relay module)
const bool ACTIVE_HIGH = true;

// Timing configuration (non-blocking using millis)
unsigned long lastPollTime      = 0;
const unsigned long POLL_INTERVAL      = 1000; // Poll state every 1 second

unsigned long lastHeartbeatTime = 0;
const unsigned long HEARTBEAT_INTERVAL = 5000; // Send heartbeat every 5 seconds

void setOutputState(bool turnOn) {
  if (ACTIVE_HIGH) {
    digitalWrite(OUTPUT_PIN, turnOn ? HIGH : LOW);
  } else {
    digitalWrite(OUTPUT_PIN, turnOn ? LOW : HIGH);
  }
}

void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 25) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] Connected successfully!");
    Serial.print("[Wi-Fi] ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[Wi-Fi] Failed to connect. Reconnection will be handled in loop().");
  }
}

void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String heartbeatUrl = String(BACKEND_BASE_URL) + "/heartbeat";
  http.begin(heartbeatUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST("{}");

  if (httpResponseCode == 200) {
    Serial.println("[Heartbeat] Backend updated -> Device marked ONLINE");
  } else {
    Serial.print("[Heartbeat] Error, response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void pollDeviceState() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String stateUrl = String(BACKEND_BASE_URL) + "/state";
  http.begin(stateUrl);

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String payload = http.getString();
    payload.trim();

    Serial.print("[State Poll] Current state: ");
    Serial.println(payload);

    if (payload == "ON") {
      setOutputState(true);
    } else if (payload == "OFF") {
      setOutputState(false);
    }
  } else {
    Serial.print("[State Poll] Error, HTTP code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=================================");
  Serial.println("  ESP32 Smart Home Node Starting ");
  Serial.println("=================================");

  pinMode(OUTPUT_PIN, OUTPUT);
  setOutputState(false); // Default to OFF

  connectToWiFi();
}

void loop() {
  // If Wi-Fi disconnects, attempt reconnection
  if (WiFi.status() != WL_CONNECTED) {
    static unsigned long lastWiFiCheck = 0;
    if (millis() - lastWiFiCheck > 10000) {
      lastWiFiCheck = millis();
      Serial.println("[Wi-Fi] Reconnecting...");
      WiFi.reconnect();
    }
    return;
  }

  unsigned long currentMillis = millis();

  // 1. Send heartbeat periodically (keeps device status 'Online' on React dashboard)
  if (currentMillis - lastHeartbeatTime >= HEARTBEAT_INTERVAL) {
    lastHeartbeatTime = currentMillis;
    sendHeartbeat();
  }

  // 2. Poll device state from Spring Boot (updates actuator state)
  if (currentMillis - lastPollTime >= POLL_INTERVAL) {
    lastPollTime = currentMillis;
    pollDeviceState();
  }
}
