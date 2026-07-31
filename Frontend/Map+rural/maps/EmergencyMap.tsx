/**
 * EmergencyMap.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 (Maps, Dashboard & Hardware) — Phase 1
 *
 * The core Emergency Map screen.
 *
 * Workflow implemented:
 *   Open Map -> Request GPS permission -> Fetch user location -> Show marker
 *   -> Fetch nearby hospitals/police/pharmacies -> Sort by distance
 *   -> Render markers + bottom sheet list -> Tap "Navigate" -> RouteNavigation
 *
 * Composition:
 *   - Uses react-leaflet + OpenStreetMap tiles (no API key required)
 *   - Renders <SafeZones /> and <RouteNavigation /> as child layers
 *   - Nearby results are rendered through <HospitalLocator /> inside a
 *     Framer-Motion animated bottom sheet
 * ---------------------------------------------------------------------------
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hospital, ShieldAlert, Pill, LocateFixed, Navigation2, X } from "lucide-react";

import { locationService, Coordinates, LocationError } from "./LocationService";
import { MapService, EmergencyPlace, ServiceType, SafeZone } from "./MapService";
import { SafeZones } from "./SafeZones";
import { RouteNavigation } from "./RouteNavigation";
import { HospitalLocator } from "./HospitalLocator";

// ---------------------------------------------------------------------------
// Leaflet default icon fix (Vite bundles break the default marker image path)
// ---------------------------------------------------------------------------
const userIcon = new L.DivIcon({
  className: "rn-user-marker",
  html: `<div class="rn-user-marker-pulse"><div class="rn-user-marker-dot"></div></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const serviceIcons: Record<ServiceType, L.DivIcon> = {
  hospital: new L.DivIcon({
    className: "",
    html: `<div class="rn-pin rn-pin-hospital"><span>+</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  police: new L.DivIcon({
    className: "",
    html: `<div class="rn-pin rn-pin-police"><span>P</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  pharmacy: new L.DivIcon({
    className: "",
    html: `<div class="rn-pin rn-pin-pharmacy"><span>Rx</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  clinic: new L.DivIcon({
    className: "",
    html: `<div class="rn-pin rn-pin-clinic"><span>C</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};

type FilterKey = ServiceType | "all";

interface RecenterProps {
  coords: Coordinates | null;
}

/** Small helper component: recenters the Leaflet map imperatively when coords change. */
function RecenterOnUser({ coords }: RecenterProps) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.latitude, coords.longitude], 15, { duration: 0.8 });
    }
  }, [coords, map]);
  return null;
}

