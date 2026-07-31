import type {
  ActivityItem,
  AiRecommendation,
  Appointment,
  CalendarEvent,
  ChartDataPoint,
  EmergencyContact,
  EmergencyFacility,
  EmergencyStatus,
  HealthAlert,
  HealthScore,
  HealthStat,
  HealthTip,
  MedicalId,
  Medication,
  MotivationalQuote,
  NotificationItem,
  QuickAction,
  RiskAnalysis,
  SosHistoryEntry,
  TodaySummary,
  WeatherPlaceholder,
} from "@/types/dashboard";

export const healthScore: HealthScore = {
  score: 86,
  grade: "A",
  riskLevel: "low",
  healthAge: 22,
  aiSummary:
    "Your vitals are stable and activity levels are above average. Keep maintaining hydration and sleep consistency for optimal recovery.",
};

export const quickActions: QuickAction[] = [
  {
    id: "healthReport",
    title: "Health Report",
    description: "View full health analytics",
    icon: "FileHeart",
    accent: "primary",
    path: "/app/health",
  },
  {
    id: "emergencySos",
    title: "Emergency SOS",
    description: "Instant emergency alert",
    icon: "Siren",
    accent: "danger",
    path: "/app/sos",
  },
  {
    id: "nearbyHospital",
    title: "Nearby Hospital",
    description: "Find closest medical care",
    icon: "Hospital",
    accent: "emergency",
    path: "/app/map",
  },
  {
    id: "emergencyContacts",
    title: "Emergency Contacts",
    description: "Manage trusted contacts",
    icon: "Users",
    accent: "warning",
  },
  {
    id: "medication",
    title: "Medication",
    description: "Track daily medicines",
    icon: "Pill",
    accent: "accent",
  },
  {
    id: "aiAssistant",
    title: "AI Assistant",
    description: "Get health guidance",
    icon: "Bot",
    accent: "primary",
  },
];

export const healthStats: HealthStat[] = [
  {
    id: "heartRate",
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    icon: "Heart",
    trend: "stable",
    trendValue: "Normal range",
    status: "good",
  },
  {
    id: "sleep",
    label: "Sleep",
    value: "7.5",
    unit: "hrs",
    icon: "Moon",
    trend: "up",
    trendValue: "+0.5 hrs",
    status: "good",
  },
  {
    id: "water",
    label: "Water",
    value: "1.8",
    unit: "L",
    icon: "Droplets",
    trend: "down",
    trendValue: "-0.4 L",
    status: "warning",
  },
  {
    id: "steps",
    label: "Steps",
    value: "8,432",
    unit: "steps",
    icon: "Footprints",
    trend: "up",
    trendValue: "+12%",
    status: "good",
  },
  {
    id: "calories",
    label: "Calories",
    value: "1,840",
    unit: "kcal",
    icon: "Flame",
    trend: "stable",
    trendValue: "On target",
    status: "good",
  },
  {
    id: "bloodPressure",
    label: "Blood Pressure",
    value: "118/76",
    unit: "mmHg",
    icon: "Activity",
    trend: "stable",
    trendValue: "Optimal",
    status: "good",
  },
];

export const weeklyChartData: ChartDataPoint[] = [
  { day: "Mon", score: 78, heartRate: 74, steps: 6200 },
  { day: "Tue", score: 82, heartRate: 71, steps: 8100 },
  { day: "Wed", score: 80, heartRate: 73, steps: 7400 },
  { day: "Thu", score: 85, heartRate: 70, steps: 9200 },
  { day: "Fri", score: 83, heartRate: 72, steps: 8800 },
  { day: "Sat", score: 88, heartRate: 68, steps: 10500 },
  { day: "Sun", score: 86, heartRate: 72, steps: 8432 },
];

