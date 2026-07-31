/**
 * Timeline.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 3: Caregiver Dashboard
 *
 * Vertical "Emergency Timeline" — chronological view of SOS events, health
 * anomalies, and system notifications for a single patient. Used inside the
 * patient detail view of the Dashboard.
 * ---------------------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { TimelineEvent } from "./Dashboard";

const dotColor: Record<TimelineEvent["type"], string> = {
  sos: "#E53935",
  health: "#F9A825",
  location: "#1565C0",
  system: "#94A3B8",
};

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-8">No events recorded yet.</p>;
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />

      {events.map((event, idx) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.04 }}
          className="relative pb-6 last:pb-0"
        >
          <span
            className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: dotColor[event.type] }}
          />
          <p className="text-xs font-medium text-slate-400">{event.timestamp}</p>
          <h4 className="text-sm font-semibold text-slate-800 mt-0.5">{event.title}</h4>
          {event.description && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
