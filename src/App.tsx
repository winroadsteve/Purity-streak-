import React, { useState, useEffect } from "react";
import { 
  Shield, 
  TrendingUp, 
  BookOpen, 
  Library, 
  Flame, 
  AlertTriangle,
  History,
  Heart,
  Calendar,
  Smile
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import ProgressCharts from "./components/ProgressCharts";
import BibleVault from "./components/BibleVault";
import ReadingsLibrary from "./components/ReadingsLibrary";
import EmergencyButton from "./components/EmergencyButton";
import { Streak, RelapseRecord, DailyProgressLog } from "./types";

const LOCAL_STREAK_KEY = "purity_streak_data";
const LOCAL_LOGS_KEY = "purity_logs_data";

// Helper to format date YYYY-MM-DD
const formatDateStr = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "charts" | "bible" | "readings" | "emergency">("dashboard");
  const [streak, setStreak] = useState<Streak | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyProgressLog[]>([]);

  // Initialize app state
  useEffect(() => {
    const savedStreak = localStorage.getItem(LOCAL_STREAK_KEY);
    const savedLogs = localStorage.getItem(LOCAL_LOGS_KEY);

    if (savedStreak && savedLogs) {
      setStreak(JSON.parse(savedStreak));
      setDailyLogs(JSON.parse(savedLogs));
    } else {
      // Warm, helpful initial demo state so they see charts instantly!
      const now = Date.now();
      const threeDaysAgoMs = now - (3 * 24 * 60 * 60 * 1000) - (2 * 60 * 60 * 1000); // 3 days, 2 hours ago
      
      const initialStreak: Streak = {
        id: "streak-initial",
        startDate: threeDaysAgoMs,
        lastRelapseDate: null,
        currentDays: 3,
        longestDays: 3,
        relapseHistory: []
      };

      const date1Str = formatDateStr(new Date(now - 2 * 24 * 60 * 60 * 1000));
      const date2Str = formatDateStr(new Date(now - 1 * 24 * 60 * 60 * 1000));

      const initialLogs: DailyProgressLog[] = [
        {
          dateString: date1Str,
          status: "clean",
          urgesIntensity: 6,
          mood: 2,
          prayed: true,
          readingDone: true,
          notes: "Temptation was quite heavy today, but reading the Science Reset article helped me understand it was just a chemical spike."
        },
        {
          dateString: date2Str,
          status: "clean",
          urgesIntensity: 3,
          mood: 4,
          prayed: true,
          readingDone: false,
          notes: "Woke up with high focus. Kept custody of my eyes in the morning. Great day."
        }
      ];

      setStreak(initialStreak);
      setDailyLogs(initialLogs);
      localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(initialStreak));
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(initialLogs));
    }
  }, []);

  // Sync to local storage
  const saveStateToLocalStorage = (newStreak: Streak, newLogs: DailyProgressLog[]) => {
    setStreak(newStreak);
    setDailyLogs(newLogs);
    localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(newStreak));
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(newLogs));
  };

  // Check current streak calculation periodically
  useEffect(() => {
    if (!streak) return;
    
    const interval = setInterval(() => {
      const diffMs = Date.now() - streak.startDate;
      const days = diffMs <= 0 ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (days !== streak.currentDays) {
        const longest = Math.max(days, streak.longestDays);
        saveStateToLocalStorage(
          { ...streak, currentDays: days, longestDays: longest },
          dailyLogs
        );
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [streak, dailyLogs]);

  // Handle reporting a clean check-in
  const handleCheckIn = (logDetails: Omit<DailyProgressLog, "dateString">) => {
    if (!streak) return;

    const todayString = formatDateStr(new Date());
    
    // Check if log already exists for today to avoid duplicate entries
    const cleanLogs = dailyLogs.filter(log => log.dateString !== todayString);
    const newLog: DailyProgressLog = {
      ...logDetails,
      dateString: todayString
    };

    const updatedLogs = [newLog, ...cleanLogs];

    // Compute active streak days
    const diffMs = Date.now() - streak.startDate;
    const currentDaysComputed = diffMs <= 0 ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const newLongest = Math.max(currentDaysComputed, streak.longestDays);

    const updatedStreak: Streak = {
      ...streak,
      currentDays: currentDaysComputed,
      longestDays: newLongest
    };

    saveStateToLocalStorage(updatedStreak, updatedLogs);
  };

  // Handle reporting a relapse/reset
  const handleRelapse = (trigger: string, note: string, customRelapseTimeMs?: number) => {
    if (!streak) return;

    const relapseTime = customRelapseTimeMs || Date.now();
    const relapseDateStr = formatDateStr(new Date(relapseTime));

    const newRecord: RelapseRecord = {
      id: `relapse-${relapseTime}`,
      timestamp: relapseTime,
      trigger,
      note
    };

    const newHistory = [newRecord, ...streak.relapseHistory];

    const diffMs = Date.now() - relapseTime;
    const currentDaysComputed = diffMs <= 0 ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const updatedStreak: Streak = {
      id: `streak-${relapseTime}`,
      startDate: relapseTime, // New streak starts from custom relapse time
      lastRelapseDate: relapseTime,
      currentDays: currentDaysComputed,
      longestDays: streak.longestDays, // Keep historical longest days
      relapseHistory: newHistory
    };

    // Log the relapse day in history
    const filteredLogs = dailyLogs.filter(log => log.dateString !== relapseDateStr);
    const relapseLog: DailyProgressLog = {
      dateString: relapseDateStr,
      status: "relapsed",
      urgesIntensity: 9,
      mood: 1,
      prayed: false,
      readingDone: false,
      notes: `Streak reset. Triggered by: ${trigger}. Reflection: ${note}`
    };

    const updatedLogs = [relapseLog, ...filteredLogs];

    saveStateToLocalStorage(updatedStreak, updatedLogs);
    
    // Auto switch back to dashboard
    setActiveTab("dashboard");
  };

  // Adjust streak start date directly
  const handleSetStartDate = (startDateMs: number) => {
    if (!streak) return;

    const diffMs = Date.now() - startDateMs;
    const currentDaysComputed = diffMs <= 0 ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const newLongest = Math.max(currentDaysComputed, streak.longestDays);

    const updatedStreak: Streak = {
      ...streak,
      startDate: startDateMs,
      currentDays: currentDaysComputed,
      longestDays: newLongest
    };

    saveStateToLocalStorage(updatedStreak, dailyLogs);
  };

  // Handle Mark Reading Done from Reading library
  const handleMarkReadingCompleted = () => {
    if (!streak) return;

    const todayString = formatDateStr(new Date());
    const existingLog = dailyLogs.find(log => log.dateString === todayString);

    let updatedLogs;
    if (existingLog) {
      updatedLogs = dailyLogs.map(log => 
        log.dateString === todayString ? { ...log, readingDone: true } : log
      );
    } else {
      const newLog: DailyProgressLog = {
        dateString: todayString,
        status: "clean",
        urgesIntensity: 3,
        mood: 3,
        prayed: false,
        readingDone: true,
        notes: "Marked recommended reading guide completed."
      };
      updatedLogs = [newLog, ...dailyLogs];
    }

    saveStateToLocalStorage(streak, updatedLogs);
  };

  // Reset entire dataset
  const handleResetData = () => {
    const freshStreak: Streak = {
      id: "streak-fresh",
      startDate: Date.now(),
      lastRelapseDate: null,
      currentDays: 0,
      longestDays: 0,
      relapseHistory: []
    };
    saveStateToLocalStorage(freshStreak, []);
    setActiveTab("dashboard");
  };

  // Import external backup
  const handleImportData = (backup: { streak: Streak; dailyLogs: DailyProgressLog[] }) => {
    saveStateToLocalStorage(backup.streak, backup.dailyLogs);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans" id="purity-app-container">
      {/* Premium Header Layout */}
      <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="p-2 bg-amber-500 text-zinc-950 rounded-xl shadow-xs">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-black text-zinc-100 tracking-tight block">PURITY STREAK</span>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block -mt-1">VIGILANT SENTINEL</span>
            </div>
          </div>

          {/* Quick Stats Header indicator */}
          {streak && (
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-400">Streak:</span>
              <span className="text-xs font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">{streak.currentDays} Days</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Navigation Rail / Sidebar */}
        <aside className="w-full lg:w-64 shrink-0" id="sidebar-navigation">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none border-b lg:border-none border-zinc-800">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                activeTab === "dashboard"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
                  : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("charts")}
              className={`flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                activeTab === "charts"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
                  : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Progress Charts</span>
            </button>

            <button
              onClick={() => setActiveTab("bible")}
              className={`flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                activeTab === "bible"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
                  : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Bible Scriptures</span>
            </button>

            <button
              onClick={() => setActiveTab("readings")}
              className={`flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                activeTab === "readings"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
                  : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Library className="w-4 h-4 shrink-0" />
              <span>Recommended Reads</span>
            </button>

            <div className="h-px bg-zinc-800 my-2 hidden lg:block" />

            <button
              onClick={() => setActiveTab("emergency")}
              className={`flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap flex-1 lg:flex-none border ${
                activeTab === "emergency"
                  ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/15 animate-pulse"
                  : "bg-zinc-900/50 border-red-950 text-red-500 hover:bg-red-950/20 hover:text-red-400"
              }`}
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>EMERGENCY COUNSEL</span>
            </button>
          </nav>
        </aside>

        {/* Dynamic Content Panel */}
        <section className="flex-1 min-w-0" id="main-content-panel">
          {streak && (
            <>
              {activeTab === "dashboard" && (
                <Dashboard 
                  streak={streak}
                  dailyLogs={dailyLogs}
                  onCheckIn={handleCheckIn}
                  onRelapse={handleRelapse}
                  onResetData={handleResetData}
                  onImportData={handleImportData}
                  onSetStartDate={handleSetStartDate}
                />
              )}
              {activeTab === "charts" && <ProgressCharts dailyLogs={dailyLogs} />}
              {activeTab === "bible" && <BibleVault />}
              {activeTab === "readings" && (
                <ReadingsLibrary onMarkReadingCompleted={handleMarkReadingCompleted} />
              )}
              {activeTab === "emergency" && (
                <EmergencyButton currentStreakDays={streak.currentDays} />
              )}
            </>
          )}
        </section>
      </main>

      {/* Humble Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-6" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 font-bold tracking-widest">
          PURITY STREAK — EQUIPPED WITH THE WORD & SCIENCE. "STAND FIRM."
        </div>
      </footer>
    </div>
  );
}