export const riskAnalysis: RiskAnalysis = {
  level: "low",
  percentage: 92,
  trend: "improving",
  trendValue: "+4% this week",
  prediction: "Low risk of cardiovascular events in the next 30 days based on current trends.",
  recommendation:
    "Increase water intake to 2.5L daily and maintain 30 minutes of moderate activity.",
};

export const recentAlerts: HealthAlert[] = [
  {
    id: "alert-1",
    title: "Emergency Check-in",
    description: "SOS was triggered and resolved within 3 minutes. All contacts notified.",
    time: "2 hours ago",
    severity: "emergency",
    icon: "Siren",
  },
  {
    id: "alert-2",
    title: "Medicine Reminder",
    description: "Time to take Vitamin D3 — 1000 IU with breakfast.",
    time: "4 hours ago",
    severity: "info",
    icon: "Pill",
  },
  {
    id: "alert-3",
    title: "Low Water Intake",
    description: "You've consumed only 60% of your daily water goal.",
    time: "6 hours ago",
    severity: "warning",
    icon: "Droplets",
  },
  {
    id: "alert-4",
    title: "Upcoming Appointment",
    description: "Dr. Sharma — General Checkup tomorrow at 10:30 AM.",
    time: "Yesterday",
    severity: "success",
    icon: "CalendarCheck",
  },
];

export const emergencyFacilities: EmergencyFacility[] = [
  {
    id: "fac-1",
    name: "Apollo Multispeciality Hospital",
    type: "hospital",
    distance: "1.2 km",
    eta: "4 min",
    phone: "+91 98765 43210",
  },
  {
    id: "fac-2",
    name: "Sector 14 Police Station",
    type: "police",
    distance: "0.8 km",
    eta: "3 min",
    phone: "+91 100",
  },
];

export const emergencyContacts: EmergencyContact[] = [
  {
    id: "contact-1",
    name: "Priya Sharma",
    relationship: "Spouse",
    phone: "+91 98765 11111",
    avatarSeed: "priya",
    isPrimary: true,
  },
  {
    id: "contact-2",
    name: "Rajesh Kumar",
    relationship: "Father",
    phone: "+91 98765 22222",
    avatarSeed: "rajesh",
  },
  {
    id: "contact-3",
    name: "Dr. Anita Mehta",
    relationship: "Family Doctor",
    phone: "+91 98765 33333",
    avatarSeed: "anita",
  },
];

export const sosHistory: SosHistoryEntry[] = [
  {
    id: "sos-1",
    date: "Jul 28, 2026",
    type: "Medical Emergency",
    status: "resolved",
  },
  {
    id: "sos-2",
    date: "Jul 15, 2026",
    type: "Safety Alert",
    status: "cancelled",
  },
];

export const medicalId: MedicalId = {
  bloodGroup: "O+",
  allergies: ["Penicillin", "Peanuts"],
  conditions: ["Mild Asthma"],
  emergencyNotes: "Carries inhaler. Contact spouse first.",
};

export const upcomingMedications: Medication[] = [
  {
    id: "med-1",
    name: "Metformin",
    dosage: "500mg",
    time: "8:00 AM",
    status: "taken",
    instructions: "Take with breakfast",
  },
  {
    id: "med-2",
    name: "Vitamin D3",
    dosage: "1000 IU",
    time: "1:00 PM",
    status: "pending",
    instructions: "Take after lunch",
  },
  {
    id: "med-3",
    name: "Atorvastatin",
    dosage: "10mg",
    time: "9:00 PM",
    status: "upcoming",
    instructions: "Take before bed",
  },
];

