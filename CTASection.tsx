import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/navigation";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="section-pad pb-24 md:pb-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-hero px-8 py-16 text-center shadow-elevated md:px-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white md:text-4xl">
            Protection shouldn't wait for an emergency to matter.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Set up your RakshaNet profile in under two minutes. It's free for
            individuals and families.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-white/90"
              onClick={() => navigate(ROUTES.register)}
            >
              Create your free account
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate(ROUTES.login)}
            >
              Log in
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
