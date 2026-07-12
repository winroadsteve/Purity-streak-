import React from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { DailyProgressLog } from "../types";
import { Activity, Zap, TrendingUp, Smile, Calendar, CheckSquare } from "lucide-react";

interface ProgressChartsProps {
  dailyLogs: DailyProgressLog[];
}

export default function ProgressCharts({ dailyLogs }: ProgressChartsProps) {
  // If no logs exist, provide a mock or placeholder view with helpful instructional information
  const hasLogs = dailyLogs.length > 0;
  
  // Format dates for display (e.g., "July 12" or "07/12")
  const chartData = dailyLogs.map(log => {
    try {
      const dateParts = log.dateString.split("-");
      const shortDate = dateParts.length === 3 ? `${dateParts[1]}/${dateParts[2]}` : log.dateString;
      return {
        ...log,
        displayName: shortDate,
        urges: log.urgesIntensity,
        moodLevel: log.mood,
        statusVal: log.status === "clean" ? 1 : 0
      };
    } catch {
      return {
        ...log,
        displayName: log.dateString,
        urges: log.urgesIntensity,
        moodLevel: log.mood,
        statusVal: log.status === "clean" ? 1 : 0
      };
    }
  }).sort((a, b) => a.dateString.localeCompare(b.dateString));

  // If no logs, let's generate some educational sample data to show what they'll see
  const sampleData = [
    { displayName: "Day 1", urges: 7, moodLevel: 2, statusVal: 1 },
    { displayName: "Day 2", urges: 8, moodLevel: 1, statusVal: 1 },
    { displayName: "Day 3", urges: 5, moodLevel: 3, statusVal: 1 },
    { displayName: "Day 4", urges: 9, moodLevel: 2, statusVal: 0 },
    { displayName: "Day 5", urges: 4, moodLevel: 3, statusVal: 1 },
    { displayName: "Day 6", urges: 3, moodLevel: 4, statusVal: 1 },
    { displayName: "Day 7", urges: 2, moodLevel: 5, statusVal: 1 },
  ];

  const dataToRender = hasLogs ? chartData : sampleData;

  // Calculate statistics
  const cleanDaysCount = dailyLogs.filter(l => l.status === "clean").length;
  const averageUrge = hasLogs 
    ? (dailyLogs.reduce((acc, curr) => acc + curr.urgesIntensity, 0) / dailyLogs.length).toFixed(1)
    : "5.0";
  const averageMood = hasLogs
    ? (dailyLogs.reduce((acc, curr) => acc + curr.mood, 0) / dailyLogs.length).toFixed(1)
    : "3.0";
  const prayerCompletionRate = hasLogs
    ? Math.round((dailyLogs.filter(l => l.prayed).length / dailyLogs.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn text-zinc-100" id="purity-charts">
      {/* Chart Introduction */}
      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-zinc-850 text-amber-500 border border-zinc-800 rounded-2xl">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-100">Your Journey Analytics</h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Visualizing your urge patterns and emotional states. Over time, science shows your urge intensity spikes will level off and your baseline mood will elevate.
          </p>
        </div>
      </div>

      {!hasLogs && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl p-4 text-xs text-center">
          <strong>Showing Educational Sample Data:</strong> You haven't checked in yet. Log your first clean day to start plotting your own dynamic charts!
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-3xs text-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Average Urge</span>
          <span className="text-2xl font-black text-amber-500">{averageUrge} / 10</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Lower is better</span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-3xs text-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Mental State</span>
          <span className="text-2xl font-black text-emerald-400">{averageMood} / 5</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Higher is better</span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-3xs text-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Prayer Connection</span>
          <span className="text-2xl font-black text-amber-500">{prayerCompletionRate}%</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Spiritual Vigilance</span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-3xs text-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Log Consistency</span>
          <span className="text-2xl font-black text-zinc-300">{dailyLogs.length} Days</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Total recorded path</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urge Intensity Chart */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Urge Intensity Trend Line
          </h3>
          <p className="text-xs text-zinc-400">
            A high-purity fast recalibrates dopamine. Watch as urges gradually diminish in both frequency and amplitude.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataToRender} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="displayName" stroke="#71717a" fontSize={11} fontWeight={600} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} stroke="#71717a" fontSize={11} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", borderRadius: "12px", border: "1px solid #27272a", color: "#f4f4f5", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="urges" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#18181b" }}
                  activeDot={{ r: 6 }} 
                  name="Urge Intensity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood vs Urges Bar Chart */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-emerald-500" /> Mental State & Urge Alignment
          </h3>
          <p className="text-xs text-zinc-400">
            Compare your mood score (1-5) directly against your temptation level. Stress triggers urges!
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataToRender} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="displayName" stroke="#71717a" fontSize={11} fontWeight={600} />
                <YAxis domain={[0, 10]} stroke="#71717a" fontSize={11} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", borderRadius: "12px", border: "1px solid #27272a", color: "#f4f4f5", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600 }} />
                <Bar dataKey="urges" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Urge Intensity (1-10)" />
                <Bar dataKey="moodLevel" fill="#10b981" radius={[4, 4, 0, 0]} name="Mental State (1-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Checklist Logs */}
      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm space-y-4" id="logs-panel">
        <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-emerald-500" /> Sentinel Check-In Logs
        </h3>
        
        {hasLogs ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-extrabold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-center">Urge Level</th>
                  <th className="pb-3 px-4 text-center">Mood</th>
                  <th className="pb-3 px-4 text-center">Spiritual Shield</th>
                  <th className="pb-3 pl-4">Personal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-medium text-zinc-300">
                {chartData.map((log, idx) => (
                  <tr key={idx} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="py-3 pr-4 font-bold text-zinc-100">{log.dateString}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === "clean" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                          : "bg-red-500/10 text-red-400 border border-red-500/25"
                      }`}>
                        {log.status === "clean" ? "Clean" : "Relapsed"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-amber-500 font-extrabold">{log.urgesIntensity}/10</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-extrabold">{log.mood}/5</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 justify-center">
                        {log.prayed && (
                          <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-amber-500/25">
                            Prayer
                          </span>
                        )}
                        {log.readingDone && (
                          <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-blue-500/25">
                            Read
                          </span>
                        )}
                        {!log.prayed && !log.readingDone && <span className="text-zinc-600">-</span>}
                      </div>
                    </td>
                    <td className="py-3 pl-4 text-zinc-400 italic max-w-xs truncate" title={log.notes}>
                      {log.notes || <span className="text-zinc-600">No entry</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 space-y-2">
            <Calendar className="w-10 h-10 mx-auto text-zinc-600" />
            <h4 className="font-bold text-zinc-300 text-sm">No recorded checkpoints</h4>
            <p className="text-xs max-w-xs mx-auto">Your physical logs will populate in this table as you progress.</p>
          </div>
        )}
      </div>
    </div>
  );
}
