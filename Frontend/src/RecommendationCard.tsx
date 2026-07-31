import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/utils/cn";
import type { AiRecommendation } from "@/types/dashboard";

const priorityStyles = {
  high: "border-l-danger-500 bg-danger-50/50",
  medium: "border-l-warning-500 bg-warning-50/50",
  low: "border-l-primary-500 bg-primary-50/50",
};

interface RecommendationCardProps {
  recommendations: AiRecommendation[];
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {recommendations.map((rec, index) => {
        const Icon = (Icons as unknown as Record<string, React.ComponentType<any>>)[rec.icon];
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className={cn(
              "card-surface border-l-4 p-4 hover:shadow-card transition-shadow",
              priorityStyles[rec.priority]
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-soft">
                {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink-primary">{rec.title}</p>
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium uppercase text-ink-secondary">
                    {rec.category}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
