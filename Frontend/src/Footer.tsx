import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Logo } from "./Logo";

const FOOTER_LINKS = {
  Product: ["Features", "How it Works", "Pricing", "Security"],
  Modules: ["Women Safety", "Child Care", "Elderly Care", "Rural Mode"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Data Protection"],
};

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-secondary">
              AI-powered health and emergency response, built to reach every
              life — in the city, at home, or in the most remote village.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-ink-secondary hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-ink-primary">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ink-secondary hover:text-primary-500 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row">
          <p className="text-xs text-ink-secondary">
            © {new Date().getFullYear()} RakshaNet 360. Built for a healthier,
            safer nation.
          </p>
          <p className="text-xs text-ink-secondary">
            In a medical emergency, always call your local emergency number
            first.
          </p>
        </div>
      </div>
    </footer>
  );
}
