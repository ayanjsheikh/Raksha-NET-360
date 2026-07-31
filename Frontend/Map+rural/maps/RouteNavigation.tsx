/**
 * RouteNavigation.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 1 (Route Display)
 *
 * Draws a route polyline from the user's live location to a selected
 * destination (hospital, safe zone, etc.) using the public OSRM demo routing
 * engine (no API key required — matches the "no paid Maps API key" spirit of
 * the OpenStreetMap stack requested for this hackathon).
 *
 * Falls back to a straight dashed line if the routing service is unreachable
 * (keeps the map usable offline / on flaky networks).
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { Polyline, Popup } from "react-leaflet";
import { Coordinates } from "./LocationService";
import { EmergencyPlace } from "./MapService";

interface RouteNavigationProps {
  origin: Coordinates;
  destination: EmergencyPlace | { latitude: number; longitude: number; name?: string };
}

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export function RouteNavigation({ origin, destination }: RouteNavigationProps) {
  const [path, setPath] = useState<[number, number][]>([]);
  const [summary, setSummary] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRoute() {
      try {
        const url = `${OSRM_BASE}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("routing service unavailable");
        const data = await res.json();
        const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        if (cancelled) return;
        setPath(coords);
        setUsedFallback(false);
        setSummary({
          distanceKm: Math.round((data.routes[0].distance / 1000) * 10) / 10,
          durationMin: Math.round(data.routes[0].duration / 60),
        });
      } catch {
        // Fallback: straight line between the two points.
        if (cancelled) return;
        setPath([
          [origin.latitude, origin.longitude],
          [destination.latitude, destination.longitude],
        ]);
        setUsedFallback(true);
        setSummary(null);
      }
    }

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [origin.latitude, origin.longitude, destination.latitude, destination.longitude]);

  if (path.length === 0) return null;

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color: "#1565C0",
        weight: 5,
        opacity: 0.85,
        dashArray: usedFallback ? "8 8" : undefined,
      }}
    >
      <Popup>
        {summary
          ? `${summary.distanceKm} km · ~${summary.durationMin} min`
          : "Approximate route (offline mode)"}
      </Popup>
    </Polyline>
  );
}
