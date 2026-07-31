import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Moon,
  Search,
  Sun,
  CheckCheck,
  Trash2,
  Pill,
  Activity,
  Calendar,
  ShieldAlert,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useClock } from "@/hooks/useClock";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/utils/cn";

export function AppNavbar() {
  const { user } = useAuth();
  const { time, shortDate } = useClock();
  const { isDark, toggle } = useDarkMode();

  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifList, setNotifList] = useState([
    {
      id: "n-1",
      title: "Evening Medicine Reminder",
      desc: "Take Metformin 500mg after dinner",
      time: "10 mins ago",
      read: false,
      type: "medication",
    },
    {
      id: "n-2",
      title: "Senior Fall Detection Sensor Armed",
      desc: "Ramesh Kumar fall accelerometer online & protecting",
      time: "25 mins ago",
      read: false,
      type: "emergency",
    },
    {
      id: "n-3",
      title: "Weekly AI Health Index Ready",
      desc: "Cardiovascular & SpO2 index computed at 92%",
      time: "2 hours ago",
      read: true,
      type: "health",
    },
    {
      id: "n-4",
      title: "Child Safe Zone Geofence Verified",
      desc: "Kavya Sharma location verified in Green Zone",
      time: "5 hours ago",
      read: true,
      type: "appointment",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifList((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const toggleNotifRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item))
    );
  };

  const removeNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllNotifs = () => {
    setNotifList([]);
  };

  const filteredNotifs = notifList.filter((item) => (filter === "unread" ? !item.read : true));

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-line bg-surface/95 backdrop-blur-md lg:left-72">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-4 lg:hidden">
          <Logo iconOnly />
        </div>

        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <Input
              placeholder="Search health records, contacts..."
              className="h-10 pl-10 bg-surface-muted border-transparent focus-visible:border-primary-500 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm font-semibold tabular-nums text-ink-primary">{time}</span>
            <span className="text-[11px] text-ink-secondary">{shortDate}</span>
          </div>

          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-secondary hover:bg-surface-muted hover:text-ink-primary transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Interactive Notifications Bell & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer",
                showNotifications
                  ? "bg-primary-50 text-primary-600 ring-2 ring-primary-500/20"
                  : "text-ink-secondary hover:bg-surface-muted hover:text-ink-primary"
              )}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-line shadow-2xl z-50 overflow-hidden text-ink-primary"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-sm font-bold">Notifications Center</h3>
                      {unreadCount > 0 && (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} NEW
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> Mark read
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="px-4 py-2 bg-surface-muted border-b border-line flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setFilter("all")}
                        className={cn(
                          "px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer",
                          filter === "all" ? "bg-white text-primary-700 shadow-xs" : "text-ink-secondary hover:text-ink-primary"
                        )}
                      >
                        All ({notifList.length})
                      </button>
                      <button
                        onClick={() => setFilter("unread")}
                        className={cn(
                          "px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer",
                          filter === "unread" ? "bg-white text-primary-700 shadow-xs" : "text-ink-secondary hover:text-ink-primary"
                        )}
                      >
                        Unread ({unreadCount})
                      </button>
                    </div>

                    {notifList.length > 0 && (
                      <button
                        onClick={clearAllNotifs}
                        className="text-ink-secondary hover:text-rose-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Clear
                      </button>
                    )}
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-line">
                    {filteredNotifs.length === 0 ? (
                      <div className="p-8 text-center text-ink-secondary space-y-2">
                        <CheckCheck className="h-8 w-8 mx-auto text-emerald-500/60" />
                        <p className="text-xs font-bold text-ink-primary">All caught up!</p>
                        <p className="text-[11px]">No active notifications to display.</p>
                      </div>
                    ) : (
                      filteredNotifs.map((item) => (
                        <div
                          key={item.id}
                          onClick={(e) => toggleNotifRead(item.id, e)}
                          className={cn(
                            "p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 relative group",
                            !item.read ? "bg-primary-50/40" : "bg-white"
                          )}
                        >
                          {/* Unread indicator dot */}
                          {!item.read && (
                            <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-rose-600" />
                          )}

                          {/* Type Icon */}
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0 mt-0.5",
                              item.type === "emergency"
                                ? "bg-rose-600"
                                : item.type === "medication"
                                ? "bg-amber-500"
                                : item.type === "health"
                                ? "bg-emerald-600"
                                : "bg-primary-600"
                            )}
                          >
                            {item.type === "emergency" ? (
                              <ShieldAlert className="h-4 w-4 animate-pulse" />
                            ) : item.type === "medication" ? (
                              <Pill className="h-4 w-4" />
                            ) : item.type === "health" ? (
                              <Activity className="h-4 w-4" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center justify-between gap-1">
                              <p className={cn("text-xs leading-tight font-bold", !item.read ? "text-ink-primary" : "text-slate-600")}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-ink-secondary shrink-0">{item.time}</span>
                            </div>
                            <p className="text-[11px] text-ink-secondary mt-0.5 leading-snug line-clamp-2">
                              {item.desc}
                            </p>
                          </div>

                          {/* Item Action Buttons */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 self-center">
                            <button
                              onClick={(e) => toggleNotifRead(item.id, e)}
                              className="p-1 rounded hover:bg-slate-200 text-slate-600 text-[10px]"
                              title={item.read ? "Mark unread" : "Mark read"}
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => removeNotif(item.id, e)}
                              className="p-1 rounded hover:bg-rose-100 text-slate-500 hover:text-rose-600 text-[10px]"
                              title="Dismiss notification"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2.5 bg-surface-muted border-t border-line text-center">
                    <span className="text-[10px] font-semibold text-ink-secondary">
                      RakshaNet Automated Real-Time Guard System
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/app/profile"
            className="flex items-center gap-2.5 pl-1 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-ink-primary leading-tight">
                {user?.name ?? "Aarav Sharma"}
              </p>
              <p className="text-[11px] text-ink-secondary capitalize">
                {user?.category ?? "Primary User"}
              </p>
            </div>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-white shrink-0 ring-2 ring-primary-100 shadow-xs"
              )}
            >
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}


