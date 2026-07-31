/**
 * notification.ts
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Integration Layer
 *
 * Unifies two notification channels:
 *   1. Native browser notifications (works even if the caregiver has the
 *      dashboard tab in the background)
 *   2. An in-app toast/alert bus that UI components (e.g. Dashboard header)
 *      subscribe to for showing animated banners.
 *
 * Wired to socket.ts: every "sos" message triggers both channels.
 * ---------------------------------------------------------------------------
 */

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  severity: "critical" | "warning" | "info";
  timestamp: number;
}

type Subscriber = (n: AppNotification) => void;

class NotificationService {
  private subscribers = new Set<Subscriber>();
  private permissionRequested = false;

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof Notification === "undefined") return "denied";
    if (Notification.permission !== "default") return Notification.permission;
    this.permissionRequested = true;
    return Notification.requestPermission();
  }

  /** Fire a notification through every available channel. */
  notify(n: Omit<AppNotification, "id" | "timestamp">): AppNotification {
    const full: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };

    // Channel 1: in-app subscribers (toast banners, sidebar badge, etc.)
    this.subscribers.forEach((cb) => cb(full));

    // Channel 2: native OS/browser notification (best-effort).
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(full.title, {
          body: full.body,
          icon: "/icons/rakshanet-alert.png",
          requireInteraction: full.severity === "critical",
        });
      } catch {
        /* some browsers restrict Notification outside a user gesture */
      }
    }

    return full;
  }

  /** Convenience for the highest-priority case: an SOS from a patient/device. */
  notifySos(patientName: string, detail?: string) {
    return this.notify({
      title: `SOS Alert — ${patientName}`,
      body: detail ?? "Emergency button pressed. Location is being shared.",
      severity: "critical",
    });
  }

  subscribe(cb: Subscriber): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }
}

export const notificationService = new NotificationService();
