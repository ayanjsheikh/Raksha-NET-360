/**
 * ============================================================================
 * gps_module.h — RakshaNet 360 — NEO-6M GPS helper
 * ============================================================================
 * Small wrapper around TinyGPS++ so sos_device.ino stays focused on the SOS
 * state machine. Include this file if you want GPS logic split out of the
 * main sketch (optional — sos_device.ino also works standalone).
 *
 * MODULE: GY-NEO6MV2 (NEO-6M GPS module)
 * WIRING (to ESP32 UART2):
 *   GPS VCC  -> ESP32 3.3V (or 5V if module has onboard regulator)
 *   GPS GND  -> ESP32 GND
 *   GPS TX   -> ESP32 GPIO16 (RX2)
 *   GPS RX   -> ESP32 GPIO17 (TX2)
 * ============================================================================
 */

#ifndef RAKSHANET_GPS_MODULE_H
#define RAKSHANET_GPS_MODULE_H

#include <TinyGPS++.h>
#include <HardwareSerial.h>

class GpsModule {
public:
  GpsModule(HardwareSerial &serial, int rxPin, int txPin, uint32_t baud = 9600)
      : _serial(serial), _rxPin(rxPin), _txPin(txPin), _baud(baud) {}

  void begin() {
    _serial.begin(_baud, SERIAL_8N1, _rxPin, _txPin);
  }

  /** Call every loop() iteration — feeds any available bytes to the parser. */
  void poll() {
    while (_serial.available() > 0) {
      _gps.encode(_serial.read());
    }
  }

  bool hasFix() const {
    return _gps.location.isValid() && _gps.location.age() < 5000;
  }

  double latitude() const { return _gps.location.lat(); }
  double longitude() const { return _gps.location.lng(); }
  double altitudeMeters() const { return _gps.altitude.meters(); }
  double speedKmph() const { return _gps.speed.kmph(); }
  uint32_t satellites() const { return _gps.satellites.value(); }

  /** Age of the last fix in milliseconds — useful to flag "stale" locations. */
  uint32_t fixAgeMs() const { return _gps.location.age(); }

private:
  HardwareSerial &_serial;
  TinyGPSPlus _gps;
  int _rxPin;
  int _txPin;
  uint32_t _baud;
};

#endif // RAKSHANET_GPS_MODULE_H
