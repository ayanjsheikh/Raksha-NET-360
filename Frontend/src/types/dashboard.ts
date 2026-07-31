export type HealthStatKey =
  | "heartRate"
  | "sleep"
  | "water"
  | "steps"
  | "calories"
  | "bloodPressure";

export type QuickActionKey =
  | "healthReport"
  | "emergencySos"
  | "nearbyHospital"
  | "emergencyContacts"
  | "medication"
  | "aiAssistant";

export type AlertSeverity = "emergency" | "warning" | "info" | "success";

export type MedicationStatus = "pending" | "taken" | "missed" | "upcoming";

export type RiskLevel = "low" | "moderate" | "high";

export interface HealthScore {
  score: number;
  grade: string;
  riskLevel: RiskLevel;
  healthAge: number;
  aiSummary: string;
}

export interface QuickAction {
  id: QuickActionKey;
  title: string;
  description: string;
  icon: string;
  accent: "primary" | "emergency" | "danger" | "warning" | "accent";
  path?: string;
}

export interface HealthStat {
  id: HealthStatKey;
  label: string;
  value: string;
  unit: string;
  icon: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  status: "good" | "warning" | "critical";
}

export interface ChartDataPoint {
  day: string;
  score: number;
  heartRate: number;
  steps: number;
}

export interface RiskAnalysis {
  level: RiskLevel;
  percentage: number;
  trend: "improving" | "stable" | "declining";
  trendValue: string;
  prediction: string;
  recommendation: string;
}

export interface HealthAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  severity: AlertSeverity;
  icon: string;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: "hospital" | "police";
  distance: string;
  eta: string;
  phone: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  avatarSeed: string;
  isPrimary?: boolean;
}

export interface SosHistoryEntry {
  id: string;
  date: string;
  type: string;
  status: "resolved" | "cancelled" | "active";
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: MedicationStatus;
  instructions?: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
  category: string;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: "health" | "medication" | "emergency" | "appointment";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "appointment" | "medication" | "checkup";
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

export interface TodaySummary {
  stepsGoal: number;
  stepsCurrent: number;
  waterGoal: number;
  waterCurrent: number;
  sleepGoal: number;
  sleepCurrent: number;
  caloriesBurned: number;
  activeMinutes: number;
}

export interface EmergencyStatus {
  sosEnabled: boolean;
  lastCheckIn: string;
  locationSharing: boolean;
  medicalIdReady: boolean;
}

export interface WeatherPlaceholder {
  condition: string;
  temperature: string;
  location: string;
  icon: string;
}

export interface MotivationalQuote {
  text: string;
  author: string;
}

export interface MedicalId {
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  emergencyNotes: string;
}
