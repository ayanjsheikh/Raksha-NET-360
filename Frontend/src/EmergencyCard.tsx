import { motion } from "framer-motion";
import { Building2, Phone, Shield, Siren, IdCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type {
  EmergencyContact,
  EmergencyFacility,
  MedicalId,
  SosHistoryEntry,
} from "@/types/dashboard";

interface EmergencyCardProps {
  facilities: EmergencyFacility[];
  contacts: EmergencyContact[];
  medicalId: MedicalId;
  sosHistory: SosHistoryEntry[];
}

export function EmergencyCard({
  facilities,
  contacts,
  medicalId,
  sosHistory,
}: EmergencyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="card-surface p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-ink-primary">Emergency Panel</h3>
        <Shield className="h-5 w-5 text-emergency-500" />
      </div>

      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="relative">
          <span className="absolute inset-0 animate-sos-pulse rounded-full bg-danger-500/30" />
          <Button variant="danger" size="lg" className="relative h-16 w-16 rounded-full p-0">
            <Siren className="h-7 w-7" strokeWidth={2.4} />
          </Button>
        </div>
        <p className="text-sm font-semibold text-danger-600">Hold to trigger SOS</p>
      </div>

      <div className="space-y-3 mb-5">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="flex items-center justify-between rounded-xl bg-surface-muted p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  facility.type === "hospital"
                    ? "bg-emergency-50 text-emergency-600"
                    : "bg-primary-50 text-primary-600"
                )}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-primary">{facility.name}</p>
                <p className="text-xs text-ink-secondary">
                  {facility.distance} · ETA {facility.eta}
                </p>
              </div>
            </div>
            <a
              href={`tel:${facility.phone.replace(/\s/g, "")}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emergency-500 text-white hover:bg-emergency-600 transition-colors"
              aria-label={`Call ${facility.name}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <IdCard className="h-4 w-4 text-primary-600" />
          <p className="text-sm font-semibold text-ink-primary">Medical ID</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-ink-secondary">Blood Group</span>
            <p className="font-semibold text-ink-primary">{medicalId.bloodGroup}</p>
          </div>
          <div>
            <span className="text-ink-secondary">Allergies</span>
            <p className="font-semibold text-ink-primary">{medicalId.allergies.join(", ")}</p>
          </div>
          <div className="col-span-2">
            <span className="text-ink-secondary">Conditions</span>
            <p className="font-semibold text-ink-primary">{medicalId.conditions.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
          Quick Contacts
        </p>
        <div className="flex flex-wrap gap-2">
          {contacts.slice(0, 2).map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-100 transition-colors"
            >
              <Phone className="h-3 w-3" />
              {contact.name}
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
          SOS History
        </p>
        <div className="space-y-2">
          {sosHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-ink-secondary" />
                <span className="text-ink-primary">{entry.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-ink-secondary">{entry.date}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-medium capitalize",
                    entry.status === "resolved" && "bg-emergency-50 text-emergency-600",
                    entry.status === "cancelled" && "bg-surface-muted text-ink-secondary",
                    entry.status === "active" && "bg-danger-50 text-danger-600"
                  )}
                >
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