export default function EmergencyMap() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied">(
    "idle"
  );

  const [hospitals, setHospitals] = useState<EmergencyPlace[]>([]);
  const [police, setPolice] = useState<EmergencyPlace[]>([]);
  const [pharmacies, setPharmacies] = useState<EmergencyPlace[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<EmergencyPlace | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ---- Step 1 & 2: Request permission, then fetch + watch location -------
  const requestLocation = useCallback(async () => {
    setPermissionState("requesting");
    setLocationError(null);
    try {
      const coords = await locationService.getCurrentLocation();
      setUserLocation(coords);
      setPermissionState("granted");

      unsubscribeRef.current?.();
      unsubscribeRef.current = locationService.watchLocation(
        (c) => setUserLocation(c),
        (err) => setLocationError(err)
      );
    } catch (err) {
      setPermissionState("denied");
      setLocationError(err as LocationError);
    }
  }, []);

  useEffect(() => {
    requestLocation();
    return () => unsubscribeRef.current?.();
  }, [requestLocation]);

  // ---- Step 3: Fetch nearby emergency services once we have a location --
  useEffect(() => {
    if (!userLocation) return;
    let cancelled = false;
    setLoadingServices(true);

    Promise.all([
      MapService.getAllNearbyServices(userLocation),
      MapService.getSafeZones(userLocation),
    ])
      .then(([{ hospitals, police, pharmacies }, zones]) => {
        if (cancelled) return;
        setHospitals(hospitals);
        setPolice(police);
        setPharmacies(pharmacies);
        setSafeZones(zones);
      })
      .catch((err) => {
        if (!cancelled) setLocationError(err);
      })
      .finally(() => {
        if (!cancelled) setLoadingServices(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  // ---- Derived: filtered + searched results for the bottom sheet ---------
  const allServices = useMemo<EmergencyPlace[]>(
    () => [...hospitals, ...police, ...pharmacies].sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    [hospitals, police, pharmacies]
  );

  const visibleServices = useMemo(() => {
    let list = activeFilter === "all" ? allServices : allServices.filter((s) => s.type === activeFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }
    return list.slice(0, 5); // Phase 2 requirement: top five nearest services
  }, [allServices, activeFilter, searchTerm]);

  const mapCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [22.9734, 78.6569]; // fallback: geographic center of India

  const filterChips: { key: FilterKey; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: <Navigation2 size={14} /> },
    { key: "hospital", label: "Hospitals", icon: <Hospital size={14} /> },
    { key: "police", label: "Police", icon: <ShieldAlert size={14} /> },
    { key: "pharmacy", label: "Pharmacy", icon: <Pill size={14} /> },
  ];

  return (
    <div className="relative w-full h-[100dvh] bg-[#F8FAFC] overflow-hidden">
      {/* ---------------------------- MAP LAYER --------------------------- */}
      <MapContainer center={mapCenter} zoom={14} zoomControl={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnUser coords={userLocation} />

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {visibleServices.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={serviceIcons[place.type]}
            eventHandlers={{ click: () => setSelectedDestination(place) }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.distanceKm} km · ETA {place.etaMinutes} min
            </Popup>
          </Marker>
        ))}

        <SafeZones zones={safeZones} />

        {userLocation && selectedDestination && (
          <RouteNavigation origin={userLocation} destination={selectedDestination} />
        )}
      </MapContainer>

      {/* ------------------------- SEARCH BAR (top) ----------------------- */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-3">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospitals, police stations, pharmacies..."
            className="flex-1 outline-none text-sm placeholder:text-slate-400 bg-transparent"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} aria-label="Clear search">
              <X size={16} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* ------------------------- FILTER CHIPS -------------------------- */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setActiveFilter(chip.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors
                ${
                  activeFilter === chip.key
                    ? "bg-[#1565C0] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* --------------------- LOCATION ERROR BANNER ----------------------- */}
      <AnimatePresence>
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-28 left-4 right-4 z-[1000] bg-[#E53935] text-white text-sm rounded-xl px-4 py-3 shadow-lg flex items-center justify-between"
          >
            <span>{locationError.message}</span>
            <button onClick={requestLocation} className="font-semibold underline shrink-0 ml-2">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------ FLOATING ACTION BUTTONS ------------------ */}
      <div className="absolute right-4 bottom-[220px] z-[1000] flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={requestLocation}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#1565C0]"
          aria-label="Recenter on my location"
        >
          <LocateFixed size={20} />
        </motion.button>
      </div>

      {/* ----------------------------- BOTTOM SHEET ------------------------- */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) setSheetOpen(false);
          else if (info.offset.y < -80) setSheetOpen(true);
        }}
        animate={{ y: sheetOpen ? 0 : 320 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
      >
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onClick={() => setSheetOpen((v) => !v)}
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-200" />
        </div>

        <div className="px-4 pb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Nearby Emergency Services
          </h2>
          {loadingServices && (
            <span className="text-xs text-slate-400 animate-pulse">Updating…</span>
          )}
        </div>

        <div className="max-h-[45vh] overflow-y-auto px-4 pb-6">
          <HospitalLocator
            places={visibleServices}
            loading={loadingServices}
            onNavigate={(place) => setSelectedDestination(place)}
          />
        </div>
      </motion.div>
    </div>
  );
}
