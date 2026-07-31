/**
 * HealthOverview.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 3: Caregiver Dashboard
 *
 * "Today's Health Summary" panel — heart rate trend, blood pressure,
 * medication adherence and fall-detection status, rendered as compact charts
 * using Recharts. Designed to sit at the top of the caregiver Dashboard.
 * ---------------------------------------------------------------------------
 */

import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { HeartPulse, Activity, Pill, ShieldCheck, AlertTriangle } from "lucide-react";
import { PatientHealthSummary } from "./Dashboard";

interface HealthOverviewProps {
  summary: PatientHealthSummary;
}

function MiniStat({
  icon,
  label,
  value,
  unit,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  trend?: number[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl font-bold text-slate-800">{value}</span>
          {unit && <span className="text-xs text-slate-400 ml-1">{unit}</span>}
        </div>
        {trend && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.map((v, i) => ({ i, v }))}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export function HealthOverview({ summary }: HealthOverviewProps) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat
          icon={<HeartPulse size={16} />}
          label="Heart Rate"
          value={summary.heartRate}
          unit="bpm"
          color="#E53935"
          trend={summary.heartRateTrend}
        />
        <MiniStat
          icon={<Activity size={16} />}
          label="Blood Pressure"
          value={summary.bloodPressure}
          color="#1565C0"
        />
        <MiniStat
          icon={<Pill size={16} />}
          label="Medication"
          value={`${summary.medicationAdherence}%`}
          color="#00B894"
        />
        <MiniStat
          icon={summary.fallDetected ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
          label="Fall Detection"
          value={summary.fallDetected ? "Alert" : "Normal"}
          color={summary.fallDetected ? "#E53935" : "#00B894"}
        />
      </div>

      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Health Score</h4>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#00B894"
                strokeWidth="3"
                strokeDasharray={`${summary.healthScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-slate-800">{summary.healthScore}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Based on heart rate stability, medication adherence, activity level and recent alert
            history over the last 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
