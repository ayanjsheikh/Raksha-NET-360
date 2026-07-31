import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { cn } from "@/utils/cn";
import type { QuickAction } from "@/types/dashboard";

const accentStyles = {
  primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
  emergency: "bg-emergency-50 text-emergency-600 group-hover:bg-emergency-100",
  danger: "bg-danger-50 text-danger-600 group-hover:bg-danger-100",
  warning: "bg-warning-50 text-warning-600 group-hover:bg-warning-100",
  accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
};

interface QuickActionCardProps {
  action: QuickAction;
  index?: number;
}

export function QuickActionCard({ action, index = 0 }: QuickActionCardProps) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<any>>)[action.icon];

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group card-surface flex flex-col gap-3 p-4 cursor-pointer hover:shadow-card transition-shadow"
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
          accentStyles[action.accent]
        )}
      >
        {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-primary">{action.title}</p>
        <p className="mt-0.5 text-xs text-ink-secondary">{action.description}</p>
      </div>
    </motion.div>
  );

  if (action.path) {
    return <Link to={action.path}>{content}</Link>;
  }

  return content;
}
