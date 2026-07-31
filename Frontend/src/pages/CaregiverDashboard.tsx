import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Heart,
  Battery,
  MapPin,
  Pill,
  AlertTriangle,
  Clock,
  Activity,
  Phone,
  ShieldCheck,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface Patient {
  id: string;
  name: string;
  relation: string;
  age: number;
  healthScore: number;
  riskLevel: "low" | "moderate" | "high";
  location: string;
  battery: number;
  medStatus: string;
  lastSync: string;
  status: "Normal" | "Alert" | "Stable";
}

const patientsList: Patient[] = [
  {
    id: "p1",
    name: "Ramesh Kumar",
    relation: "Father (Elderly Care)",
    age: 72,
    healthScore: 78,
    riskLevel: "moderate",
    location: "Sector 14, Gurgaon",
    battery: 84,
    medStatus: "2/3 Taken",
    lastSync: "5 mins ago",
    status: "Stable",
  },
  {
    id: "p2",
    name: "Aarav Sharma",
    relation: "Son (Child Care)",
    age: 2,
    healthScore: 92,
    riskLevel: "low",
    location: "Home - Sector 14",
    battery: 95,
    medStatus: "1/1 Given",
    lastSync: "12 mins ago",
    status: "Normal",
  },
  {
    id: "p3",
    name: "Sunita Devi",
    relation: "Mother-in-law",
    age: 68,
    healthScore: 65,
    riskLevel: "high",
    location: "Apollo Hospital Sector 14",
    battery: 42,
    medStatus: "1/4 Taken",
    lastSync: "Just now",
    status: "Alert",
  },
];

export default function CaregiverDashboard() {
  const [patients, setPatients] = useState<Patient[]>(patientsList);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patientsList[0]);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientRelation, setNewPatientRelation] = useState("Elderly Care");
  const [newPatientAge, setNewPatientAge] = useState(70);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;
    const newPatient: Patient = {
      id: String(Date.now()),
      name: newPatientName,
      relation: `${newPatientRelation}`,
      age: Number(newPatientAge),
      healthScore: 85,
      riskLevel: "low",
      location: "Registered Residence",
      battery: 90,
      medStatus: "0/2 Taken",
      lastSync: "Just now",
      status: "Stable",
    };
    setPatients([...patients, newPatient]);
    setSelectedPatient(newPatient);
    setNewPatientName("");
    setShowAddPatientModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Caregiver Hub & Multi-Patient Command
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Real-time remote vital monitoring, fall detection alerts, and patient management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddPatientModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm"
          >
            + Add Dependent Profile
          </Button>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-700 bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-200">
            <UserCheck className="h-4 w-4 text-primary-600" /> Active Caregiver Session
          </div>
        </div>
      </div>


      {/* Patient Cards Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patients.map((patient) => (

          <motion.div
            key={patient.id}
            onClick={() => setSelectedPatient(patient)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "card-surface p-5 cursor-pointer border-2 transition-all space-y-4",
              selectedPatient.id === patient.id
                ? "border-primary-500 shadow-card bg-primary-50/20"
                : "border-transparent hover:border-line"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-extrabold text-base">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-primary">{patient.name}</h3>
                  <p className="text-xs text-ink-secondary">{patient.relation} · {patient.age} yrs</p>
                </div>
              </div>

              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize",
                  patient.status === "Normal" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                  patient.status === "Stable" && "bg-blue-50 text-blue-700 border border-blue-200",
                  patient.status === "Alert" && "bg-danger-50 text-danger-700 border border-danger-200 animate-pulse"
                )}
              >
                {patient.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-surface-muted">
                <span className="text-ink-secondary text-[11px]">Health Score</span>
                <p className="text-lg font-black text-ink-primary">{patient.healthScore} / 100</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-muted">
                <span className="text-ink-secondary text-[11px]">Medication</span>
                <p className="text-sm font-bold text-ink-primary mt-1">{patient.medStatus}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-secondary pt-1">
              <span className="flex items-center gap-1">
                <Battery className="h-3.5 w-3.5 text-emerald-600" /> {patient.battery}% Device
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary-500" /> {patient.location}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Patient Deep-Dive Detail View */}
      <div className="card-surface p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white font-extrabold text-xl">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-ink-primary">{selectedPatient.name}</h2>
                <span className="text-xs bg-surface-muted border border-line text-ink-secondary px-2.5 py-0.5 rounded-full font-semibold">
                  {selectedPatient.relation}
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                Last Telemetry Sync: {selectedPatient.lastSync} · Live GPS Track Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 text-primary-600" /> View Live Map
            </Button>
            <Button size="sm" className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Phone className="h-3.5 w-3.5" /> Call Patient
            </Button>
          </div>
        </div>

        {/* Vitals & Alert Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" /> Patient Live Vitals & Sensors
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-surface-muted border border-line">
                <span className="text-xs text-ink-secondary">Heart Rate</span>
                <p className="text-2xl font-bold text-ink-primary mt-1">74 bpm</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Normal</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-muted border border-line">
                <span className="text-xs text-ink-secondary">Blood Pressure</span>
                <p className="text-2xl font-bold text-ink-primary mt-1">122/78</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Optimal</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-muted border border-line">
                <span className="text-xs text-ink-secondary">Fall Detector</span>
                <p className="text-lg font-bold text-emerald-600 mt-1">Active</p>
                <span className="text-[10px] text-ink-secondary">0 Incidents</span>
              </div>
            </div>

            {/* Medication Checklist */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-ink-primary mb-3">Daily Prescriptions Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line">
                  <span>Amlodipine 5mg (Morning)</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">✓ Confirmed Taken</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line">
                  <span>Metformin 500mg (Afternoon)</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">✓ Confirmed Taken</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Activity & Alerts Feed */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> Recent Telemetry Logs
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-muted border border-line">
                <div className="flex justify-between font-bold text-ink-primary">
                  <span>Daily Morning Check-in</span>
                  <span className="text-[10px] text-ink-secondary">08:15 AM</span>
                </div>
                <p className="text-ink-secondary mt-1">Patient acknowledged wellness prompt.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-line">
                <div className="flex justify-between font-bold text-ink-primary">
                  <span>Vitals Auto-Sync</span>
                  <span className="text-[10px] text-ink-secondary">10:30 AM</span>
                </div>
                <p className="text-ink-secondary mt-1">Heart rate and SpO2 synced automatically via smartwatch.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Dependent Profile */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary-600" /> Add Dependent Profile
              </h3>
              <button onClick={() => setShowAddPatientModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Care Category</label>
                <select
                  value={newPatientRelation}
                  onChange={(e) => setNewPatientRelation(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted cursor-pointer"
                >
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Child Care">Child Care</option>
                  <option value="Chronic Care">Chronic Care</option>
                  <option value="Post-Op Recovery">Post-Op Recovery</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Age (Years)</label>
                <input
                  type="number"
                  value={newPatientAge}
                  onChange={(e) => setNewPatientAge(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddPatientModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold" size="sm">Save Dependent</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

