import { NavLink, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { APP_NAV_ITEMS, ROUTES } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };


  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 flex-col border-r border-line bg-surface">
      <div className="flex h-20 items-center px-6 border-b border-line">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {APP_NAV_ITEMS.map((item) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<any>>)[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-ink-secondary hover:bg-surface-muted hover:text-ink-primary"
                )
              }
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-muted p-3">
          <NavLink to={ROUTES.profile} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-white shrink-0 shadow-xs">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-primary">
                {user?.name ?? "Aarav Sharma"}
              </p>
              <p className="truncate text-[11px] text-ink-secondary">
                View Profile & Pass
              </p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-secondary hover:bg-white hover:text-danger-500 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
