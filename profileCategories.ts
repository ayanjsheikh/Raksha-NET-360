import type { UserCategory } from "@/types";

export interface ProfileCategoryOption {
  id: UserCategory;
  label: string;
  description: string;
  icon: string;
  gradient: string;
  ring: string;
}

export const PROFILE_CATEGORIES: ProfileCategoryOption[] = [
  {
    id: "child",
    label: "Child",
    description:
      "Vaccination tracking, growth charts, and guardian-linked emergency alerts.",
    icon: "Baby",
    gradient: "from-[#FF7043] to-[#E85A2C]",
    ring: "ring-accent-500",
  },
  {
    id: "adult",
    label: "Adult",
    description:
      "AI health scoring, activity tracking, and one-tap emergency response.",
    icon: "HeartPulse",
    gradient: "from-[#1565C0] to-[#0D3F76]",
    ring: "ring-primary-500",
  },
  {
    id: "woman",
    label: "Woman Safety",
    description:
      "Live location sharing, trusted contacts, and a direct line to nearby police.",
    icon: "ShieldCheck",
    gradient: "from-[#FF7043] to-[#C2185B]",
    ring: "ring-[#C2185B]",
  },
  {
    id: "elderly",
    label: "Elderly",
    description:
      "Fall detection, medicine reminders, and simplified daily check-ins.",
    icon: "Users",
    gradient: "from-[#00B894] to-[#00745A]",
    ring: "ring-emergency-500",
  },
  {
    id: "rural",
    label: "Rural",
    description:
      "Offline-first emergency queue with SMS fallback for low-connectivity areas.",
    icon: "Signal",
    gradient: "from-[#F9A825] to-[#D68E14]",
    ring: "ring-warning-500",
  },
];
