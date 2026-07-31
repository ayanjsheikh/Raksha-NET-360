import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import {
  Building2,
  Shield,
  Pill,
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  Compass,
  CheckCircle,
  ExternalLink,
  Layers,
  Globe,
  Radio,
  LocateFixed,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

// Helper component to auto-recenter Leaflet map when live location updates
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Fix standard Leaflet default icon issues in React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom Icons for categories
const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: `<div class="w-6 h-6 rounded-full bg-primary-600 border-4 border-white shadow-lg animate-pulse"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Facility {
  id: string;
  name: string;
  category: "hospital" | "police" | "pharmacy" | "safezone";
  lat: number;
  lng: number;
  address: string;
  phone: string;
  distance: string;
  eta: string;
  openHours: string;
  rating: number;
}

const mockFacilities: Facility[] = [
  {
    id: "h1",
    name: "Apollo Hospital Sector 14",
    category: "hospital",
    lat: 28.4595,
    lng: 77.0266,
    address: "Plot 12, Sector 14, Gurgaon",
    phone: "+91 98765 43210",
    distance: "1.2 km",
    eta: "4 mins",
    openHours: "Open 24/7 (Emergency & ICU Ready)",
    rating: 4.8,
  },
  {
    id: "h2",
    name: "Fortis Memorial Research Institute",
    category: "hospital",
    lat: 28.468,
    lng: 77.072,
    address: "Sector 44, Opposite HUDA City Centre",
    phone: "+91 124 4962200",
    distance: "3.5 km",
    eta: "9 mins",
    openHours: "Open 24/7",
    rating: 4.9,
  },
  {
    id: "p1",
    name: "Sector 14 Police Station",
    category: "police",
    lat: 28.463,
    lng: 77.031,
    address: "Old Delhi Gurgaon Road, Sector 14",
    phone: "+91 100",
    distance: "0.8 km",
    eta: "3 mins",
    openHours: "Open 24/7",
    rating: 4.5,
  },
  {
    id: "ph1",
    name: "Apollo Pharmacy 24x7",
    category: "pharmacy",
    lat: 28.457,
    lng: 77.029,
    address: "Shop 4, Main Market Sector 14",
    phone: "+91 98765 99999",
    distance: "0.5 km",
    eta: "2 mins",
    openHours: "Open 24/7",
    rating: 4.7,
  },
  {
    id: "s1",
    name: "Safe Zone - Community Medical Center",
    category: "safezone",
    lat: 28.461,
    lng: 77.024,
    address: "Civic Center Complex, Sector 14",
    phone: "+91 1800 11 2233",
    distance: "0.9 km",
    eta: "3 mins",
    openHours: "Protected Safe Point 24/7",
    rating: 5.0,
  },
];

// Map Tile Providers (Google Maps, Mappls & High Availability Tile Servers)
const MAP_LAYERS = {
  googleRoadmap: {
    name: "Google Maps (Roadmap)",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps Technology",
  },
  googleSatellite: {
    name: "Google Maps (Satellite Hybrid)",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps Imagery",
  },
  googleTerrain: {
    name: "Google Maps (Terrain)",
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps Physical Terrain",
  },
  mappls: {
    name: "Mappls (MapmyIndia / Voyager)",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.mappls.com/">Mappls MapmyIndia</a> & CARTO',
  },
  osm: {
    name: "OpenStreetMap Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    name: "Dark Tactical Mode",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO Dark",
  },
};

export default function EmergencyMap() {
  const [filter, setFilter] = useState<"all" | "hospital" | "police" | "pharmacy" | "safezone">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapProvider, setMapProvider] = useState<keyof typeof MAP_LAYERS>("googleRoadmap");
  const [userPos, setUserPos] = useState<[number, number]>([28.4595, 77.0266]);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { user } = useAuth();

  // Fetch real user location & set up continuous watchPosition GPS engine
  const requestLiveGPSLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(newPos);
          setGpsAccuracy(Math.round(pos.coords.accuracy));
          setIsLocating(false);

          if (user) {
            api.post("/api/location/", {
              user_id: Number(user.id),
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }).catch((err) => console.warn("Backend location sync silent error", err));
          }
        },
        (err) => {
          console.warn("Geolocation permission error", err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    requestLiveGPSLocation();

    // Set up continuous location tracking watchPosition
    let watchId: number | null = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
          setGpsAccuracy(Math.round(pos.coords.accuracy));
        },
        (err) => console.warn("Watch position error", err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    }

    return () => {
      if (watchId !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [user]);


  const filteredFacilities = mockFacilities.filter((fac) => {
    const matchesCategory = filter === "all" || fac.category === filter;
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary-600" /> Live Google Maps & Emergency Dispatch
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Real-time GPS tracking stream, Google Maps GIS tile engine, and turn-by-turn navigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Map Layer Selector dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-card p-1 rounded-xl border border-line text-xs font-semibold shadow-sm">
            <Layers className="h-4 w-4 text-primary-600 ml-2" />
            <select
              value={mapProvider}
              onChange={(e) => setMapProvider(e.target.value as any)}
              className="bg-transparent pr-2 py-1 text-xs text-ink-primary focus:outline-none cursor-pointer font-bold"
            >
              <option value="googleRoadmap">🗺️ Google Maps (Roadmap)</option>
              <option value="googleSatellite">🛰️ Google Maps (Satellite)</option>
              <option value="googleTerrain">🏔️ Google Maps (Terrain)</option>
              <option value="mappls">🇮🇳 Mappls (MapmyIndia)</option>
              <option value="osm">🌐 OpenStreetMap</option>
              <option value="dark">🌙 Dark Tactical Mode</option>
            </select>
          </div>

          <Button
            size="sm"
            onClick={requestLiveGPSLocation}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-sm"
          >
            <LocateFixed className={cn("h-4 w-4", isLocating && "animate-spin")} />
            {isLocating ? "Fetching Live GPS..." : "Live GPS Active"}
            {gpsAccuracy && <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded">±{gpsAccuracy}m</span>}
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="card-surface p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> All ({mockFacilities.length})
          </button>
          <button
            onClick={() => setFilter("hospital")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
              filter === "hospital"
                ? "bg-emergency-500 text-white"
                : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
            )}
          >
            <Building2 className="h-3.5 w-3.5 text-emergency-500" /> Hospitals
          </button>
          <button
            onClick={() => setFilter("police")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
              filter === "police"
                ? "bg-primary-600 text-white"
                : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
            )}
          >
            <Shield className="h-3.5 w-3.5 text-primary-500" /> Police
          </button>
          <button
            onClick={() => setFilter("pharmacy")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
              filter === "pharmacy"
                ? "bg-amber-500 text-white"
                : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
            )}
          >
            <Pill className="h-3.5 w-3.5 text-amber-500" /> Pharmacies
          </button>
          <button
            onClick={() => setFilter("safezone")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
              filter === "safezone"
                ? "bg-indigo-600 text-white"
                : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
            )}
          >
            <CheckCircle className="h-3.5 w-3.5 text-indigo-500" /> Safe Zones
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location or facility..."
            className="pl-9 h-9 text-xs bg-surface-muted border-line"
          />
        </div>
      </div>

      {/* Main Map Container and Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet & Google Maps Engine Box */}
        <div className="lg:col-span-2 card-surface p-2 overflow-hidden h-[520px] min-h-[520px] relative z-10 shadow-elevated">
          <MapContainer
            center={userPos}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%", minHeight: "500px", borderRadius: "12px" }}
          >
            {/* Auto Recenter Map on GPS Update */}
            <MapRecenter center={userPos} />

            <TileLayer
              attribution={MAP_LAYERS[mapProvider].attribution}
              url={MAP_LAYERS[mapProvider].url}
            />

            {/* Current User Location Marker */}
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <div className="text-xs p-1 font-sans">
                  <p className="font-bold text-primary-600 flex items-center gap-1">
                    <LocateFixed className="h-3.5 w-3.5 text-emerald-600" /> Your Live GPS Location
                  </p>
                  <p className="text-gray-600 font-mono text-[11px]">
                    Lat: {userPos[0].toFixed(5)}, Lng: {userPos[1].toFixed(5)}
                  </p>
                  {gpsAccuracy && <p className="text-[10px] text-emerald-600 font-bold">Accuracy: ±{gpsAccuracy} meters</p>}
                </div>
              </Popup>
            </Marker>

            {/* Selected Facility Navigation Route Polyline */}
            {selectedFacility && (
              <Polyline
                positions={[
                  userPos,
                  [selectedFacility.lat, selectedFacility.lng]
                ]}
                color="#2563EB"
                weight={5}
                dashArray="10, 10"
              />
            )}

            {/* Facility Markers */}
            {filteredFacilities.map((fac) => (
              <Marker
                key={fac.id}
                position={[fac.lat, fac.lng]}
                icon={defaultIcon}
                eventHandlers={{
                  click: () => setSelectedFacility(fac),
                }}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <p className="font-bold text-gray-900">{fac.name}</p>
                    <p className="text-gray-600">{fac.address}</p>
                    <p className="font-semibold text-emerald-600">{fac.distance} · ETA {fac.eta}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Nearby Facilities List & Route Guidance */}
        <div className="space-y-4">
          <div className="card-surface p-5 max-h-[500px] overflow-y-auto space-y-3">
            <h3 className="text-base font-semibold text-ink-primary flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary-500" /> Nearby Facilities ({filteredFacilities.length})
            </h3>

            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer hover:border-primary-300",
                  selectedFacility?.id === fac.id
                    ? "bg-primary-50 border-primary-400 shadow-sm"
                    : "bg-surface-muted border-line"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-ink-primary">{fac.name}</h4>
                    <p className="text-[11px] text-ink-secondary">{fac.address}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-emerald-600 border border-emerald-200 shrink-0">
                    {fac.distance}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-ink-secondary flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ETA {fac.eta}
                  </span>
                  <a
                    href={`tel:${fac.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:underline"
                  >
                    <Phone className="h-3 w-3" /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Facility Navigation Modal / Panel */}
      {selectedFacility && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 border-l-4 border-l-primary-600 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {selectedFacility.category}
              </span>
              <h3 className="text-lg font-bold text-ink-primary">{selectedFacility.name}</h3>
            </div>
            <p className="text-xs text-ink-secondary">{selectedFacility.address}</p>
            <p className="text-xs text-emerald-600 font-semibold">{selectedFacility.openHours}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a href={`tel:${selectedFacility.phone}`}>
              <Button size="sm" variant="outline" className="gap-2 text-xs">
                <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call Facility
              </Button>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userPos[0]},${userPos[1]}&destination=${selectedFacility.lat},${selectedFacility.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-2 text-xs bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md">
                <ExternalLink className="h-3.5 w-3.5" /> Navigate with Google Maps ({selectedFacility.eta})
              </Button>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}

