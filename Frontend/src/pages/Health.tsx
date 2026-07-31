import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  getHealthData,
  getRecommendation,
  addHealthData,
  getAIHealthAnalysis,
  putHealthIndex,
} from "@/services/healthService";
import { motion } from "framer-motion";
import {
  Activity,
  Heart,
  Moon,
  Droplets,
  Footprints,
  Scale,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  ChevronRight,
  Plus,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

// Weekly & Monthly Dummy Vitals Data
const weeklyVitals = [
  { day: "Mon", heartRate: 72, bpSys: 118, bpDia: 76, sleep: 7.2, water: 2.1, steps: 8200 },
  { day: "Tue", heartRate: 75, bpSys: 120, bpDia: 78, sleep: 6.8, water: 1.8, steps: 7400 },
  { day: "Wed", heartRate: 70, bpSys: 116, bpDia: 75, sleep: 8.0, water: 2.4, steps: 9600 },
  { day: "Thu", heartRate: 74, bpSys: 119, bpDia: 77, sleep: 7.5, water: 2.2, steps: 8900 },
  { day: "Fri", heartRate: 71, bpSys: 117, bpDia: 76, sleep: 7.8, water: 2.5, steps: 10400 },
  { day: "Sat", heartRate: 68, bpSys: 115, bpDia: 74, sleep: 8.5, water: 2.8, steps: 11200 },
  { day: "Sun", heartRate: 72, bpSys: 118, bpDia: 76, sleep: 7.5, water: 1.8, steps: 8432 },
];

const monthlyVitals = [
  { day: "Week 1", heartRate: 73, bpSys: 119, bpDia: 77, sleep: 7.4, water: 2.2, steps: 8500 },
  { day: "Week 2", heartRate: 71, bpSys: 117, bpDia: 75, sleep: 7.7, water: 2.4, steps: 9100 },
  { day: "Week 3", heartRate: 74, bpSys: 121, bpDia: 78, sleep: 7.1, water: 2.0, steps: 8100 },
  { day: "Week 4", heartRate: 70, bpSys: 116, bpDia: 74, sleep: 8.0, water: 2.6, steps: 9800 },
];

const healthTimeline = [
  {
    id: "tl-1",
    time: "Today, 08:30 AM",
    title: "Morning Vitals Logged",
    description: "Heart Rate: 72 bpm | BP: 118/76 mmHg | SpO2: 99%",
    category: "vitals",
    status: "Normal",
  },
  {
    id: "tl-2",
    time: "Yesterday, 09:15 PM",
    title: "Sleep & Recovery Sync",
    description: "7.5 hrs sleep logged. 1h 45m Deep sleep recorded.",
    category: "sleep",
    status: "Optimal",
  },
  {
    id: "tl-3",
    time: "Jul 28, 04:00 PM",
    title: "Cardio Activity Complete",
    description: "45 minutes jogging — 380 kcal burned — Avg HR 135 bpm.",
    category: "fitness",
    status: "Good",
  },
  {
    id: "tl-4",
    time: "Jul 25, 11:00 AM",
    title: "Biometric BMI Update",
    description: "Weight: 68.5 kg | Height: 175 cm | BMI: 22.4 (Normal)",
    category: "bmi",
    status: "Healthy",
  },
];

export default function Health() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  const [waterCount, setWaterCount] = useState(1.8);
  const data = timeframe === "weekly" ? weeklyVitals : monthlyVitals;
  const { user } = useAuth();

  const [healthData, setHealthData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPutModal, setShowPutModal] = useState(false);
  const [customIndex, setCustomIndex] = useState(90);

  // BMI Interactive Calculator State
  const [bmiHeight, setBmiHeight] = useState(175);
  const [bmiWeight, setBmiWeight] = useState(70);

  const calculatedBmi = +(bmiWeight / ((bmiHeight / 100) * (bmiHeight / 100))).toFixed(1);
  const bmiCategory =
    calculatedBmi < 18.5
      ? "Underweight"
      : calculatedBmi < 25
      ? "Normal Weight"
      : calculatedBmi < 30
      ? "Overweight"
      : "Obese";

  // New Vitals Form State
  const [formData, setFormData] = useState({
    heart_rate: 75,
    blood_pressure: "120/80",
    spo2: 98,
    temperature: 37.0,
    sugar_level: 105,
    bmi: 22.5,
  });


  const fetchHealth = async () => {
    const userId = user ? Number(user.id) : 1;
    try {
      setLoading(true);
      const data = await getHealthData(userId);
      setHealthData(data);

      const ai = await getAIHealthAnalysis(userId);
      setAiAnalysis(ai);

      const rec = await getRecommendation(userId);
      if (rec?.recommendations) {
        setRecommendations(rec.recommendations);
      }
    } catch (err) {
      console.warn("Health fetch fallback to local demo data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, [user]);


  const handleAddVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user ? Number(user.id) : 1;
    try {
      await addHealthData({
        user_id: userId,
        ...formData,
      });
    } catch (err) {
      console.warn("Backend save fallback active", err);
    }
    setShowLogModal(false);
    await fetchHealth();
  };

  const handlePutIndexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user ? Number(user.id) : 1;
    try {
      await putHealthIndex(userId, Number(customIndex), formData);
    } catch (err) {
      console.warn("Backend update fallback active", err);
    }
    setAiAnalysis({ health_index: Number(customIndex), status: customIndex > 80 ? "Optimal" : "Attention Needed" });
    setShowPutModal(false);
    await fetchHealth();
  };


  const healthScore = aiAnalysis?.health_index ?? healthData?.health_index ?? 92;
  const healthStatus = aiAnalysis?.status ?? "Optimal";

  if (loading && !healthData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 text-primary-600 animate-spin" />
          <p className="text-sm font-semibold text-ink-secondary">Computing AI Health Index...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            AI Health Index & Analytics
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Real-time multi-vital assessment, predictive risk index, and AI recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowPutModal(true)}
            variant="outline"
            className="border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 gap-1.5 text-xs font-bold shadow-sm"
          >
            <Zap className="h-4 w-4 text-emerald-600" /> PUT Custom Index ({healthScore})
          </Button>

          <Button
            onClick={() => setShowLogModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white gap-2 text-xs font-bold shadow-md"
          >
            <Plus className="h-4 w-4" /> Run AI Assessment / Log Vitals
          </Button>

          {/* Timeframe selector */}
          <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-line">
            <button
              onClick={() => setTimeframe("weekly")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                timeframe === "weekly"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              )}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                timeframe === "monthly"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-ink-secondary hover:text-ink-primary"
              )}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* AI Health Index Hero Feature Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-surface p-6 bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white rounded-2xl border-2 border-primary-500/30 shadow-elevated overflow-hidden relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
          {/* Circular SVG Gauge Meter */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-44 h-44 -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  className="text-slate-800"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  className="text-emerald-400 transition-all duration-1000"
                  strokeWidth="12"
                  strokeDasharray={464}
                  strokeDashoffset={464 - (healthScore / 100) * 464}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tracking-tight text-white">{healthScore}</span>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                  AI INDEX
                </span>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {healthStatus} Physiological State
              </span>
            </div>
          </div>

          {/* Sub-score Progress Bars */}
          <div className="space-y-4 lg:col-span-2 bg-slate-800/60 p-5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning-400" /> Vital Sub-Score Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">Weighted AI Metric Matrix</span>
            </div>

            {/* Cardio Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Cardiovascular Health</span>
                <span className="text-emerald-400">{aiAnalysis?.sub_scores?.cardiovascular ?? 95}%</span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${aiAnalysis?.sub_scores?.cardiovascular ?? 95}%` }}
                />
              </div>
            </div>

            {/* Respiratory Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Respiratory Efficiency</span>
                <span className="text-primary-400">{aiAnalysis?.sub_scores?.respiratory ?? 98}%</span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${aiAnalysis?.sub_scores?.respiratory ?? 98}%` }}
                />
              </div>
            </div>

            {/* Metabolic Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Metabolic & Glucose Balance</span>
                <span className="text-amber-400">{aiAnalysis?.sub_scores?.metabolic ?? 88}%</span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${aiAnalysis?.sub_scores?.metabolic ?? 88}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal: Add Vitals / Run AI Assessment */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" /> Log Vitals & Run AI Index
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-ink-secondary hover:text-ink-primary font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddVitals} className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={formData.heart_rate}
                    onChange={(e) => setFormData({ ...formData, heart_rate: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Blood Pressure (e.g. 120/80)</label>
                  <input
                    type="text"
                    value={formData.blood_pressure}
                    onChange={(e) => setFormData({ ...formData, blood_pressure: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={formData.spo2}
                    onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={formData.sugar_level}
                    onChange={(e) => setFormData({ ...formData, sugar_level: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">BMI Score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => setFormData({ ...formData, bmi: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowLogModal(false)} size="sm">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white" size="sm">
                  Calculate AI Index
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Direct PUT Method Health Index Update */}
      {showPutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border-2 border-emerald-500"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-600" /> PUT Custom Health Index Value
              </h3>
              <button
                onClick={() => setShowPutModal(false)}
                className="text-ink-secondary hover:text-ink-primary font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePutIndexSubmit} className="space-y-4">
              <div className="space-y-2 text-center p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Select Custom Health Score (0 - 100)
                </label>
                <span className="text-4xl font-extrabold text-emerald-600 block">{customIndex}</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={customIndex}
                  onChange={(e) => setCustomIndex(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="text-xs text-ink-secondary">
                <p className="font-semibold text-ink-primary mb-1">HTTP PUT Method Target:</p>
                <code className="bg-surface-muted p-1.5 rounded text-[11px] block font-mono text-emerald-700">
                  PUT /api/health/update-index/{user?.id || 1}
                </code>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setShowPutModal(false)} size="sm">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" size="sm">
                  Send PUT Request
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}



      {/* Top 4 Vitals Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-5 border-l-4 border-l-danger-500 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">Heart Rate Monitor</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
              <Heart className="h-5 w-5 animate-pulse text-danger-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-ink-primary">
                {healthData?.heart_rate ?? formData.heart_rate}
              </span>
              <span className="text-xs font-medium text-ink-secondary">bpm</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              RESTING 60-100
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> Normal Sinus Rhythm
          </p>
        </motion.div>

        {/* Blood Pressure */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-5 border-l-4 border-l-primary-500 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">Blood Pressure Monitor</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Activity className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-ink-primary">
                {healthData?.blood_pressure ?? formData.blood_pressure}
              </span>
              <span className="text-xs font-medium text-ink-secondary">mmHg</span>
            </div>
            <span className="text-[10px] font-bold bg-primary-50 text-primary-700 px-2 py-0.5 rounded border border-primary-200">
              OPTIMAL
            </span>
          </div>
          <p className="mt-2 text-xs text-primary-600 flex items-center gap-1 font-medium">
            <Zap className="h-3.5 w-3.5" /> Systolic / Diastolic Target
          </p>
        </motion.div>


        {/* Sleep Quality */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-surface p-5 border-l-4 border-l-accent-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">Sleep & Rest</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              <Moon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink-primary">7.5</span>
            <span className="text-xs font-medium text-ink-secondary">hrs</span>
          </div>
          <p className="mt-2 text-xs text-ink-secondary flex items-center gap-1">
            Deep sleep: 1h 45m (23%)
          </p>
        </motion.div>

        {/* Water Intake */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-surface p-5 border-l-4 border-l-emergency-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">Hydration Tracker</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emergency-50 text-emergency-600">
              <Droplets className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-ink-primary">{waterCount.toFixed(1)}</span>
              <span className="text-xs font-medium text-ink-secondary">/ 2.5 L</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setWaterCount((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)))}
              className="h-7 text-xs px-2 gap-1"
            >
              <Plus className="h-3 w-3" /> +250ml
            </Button>
          </div>
          <div className="mt-2 h-2 w-full bg-surface-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emergency-500 rounded-full transition-all duration-300"
              style={{ width: `${(waterCount / 2.5) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Main Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate & BP Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-ink-primary">Heart Rate & Blood Pressure</h3>
              <p className="text-xs text-ink-secondary">Systolic / Diastolic vs Heart Rate</p>
            </div>
            <span className="text-xs font-medium text-danger-600 bg-danger-50 px-2.5 py-1 rounded-full">
              Live Monitor
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E53935" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E53935" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 140]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="heartRate" stroke="#E53935" fill="url(#hrGrad)" strokeWidth={2} name="Heart Rate (bpm)" />
                <Line type="monotone" dataKey="bpSys" stroke="#1565C0" strokeWidth={2} name="Systolic (mmHg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity & Steps Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-surface p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-ink-primary">Activity & Daily Steps</h3>
              <p className="text-xs text-ink-secondary">Step counts & movement goal</p>
            </div>
            <span className="text-xs font-medium text-emergency-600 bg-emergency-50 px-2.5 py-1 rounded-full">
              Goal: 10,000 steps
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="steps" fill="#00B894" radius={[6, 6, 0, 0]} name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      {recommendations.length > 0 && (
        <div className="card-surface p-5">
          <h3 className="text-lg font-semibold mb-3">
            Health Recommendations
          </h3>

          <ul className="list-disc ml-5 space-y-2">
            {recommendations.map((item, index) => (
             <li key={index}>{item}</li>
            ))}
         </ul>
        </div>
      )}
      {/* BMI Calculator & Health Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive BMI & Body Composition Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary-500" /> Interactive BMI Calculator
            </h3>
            <span
              className={cn(
                "text-xs font-bold px-2.5 py-1 rounded-lg border",
                bmiCategory === "Normal Weight"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : bmiCategory === "Underweight"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              )}
            >
              {bmiCategory}
            </span>
          </div>

          <div className="rounded-2xl bg-gradient-primary p-5 text-white text-center shadow-md">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Calculated Body Mass Index</p>
            <p className="text-4xl font-extrabold mt-1">{calculatedBmi}</p>
            <p className="text-xs text-white/90 mt-2">Optimal Range: 18.5 – 24.9 kg/m²</p>
          </div>

          {/* Height and Weight Sliders */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-ink-secondary">Height (cm)</span>
                <span className="text-primary-600 font-bold">{bmiHeight} cm</span>
              </div>
              <input
                type="range"
                min="120"
                max="220"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(Number(e.target.value))}
                className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-ink-secondary">Weight (kg)</span>
                <span className="text-primary-600 font-bold">{bmiWeight} kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(Number(e.target.value))}
                className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>

          {/* Dynamic BMI Scale Indicator */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-ink-secondary font-medium">
              <span>Underweight (&lt;18.5)</span>
              <span className="font-bold text-emerald-600">Normal (18.5-24.9)</span>
              <span>Overweight (&gt;25)</span>
            </div>
            <div className="h-2.5 w-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-500 rounded-full relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white border-2 border-primary-600 rounded-full shadow-md transition-all duration-300"
                style={{
                  left: `${Math.max(5, Math.min(95, ((calculatedBmi - 15) / 20) * 100))}%`,
                }}
              />
            </div>
          </div>
        </motion.div>


        {/* Health Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-surface p-6 lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-500" /> Health Event Timeline
              </h3>
              <p className="text-xs text-ink-secondary">Recent biometric records and wellness logs</p>
            </div>
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Log Vitals
            </Button>
          </div>

          <div className="relative border-l-2 border-line pl-4 space-y-5 my-3">
            {healthTimeline.map((item) => (
              <div key={item.id} className="relative group">
                <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-white" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-semibold text-ink-primary group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-ink-secondary flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.time}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary mt-1">{item.description}</p>
                <div className="mt-2">
                  <span className="inline-block rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-ink-primary border border-line">
                    Status: {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
