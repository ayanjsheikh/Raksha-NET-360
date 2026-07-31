/**
 * socket.ts
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Integration Layer
 *
 * Real-time channel between the FastAPI backend and the React frontend.
 * Used by the Caregiver Dashboard to receive:
 *   - "sos"        -> new emergency from an ESP32 device / patient app
 *   - "location"   -> live GPS updates for a tracked patient
 *   - "health"     -> vitals updates (heart rate, fall detection, etc.)
 *
 * Auto-reconnects with exponential backoff so a caregiver's dashboard never
 * silently goes stale during a network blip — critical for an emergency
 * response product.
 * ---------------------------------------------------------------------------
 */

export type SocketEventType = "sos" | "location" | "health" | "system";

export interface SocketMessage<T = unknown> {
  type: SocketEventType;
  payload: T;
}

type Listener = (msg: SocketMessage) => void;

const WS_BASE = (import.meta.env?.VITE_WS_BASE_URL as string) ?? "ws://localhost:8000/ws";
const MAX_BACKOFF_MS = 15000;

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private reconnectAttempt = 0;
  private manualClose = false;

  connect(path = "/caregiver"): void {
    this.manualClose = false;
    this.open(path);
  }

  private open(path: string) {
    this.ws = new WebSocket(`${WS_BASE}${path}`);

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: SocketMessage = JSON.parse(event.data);
        this.listeners.forEach((cb) => cb(msg));
      } catch {
        // Ignore malformed frames rather than crashing the dashboard.
      }
    };

    this.ws.onclose = () => {
      if (this.manualClose) return;
      const delay = Math.min(1000 * 2 ** this.reconnectAttempt, MAX_BACKOFF_MS);
      this.reconnectAttempt += 1;
      setTimeout(() => this.open(path), delay);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  /** Subscribe to all incoming messages. Returns an unsubscribe function. */
  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Convenience: subscribe to a single event type only. */
  onType<T = unknown>(type: SocketEventType, listener: (payload: T) => void): () => void {
    return this.on((msg) => {
      if (msg.type === type) listener(msg.payload as T);
    });
  }

  send(msg: SocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  close(): void {
    this.manualClose = true;
    this.ws?.close();
    this.listeners.clear();
  }
}

/** Singleton — one live connection shared across the whole app. */
export const socketClient = new SocketClient();
