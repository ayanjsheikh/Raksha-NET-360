import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { FEATURES } from "@/data/landingContent";
import { cn } from "@/utils/cn";

const ACCENT_STYLES: Record<string, string> = {
  primary: "bg-primary-50 text-primary-500",
  emergency: "bg-emergency-50 text-emergency-500",
  danger: "bg-danger-50 text-danger-500",
  warning: "bg-warning-50 text-warning-500",
  accent: "bg-accent-50 text-accent-500",
};

export function FeaturesSection() {
  return (
    <section id="features" className="section-pad py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">
            Platform
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
            Everything an emergency needs, in one calm interface
          </h2>
          <p className="mt-4 text-ink-secondary">
            RakshaNet 360 brings AI health monitoring and emergency response
            together, so protection feels effortless — not overwhelming.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = (Icons as Record<string, Icons.LucideIcon>)[feature.icon];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="card-surface p-7"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    ACCENT_STYLES[feature.accent]
                  )}
                >
                  {Icon && <Icon className="h-6 w-6" strokeWidth={2} />}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
