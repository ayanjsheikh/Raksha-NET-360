/**
 * ============================================================================
 * gsm_module.h — RakshaNet 360 — SIM800L GSM helper (OPTIONAL module)
 * ============================================================================
 * Provides a minimal AT-command wrapper to send an SMS as a last-resort
 * fallback channel when the ESP32 has no WiFi/internet access. This mirrors
 * rural / low-connectivity conditions the hackathon brief calls out
 * ("Offline Health & Emergency Response").
 *
 * MODULE: SIM800L GSM/GPRS module
 * WIRING (to ESP32, via UART1 — logic-level shifted!):
 *   SIM800L VCC  -> external 4V/2A supply (NOT the ESP32 3V3 pin — SIM800L
 *                   draws up to ~2A current spikes during transmission)
 *   SIM800L GND  -> ESP32 GND (common ground with the external supply too)
 *   SIM800L TX   -> ESP32 GPIO4  (RX)   [through a voltage divider to 3.3V]
 *   SIM800L RX   -> ESP32 GPIO5  (TX)   [SIM800L RX is 3.3V tolerant already]
 *
 * To enable, add `#define RAKSHANET_ENABLE_GSM` and `#include "gsm_module.h"`
 * at the top of sos_device.ino, then call gsmModule.begin() in setup().
 * ============================================================================
 */

#ifndef RAKSHANET_GSM_MODULE_H
#define RAKSHANET_GSM_MODULE_H

#include <HardwareSerial.h>

class GsmModule {
public:
  GsmModule(HardwareSerial &serial, int rxPin, int txPin, uint32_t baud = 9600)
      : _serial(serial), _rxPin(rxPin), _txPin(txPin), _baud(baud) {}

  void begin() {
    _serial.begin(_baud, SERIAL_8N1, _rxPin, _txPin);
    delay(3000); // SIM800L needs a few seconds to register on the network
    sendAt("AT");            // handshake
    sendAt("AT+CMGF=1");     // text mode SMS
  }

  bool isNetworkRegistered() {
    String resp = sendAt("AT+CREG?");
    return resp.indexOf(",1") != -1 || resp.indexOf(",5") != -1;
  }

  bool sendSms(const char *number, const String &message) {
    sendAt("AT+CMGF=1");
    _serial.print("AT+CMGS=\"");
    _serial.print(number);
    _serial.println("\"");
    delay(300);
    _serial.print(message);
    _serial.write(26); // Ctrl+Z terminates the SMS body
    delay(500);
    String resp = readResponse(5000);
    return resp.indexOf("OK") != -1;
  }

private:
  HardwareSerial &_serial;
  int _rxPin;
  int _txPin;
  uint32_t _baud;

  String sendAt(const String &cmd) {
    _serial.println(cmd);
    return readResponse(1000);
  }

  String readResponse(uint32_t timeoutMs) {
    String out;
    unsigned long start = millis();
    while (millis() - start < timeoutMs) {
      while (_serial.available()) {
        out += (char)_serial.read();
      }
    }
    return out;
  }
};

#endif // RAKSHANET_GSM_MODULE_H
