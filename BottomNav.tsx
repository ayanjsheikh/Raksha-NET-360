import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { MOBILE_NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = (Icons as Record<string, Icons.LucideIcon>)[item.icon];
          const isSOS = item.icon === "Siren";
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary-500" : "text-ink-secondary"
                )
              }
            >
              {({ isActive }) =>
                isSOS ? (
                  <>
                    <span className="flex h-11 w-11 -mt-6 items-center justify-center rounded-full bg-gradient-danger shadow-elevated ring-4 ring-surface">
                      {Icon && <Icon className="h-5 w-5 text-white" strokeWidth={2.4} />}
                    </span>
                    <span className={isActive ? "text-danger-500" : "text-ink-secondary"}>
                      {item.label}
                    </span>
                  </>
                ) : (
                  <>
                    {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
                    {item.label}
                  </>
                )
              }
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
