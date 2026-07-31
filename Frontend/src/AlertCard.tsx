import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import type { HealthAlert } from "@/types/dashboard";

const severityStyles = {
  emergency: {
    dot: "bg-danger-500",
    bg: "bg-danger-50",
    icon: "text-danger-600",
    border: "border-danger-100",
  },
  warning: {
    dot: "bg-warning-500",
    bg: "bg-warning-50",
    icon: "text-warning-600",
    border: "border-warning-100",
  },
  info: {
    dot: "bg-primary-500",
    bg: "bg-primary-50",
    icon: "text-primary-600",
    border: "border-primary-100",
  },
  success: {
    dot: "bg-emergency-500",
    bg: "bg-emergency-50",
    icon: "text-emergency-600",
    border: "border-emergency-100",
  },
};

interface AlertCardProps {
  alerts: HealthAlert[];
}

export function AlertCard({ alerts }: AlertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="card-surface p-6"
    >
      <h3 className="text-lg font-semibold text-ink-primary mb-5">Recent Alerts</h3>
      <div className="relative space-y-0">
        {alerts.map((alert, index) => {
          const styles = severityStyles[alert.severity];
          const Icon = (Icons as unknown as Record<string, React.ComponentType<any>>)[alert.icon];
          const isLast = index === alerts.length - 1;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {!isLast && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-line" />
              )}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                <span className={cn("absolute h-3 w-3 rounded-full", styles.dot)} />
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border",
                    styles.bg,
                    styles.border
                  )}
                >
                  {Icon && <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={2} />}
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-primary">{alert.title}</p>
                  <span className="shrink-0 text-xs text-ink-secondary">{alert.time}</span>
                </div>
                <p className="mt-1 text-sm text-ink-secondary">{alert.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
