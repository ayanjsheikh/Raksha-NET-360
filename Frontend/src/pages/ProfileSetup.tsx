import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { Button } from "@/components/ui/button";
import { PROFILE_CATEGORIES } from "@/data/profileCategories";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/navigation";
import type { UserCategory } from "@/types";

export default function ProfileSetup() {
  const [selected, setSelected] = useState<UserCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, setCategory } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) return;
    setSubmitting(true);
    setCategory(selected);
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate(ROUTES.dashboard);
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="section-pad flex h-20 items-center justify-between border-b border-line bg-surface">
        <Logo />
        <div className="flex items-center gap-2 text-xs font-medium text-ink-secondary">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
            ✓
          </span>
          Account
          <span className="mx-1 h-px w-6 bg-line" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
            2
          </span>
          Profile
        </div>
      </header>

      <main className="section-pad py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
              {user?.name ? `Welcome, ${user.name.split(" ")[0]}.` : "Welcome."}{" "}
              Who are we protecting?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-ink-secondary">
              This tailors your dashboard, alerts, and emergency modules. You
              can add more profiles or change this later in Settings.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROFILE_CATEGORIES.map((category, i) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={i}
                selected={selected === category.id}
                onSelect={() => setSelected(category.id)}
              />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="w-full max-w-xs"
              disabled={!selected || submitting}
              onClick={handleContinue}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up your dashboard...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <button
              onClick={() => navigate(ROUTES.dashboard)}
              className="text-sm font-medium text-ink-secondary hover:text-primary-500"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
