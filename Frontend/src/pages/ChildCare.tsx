import { useState } from "react";
import { motion } from "framer-motion";
import {
  Baby,
  Syringe,
  TrendingUp,
  Pill,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Heart,
  Plus,
} from "lucide-react";
import {
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

// Growth Percentile Data
const growthData = [
  { age: "Birth", weight: 3.4, height: 50 },
  { age: "3 Mos", weight: 6.2, height: 60 },
  { age: "6 Mos", weight: 7.9, height: 67 },
  { age: "9 Mos", weight: 8.9, height: 71 },
  { age: "12 Mos", weight: 9.6, height: 75 },
  { age: "18 Mos", weight: 11.2, height: 82 },
  { age: "24 Mos", weight: 12.5, height: 87 },
];

const vaccinations = [
  { id: "v1", vaccine: "BCG & Hep B (Birth Dose)", dueDate: "Completed", status: "completed" },
  { id: "v2", vaccine: "OPV 1 & DTP 1 (6 Weeks)", dueDate: "Completed", status: "completed" },
  { id: "v3", vaccine: "OPV 2 & DTP 2 (10 Weeks)", dueDate: "Completed", status: "completed" },
  { id: "v4", vaccine: "MMR 1st Dose (9 Months)", dueDate: "Aug 15, 2026", status: "upcoming" },
  { id: "v5", vaccine: "DTP Booster 1 (18 Months)", dueDate: "Jan 10, 2027", status: "upcoming" },
];

const childMedications = [
  { id: "m1", name: "Pediatric Vitamin D3 Drops", dose: "4 drops (400 IU)", time: "09:00 AM", status: "Given" },
  { id: "m2", name: "Iron Supplement Syrup", dose: "2.5 ml after lunch", time: "02:00 PM", status: "Pending" },
];

export default function ChildCare() {
  const [meds, setMeds] = useState(childMedications);
  const [childHealthIndex, setChildHealthIndex] = useState(96);
  const [showLogModal, setShowLogModal] = useState(false);
  const [childVitals, setChildVitals] = useState({
    heart_rate: 98,
    spo2: 99,
    temperature: 36.8,
    weight: 12.5,
    height: 87,
  });

  const toggleMedStatus = (id: string) => {
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "Given" ? "Pending" : "Given" } : m
      )
    );
  };

  const handleCalculateChildIndex = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate Pediatric AI Health Score
    let score = 100;
    if (childVitals.temperature > 37.5) score -= 15;
    if (childVitals.spo2 < 96) score -= 20;
    if (childVitals.heart_rate < 80 || childVitals.heart_rate > 120) score -= 10;
    setChildHealthIndex(Math.max(50, Math.min(100, score)));
    setShowLogModal(false);
  };

  const [showAddVacModal, setShowAddVacModal] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState("");
  const [newVaccineDueDate, setNewVaccineDueDate] = useState("");
  const [vaccinationList, setVaccinationList] = useState(vaccinations);

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaccineName) return;
    setVaccinationList([
      ...vaccinationList,
      {
        id: String(Date.now()),
        vaccine: newVaccineName,
        dueDate: newVaccineDueDate || "Upcoming",
        status: "upcoming",
      },
    ]);
    setNewVaccineName("");
    setNewVaccineDueDate("");
    setShowAddVacModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Child Health & Immunization Center
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Pediatric AI Health Index, vaccination tracking, and WHO growth percentile metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowLogModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Input Vitals & AI Score
          </Button>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 font-bold px-3.5 py-1.5 rounded-full border border-amber-200 text-xs">
            <Baby className="h-4 w-4 text-amber-600" /> Child ID: Aarav Sharma (2 Yrs)
          </div>
        </div>
      </div>

      {/* AI Pediatric Health Index & Guardian Card */}
      <div className="card-surface p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-elevated rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4 md:col-span-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-3xl font-black shrink-0">
              👶
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold">Aarav Sharma</h2>
                <span className="bg-white/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Male · 24 Months
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1">
                Blood Group: O+ · Height: {childVitals.height} cm · Weight: {childVitals.weight} kg (75th Percentile)
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                SpO2: {childVitals.spo2}% · Pulse: {childVitals.heart_rate} bpm · Temp: {childVitals.temperature}°C
              </p>
            </div>
          </div>

          {/* AI Child Wellness Score Badge */}
          <div className="flex flex-col items-center justify-center bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20 text-center">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">AI Child Wellness Score</span>
            <span className="text-4xl font-black text-white my-0.5">{childHealthIndex} / 100</span>
            <span className="text-[11px] font-semibold bg-emerald-400 text-slate-900 px-2.5 py-0.5 rounded-full">
              Optimal Pediatric Growth
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Input Child Vitals */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Baby className="h-5 w-5 text-amber-600" /> Input Child Vitals & AI Score
              </h3>
              <button onClick={() => setShowLogModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleCalculateChildIndex} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Heart Pulse (bpm)</label>
                  <input
                    type="number"
                    value={childVitals.heart_rate}
                    onChange={(e) => setChildVitals({ ...childVitals, heart_rate: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Oxygen SpO2 (%)</label>
                  <input
                    type="number"
                    value={childVitals.spo2}
                    onChange={(e) => setChildVitals({ ...childVitals, spo2: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Body Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={childVitals.temperature}
                    onChange={(e) => setChildVitals({ ...childVitals, temperature: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={childVitals.weight}
                    onChange={(e) => setChildVitals({ ...childVitals, weight: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowLogModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-amber-600 text-white font-bold" size="sm">Calculate AI Child Index</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}


      {/* Main Grid: Vaccination Tracker & Pediatric Meds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vaccination Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
              <Syringe className="h-5 w-5 text-amber-500" /> Immunization Schedule
            </h3>
            <Button
              size="sm"
              onClick={() => setShowAddVacModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-7 px-2.5"
            >
              + Add Vaccine
            </Button>
          </div>

          <div className="space-y-3">
            {vaccinationList.map((vac) => (
              <div
                key={vac.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted border border-line"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0",
                      vac.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {vac.status === "completed" ? "✓" : "!"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-primary">{vac.vaccine}</p>
                    <p className="text-[11px] text-ink-secondary">Due / Status: {vac.dueDate}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold capitalize",
                    vac.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}
                >
                  {vac.status}
                </span>
              </div>
            ))}
          </div>

        </motion.div>

        {/* Pediatric Medication Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary-500" /> Pediatric Daily Medicines
            </h3>
            <span className="text-xs text-ink-secondary">Today's Schedule</span>
          </div>

          <div className="space-y-3">
            {meds.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted border border-line"
              >
                <div>
                  <p className="text-xs font-bold text-ink-primary">{med.name}</p>
                  <p className="text-[11px] text-ink-secondary">{med.dose} · Scheduled {med.time}</p>
                </div>

                <Button
                  size="sm"
                  variant={med.status === "Given" ? "outline" : "primary"}
                  onClick={() => toggleMedStatus(med.id)}
                  className={cn(
                    "text-xs h-8 px-3 font-semibold",
                    med.status === "Given" ? "text-emerald-600 border-emerald-300 bg-emerald-50" : "bg-primary-600 text-white"
                  )}
                >
                  {med.status === "Given" ? "✓ Dose Given" : "Mark as Given"}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* WHO Growth Percentile Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Growth Curve (Height & Weight)
            </h3>
            <p className="text-xs text-ink-secondary">Compared against WHO Standard Percentiles</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Healthy Growth Trajectory
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#F59E0B" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#F59E0B" strokeWidth={2.5} name="Weight (kg)" />
              <Line yAxisId="right" type="monotone" dataKey="height" stroke="#10B981" strokeWidth={2.5} name="Height (cm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>


      {/* Modal: Add Vaccination Record */}
      {showAddVacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Syringe className="h-5 w-5 text-amber-600" /> Add Immunization Record
              </h3>
              <button onClick={() => setShowAddVacModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddVaccine} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Vaccine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hepatitis B Booster"
                  value={newVaccineName}
                  onChange={(e) => setNewVaccineName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Due Date / Status</label>
                <input
                  type="text"
                  placeholder="e.g. Sep 20, 2026 or Completed"
                  value={newVaccineDueDate}
                  onChange={(e) => setNewVaccineDueDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddVacModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold" size="sm">Save Vaccine Record</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

