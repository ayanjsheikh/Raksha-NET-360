import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDataPoint } from "@/types/dashboard";

interface HealthChartProps {
  data: ChartDataPoint[];
}

export function HealthChart({ data }: HealthChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="card-surface p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-ink-primary">Weekly Health Score</h3>
          <p className="text-sm text-ink-secondary">Last 7 days overview</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
            Health Score
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              domain={[60, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(21, 101, 192, 0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`${value}`, "Score"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#1565C0"
              strokeWidth={2.5}
              fill="url(#scoreGradient)"
              dot={{ fill: "#1565C0", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#1565C0" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
