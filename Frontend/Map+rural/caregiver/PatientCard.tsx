/**
 * PatientCard.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 3: Caregiver Dashboard
 *
 * Reusable card summarizing a single patient in the caregiver's patient list:
 * health score, battery level, last seen, and quick-action buttons
 * (Quick Contact / Live Location) as required by the spec.
 * ---------------------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { Battery, BatteryLow, MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import { Patient } from "./Dashboard";

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
  onCall: (patient: Patient) => void;
  onLiveLocation: (patient: Patient) => void;
}

function healthScoreColor(score: number) {
  if (score >= 80) return "#00B894";
  if (score >= 50) return "#F9A825";
  return "#E53935";
}

export function PatientCard({ patient, onSelect, onCall, onLiveLocation }: PatientCardProps) {
  const scoreColor = healthScoreColor(patient.healthScore);
  const BatteryIcon = patient.batteryLevel <= 20 ? BatteryLow : Battery;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 cursor-pointer"
      onClick={() => onSelect(patient)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm shrink-0"
            style={{ backgroundColor: scoreColor }}
          >
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 text-sm">{patient.name}</h3>
              {patient.sosActive && (
                <span className="text-[10px] font-bold text-white bg-[#E53935] px-2 py-0.5 rounded-full animate-pulse">
                  SOS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {patient.age} yrs · {patient.condition}
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-300" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div>
          <p className="text-sm font-bold" style={{ color: scoreColor }}>
            {patient.healthScore}
          </p>
          <p className="text-[10px] text-slate-400">Health Score</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
            <BatteryIcon size={14} className={patient.batteryLevel <= 20 ? "text-[#E53935]" : ""} />
            {patient.batteryLevel}%
          </p>
          <p className="text-[10px] text-slate-400">Device Battery</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
            <Clock size={14} /> {patient.lastSeen}
          </p>
          <p className="text-[10px] text-slate-400">Last Seen</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCall(patient);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#00B894]/10 text-[#00B894] text-xs font-semibold py-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Phone size={14} /> Quick Contact
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLiveLocation(patient);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#1565C0]/10 text-[#1565C0] text-xs font-semibold py-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <MapPin size={14} /> Live Location
        </button>
      </div>
    </motion.div>
  );
}
