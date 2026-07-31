import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAV_LINKS, ROUTES } from "@/constants/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container flex h-20 items-center justify-between">
        <Link to={ROUTES.landing}>
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {PUBLIC_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTES.login)}>
            Log in
          </Button>
          <Button variant="primary" onClick={() => navigate(ROUTES.register)}>
            Get Protected
          </Button>
        </div>

        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-line"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-line bg-surface"
          >
            <div className="container flex flex-col gap-4 py-6">
              {PUBLIC_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-ink-secondary"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <Button variant="outline" onClick={() => navigate(ROUTES.login)}>
                  Log in
                </Button>
                <Button variant="primary" onClick={() => navigate(ROUTES.register)}>
                  Get Protected
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
