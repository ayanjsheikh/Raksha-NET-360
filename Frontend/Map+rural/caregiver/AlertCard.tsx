/**
 * AlertCard.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 3: Caregiver Dashboard
 *
 * Renders a single emergency alert / SOS history entry with severity-based
 * styling (matches the AI Engine's emergency classification from Phase 5:
 * critical / warning / info).
 * ---------------------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, Info, MapPin, Clock } from "lucide-react";
import { EmergencyAlert } from "./Dashboard";

interface AlertCardProps {
  alert: EmergencyAlert;
  onViewOnMap: (alert: EmergencyAlert) => void;
}

const severityMeta = {
  critical: { icon: AlertOctagon, color: "#E53935", label: "Critical" },
  warning: { icon: AlertTriangle, color: "#F9A825", label: "Warning" },
  info: { icon: Info, color: "#1565C0", label: "Info" },
} as const;

export function AlertCard({ alert, onViewOnMap }: AlertCardProps) {
  const meta = severityMeta[alert.severity];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-800 truncate">{alert.title}</h4>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.description}</p>

        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {alert.timestamp}
          </span>
          {alert.hasLocation && (
            <button
              onClick={() => onViewOnMap(alert)}
              className="flex items-center gap-1 font-medium text-[#1565C0]"
            >
              <MapPin size={12} /> View on map
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
