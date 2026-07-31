import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/utils/cn";
import type { HealthStat } from "@/types/dashboard";

const statusColors = {
  good: "text-emergency-600",
  warning: "text-warning-600",
  critical: "text-danger-600",
};

const trendIcons = {
  up: Icons.TrendingUp,
  down: Icons.TrendingDown,
  stable: Icons.Minus,
};

interface StatCardProps {
  stat: HealthStat;
  index?: number;
}

export function StatCard({ stat, index = 0 }: StatCardProps) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<any>>)[stat.icon];
  const TrendIcon = trendIcons[stat.trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="card-surface p-4 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium", statusColors[stat.status])}>
          <TrendIcon className="h-3.5 w-3.5" />
          {stat.trendValue}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-ink-secondary">{stat.label}</p>
        <p className="mt-1 text-2xl font-bold text-ink-primary">
          {stat.value}
          <span className="ml-1 text-sm font-normal text-ink-secondary">{stat.unit}</span>
        </p>
      </div>
    </motion.div>
  );
}
