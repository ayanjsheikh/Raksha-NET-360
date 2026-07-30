export type UserCategory = "child" | "adult" | "woman" | "elderly" | "rural";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category?: UserCategory;
  bloodGroup?: string;
  avatarUrl?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarSeed: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: "primary" | "emergency" | "danger" | "warning" | "accent";
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}
