import { motion } from "framer-motion";
import { Bell, Check, Clock, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { Medication } from "@/types/dashboard";

const statusConfig = {
  pending: { label: "Due Now", color: "bg-warning-50 text-warning-600 border-warning-100" },
  taken: { label: "Taken", color: "bg-emergency-50 text-emergency-600 border-emergency-100" },
  missed: { label: "Missed", color: "bg-danger-50 text-danger-600 border-danger-100" },
  upcoming: { label: "Upcoming", color: "bg-primary-50 text-primary-600 border-primary-100" },
};

interface MedicationCardProps {
  medications: Medication[];
}

export function MedicationCard({ medications }: MedicationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="card-surface p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-ink-primary">Upcoming Medication</h3>
        <Pill className="h-5 w-5 text-accent-500" />
      </div>

      <div className="space-y-3">
        {medications.map((med, index) => {
          const status = statusConfig[med.status];
          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center justify-between rounded-xl border border-line p-4 hover:bg-surface-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Pill className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-primary">{med.name}</p>
                  <p className="text-xs text-ink-secondary">
                    {med.dosage} · {med.instructions}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-secondary">
                    <Clock className="h-3 w-3" />
                    {med.time}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={cn("rounded-lg border px-2 py-0.5 text-[10px] font-semibold", status.color)}>
                  {status.label}
                </span>
                {med.status === "pending" && (
                  <Button variant="subtle" size="sm" className="h-8 gap-1 text-xs">
                    <Bell className="h-3 w-3" />
                    Remind
                  </Button>
                )}
                {med.status === "taken" && (
                  <span className="flex items-center gap-1 text-xs text-emergency-600">
                    <Check className="h-3 w-3" />
                    Done
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
