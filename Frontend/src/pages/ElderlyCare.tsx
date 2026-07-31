import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShieldAlert,
  Heart,
  Pill,
  CheckCircle2,
  PhoneCall,
  Activity,
  Thermometer,
  Clock,
  User,
  Zap,
  AlertTriangle,
  Siren,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { audioEngine } from "@/utils/audioEngine";

export default function ElderlyCare() {
  const [checkedInToday, setCheckedInToday] = useState(true);
  const [fallDetectionActive, setFallDetectionActive] = useState(true);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [seniorHealthIndex, setSeniorHealthIndex] = useState(89);
  const [showLogModal, setShowLogModal] = useState(false);
  const [seniorVitals, setSeniorVitals] = useState({
    heart_rate: 68,
    blood_pressure: "124/80",
    spo2: 98,
    temperature: 36.9,
    sugar_level: 110,
  });

  const toggleFallSiren = () => {
    if (isSirenActive) {
      audioEngine.stopSiren();
      setIsSirenActive(false);
    } else {
      audioEngine.startSiren();
      audioEngine.announceEmergency("Fall Alert Triggered! High-pitch Emergency Siren Active. Caregivers Notified.");
      setIsSirenActive(true);
    }
  };


  const handleCalculateSeniorIndex = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 100;
    if (seniorVitals.spo2 < 95) score -= 20;
    if (seniorVitals.sugar_level > 140) score -= 15;
    if (seniorVitals.heart_rate < 60 || seniorVitals.heart_rate > 100) score -= 10;
    setSeniorHealthIndex(Math.max(40, Math.min(100, score)));
    setShowLogModal(false);
  };

  const elderlyVitals = [
    { label: "Heart Rate", value: `${seniorVitals.heart_rate} bpm`, status: "Normal", icon: Heart, color: "text-danger-500" },
    { label: "Blood Oxygen (SpO2)", value: `${seniorVitals.spo2}%`, status: "Optimal", icon: Activity, color: "text-primary-500" },
    { label: "Body Temp", value: `${seniorVitals.temperature}°C`, status: "Normal", icon: Thermometer, color: "text-amber-500" },
    { label: "Blood Pressure", value: seniorVitals.blood_pressure, status: "Normal", icon: Zap, color: "text-indigo-500" },
  ];

  const elderlyMedicines = [
    { id: "1", name: "BP Controller (Amlodipine 5mg)", time: "08:00 AM", taken: true },
    { id: "2", name: "Multivitamin & Calcium D3", time: "01:30 PM", taken: true },
    { id: "3", name: "Diabetes Care (Metformin 500mg)", time: "08:30 PM", taken: false },
  ];

  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedTime, setNewMedTime] = useState("08:00 AM");
  const [medicationList, setMedicationList] = useState(elderlyMedicines);


  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setMedicationList([
      ...medicationList,
      {
        id: String(Date.now()),
        name: newMedName,
        time: newMedTime || "09:00 AM",
        taken: false,
      },
    ]);
    setNewMedName("");
    setShowAddMedModal(false);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Elderly Health & Caregiver Monitoring
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Automated fall detection, Senior AI Health Index, simplified medicine reminders, and daily logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowLogModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 shadow-sm"
          >
            <Activity className="h-4 w-4" /> Input Senior Vitals & AI Index
          </Button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200">
              <Users className="h-4 w-4 text-indigo-600" /> Senior Profile: Ramesh Kumar (72 Yrs)
            </span>
          </div>
        </div>
      </div>

      {/* Senior AI Health Index Hero Banner */}
      <div className="card-surface p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 shadow-elevated">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl font-bold text-indigo-300">
                👴
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Ramesh Kumar (72 Yrs)</h2>
                <p className="text-xs text-indigo-200">Live Caregiver Sync Active · Primary Guardian: Vikram Kumar (+91 98765 43210)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[10px]">Heart Pulse</span>
                <span className="font-bold text-white">{seniorVitals.heart_rate} bpm</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                <span className="font-bold text-white">{seniorVitals.blood_pressure}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[10px]">SpO2 Oxygen</span>
                <span className="font-bold text-white">{seniorVitals.spo2}%</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[10px]">Blood Sugar</span>
                <span className="font-bold text-white">{seniorVitals.sugar_level} mg/dL</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-indigo-800/40 p-4 rounded-xl backdrop-blur-md border border-indigo-500/30 text-center">
            <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">AI Senior Health Score</span>
            <span className="text-4xl font-extrabold text-white my-1">{seniorHealthIndex} / 100</span>
            <span className="text-[11px] font-bold bg-emerald-400 text-slate-900 px-3 py-0.5 rounded-full">
              Stable Physiological State
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Input Senior Vitals */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" /> Input Senior Vitals & AI Score
              </h3>
              <button onClick={() => setShowLogModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleCalculateSeniorIndex} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={seniorVitals.heart_rate}
                    onChange={(e) => setSeniorVitals({ ...seniorVitals, heart_rate: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Blood Pressure (e.g. 124/80)</label>
                  <input
                    type="text"
                    value={seniorVitals.blood_pressure}
                    onChange={(e) => setSeniorVitals({ ...seniorVitals, blood_pressure: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={seniorVitals.spo2}
                    onChange={(e) => setSeniorVitals({ ...seniorVitals, spo2: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={seniorVitals.sugar_level}
                    onChange={(e) => setSeniorVitals({ ...seniorVitals, sugar_level: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-surface-muted"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowLogModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 text-white font-bold" size="sm">Calculate Senior AI Index</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}


      {/* Fall Detection & Daily Check-in Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fall Detection Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "card-surface p-6 border-l-4 shadow-elevated transition-all relative overflow-hidden",
            isSirenActive
              ? "border-l-rose-600 bg-rose-50/90 animate-pulse border-rose-300"
              : fallDetectionActive
              ? "border-l-emerald-500 bg-gradient-to-br from-emerald-50/40 to-white"
              : "border-l-amber-500"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
                  isSirenActive
                    ? "bg-rose-600 text-white animate-bounce"
                    : "bg-emerald-100 text-emerald-700"
                )}
              >
                {isSirenActive ? <Siren className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                  AI Fall Detection Sensor
                  {isSirenActive && <span className="text-xs text-rose-600 font-extrabold uppercase animate-ping">ALARM BLARING!</span>}
                </h3>
                <p className="text-xs text-ink-secondary">Accelerometer & Gyroscope Hardware Sensor Stream</p>
              </div>
            </div>
            <span
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-full",
                isSirenActive
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-emerald-100 text-emerald-800"
              )}
            >
              {isSirenActive ? "FALL ALARM ACTIVE" : "PROTECTED"}
            </span>
          </div>

          <p className="text-xs text-ink-secondary mt-4 leading-relaxed">
            If a sudden fall impact or lack of movement is detected, RakshaNet triggers a high-decibel siren alarm, broadcasts GPS coordinates, and alerts primary caregiver Dr. Rajesh Varma.
          </p>

          {/* Active Siren Banner */}
          {isSirenActive && (
            <div className="mt-3 p-3 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Siren className="h-4 w-4 animate-spin" />
                <span>FALL DETECTED — EMERGENCY SIREN ACTIVE</span>
              </div>
              <Button
                size="sm"
                onClick={toggleFallSiren}
                className="bg-white text-rose-700 hover:bg-slate-100 text-xs font-bold h-7 px-3"
              >
                <VolumeX className="h-3.5 w-3.5 mr-1" /> SILENCE SIREN
              </Button>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-ink-secondary">Sensor State: {fallDetectionActive ? "Arming High Sensitivity" : "Disabled"}</span>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={toggleFallSiren}
                className={cn(
                  "text-xs h-8 font-bold gap-1.5 shadow-sm transition-all",
                  isSirenActive
                    ? "bg-rose-700 text-white hover:bg-rose-800"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                )}
              >
                {isSirenActive ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" /> Stop Siren Alarm
                  </>
                ) : (
                  <>
                    <Siren className="h-3.5 w-3.5" /> Test Fall Siren Sound
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setFallDetectionActive(!fallDetectionActive)}
                className="text-xs h-8"
              >
                {fallDetectionActive ? "Sensor Enabled" : "Enable Sensor"}
              </Button>
            </div>
          </div>
        </motion.div>


        {/* Daily Morning Check-in Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 bg-gradient-to-r from-primary-600 to-indigo-700 text-white shadow-elevated flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-white/80 tracking-wider">
                Daily Wellness Signal
              </span>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                Today, 08:15 AM
              </span>
            </div>
            <h3 className="text-2xl font-extrabold mt-2">Daily Morning Check-in</h3>
            <p className="text-xs text-white/90 mt-1">
              Pressing the button notifies your family and assigned caregiver that you are doing well today.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold">Checked in at 8:15 AM</span>
            </div>
            <Button
              size="sm"
              className="bg-white text-primary-700 hover:bg-slate-100 font-bold px-5"
              onClick={() => setCheckedInToday(true)}
            >
              Send Check-in Signal
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Senior Vitals & Caregiver Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Senior Vitals Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-ink-primary">Live Vitals & Biometrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {elderlyVitals.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.label} className="card-surface p-4 text-center space-y-2">
                  <div className="flex justify-center">
                    <Icon className={cn("h-6 w-6", v.color)} />
                  </div>
                  <p className="text-xs text-ink-secondary font-medium">{v.label}</p>
                  <p className="text-xl font-bold text-ink-primary">{v.value}</p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {v.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* High-contrast Senior Medicine List */}
          <div className="card-surface p-6 space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary-600" /> Senior Medicine Checklist
              </h3>
              <Button
                size="sm"
                onClick={() => setShowAddMedModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-7 px-2.5"
              >
                + Add Medication
              </Button>
            </div>

            <div className="space-y-3">
              {medicationList.map((med) => (
                <div
                  key={med.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-muted border border-line gap-3"
                >
                  <div>
                    <p className="text-base font-bold text-ink-primary">{med.name}</p>
                    <p className="text-xs text-ink-secondary font-semibold">Time: {med.time}</p>
                  </div>

                  <button
                    onClick={() =>
                      setMedicationList(
                        medicationList.map((m) =>
                          m.id === med.id ? { ...m, taken: !m.taken } : m
                        )
                      )
                    }
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold text-center cursor-pointer transition-all",
                      med.taken
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    )}
                  >
                    {med.taken ? "✓ Dose Taken" : "Mark Dose Taken"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Primary Caregiver Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-ink-primary">Assigned Caregiver</h3>
          <div className="card-surface p-6 space-y-4 border-t-4 border-t-primary-600">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-extrabold text-xl shrink-0">
                DR
              </div>
              <div>
                <h4 className="text-base font-bold text-ink-primary">Dr. Rajesh Varma</h4>
                <p className="text-xs text-ink-secondary">Primary Geriatric Nurse & Caregiver</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  On Duty (Sector 14 Branch)
                </span>
              </div>
            </div>

            <div className="border-t border-line pt-3 space-y-2 text-xs">
              <p className="text-ink-secondary">Phone: <span className="font-bold text-ink-primary">+91 98765 44332</span></p>
              <p className="text-ink-secondary">Last Visit: <span className="font-bold text-ink-primary">Yesterday at 5:00 PM</span></p>
              <p className="text-ink-secondary">Next Home Visit: <span className="font-bold text-ink-primary">Tomorrow, 10:00 AM</span></p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a href="tel:+919876544332">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs">
                  <PhoneCall className="h-4 w-4" /> Call Caregiver Directly
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Senior Medication */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Pill className="h-5 w-5 text-indigo-600" /> Add Senior Medication Reminder
              </h3>
              <button onClick={() => setShowAddMedModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddMedication} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Medicine Name & Dosage</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BP Controller (Amlodipine 5mg)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Scheduled Time</label>
                <input
                  type="text"
                  placeholder="e.g. 08:00 AM or After Dinner"
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddMedModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold" size="sm">Save Medication</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}


