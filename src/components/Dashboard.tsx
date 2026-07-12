import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Clock, 
  Flame, 
  Award, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  History,
  Calendar,
  Smile,
  Zap,
  BookOpen,
  Check,
  Download,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Streak, RelapseRecord, DailyProgressLog } from "../types";

interface DashboardProps {
  streak: Streak;
  dailyLogs: DailyProgressLog[];
  onCheckIn: (log: Omit<DailyProgressLog, "dateString">) => void;
  onRelapse: (trigger: string, note: string) => void;
  onResetData: () => void;
  onImportData: (data: { streak: Streak; dailyLogs: DailyProgressLog[] }) => void;
}

const BADGES = [
  { days: 1, title: "Bronze Sentinel", desc: "Completed 24 Hours of purity", color: "from-amber-600 to-amber-800" },
  { days: 3, title: "Silver Guardian", desc: "Surpassed 3 Days of vigilant control", color: "from-slate-400 to-slate-600" },
  { days: 7, title: "Gold Shield", desc: "1 Week clean. Neural reset in progress", color: "from-yellow-500 to-amber-500" },
  { days: 14, title: "Platinum Conqueror", desc: "2 Weeks. Dopamine pathways upregulating", color: "from-teal-400 to-emerald-600" },
  { days: 30, title: "Amethyst Victor", desc: "1 Month of complete cognitive freedom", color: "from-purple-500 to-indigo-600" },
  { days: 90, title: "Diamond Overcomer", desc: "90 Days! Complete neural reset achieved", color: "from-blue-400 to-cyan-500" },
];