export const aiRecommendations: AiRecommendation[] = [
  {
    id: "rec-1",
    title: "Hydration Boost",
    description: "Drink 2 glasses of water in the next hour to reach your daily goal.",
    icon: "Droplets",
    priority: "high",
    category: "Nutrition",
  },
  {
    id: "rec-2",
    title: "Evening Walk",
    description: "A 20-minute walk after dinner can improve sleep quality by 15%.",
    icon: "Footprints",
    priority: "medium",
    category: "Activity",
  },
  {
    id: "rec-3",
    title: "Stress Relief",
    description: "Try 5 minutes of deep breathing — your resting heart rate was slightly elevated.",
    icon: "Wind",
    priority: "medium",
    category: "Wellness",
  },
  {
    id: "rec-4",
    title: "Sleep Schedule",
    description: "Maintain a consistent bedtime within ±30 minutes for better recovery.",
    icon: "Moon",
    priority: "low",
    category: "Sleep",
  },
];

export const healthTips: HealthTip[] = [
  {
    id: "tip-1",
    title: "Stay Hydrated",
    content: "Drinking water before meals aids digestion and helps maintain energy levels throughout the day.",
    icon: "Droplets",
    category: "Nutrition",
  },
  {
    id: "tip-2",
    title: "Move Every Hour",
    content: "Stand up and stretch for 2 minutes every hour to reduce sedentary health risks.",
    icon: "Activity",
    category: "Activity",
  },
  {
    id: "tip-3",
    title: "Screen-Free Wind Down",
    content: "Avoid screens 30 minutes before bed to improve melatonin production and sleep quality.",
    icon: "Smartphone",
    category: "Sleep",
  },
  {
    id: "tip-4",
    title: "Mindful Breathing",
    content: "Practice 4-7-8 breathing technique to quickly reduce stress and lower heart rate.",
    icon: "Wind",
    category: "Wellness",
  },
];

export const todaySummary: TodaySummary = {
  stepsGoal: 10000,
  stepsCurrent: 8432,
  waterGoal: 2.5,
  waterCurrent: 1.8,
  sleepGoal: 8,
  sleepCurrent: 7.5,
  caloriesBurned: 1840,
  activeMinutes: 47,
};

export const activityItems: ActivityItem[] = [
  { id: "act-1", label: "Morning Run", value: "3.2 km", icon: "Footprints" },
  { id: "act-2", label: "Yoga Session", value: "25 min", icon: "Heart" },
  { id: "act-3", label: "Stairs Climbed", value: "12 floors", icon: "TrendingUp" },
];

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Medication due in 30 min",
    time: "12:30 PM",
    read: false,
    type: "medication",
  },
  {
    id: "notif-2",
    title: "Weekly health report ready",
    time: "10:00 AM",
    read: false,
    type: "health",
  },
  {
    id: "notif-3",
    title: "Appointment reminder: Dr. Sharma",
    time: "Yesterday",
    read: true,
    type: "appointment",
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "General Checkup",
    date: "Jul 31",
    time: "10:30 AM",
    type: "checkup",
  },
  {
    id: "cal-2",
    title: "Blood Test",
    date: "Aug 2",
    time: "8:00 AM",
    type: "appointment",
  },
  {
    id: "cal-3",
    title: "Medication Refill",
    date: "Aug 5",
    time: "All day",
    type: "medication",
  },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: "appt-1",
    doctor: "Dr. Ananya Sharma",
    specialty: "General Physician",
    date: "Jul 31, 2026",
    time: "10:30 AM",
    location: "Apollo Clinic, Sector 14",
  },
  {
    id: "appt-2",
    doctor: "Dr. Vikram Patel",
    specialty: "Cardiologist",
    date: "Aug 8, 2026",
    time: "2:00 PM",
    location: "Max Hospital, Gurgaon",
  },
];

export const emergencyStatus: EmergencyStatus = {
  sosEnabled: true,
  lastCheckIn: "12 min ago",
  locationSharing: true,
  medicalIdReady: true,
};

export const weatherPlaceholder: WeatherPlaceholder = {
  condition: "Partly Cloudy",
  temperature: "28°C",
  location: "New Delhi",
  icon: "CloudSun",
};

export const motivationalQuotes: MotivationalQuote[] = [
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "Health is not valued till sickness comes.",
    author: "Thomas Fuller",
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil",
  },
];
