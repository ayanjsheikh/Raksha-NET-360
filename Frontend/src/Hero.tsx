import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, ShieldCheck, Siren } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: "easeOut" },
  }),
};

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden section-pad pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Ambient gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-40 h-96 w-96 rounded-full bg-emergency-100/50 blur-3xl"
      />

      <div className="container relative grid items-center gap-16 lg:grid-cols-2">
        <div>
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-medium text-primary-600 shadow-soft"
          >
            <span className="h-2 w-2 rounded-full bg-emergency-500 animate-pulse" />
            AI-powered emergency response, live in 640+ districts
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink-primary md:text-6xl"
          >
            Every second counts.
            <br />
            <span className="text-primary-500">RakshaNet</span> makes sure
            help never waits.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-ink-secondary"
          >
            One platform that watches your health quietly in the background,
            and reaches ambulances, hospitals, police, and your family the
            instant something goes wrong — for children, women, elderly
            parents, and rural communities alike.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" onClick={() => navigate(ROUTES.register)}>
              Get Protected Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.login)}>
              I already have an account
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-12 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { value: "3s", label: "avg. SOS trigger" },
              { value: "24/7", label: "AI health monitoring" },
              { value: "99.9%", label: "alert delivery rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-ink-primary">{stat.value}</p>
                <p className="text-xs text-ink-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative rounded-3xl bg-gradient-hero p-8 shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Good evening, Aarav</p>
                <p className="text-2xl font-bold text-white">Health Score: 92</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <HeartPulse className="h-6 w-6 text-white" />
              </span>
            </div>

            <div className="mt-6 h-24 w-full rounded-2xl bg-white/10 backdrop-blur-sm flex items-end gap-1.5 p-4">
              {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                  className="flex-1 rounded-full bg-white/70"
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/95 p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50">
                  <Siren className="h-5 w-5 text-danger-500" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-primary">
                    Hold for SOS
                  </p>
                  <p className="text-xs text-ink-secondary">3 seconds to alert</p>
                </div>
              </div>
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="h-3 w-3 rounded-full bg-danger-500"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-8 top-8 hidden md:flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 shadow-elevated"
          >
            <ShieldCheck className="h-5 w-5 text-emergency-500" />
            <span className="text-xs font-semibold text-ink-primary">
              Trusted contacts notified
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
