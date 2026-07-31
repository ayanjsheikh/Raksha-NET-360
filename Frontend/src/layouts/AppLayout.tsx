import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { AppNavbar } from "@/components/dashboard/AppNavbar";
import { BottomNav } from "@/components/shared/BottomNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-muted text-ink-primary font-sans antialiased">
      <Sidebar />
      <AppNavbar />
      <main className="pt-16 lg:pl-72 pb-24 lg:pb-10 min-h-screen transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
