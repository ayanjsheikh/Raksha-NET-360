import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/utils/cn";
import type { HealthScore } from "@/types/dashboard";

interface HealthCardProps {
  data: HealthScore;
  className?: string;
}

function CircularProgress({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <motion.span
          className="text-4xl font-bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-white/80">/ 100</span>
      </div>
    </div>
  );
}

export function HealthCard({ data, className }: HealthCardProps) {
  const riskColors = {
    low: "bg-emergency-500/20 text-emergency-100 border-emergency-500/30",
    moderate: "bg-warning-500/20 text-warning-100 border-warning-500/30",
    high: "bg-danger-500/20 text-danger-100 border-danger-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-hero p-6 shadow-elevated",
        className
      )}
    >
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-emergency-500/20 blur-2xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-white/80">Health Score</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-white/20 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
                Grade {data.grade}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-lg border px-3 py-1 text-sm font-medium capitalize backdrop-blur-sm",
                  riskColors[data.riskLevel]
                )}
              >
                {data.riskLevel} Risk
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <Icons.Sparkles className="h-3.5 w-3.5" />
                Health Age: {data.healthAge}
              </span>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/90">{data.aiSummary}</p>
        </div>

        <CircularProgress score={data.score} />
      </div>
    </motion.div>
  );
}
