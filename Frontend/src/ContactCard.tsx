import { motion } from "framer-motion";
import { Phone, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import type { EmergencyContact } from "@/types/dashboard";

function Avatar({ seed, name }: { seed: string; name: string }) {
  const colors = [
    "bg-primary-100 text-primary-700",
    "bg-emergency-100 text-emergency-700",
    "bg-accent-100 text-accent-700",
    "bg-warning-100 text-warning-700",
  ];
  const colorIndex = seed.charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        colors[colorIndex]
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

interface ContactCardProps {
  contacts: EmergencyContact[];
}

export function ContactCard({ contacts }: ContactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="card-surface p-6"
    >
      <h3 className="text-lg font-semibold text-ink-primary mb-5">Emergency Contacts</h3>
      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center justify-between rounded-xl border border-line p-3 hover:bg-surface-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar seed={contact.avatarSeed} name={contact.name} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-ink-primary">{contact.name}</p>
                  {contact.isPrimary && (
                    <Star className="h-3 w-3 fill-warning-500 text-warning-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-ink-secondary">{contact.relationship}</p>
                <p className="text-xs text-primary-600">{contact.phone}</p>
              </div>
            </div>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emergency-500 text-white hover:bg-emergency-600 transition-colors"
              aria-label={`Call ${contact.name}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
