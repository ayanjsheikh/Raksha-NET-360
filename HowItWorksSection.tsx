import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { HOW_IT_WORKS } from "@/data/landingContent";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-pad py-24 md:py-32 bg-surface">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-emergency-600">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
            From setup to rescue, in four simple steps
          </h2>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-4">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-line" />
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = (Icons as Record<string, Icons.LucideIcon>)[step.icon];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-card">
                  {Icon && <Icon className="h-7 w-7" strokeWidth={2} />}
                </span>
                <span className="mt-4 text-xs font-semibold text-primary-500">
                  Step {step.step}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-ink-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink-secondary">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
