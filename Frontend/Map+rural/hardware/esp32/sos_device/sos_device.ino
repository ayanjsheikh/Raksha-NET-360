/**
 * ============================================================================
 * RakshaNet 360 — Member 4 — Phase 4: ESP32 SOS Device
 * ============================================================================
 * File:   sos_device.ino
 * Board:  ESP32 Dev Module
 *
 * FEATURES
 *  - Single button SOS trigger (short press) + Long-press "confirmed" SOS
 *  - Reads live GPS coordinates (NEO-6M over UART, TinyGPS++)
 *  - Optional SIM800L GSM fallback: sends an SMS if WiFi/HTTP POST fails
 *  - Sends an "Emergency Packet" (JSON) to the FastAPI backend over HTTP POST
 *  - LED + buzzer feedback for: idle / arming / sent / failed
 *  - Retries with exponential backoff if the network request fails
 *  - Persists the last known GPS fix in EEPROM/Preferences so a stale-but-
 *    valid location can still be sent if GPS loses lock right at press time
 *  - Reads an analog pin as a rough battery-level percentage
 *
 * LIBRARIES REQUIRED (Arduino Library Manager)
 *  - TinyGPS++            by Mikal Hart
 *  - ArduinoJson           by Benoit Blanchon
 *  - WiFi.h                (bundled with ESP32 core)
 *  - HTTPClient.h          (bundled with ESP32 core)
 *  - Preferences.h         (bundled with ESP32 core)
 *
 * WIRING — see hardware/esp32/README.md for the full pinout + diagram.
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <TinyGPS++.h>
#include <Preferences.h>
#include <HardwareSerial.h>

// ---------------------------------------------------------------------------
// CONFIGURATION — edit these before flashing
// ---------------------------------------------------------------------------
const char* WIFI_SSID       = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD   = "YOUR_WIFI_PASSWORD";
const char* BACKEND_HOST    = "http://192.168.1.100:8000"; // FastAPI server
const char* BACKEND_SOS_PATH = "/api/hardware/sos";
const char* DEVICE_ID       = "RN360-ESP32-001";           // unique per device

// ---------------------------------------------------------------------------
// PIN MAP
// ---------------------------------------------------------------------------
const int PIN_SOS_BUTTON   = 27;  // Push button -> GND (INPUT_PULLUP)
const int PIN_LED           = 2;   // Onboard/external status LED
const int PIN_BUZZER        = 26;  // Passive/active buzzer
const int PIN_BATTERY_ADC   = 34;  // Voltage divider into battery pack
const int GPS_RX_PIN        = 16;  // ESP32 RX2 <- GPS TX
const int GPS_TX_PIN        = 17;  // ESP32 TX2 -> GPS RX
const int GSM_RX_PIN        = 4;   // ESP32 RX  <- SIM800L TX  (optional module)
const int GSM_TX_PIN        = 5;   // ESP32 TX  -> SIM800L RX  (optional module)

// ---------------------------------------------------------------------------
// TIMING / BEHAVIOUR CONSTANTS
// ---------------------------------------------------------------------------
const unsigned long LONG_PRESS_MS   = 2000;  // hold 2s to confirm SOS
const unsigned long DEBOUNCE_MS     = 50;
const int MAX_RETRIES               = 4;
const unsigned long RETRY_BASE_MS   = 1500;  // exponential backoff base

// ---------------------------------------------------------------------------
// GLOBAL OBJECTS
// ---------------------------------------------------------------------------
HardwareSerial gpsSerial(2);   // UART2 for NEO-6M
TinyGPSPlus gps;
Preferences prefs;

enum DeviceState { STATE_IDLE, STATE_ARMING, STATE_SENDING, STATE_SENT, STATE_FAILED };
DeviceState state = STATE_IDLE;

unsigned long buttonPressedAt = 0;
bool buttonWasPressed = false;

// ---------------------------------------------------------------------------
// FORWARD DECLARATIONS
// ---------------------------------------------------------------------------
void connectWiFi();
void readGpsNonBlocking();
bool sendSosPacket(double lat, double lng, bool gpsValid, int batteryPct);
void sendSmsFallback(double lat, double lng);
int readBatteryPercent();
void setLed(bool on);
void beep(int durationMs, int times = 1);
void saveLastFix(double lat, double lng);
bool loadLastFix(double &lat, double &lng);

// ---------------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  pinMode(PIN_SOS_BUTTON, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  prefs.begin("rakshanet", false);

  connectWiFi();

  Serial.println("[RakshaNet360] ESP32 SOS Device ready.");
  beep(150, 2); // startup chime
}

// ---------------------------------------------------------------------------
// MAIN LOOP
// ---------------------------------------------------------------------------
void loop() {
  readGpsNonBlocking();
  handleButton();

  switch (state) {
    case STATE_IDLE:
      setLed(false);
      break;
    case STATE_ARMING:
      // Blink fast while the user is holding the button down.
      setLed((millis() / 150) % 2 == 0);
      break;
    case STATE_SENDING:
      setLed((millis() / 300) % 2 == 0);
      break;
    case STATE_SENT:
      setLed(true);
      break;
    case STATE_FAILED:
      setLed((millis() / 100) % 2 == 0); // rapid blink = failure
      break;
  }
}

// ---------------------------------------------------------------------------
// BUTTON HANDLING — short press = arm, long press (>=2s) = confirmed SOS
// ---------------------------------------------------------------------------
void handleButton() {
  bool pressed = (digitalRead(PIN_SOS_BUTTON) == LOW);

  if (pressed && !buttonWasPressed) {
    buttonPressedAt = millis();
    buttonWasPressed = true;
    state = STATE_ARMING;
  }

  if (pressed && buttonWasPressed) {
    if (millis() - buttonPressedAt >= LONG_PRESS_MS) {
      triggerSos();
      buttonWasPressed = false; // avoid re-trigger until released
    }
  }

  if (!pressed && buttonWasPressed) {
    // Released before the long-press threshold -> cancel arming.
    buttonWasPressed = false;
    if (state == STATE_ARMING) state = STATE_IDLE;
  }
}

// ---------------------------------------------------------------------------
// TRIGGER SOS — build the emergency packet and send it (with retries)
// ---------------------------------------------------------------------------
void triggerSos() {
  state = STATE_SENDING;
  beep(400, 1);

  bool gpsValid = gps.location.isValid() && gps.location.age() < 5000;
  double lat = gpsValid ? gps.location.lat() : 0;
  double lng = gpsValid ? gps.location.lng() : 0;

  if (gpsValid) {
    saveLastFix(lat, lng);
  } else {
    // GPS lost lock right when the button was pressed — fall back to the
    // last known-good fix so responders still get *a* location.
    double lastLat, lastLng;
    if (loadLastFix(lastLat, lastLng)) {
      lat = lastLat;
      lng = lastLng;
      Serial.println("[GPS] No live fix — using last known location.");
    }
  }

  int batteryPct = readBatteryPercent();

  bool sent = false;
  for (int attempt = 0; attempt < MAX_RETRIES && !sent; attempt++) {
    if (attempt > 0) {
      unsigned long backoff = RETRY_BASE_MS * (1UL << attempt); // exponential
      Serial.printf("[SOS] Retry %d in %lums...\n", attempt, backoff);
      delay(backoff);
    }
    sent = sendSosPacket(lat, lng, gpsValid, batteryPct);
  }

  if (sent) {
    state = STATE_SENT;
    beep(150, 3);
  } else {
    state = STATE_FAILED;
    beep(800, 1);
    // Final fallback: SMS via SIM800L if HTTP delivery failed after all retries.
    sendSmsFallback(lat, lng);
  }

  delay(3000);
  state = STATE_IDLE;
}

// ---------------------------------------------------------------------------
// NETWORKING
// ---------------------------------------------------------------------------
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("[WiFi] Connecting");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(400);
    Serial.print(".");
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? " connected." : " failed (offline mode).");
}

bool sendSosPacket(double lat, double lng, bool gpsValid, int batteryPct) {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) return false;
  }

  HTTPClient http;
  http.begin(String(BACKEND_HOST) + BACKEND_SOS_PATH);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(8000);

  StaticJsonDocument<256> doc;
  doc["device_id"]     = DEVICE_ID;
  doc["latitude"]      = lat;
  doc["longitude"]     = lng;
  doc["gps_valid"]     = gpsValid;
  doc["battery_pct"]   = batteryPct;
  doc["triggered_at"]  = millis(); // backend also stamps server-side receipt time

  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  Serial.printf("[HTTP] POST %s -> %d\n", BACKEND_SOS_PATH, httpCode);
  http.end();

  return httpCode >= 200 && httpCode < 300;
}

// ---------------------------------------------------------------------------
// SIM800L GSM FALLBACK (optional module) — see hardware/gsm/gsm_module.h
// ---------------------------------------------------------------------------
void sendSmsFallback(double lat, double lng) {
#if defined(RAKSHANET_ENABLE_GSM)
  extern void gsmSendSms(const char *number, const String &message);
  String msg = "RakshaNet360 SOS! Location: https://maps.google.com/?q=" +
               String(lat, 6) + "," + String(lng, 6);
  gsmSendSms("+91XXXXXXXXXX", msg); // configure caregiver's number
  Serial.println("[GSM] SMS fallback sent.");
#else
  Serial.println("[GSM] Fallback disabled (RAKSHANET_ENABLE_GSM not defined).");
#endif
}

// ---------------------------------------------------------------------------
// GPS
// ---------------------------------------------------------------------------
void readGpsNonBlocking() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }
}

void saveLastFix(double lat, double lng) {
  prefs.putDouble("lastLat", lat);
  prefs.putDouble("lastLng", lng);
}

bool loadLastFix(double &lat, double &lng) {
  if (!prefs.isKey("lastLat")) return false;
  lat = prefs.getDouble("lastLat", 0);
  lng = prefs.getDouble("lastLng", 0);
  return true;
}

// ---------------------------------------------------------------------------
// BATTERY
// ---------------------------------------------------------------------------
int readBatteryPercent() {
  int raw = analogRead(PIN_BATTERY_ADC);         // 0-4095 (12-bit ADC)
  float voltage = (raw / 4095.0) * 3.3 * 2;       // x2 for a 100k/100k divider
  float minV = 3.3, maxV = 4.2;                   // typical single-cell Li-ion
  float pct = (voltage - minV) / (maxV - minV) * 100.0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  return (int)pct;
}

// ---------------------------------------------------------------------------
// FEEDBACK: LED + BUZZER
// ---------------------------------------------------------------------------
void setLed(bool on) {
  digitalWrite(PIN_LED, on ? HIGH : LOW);
}

void beep(int durationMs, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(PIN_BUZZER, HIGH);
    delay(durationMs);
    digitalWrite(PIN_BUZZER, LOW);
    if (i < times - 1) delay(120);
  }
}
