import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
