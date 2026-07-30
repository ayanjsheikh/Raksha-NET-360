import { ShieldPlus } from "lucide-react";
import { cn } from "@/utils/cn";

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-card shrink-0">
        <ShieldPlus className="h-5 w-5 text-white" strokeWidth={2.4} />
      </span>
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-ink-primary">
          RakshaNet <span className="text-primary-500">360</span>
        </span>
      )}
    </div>
  );
}
