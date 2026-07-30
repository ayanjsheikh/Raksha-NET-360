import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Check } from "lucide-react";
import type { ProfileCategoryOption } from "@/data/profileCategories";
import { cn } from "@/utils/cn";

export function CategoryCard({
  category,
  selected,
  onSelect,
  index = 0,
}: {
  category: ProfileCategoryOption;
  selected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  const Icon = (Icons as Record<string, Icons.LucideIcon>)[category.icon];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-start gap-4 rounded-2xl border bg-surface p-6 text-left shadow-soft transition-all duration-200",
        selected
          ? cn("border-transparent ring-2", category.ring)
          : "border-line hover:border-primary-200"
      )}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}

      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white",
          category.gradient
        )}
      >
        {Icon && <Icon className="h-6 w-6" strokeWidth={2} />}
      </span>

      <div>
        <p className="font-semibold text-ink-primary">{category.label}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
          {category.description}
        </p>
      </div>
    </motion.button>
  );
}
