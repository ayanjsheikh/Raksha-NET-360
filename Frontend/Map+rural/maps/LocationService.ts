/**
 * LocationService.ts
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 (Maps, Dashboard & Hardware)
 *
 * Responsible for everything related to the browser Geolocation API:
 *   - Requesting permission
 *   - One-shot position fetch
 *   - Continuous "watch" tracking (live user marker on the Emergency Map)
 *   - Haversine distance + ETA estimation (used by MapService & cards)
 *
 * Kept framework-agnostic (no React import) so it can be reused by the
 * caregiver dashboard, the map module, and the notification/integration layer.
 * ---------------------------------------------------------------------------
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export type LocationErrorCode =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNSUPPORTED";

export class LocationError extends Error {
  code: LocationErrorCode;
  constructor(code: LocationErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "LocationError";
  }
}

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 5000,
};

function toCoordinates(pos: GeolocationPosition): Coordinates {
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    heading: pos.coords.heading,
    speed: pos.coords.speed,
    timestamp: pos.timestamp,
  };
}

function mapGeoError(err: GeolocationPositionError): LocationError {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return new LocationError(
        "PERMISSION_DENIED",
        "Location permission was denied. Enable it in your browser settings to use the Emergency Map."
      );
    case err.POSITION_UNAVAILABLE:
      return new LocationError(
        "POSITION_UNAVAILABLE",
        "Your location could not be determined. Please check your GPS/network signal."
      );
    case err.TIMEOUT:
      return new LocationError("TIMEOUT", "Location request timed out. Retrying may help.");
    default:
      return new LocationError("POSITION_UNAVAILABLE", "Unknown location error.");
  }
}

class LocationServiceImpl {
  private watchId: number | null = null;
  private lastKnown: Coordinates | null = null;
  private listeners = new Set<(coords: Coordinates) => void>();
  private errorListeners = new Set<(err: LocationError) => void>();

  isSupported(): boolean {
    return typeof navigator !== "undefined" && "geolocation" in navigator;
  }

  /** One-shot fetch — used on initial map load. */
  getCurrentLocation(options: PositionOptions = DEFAULT_OPTIONS): Promise<Coordinates> {
    if (!this.isSupported()) {
      return Promise.reject(
        new LocationError("UNSUPPORTED", "Geolocation is not supported on this device/browser.")
      );
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.lastKnown = toCoordinates(pos);
          resolve(this.lastKnown);
        },
        (err) => reject(mapGeoError(err)),
        options
      );
    });
  }

  /** Starts continuous tracking. Returns an unsubscribe function. */
  watchLocation(
    onUpdate: (coords: Coordinates) => void,
    onError?: (err: LocationError) => void,
    options: PositionOptions = DEFAULT_OPTIONS
  ): () => void {
    this.listeners.add(onUpdate);
    if (onError) this.errorListeners.add(onError);

    if (this.watchId === null && this.isSupported()) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.lastKnown = toCoordinates(pos);
          this.listeners.forEach((cb) => cb(this.lastKnown!));
        },
        (err) => {
          const mapped = mapGeoError(err);
          this.errorListeners.forEach((cb) => cb(mapped));
        },
        options
      );
    }

    return () => {
      this.listeners.delete(onUpdate);
      if (onError) this.errorListeners.delete(onError);
      if (this.listeners.size === 0 && this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    };
  }

  getLastKnownLocation(): Coordinates | null {
    return this.lastKnown;
  }

  stopAll(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.listeners.clear();
    this.errorListeners.clear();
  }

  /**
   * Haversine formula — great-circle distance between two points in km.
   */
  distanceKm(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    const lat1 = this.toRad(from.latitude);
    const lat2 = this.toRad(to.latitude);

    const a =
      Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /** Rough ETA in minutes given a travel mode's average speed (km/h). */
  estimateEtaMinutes(distanceKm: number, mode: "driving" | "walking" = "driving"): number {
    const avgSpeedKmh = mode === "driving" ? 32 : 5; // urban/emergency-traffic assumption
    return Math.max(1, Math.round((distanceKm / avgSpeedKmh) * 60));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}

/** Singleton — import { locationService } wherever needed. */
export const locationService = new LocationServiceImpl();
