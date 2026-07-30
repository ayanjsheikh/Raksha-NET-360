import type { FeatureItem, HowItWorksStep, Testimonial } from "@/types";

export const FEATURES: FeatureItem[] = [
  {
    id: "f1",
    title: "One-tap Emergency SOS",
    description:
      "Hold the SOS button for 3 seconds to instantly alert your trusted contacts, share live location, and notify the nearest responders.",
    icon: "Siren",
    accent: "danger",
  },
  {
    id: "f2",
    title: "AI Health Risk Scoring",
    description:
      "RakshaNet continuously reads your vitals and daily activity to flag early risk signals before they become emergencies.",
    icon: "BrainCircuit",
    accent: "primary",
  },
  {
    id: "f3",
    title: "Live Emergency Map",
    description:
      "Find the nearest hospital, clinic, pharmacy, or police station in seconds, with real-time routing to the safest path.",
    icon: "MapPinned",
    accent: "emergency",
  },
  {
    id: "f4",
    title: "Built for Every Life Stage",
    description:
      "Dedicated modules for children, women's safety, elderly care, and rural connectivity — one platform, tailored protection.",
    icon: "Users",
    accent: "accent",
  },
  {
    id: "f5",
    title: "Works Even Offline",
    description:
      "Rural Mode queues emergency alerts and syncs the moment signal returns, with SMS fallback when data isn't available.",
    icon: "Signal",
    accent: "warning",
  },
  {
    id: "f6",
    title: "Your Medical ID, Always Ready",
    description:
      "Blood group, allergies, medications, and emergency contacts are available to first responders in one glance — even offline.",
    icon: "IdCard",
    accent: "primary",
  },
];

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Set up your health profile",
    description:
      "Tell us who you're protecting — yourself, a child, a parent — so RakshaNet can tailor monitoring and alerts.",
    icon: "UserPlus",
  },
  {
    step: 2,
    title: "RakshaNet watches quietly",
    description:
      "Vitals, activity, and risk score update in the background. No action needed until something needs your attention.",
    icon: "Activity",
  },
  {
    step: 3,
    title: "Respond in one tap",
    description:
      "In an emergency, a single hold on the SOS button reaches contacts, ambulances, and responders with your exact location.",
    icon: "Siren",
  },
  {
    step: 4,
    title: "Help arrives informed",
    description:
      "Responders see your medical ID and location before they arrive, cutting critical minutes off every response.",
    icon: "ShieldCheck",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Dr. Anjali Rao",
    role: "Emergency Medicine, AIIMS",
    location: "Delhi",
    quote:
      "The medical ID feature alone has changed how fast our ER can act on unconscious patients brought in by ambulance.",
    avatarSeed: "anjali-rao",
  },
  {
    id: "t2",
    name: "Meera Joshi",
    role: "Daughter & Caregiver",
    location: "Pune",
    quote:
      "Fall detection alerted me before my mother even called. RakshaNet gave our family back its peace of mind.",
    avatarSeed: "meera-joshi",
  },
  {
    id: "t3",
    name: "Suresh Patel",
    role: "Village Health Worker",
    location: "Rural Gujarat",
    quote:
      "Rural Mode's offline queue means our community's emergencies still reach help, even when the network doesn't.",
    avatarSeed: "suresh-patel",
  },
];