export default function Dashboard({ 
  streak, 
  dailyLogs, 
  onCheckIn, 
  onRelapse,
  onResetData,
  onImportData
}: DashboardProps) {
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // Check-in form state
  const [urgesIntensity, setUrgesIntensity] = useState(3);
  const [mood, setMood] = useState(3);
  const [prayed, setPrayed] = useState(false);
  const [readingDone, setReadingDone] = useState(false);
  const [checkInNote, setCheckInNote] = useState("");
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  // Relapse form state
  const [relapseTrigger, setRelapseTrigger] = useState("Boredom");
  const [relapseNote, setRelapseNote] = useState("");

  const TRIGGERS = ["Boredom", "Stress", "Social Media", "Late Night", "Loneliness", "Anger/Frustration", "Fatigue", "Unprotected Web Surfing"];

  // Update dynamic clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const start = streak.startDate;
      const diffMs = now - start;

      if (diffMs <= 0) {
        setTimeElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      setTimeElapsed({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [streak.startDate]);

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckIn({
      status: "clean",
      urgesIntensity,
      mood,
      prayed,
      readingDone,
      notes: checkInNote
    });
    setCheckInSuccess(true);
    setTimeout(() => {
      setCheckInSuccess(false);
      setShowCheckInModal(false);
      // Reset form
      setCheckInNote("");
      setPrayed(false);
      setReadingDone(false);
    }, 1500);
  };

  const handleRelapseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRelapse(relapseTrigger, relapseNote);
    setShowRelapseModal(false);
    // Reset form
    setRelapseNote("");
    setRelapseTrigger("Boredom");
  };

  // Check if check-in is already completed for today
  const todayStr = new Date().toISOString().split("T")[0];
  const hasCheckedInToday = dailyLogs.some(log => log.dateString === todayStr && log.status === "clean");

  // Export data function
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ streak, dailyLogs }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `purity-streak-backup-${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import data function
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.streak && parsed.dailyLogs) {
            onImportData(parsed);
            alert("Backup imported successfully!");
          } else {
            alert("Invalid backup file structure.");
          }
        } catch (err) {
          alert("Failed to parse the backup file.");
        }
      };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-zinc-100" id="purity-dashboard">
      {/* Dynamic Streak Shield Counter */}
      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-md relative overflow-hidden" id="streak-panel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20 opacity-40 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Shield className="w-3.5 h-3.5" /> ACTIVE SENTINEL PROTECTION
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Your Sanctification Path
            </h1>
            <p className="text-zinc-400 max-w-md text-sm italic">
              "Create in me a clean heart, O God, and renew a right spirit within me." – Psalm 51:10
            </p>

            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <button
                disabled={hasCheckedInToday}
                onClick={() => setShowCheckInModal(true)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 ${
                  hasCheckedInToday 
                  ? "bg-zinc-850 text-zinc-500 cursor-not-allowed border border-zinc-800" 
                  : "bg-amber-500 hover:bg-amber-400 text-zinc-950 active:scale-95"
                }`}
                id="btn-report-clean"
              >
                <CheckCircle className="w-4 h-4" />
                {hasCheckedInToday ? "Checked In Clean Today" : "Log Daily Clean Check-In"}
              </button>

              <button
                onClick={() => setShowRelapseModal(true)}
                className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider border border-red-900/40 text-red-400 bg-red-950/25 hover:bg-red-950/45 transition-all flex items-center gap-2 active:scale-95"
                id="btn-report-relapse"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Relapse / Slip
              </button>
            </div>
          </div>

          {/* Dynamic Gauge Shield */}
          <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800/60 min-w-[280px]">
            <div className="relative flex items-center justify-center w-40 h-40">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 animate-pulse border-t-transparent" />
              
              <div className="text-center z-10">
                <Flame className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                <span className="text-5xl font-black text-zinc-100 block italic tracking-tighter">
                  {timeElapsed.days}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                  DAYS CLEAN
                </span>
              </div>
            </div>

            {/* Dynamic Clock Section */}
            <div className="grid grid-cols-4 gap-2 text-center mt-6 w-full px-2">
              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
                <span className="text-lg font-black text-zinc-100 block">{timeElapsed.days}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Days</span>
              </div>
              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
                <span className="text-lg font-black text-zinc-100 block">{timeElapsed.hours}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Hrs</span>
              </div>
              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
                <span className="text-lg font-black text-zinc-100 block">{timeElapsed.minutes}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Mins</span>
              </div>
              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
                <span className="text-lg font-black text-amber-500 block">{timeElapsed.seconds}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="stats-grid">
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-zinc-850 rounded-2xl text-amber-500 border border-zinc-800">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-500">Longest Streak</span>
            <h3 className="text-2xl font-black text-zinc-100">{streak.longestDays} Days</h3>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-zinc-850 rounded-2xl text-red-400 border border-zinc-800">
            <History className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-500">Total Relapses</span>
            <h3 className="text-2xl font-black text-zinc-100">{streak.relapseHistory.length}</h3>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-zinc-850 rounded-2xl text-emerald-400 border border-zinc-800">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-500">Check-Ins Completed</span>
            <h3 className="text-2xl font-black text-zinc-100">{dailyLogs.length}</h3>
          </div>
        </div>
      </div>

      {/* Sentinel Badge Unlocks */}
      <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-sm" id="badges-panel">
        <h2 className="text-base uppercase tracking-widest font-black text-zinc-400 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Sentinel Achievement Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge, idx) => {
            const isUnlocked = streak.longestDays >= badge.days;
            const isCurrentActive = streak.currentDays >= badge.days;
            return (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border flex gap-3.5 items-start transition-all ${
                  isUnlocked 
                    ? "bg-zinc-950/40 border-amber-500/15 shadow-2xs" 
                    : "bg-zinc-950/10 border-zinc-900 opacity-40"
                }`}
              >
                <div className={`p-2.5 rounded-xl text-zinc-950 bg-gradient-to-br from-amber-400 to-amber-600 shrink-0 shadow-2xs`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-zinc-100 text-sm leading-tight">{badge.title}</h4>
                    {isCurrentActive && (
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{badge.desc}</p>
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest mt-2 block">
                    {badge.days} {badge.days === 1 ? "Day" : "Days"} Target
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy, Export & Backup Console */}
      <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-zinc-200 flex items-center justify-center sm:justify-start gap-2 text-sm uppercase tracking-wider">
            <Shield className="w-4 h-4 text-amber-500" /> 100% Offline & Private
          </h3>
          <p className="text-xs text-zinc-400 max-w-lg">
            All your records are stored directly inside your browser cache. Export backup files to safeguard your data.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 justify-center">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          
          <label className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95">
            <Upload className="w-3.5 h-3.5" /> Import
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              className="hidden" 
            />
          </label>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-950/40 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      <AnimatePresence>
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 rounded-3xl p-6 max-w-sm w-full border border-zinc-800 shadow-xl text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-black text-zinc-100">Clear All Streak Data?</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                This will permanently delete all your check-in logs, history, and streak states. This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    onResetData();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-all active:scale-95"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 font-bold rounded-xl text-xs transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Check-In Modal */}
      <AnimatePresence>
        {showCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-800 shadow-2xl overflow-hidden relative"
            >
              {checkInSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100">Check-In Successful!</h3>
                  <p className="text-zinc-400 text-xs">Purity Shield extended by 24 Hours.</p>
                </div>
              ) : (
                <form onSubmit={handleCheckInSubmit} className="space-y-5">
                  <div className="text-center">
                    <h3 className="text-xl font-black text-zinc-100 flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" /> Daily Sentinel Check-In
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1">Record today's victory and keep watch over your soul.</p>
                  </div>

                  {/* Urge Intensity Range */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-zinc-400">
                      <span>Urges Intensity</span>
                      <span className="text-amber-500 font-black">{urgesIntensity}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={urgesIntensity}
                      onChange={(e) => setUrgesIntensity(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-zinc-800"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                      <span>0 - Quiet Calm</span>
                      <span>5 - Moderate</span>
                      <span>10 - Critical Assault</span>
                    </div>
                  </div>

                  {/* Mood Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 block">Current Mood/Mental State</span>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { val: 1, label: "Tired/Low" },
                        { val: 2, label: "Anxious" },
                        { val: 3, label: "Peaceful" },
                        { val: 4, label: "Focused" },
                        { val: 5, label: "Glorious" }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setMood(item.val)}
                          className={`py-2 rounded-xl text-center flex flex-col justify-center items-center transition-all border ${
                            mood === item.val 
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-500 font-black" 
                              : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-850"
                          }`}
                        >
                          <span className="text-sm font-extrabold block">{item.val}</span>
                          <span className="text-[8px] tracking-tight">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes for Spiritual Armor */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`p-3 border rounded-xl flex items-center gap-2.5 cursor-pointer transition-all ${
                      prayed ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-zinc-950/40 border-zinc-800 text-zinc-400"
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={prayed}
                        onChange={(e) => setPrayed(e.target.checked)}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold block">Prayed / Guarded</span>
                        <span className="text-[9px] text-zinc-500 block font-semibold">Talked with God</span>
                      </div>
                    </label>

                    <label className={`p-3 border rounded-xl flex items-center gap-2.5 cursor-pointer transition-all ${
                      readingDone ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-zinc-950/40 border-zinc-800 text-zinc-400"
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={readingDone}
                        onChange={(e) => setReadingDone(e.target.checked)}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold block">Read Guide</span>
                        <span className="text-[9px] text-zinc-500 block font-semibold">Purity learning done</span>
                      </div>
                    </label>
                  </div>

                  {/* Reflective Note */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400">Reflective Journal Entry (Optional)</label>
                    <textarea
                      placeholder="How was the battle today? Record any insights, victories, or small struggles."
                      value={checkInNote}
                      onChange={(e) => setCheckInNote(e.target.value)}
                      rows={2}
                      className="w-full text-zinc-100 placeholder-zinc-600 bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs transition-all shadow-sm active:scale-95"
                    >
                      Complete Victory Check-In
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckInModal(false)}
                      className="px-5 py-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold rounded-xl text-xs transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Relapse / Reset Modal */}
      <AnimatePresence>
        {showRelapseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-zinc-900 rounded-3xl p-6 max-w-md w-full border border-zinc-800 shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleRelapseSubmit} className="space-y-5">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-red-950/20 text-red-500 border border-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-100">Honest Reset Required</h3>
                  <p className="text-zinc-500 text-xs italic">
                    "A righteous man falls seven times, and rises again." – Proverbs 24:16
                  </p>
                </div>

                <div className="bg-red-950/10 rounded-xl p-3 border border-red-900/20 text-red-400 text-xs leading-relaxed">
                  <strong>Important:</strong> There is absolutely zero condemnation here. Recovery is not a straight line. By tracking this relapse, you are learning what triggered you so you can seal the breach in your fortress tomorrow.
                </div>

                {/* Trigger Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">What triggered the slip?</label>
                  <select
                    value={relapseTrigger}
                    onChange={(e) => setRelapseTrigger(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 p-3 rounded-xl border border-zinc-800 text-xs focus:ring-amber-500 focus:border-amber-500 outline-none font-bold"
                  >
                    {TRIGGERS.map((trig, idx) => (
                      <option key={idx} value={trig}>{trig}</option>
                    ))}
                  </select>
                </div>

                {/* Honest reflections */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400">Honest Retrospective (Optional)</label>
                  <textarea
                    placeholder="Where were you? What thoughts or feelings led to this? How can you avoid this specific setup next time?"
                    value={relapseNote}
                    onChange={(e) => setRelapseNote(e.target.value)}
                    rows={3}
                    className="w-full text-zinc-100 placeholder-zinc-600 bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95"
                  >
                    Reset My Streak & Stand Up Again
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRelapseModal(false)}
                    className="px-5 py-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-350 border border-zinc-800 font-bold rounded-xl text-xs transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
