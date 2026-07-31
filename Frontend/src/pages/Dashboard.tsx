import { useState } from "react";
import { motion } from "framer-motion";
import { HealthCard } from "@/components/dashboard/HealthCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RiskCard } from "@/components/dashboard/RiskCard";
import { HealthChart } from "@/components/dashboard/HealthChart";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { EmergencyCard } from "@/components/dashboard/EmergencyCard";
import { MedicationCard } from "@/components/dashboard/MedicationCard";
import { ContactCard } from "@/components/dashboard/ContactCard";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  healthScore,
  healthStats,
  riskAnalysis,
  weeklyChartData,
  quickActions,
  emergencyFacilities,
  emergencyContacts,
  medicalId,
  sosHistory,
  upcomingMedications,
  aiRecommendations,
  recentAlerts,
} from "@/data/dashboardData";

export default function Dashboard() {
  const { latitude, longitude, address, loading } = useGeolocation();
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitals, setVitals] = useState({ hr: 72, bp: "120/80", spo2: 98, temp: 36.8 });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Health Overview & Command Center
          </h1>
          <p className="text-sm text-ink-secondary mt-1 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
            {loading ? "Acquiring live GPS..." : `Live Location: ${address}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowVitalsModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Quick Log Vitals
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emergency-50 px-3 py-1.5 text-xs font-bold text-emergency-600 border border-emergency-200">
            <span className="h-2 w-2 rounded-full bg-emergency-500 animate-pulse" />
            GPS Protection Active
          </span>
        </div>
      </div>


      {/* Main Health Score Banner */}
      <HealthCard data={healthScore} />

      {/* Vitals & Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {healthStats.map((stat, idx) => (
          <StatCard key={stat.id} stat={stat} index={idx} />
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div>
        <h2 className="text-lg font-semibold text-ink-primary mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* Main Grid Section: Charts & Analytics vs Emergency Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <HealthChart data={weeklyChartData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskCard data={riskAnalysis} />
            <MedicationCard medications={upcomingMedications} />
          </div>

          <RecommendationCard recommendations={aiRecommendations} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <EmergencyCard
            facilities={emergencyFacilities}
            contacts={emergencyContacts}
            medicalId={medicalId}
            sosHistory={sosHistory}
          />
          <ContactCard contacts={emergencyContacts} />
          <AlertCard alerts={recentAlerts} />
        </div>
      </div>

      {/* Modal: Quick Log Vitals */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" /> Quick Log Health Vitals
              </h3>
              <button onClick={() => setShowVitalsModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowVitalsModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.hr}
                    onChange={(e) => setVitals({ ...vitals, hr: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Blood Pressure</label>
                  <input
                    type="text"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl bg-surface-muted"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-secondary mb-1 block">Body Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temp}
                    onChange={(e) => setVitals({ ...vitals, temp: parseFloat(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl bg-surface-muted"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowVitalsModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold" size="sm">Log Vitals Record</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

