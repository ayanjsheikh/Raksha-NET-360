/**
 * MapService.ts
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 (Maps, Dashboard & Hardware)
 *
 * Repository-pattern API client for every map-related backend endpoint:
 *   GET /api/location
 *   GET /api/nearby-hospitals
 *   GET /api/nearby-police
 *   GET /api/nearby-pharmacy
 *   GET /api/safe-zones
 *   GET /api/route
 *
 * Includes:
 *   - Centralized fetch wrapper with typed errors
 *   - Distance/ETA enrichment (delegates math to LocationService)
 *   - Offline-first cache (localStorage) so the Emergency Map still shows the
 *     last-known nearby services when the network drops (BONUS: Offline Maps
 *     Cache / Offline Queue requirement).
 * ---------------------------------------------------------------------------
 */

import { locationService, Coordinates } from "./LocationService";

export type ServiceType = "hospital" | "police" | "pharmacy" | "clinic";

export interface EmergencyPlace {
  id: string;
  name: string;
  type: ServiceType;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  isOpen: boolean;
  emergencyAvailable: boolean;
  rating?: number;
  distanceKm?: number; // enriched client-side
  etaMinutes?: number; // enriched client-side
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  type: "shelter" | "police" | "hospital" | "community-center";
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  polyline: [number, number][]; // [lat, lng] pairs
}

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000/api";
const CACHE_PREFIX = "rakshanet_cache_";
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export class MapServiceError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "MapServiceError";
    this.status = status;
  }
}

function cacheKey(name: string, coords: Coordinates) {
  // Round coordinates to ~1km grid so nearby requests hit the same cache entry.
  const lat = coords.latitude.toFixed(2);
  const lng = coords.longitude.toFixed(2);
  return `${CACHE_PREFIX}${name}_${lat}_${lng}`;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data as T;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* storage full / disabled — fail silently, cache is a nice-to-have */
  }
}

async function request<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    throw new MapServiceError("Network request failed — you may be offline.");
  }

  if (!response.ok) {
    throw new MapServiceError(`Request to ${path} failed`, response.status);
  }
  return response.json();
}

/** Enrich raw places with distance & ETA relative to the user's coordinates, sorted nearest-first. */
function enrichAndSort(places: EmergencyPlace[], origin: Coordinates): EmergencyPlace[] {
  return places
    .map((p) => {
      const distanceKm = locationService.distanceKm(origin, p);
      return {
        ...p,
        distanceKm: Math.round(distanceKm * 10) / 10,
        etaMinutes: locationService.estimateEtaMinutes(distanceKm, "driving"),
      };
    })
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

async function fetchNearby(
  path: string,
  cacheName: string,
  origin: Coordinates,
  radiusKm = 10
): Promise<EmergencyPlace[]> {
  const key = cacheKey(cacheName, origin);
  try {
    const raw = await request<EmergencyPlace[]>(path, {
      lat: origin.latitude,
      lng: origin.longitude,
      radius_km: radiusKm,
    });
    const enriched = enrichAndSort(raw, origin);
    writeCache(key, enriched);
    return enriched;
  } catch (err) {
    const cached = readCache<EmergencyPlace[]>(key);
    if (cached) return cached;
    throw err;
  }
}

export const MapService = {
  async getNearbyHospitals(origin: Coordinates, radiusKm = 10) {
    return fetchNearby("/nearby-hospitals", "hospitals", origin, radiusKm);
  },

  async getNearbyPolice(origin: Coordinates, radiusKm = 10) {
    return fetchNearby("/nearby-police", "police", origin, radiusKm);
  },

  async getNearbyPharmacies(origin: Coordinates, radiusKm = 10) {
    return fetchNearby("/nearby-pharmacy", "pharmacy", origin, radiusKm);
  },

  /** Convenience: fetch all four service types in parallel for the map's default view. */
  async getAllNearbyServices(origin: Coordinates, radiusKm = 10) {
    const [hospitals, police, pharmacies] = await Promise.all([
      this.getNearbyHospitals(origin, radiusKm),
      this.getNearbyPolice(origin, radiusKm),
      this.getNearbyPharmacies(origin, radiusKm),
    ]);
    return { hospitals, police, pharmacies };
  },

  async getSafeZones(origin: Coordinates, radiusKm = 15): Promise<SafeZone[]> {
    const key = cacheKey("safezones", origin);
    try {
      const zones = await request<SafeZone[]>("/safe-zones", {
        lat: origin.latitude,
        lng: origin.longitude,
        radius_km: radiusKm,
      });
      writeCache(key, zones);
      return zones;
    } catch (err) {
      const cached = readCache<SafeZone[]>(key);
      if (cached) return cached;
      throw err;
    }
  },

  /** Route between the user and a chosen destination (hospital, safe zone, etc). */
  async getRoute(origin: Coordinates, destination: { latitude: number; longitude: number }): Promise<RouteResult> {
    return request<RouteResult>("/route", {
      origin_lat: origin.latitude,
      origin_lng: origin.longitude,
      dest_lat: destination.latitude,
      dest_lng: destination.longitude,
    });
  },
};
