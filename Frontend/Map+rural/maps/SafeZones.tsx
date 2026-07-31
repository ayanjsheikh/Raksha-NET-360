/**
 * SafeZones.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 1 (Safe Zones layer)
 *
 * Renders designated safe zones (shelters, police posts, hospitals,
 * community centers) as translucent circles + markers on the Emergency Map.
 * Kept as its own component so it can be toggled on/off independently and
 * reused by RouteNavigation (e.g. "safe route" bonus feature).
 * ---------------------------------------------------------------------------
 */

import { Circle, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { SafeZone } from "./MapService";

const zoneColor: Record<SafeZone["type"], string> = {
  shelter: "#F9A825",
  police: "#00B894",
  hospital: "#1565C0",
  "community-center": "#FF7043",
};

const zoneIcon = (type: SafeZone["type"]) =>
  new L.DivIcon({
    className: "",
    html: `<div class="rn-safezone-pin" style="background:${zoneColor[type]}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

interface SafeZonesProps {
  zones: SafeZone[];
  visible?: boolean;
}

export function SafeZones({ zones, visible = true }: SafeZonesProps) {
  if (!visible || zones.length === 0) return null;

  return (
    <>
      {zones.map((zone) => (
        <div key={zone.id}>
          <Circle
            center={[zone.latitude, zone.longitude]}
            radius={zone.radiusMeters}
            pathOptions={{
              color: zoneColor[zone.type],
              fillColor: zoneColor[zone.type],
              fillOpacity: 0.1,
              weight: 1.5,
              dashArray: "4 4",
            }}
          />
          <Marker position={[zone.latitude, zone.longitude]} icon={zoneIcon(zone.type)}>
            <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
              {zone.name}
            </Tooltip>
            <Popup>
              <strong>{zone.name}</strong>
              <br />
              Safe zone · {zone.type.replace("-", " ")}
            </Popup>
          </Marker>
        </div>
      ))}
    </>
  );
}
