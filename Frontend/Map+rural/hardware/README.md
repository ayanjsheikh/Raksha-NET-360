# RakshaNet 360 — ESP32 SOS Device (Phase 4)

A wearable/portable emergency button that gets a GPS fix and sends an
"Emergency Packet" straight to the RakshaNet 360 backend over WiFi — with an
optional SMS fallback for areas with no internet.

## Bill of Materials

| Component                    | Qty | Notes                                   |
|-------------------------------|-----|------------------------------------------|
| ESP32 Dev Module (30/38-pin)  | 1   | Main controller                          |
| NEO-6M GPS module (GY-NEO6MV2)| 1   | Location fix                             |
| SIM800L GSM module            | 1   | **Optional** — SMS fallback only         |
| Momentary push button          | 1   | SOS trigger                              |
| Buzzer (active or passive)     | 1   | Audible feedback                         |
| LED (5mm, any color) + 220Ω R  | 1   | Status indicator                         |
| Li-ion cell + TP4056 charger   | 1   | Portable power                           |
| Voltage divider (2x 100kΩ)     | 1   | Battery level sensing on an ADC pin      |
| Breadboard / perfboard + wires | -   | Assembly                                 |

## Pinout / Wiring Diagram

```
                         ┌───────────────────────────┐
                         │           ESP32            │
                         │                            │
   SOS Button ───────────┤ GPIO27  (INPUT_PULLUP)     │
   (other leg -> GND)    │                            │
                         │                            │
   LED (+220Ω) ──────────┤ GPIO2                      │
   (cathode -> GND)      │                            │
                         │                            │
   Buzzer (+) ───────────┤ GPIO26                     │
   (Buzzer -  -> GND)    │                            │
                         │                            │
   Battery divider mid ──┤ GPIO34  (ADC1_CH6)         │
   (100k/100k across     │                            │
    battery + -> GND)    │                            │
                         │                            │
   NEO-6M TX ────────────┤ GPIO16  (RX2)               │
   NEO-6M RX ────────────┤ GPIO17  (TX2)               │
   NEO-6M VCC ───────────┤ 3V3                          │
   NEO-6M GND ───────────┤ GND                          │
                         │                            │
   SIM800L TX  ──────────┤ GPIO4   (RX1, via divider)  │  (OPTIONAL)
   SIM800L RX  ──────────┤ GPIO5   (TX1)                │  (OPTIONAL)
   SIM800L VCC ──────────┤ External 4V/2A supply        │  (OPTIONAL — NOT 3V3!)
   SIM800L GND ──────────┤ GND (shared with ESP32)      │  (OPTIONAL)
                         └───────────────────────────┘
```

### Connection notes

1. **SOS Button** — one leg to `GPIO27`, the other to `GND`. The pin is
   configured `INPUT_PULLUP`, so the resting state reads `HIGH` and pressing
   the button pulls it `LOW` — no external resistor needed.
2. **LED** — anode through a 220Ω resistor to `GPIO2`, cathode to `GND`.
   Blink patterns: slow blink = arming (button held), fast blink = sending,
   solid = sent successfully, rapid blink = failed after retries.
3. **Buzzer** — signal pin to `GPIO26`, ground to `GND`. A single beep on
   press, a triple beep on successful send, one long beep on failure.
4. **Battery sensing** — a 100kΩ/100kΩ divider halves the battery voltage so
   it stays within the ESP32 ADC's 3.3V range; `readBatteryPercent()` in the
   sketch undoes the division in software.
5. **NEO-6M GPS** — wired to UART2 (`GPIO16`/`GPIO17`) so it doesn't collide
   with the USB/serial-monitor UART0. Runs at the module's default 9600 baud.
6. **SIM800L (optional)** — needs its own regulated 4V supply capable of ~2A
   peaks; **do not** power it from the ESP32's 3V3 pin. Its TX line must be
   stepped down to 3.3V (simple resistor divider) before reaching the ESP32's
   RX pin — the ESP32 is not 5V-tolerant on GPIOs.

## Flashing

1. Install the **ESP32 board package** in Arduino IDE
   (`File > Preferences > Additional Board URLs`, add the Espressif package
   index, then install via `Boards Manager`).
2. Install libraries via `Sketch > Include Library > Manage Libraries`:
   - `TinyGPS++` (Mikal Hart)
   - `ArduinoJson` (Benoit Blanchon, v6.x)
3. Open `esp32/sos_device/sos_device.ino`, set `WIFI_SSID`, `WIFI_PASSWORD`,
   `BACKEND_HOST`, and a unique `DEVICE_ID`.
4. Select `Board: ESP32 Dev Module`, pick the correct COM port, and upload.
5. Open the Serial Monitor at `115200` baud to watch connection + SOS logs.

## Testing the SOS flow end-to-end

1. Start the FastAPI backend (`backend/`) — see the project root `README.md`.
2. Power the ESP32; confirm it prints `WiFi connected.` in the Serial
   Monitor (or continues in offline mode if no WiFi is configured).
3. Hold the SOS button for 2+ seconds. LED should blink fast, buzzer beeps
   once, then the device POSTs to `/api/hardware/sos`.
4. Confirm the Caregiver Dashboard receives a real-time SOS toast, and the
   Emergency Map opens centered on the reported coordinates.
