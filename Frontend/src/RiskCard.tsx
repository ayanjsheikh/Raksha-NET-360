import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import type { RiskAnalysis } from "@/types/dashboard";

const trendConfig = {
  improving: { icon: TrendingUp, color: "text-emergency-600", label: "Improving" },
  stable: { icon: Minus, color: "text-primary-600", label: "Stable" },
  declining: { icon: TrendingDown, color: "text-danger-600", label: "Declining" },
};

const levelColors = {
  low: "from-emergency-500 to-emergency-600",
  moderate: "from-warning-500 to-warning-600",
  high: "from-danger-500 to-danger-600",
};

interface RiskCardProps {
  data: RiskAnalysis;
}

export function RiskCard({ data }: RiskCardProps) {
  const trend = trendConfig[data.trend];
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card-surface p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink-primary">Risk Analysis</h3>
          <p className="text-sm text-ink-secondary capitalize">{data.level} Risk Profile</p>
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-medium", trend.color)}>
          <TrendIcon className="h-4 w-4" />
          {trend.label}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-bold text-ink-primary">{data.percentage}%</span>
          <span className="text-xs text-ink-secondary">{data.trendValue}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", levelColors[data.level])}
            initial={{ width: 0 }}
            animate={{ width: `${data.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl bg-primary-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Prediction
          </p>
          <p className="mt-1 text-sm text-ink-primary">{data.prediction}</p>
        </div>
        <div className="rounded-xl bg-emergency-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emergency-600">
            Recommendation
          </p>
          <p className="mt-1 text-sm text-ink-primary">{data.recommendation}</p>
        </div>
      </div>
    </motion.div>
  );
}
