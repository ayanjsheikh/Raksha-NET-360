import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart2,
  CheckCircle,
  FileSpreadsheet,
  Share2,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const reportTrends = [
  { month: "Jan", healthScore: 82, bpAvg: 120, heartRateAvg: 73 },
  { month: "Feb", healthScore: 80, bpAvg: 119, heartRateAvg: 74 },
  { month: "Mar", healthScore: 84, bpAvg: 118, heartRateAvg: 72 },
  { month: "Apr", healthScore: 85, bpAvg: 117, heartRateAvg: 71 },
  { month: "May", healthScore: 83, bpAvg: 119, heartRateAvg: 73 },
  { month: "Jun", healthScore: 86, bpAvg: 118, heartRateAvg: 72 },
];

const availableReports = [
  {
    id: "rep-1",
    title: "Comprehensive Monthly Health Audit — June 2026",
    dateRange: "Jun 1, 2026 – Jun 30, 2026",
    type: "Monthly",
    size: "2.4 MB",
    grade: "A (Score: 86)",
  },
  {
    id: "rep-2",
    title: "Cardiovascular & Vital Trends Report",
    dateRange: "May 1, 2026 – May 31, 2026",
    type: "Monthly",
    size: "1.8 MB",
    grade: "A- (Score: 83)",
  },
  {
    id: "rep-3",
    title: "Weekly Immunization & Pediatric Summary",
    dateRange: "Jul 21, 2026 – Jul 28, 2026",
    type: "Weekly",
    size: "850 KB",
    grade: "Optimal",
  },
];

export default function Reports() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customRange, setCustomRange] = useState("Last 30 Days");
  const [reportsList, setReportsList] = useState(availableReports);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    setReportsList([
      {
        id: String(Date.now()),
        title: customTitle,
        dateRange: customRange,
        type: "Custom",
        size: "1.2 MB",
        grade: "Verified A",
      },
      ...reportsList,
    ]);
    setCustomTitle("");
    setShowGenerateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Medical Reports & Trend Exports
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Download clinical summaries, weekly vitals breakdown, and doctor-ready PDF reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold gap-2 text-xs shadow-md"
          >
            + Generate Custom Report
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="font-bold gap-2 text-xs border-line text-ink-primary"
          >
            <Download className="h-4 w-4 text-primary-600" /> Export History
          </Button>
        </div>
      </div>


      {/* Top Trend Graph Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" /> 6-Month Health Score Trajectory
            </h3>
            <p className="text-xs text-ink-secondary">Overall wellness score trend over time</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            +4.8% Improvement
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportTrends}>
              <defs>
                <linearGradient id="scoreReport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1565C0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="healthScore" stroke="#1565C0" fill="url(#scoreReport)" strokeWidth={2.5} name="Health Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Available Reports List */}
      <div className="card-surface p-6 space-y-4">
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" /> Generated Clinical PDF Archives
        </h3>

        <div className="space-y-3">
          {reportsList.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-muted border border-line gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink-primary">{report.title}</h4>
                  <p className="text-xs text-ink-secondary">
                    {report.dateRange} · {report.size} · Grade: {report.grade}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(report.id)}
                  disabled={downloadingId === report.id}
                  className="gap-2 text-xs font-semibold"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloadingId === report.id ? "Generating PDF..." : "Download PDF"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Generate Custom Report */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600" /> Generate Custom Health Report
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Report Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Comprehensive Cardiology & Vitals Summary"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Date Range Filter</label>
                <select
                  value={customRange}
                  onChange={(e) => setCustomRange(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted cursor-pointer"
                >
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="Full Year 2026">Full Year 2026</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowGenerateModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold" size="sm">Compile & Save Report</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

