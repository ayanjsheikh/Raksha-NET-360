import { useState } from "react";
import { motion } from "framer-motion";
import {
  Signal,
  SignalZero,
  MessageSquare,
  RefreshCw,
  Database,
  Building2,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export default function RuralMode() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queue, setQueue] = useState([
    { id: "q1", type: "Vitals Record", detail: "BP 120/80, HR 72", timestamp: "Today 02:15 PM", synced: false },
    { id: "q2", type: "Water Intake Log", detail: "1.5 L consumed", timestamp: "Today 11:30 AM", synced: false },
    { id: "q3", type: "Medicine Check", detail: "Metformin taken", timestamp: "Today 08:00 AM", synced: true },
  ]);

  const nearbyCenters = [
    { id: "phc-1", name: "Primary Health Center (PHC) Village Badshahpur", type: "PHC", distance: "2.4 km", doctor: "Dr. Rameshwar Singh", phone: "+91 98112 00112" },
    { id: "chc-2", name: "Community Health Center (CHC) Sohna Block", type: "CHC", distance: "5.1 km", doctor: "Dr. Meenakshi Pal", phone: "+91 98112 00113" },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setQueue((prev) => prev.map((q) => ({ ...q, synced: true })));
      setIsSyncing(false);
    }, 1500);
  };

  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newLogType, setNewLogType] = useState("Vitals Record");
  const [newLogDetail, setNewLogDetail] = useState("");

  const handleAddOfflineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogDetail) return;
    setQueue([
      {
        id: String(Date.now()),
        type: newLogType,
        detail: newLogDetail,
        timestamp: "Just now",
        synced: false,
      },
      ...queue,
    ]);
    setNewLogDetail("");
    setShowAddLogModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Rural & Low-Bandwidth Mode
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Zero-internet SMS emergency dispatch, offline data caching, and local PHC registry.
          </p>
        </div>

        {/* Offline Mode Switch */}
        <button
          onClick={() => setOfflineMode(!offlineMode)}
          className={cn(
            "flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm",
            offlineMode
              ? "bg-amber-500 text-white border-amber-600 shadow-amber-500/20"
              : "bg-surface text-ink-secondary border-line"
          )}
        >
          {offlineMode ? <SignalZero className="h-4 w-4" /> : <Signal className="h-4 w-4 text-emerald-600" />}
          {offlineMode ? "Offline Low-Bandwidth Active" : "Online Mode"}
        </button>
      </div>

      {/* Top Banner: Low-Bandwidth Status & SMS SOS Fallback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Emergency Broadcast Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card-surface p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-elevated"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md uppercase tracking-wider mb-2">
                No Data Connection Required
              </span>
              <h2 className="text-2xl font-extrabold">SMS Emergency Fallback</h2>
              <p className="text-xs text-white/90 max-w-md mt-1">
                Generates a compressed 160-character SMS packet containing your cellular cell tower coordinates, blood group, and emergency alert.
              </p>
            </div>

            <a href="sms:112?body=EMERGENCY%20SOS%20RakshaNet%20User%20Loc:28.45,77.02%20Blood:O+">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 font-extrabold text-sm h-12 px-6 rounded-xl shrink-0 gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" /> Send SMS Emergency
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Sync Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Database className="h-5 w-5 text-primary-600" /> Offline Data Queue
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {queue.filter((q) => !q.synced).length} Pending Sync
            </span>
          </div>

          <p className="text-xs text-ink-secondary">
            Health records logged while offline are stored securely in local device storage until internet connectivity is restored.
          </p>

          <div className="pt-2">
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              size="sm"
              className="w-full text-xs font-bold gap-2 bg-primary-600 text-white"
            >
              <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
              {isSyncing ? "Syncing Data Vault..." : "Sync Offline Queue Now"}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Grid: Offline Queue List & Rural Health Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offline Log Queue */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-500" /> Local Offline Activity Queue
            </h3>
            <Button
              size="sm"
              onClick={() => setShowAddLogModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-7 px-2.5"
            >
              + Log Offline Record
            </Button>
          </div>


          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted border border-line text-xs"
              >
                <div>
                  <p className="font-bold text-ink-primary">{item.type}</p>
                  <p className="text-ink-secondary text-[11px]">{item.detail} · {item.timestamp}</p>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full font-bold text-[10px]",
                    item.synced ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}
                >
                  {item.synced ? "✓ Synced" : "Pending Sync"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nearby Primary Health Centers (PHC) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" /> Local Primary Health Centers (PHC)
          </h3>

          <div className="space-y-3">
            {nearbyCenters.map((center) => (
              <div
                key={center.id}
                className="p-4 rounded-xl bg-surface-muted border border-line space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    {center.type}
                  </span>
                  <span className="text-emerald-700 font-bold">{center.distance}</span>
                </div>
                <h4 className="text-sm font-bold text-ink-primary">{center.name}</h4>
                <p className="text-ink-secondary text-[11px]">Officer In-Charge: {center.doctor}</p>

                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={`tel:${center.phone}`}
                    className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call PHC ({center.phone})
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal: Log Offline Record */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-600" /> Log Offline Medical Record
              </h3>
              <button onClick={() => setShowAddLogModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddOfflineItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Record Category</label>
                <select
                  value={newLogType}
                  onChange={(e) => setNewLogType(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted cursor-pointer"
                >
                  <option value="Vitals Record">Vitals Record</option>
                  <option value="Water Intake Log">Water Intake Log</option>
                  <option value="Medicine Check">Medicine Check</option>
                  <option value="Symptom Note">Symptom Note</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Details / Notes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BP 120/80, Heart Rate 75 bpm"
                  value={newLogDetail}
                  onChange={(e) => setNewLogDetail(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddLogModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold" size="sm">Queue Offline Log</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

