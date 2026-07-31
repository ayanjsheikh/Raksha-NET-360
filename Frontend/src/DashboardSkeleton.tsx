import { motion } from "framer-motion";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-line/60 ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s linear infinite",
      }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="h-4 w-48" />
      </div>

      <SkeletonBlock className="h-48 w-full rounded-2xl" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-28" />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </div>
    </motion.div>
  );
}
