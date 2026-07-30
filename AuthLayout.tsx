import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HeartPulse, MapPinned, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { ROUTES } from "@/constants/navigation";

const PANEL_POINTS = [
  { icon: ShieldCheck, text: "One-tap SOS reaches help in under 3 seconds" },
  { icon: HeartPulse, text: "AI reads your vitals for early risk warnings" },
  { icon: MapPinned, text: "Live map to the nearest hospital or police" },
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:flex lg:flex-col lg:justify-between p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />

        <Link to={ROUTES.landing} className="relative z-10">
          <Logo className="[&_span]:text-white" />
        </Link>

        <div className="relative z-10">
          <h2 className="max-w-md text-3xl font-bold leading-snug text-white">
            Protection that watches quietly, and acts instantly.
          </h2>
          <div className="mt-10 space-y-5">
            {PANEL_POINTS.map((point, i) => (
              <motion.div
                key={point.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <point.icon className="h-5 w-5 text-white" />
                </span>
                <p className="text-sm text-white/90">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} RakshaNet 360
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to={ROUTES.landing} className="lg:hidden mb-10 inline-block">
            <Logo />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-ink-primary">{title}</h1>
            <p className="mt-2 text-sm text-ink-secondary">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
