/**
 * HospitalLocator.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 2: Nearby Emergency Services
 *
 * Reusable card list that renders the top 5 nearest emergency services
 * (hospitals, police stations, pharmacies). Used inside the Emergency Map's
 * bottom sheet, and can be reused stand-alone anywhere a "nearby services"
 * list is needed (e.g. caregiver dashboard's quick-contact panel).
 *
 * Each card shows:
 *   Name · Distance · ETA · Open/Closed · Emergency Available · Phone
 *   [Navigate] [Call]
 * ---------------------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { Hospital, ShieldAlert, Pill, Stethoscope, Phone, Navigation2, Clock } from "lucide-react";
import { EmergencyPlace, ServiceType } from "./MapService";

interface HospitalLocatorProps {
  places: EmergencyPlace[];
  loading?: boolean;
  onNavigate: (place: EmergencyPlace) => void;
}

const typeMeta: Record<ServiceType, { icon: React.ReactNode; color: string; label: string }> = {
  hospital: { icon: <Hospital size={18} />, color: "#1565C0", label: "Hospital" },
  police: { icon: <ShieldAlert size={18} />, color: "#00B894", label: "Police Station" },
  pharmacy: { icon: <Pill size={18} />, color: "#FF7043", label: "Pharmacy" },
  clinic: { icon: <Stethoscope size={18} />, color: "#F9A825", label: "Clinic" },
};

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-slate-100 rounded-2xl p-4 mb-3">
      <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-1/3 bg-slate-100 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-slate-100 rounded-xl" />
        <div className="h-8 flex-1 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export function HospitalLocator({ places, loading, onNavigate }: HospitalLocatorProps) {
  if (loading && places.length === 0) {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!loading && places.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        No emergency services found nearby. Try widening your search.
      </div>
    );
  }

  return (
    <div>
      {places.map((place, idx) => {
        const meta = typeMeta[place.type];
        return (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
                >
                  {meta.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{meta.label} · {place.address}</p>
                </div>
              </div>

              {place.emergencyAvailable && (
                <span className="text-[10px] font-semibold text-[#E53935] bg-[#E53935]/10 px-2 py-1 rounded-full whitespace-nowrap">
                  24×7 Emergency
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Navigation2 size={13} /> {place.distanceKm} km
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {place.etaMinutes} min
              </span>
              <span
                className={`font-medium ${place.isOpen ? "text-[#00B894]" : "text-[#E53935]"}`}
              >
                {place.isOpen ? "Open now" : "Closed"}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onNavigate(place)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#1565C0] text-white text-xs font-semibold py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                <Navigation2 size={14} /> Navigate
              </button>
              <a
                href={`tel:${place.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#00B894]/10 text-[#00B894] text-xs font-semibold py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                <Phone size={14} /> Call
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
