import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/landingContent";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-pad py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-500">
            Trusted nationwide
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
            Families, doctors, and health workers rely on RakshaNet
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-surface flex flex-col p-7"
            >
              <Quote className="h-8 w-8 text-primary-200" strokeWidth={2} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-primary">
                “{t.quote}”
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-white"
                  aria-hidden
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-primary">{t.name}</p>
                  <p className="text-xs text-ink-secondary">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
