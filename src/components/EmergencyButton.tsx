import React, { useState } from "react";
import { 
  ShieldAlert, 
  Flame, 
  Compass, 
  HelpCircle, 
  Sparkles, 
  Play, 
  BookOpen, 
  Heart, 
  RefreshCw,
  AlertOctagon,
  Settings,
  XCircle,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CounselorResponse } from "../types";

interface EmergencyButtonProps {
  currentStreakDays: number;
}

// Fallback high-quality rescue payload when API key is missing
const FALLBACK_RESCUE_GUIDES: Record<string, CounselorResponse> = {
  "Intense Urge": {
    message: "Take a slow, deep breath. This urge is a chemical surge, not a command. You do not have to obey it. It is peak level right now, but it WILL subside in 10 minutes if you disrupt your brain's anticipation. You are completely safe under God's shield.",
    scriptureReference: "1 Corinthians 10:13",
    scriptureText: "No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.",
    prayer: "Lord Jesus, I surrender this intense craving into Your hands. Splash Your Holy Spirit's calm over my mind. Break this hypnotic hold and give me the immediate courage to stand up and walk away. Amen.",
    practicalActions: [
      "Stand up and immediately leave your current room. Walk outside or to a communal area.",
      "Splash freezing cold water on your face, or hold an ice cube in your hand for 60 seconds.",
      "Drop and do 20 pushups as fast as possible to flood your muscles with oxygen and blood."
    ]
  },
  "Boredom / Idleness": {
    message: "Boredom is the voice of your dopamine system pleading for easy, passive stimulation. Do not reward it with visual consumption. Your mind is a temple; give it a noble, active task immediately. You are built for creation, not consumption.",
    scriptureReference: "Romans 12:2",
    scriptureText: "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.",
    prayer: "Father, my mind is idle, and the enemy is trying to present false comfort. Give me a hunger for high-value pursuits. Inspire me with a project, a book, or a person to serve this very hour. Amen.",
    practicalActions: [
      "Close all browser tabs. Shut down your phone/laptop and put it in a separate room.",
      "Pick up a difficult physical book or an educational article and read for 10 minutes.",
      "Message a friend or family member asking how their day is going; focus on serving others."
    ]
  },
  "Stress / Anger": {
    message: "Your nervous system is flooded with cortisol and adrenaline. Lust is trying to sell you a fake, instant tranquilizer. Do not take the bait. The escape of lust will only add shame and multiply your stress. Let Christ be your peace.",
    scriptureReference: "Philippians 4:6-7",
    scriptureText: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
    prayer: "Lord, I am completely overwhelmed and frustrated. I take this anger and tension and place it at Your feet. Grant me the grace to endure this discomfort without resorting to easy self-medication. Amen.",
    practicalActions: [
      "Sit upright. Inhale slowly for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat 5 times.",
      "Leave your device behind and walk at a brisk pace around the block or up some stairs.",
      "Write down the exact 3 things causing you frustration, and say aloud: 'I entrust these to God.'"
    ]
  },
  "Loneliness": {
    message: "Loneliness creates a deep emotional ache that lust seeks to hijack with simulated virtual intimacy. Porn cannot love you; it leaves you twice as isolated. Bring your hunger for connection to the Father who sees you.",
    scriptureReference: "Psalm 139:1-3",
    scriptureText: "O Lord, you have searched me and known me! You know when I sit down and when I rise up; you discern my thoughts from afar. You search out my path and my lying down and are acquainted with all my ways.",
    prayer: "Jesus, I feel profoundly alone right now. I ask You to inhabit this empty space. Remind me that I am Your beloved child, fully known and fully loved. Give me the strength to reach out to real people. Amen.",
    practicalActions: [
      "Pick up your phone and text or call an accountability partner, parent, or trusted friend.",
      "Go immediately to a public coffee shop, park, or library—be around other human beings.",
      "Write a short note of gratitude to someone who has supported you in the past."
    ]
  },
  "Late Night Fatigue": {
    message: "Your prefrontal cortex is exhausted and lacks the executive strength to filter triggers. Do not stay on your device. You are entering a danger zone. Secure your perimeter and sleep in peace.",
    scriptureReference: "Psalm 4:8",
    scriptureText: "In peace I will both lie down and sleep; for you alone, O Lord, make me dwell in safety.",
    prayer: "Lord, I am tired, and my guard is slipping. I surrender my devices and my thoughts into Your custody. Wrap me in Your protection and give me a night of clean, restorative rest. Amen.",
    practicalActions: [
      "Plug your phone in to charge across the room, far out of physical reach of your bed.",
      "Turn off all screens immediately. Do not check 'one last thing' on social media.",
      "Lie flat on your back and repeat a slow scripture verse (like Psalm 23) until you fall asleep."
    ]
  }
};

export default function EmergencyButton({ currentStreakDays }: EmergencyButtonProps) {
  const [trigger, setTrigger] = useState("Intense Urge");
  const [userNote, setUserNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [counsel, setCounsel] = useState<CounselorResponse | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ type: string; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const TRIGGERS = [
    "Intense Urge",
    "Boredom / Idleness",
    "Stress / Anger",
    "Loneliness",
    "Late Night Fatigue",
    "Social Media Trigger"
  ];

  const handleEscapeAssault = async () => {
    setLoading(true);
    setCounsel(null);
    setErrorDetails(null);

    try {
      const response = await fetch("/api/emergency-counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger, currentStreakDays, userNote }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_MISSING") {
          throw new Error("API_KEY_MISSING");
        } else {
          throw new Error(data.message || "Failed to contact counselor.");
        }
      }

      setCounsel(data);
    } catch (err: any) {
      console.error("Emergency counsel error:", err);
      if (err.message === "API_KEY_MISSING") {
        setErrorDetails({
          type: "API_KEY_MISSING",
          msg: "Gemini API key is not configured in this workspace. No worries! Here is our pristine, offline tactical counselor guide built for your exact trigger."
        });
        
        // Provide pristine fallback based on selected trigger
        const fallbackKey = trigger in FALLBACK_RESCUE_GUIDES ? trigger : "Intense Urge";
        setCounsel(FALLBACK_RESCUE_GUIDES[fallbackKey]);
      } else {
        setErrorDetails({
          type: "SERVER_ERROR",
          msg: "Could not establish server-side AI connection. Using offline hand-picked rescue guide instead."
        });
        const fallbackKey = trigger in FALLBACK_RESCUE_GUIDES ? trigger : "Intense Urge";
        setCounsel(FALLBACK_RESCUE_GUIDES[fallbackKey]);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyScripture = () => {
    if (!counsel) return;
    const textToCopy = `"${counsel.scriptureText}" — ${counsel.scriptureReference}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-zinc-100 animate-fadeIn" id="emergency-button-module">
      {/* Immersive Trigger Sheet */}
      <AnimatePresence mode="wait">
        {!counsel && !loading ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-lg text-center space-y-6 relative overflow-hidden"
          >
            {/* Glowing red accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-red-500 rounded-b-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />

            <div className="space-y-2">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-black text-zinc-100 tracking-tight">
                AI TEMPTATION ESCAPE BUTTON
              </h1>
              <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                Facing a severe attack or urge? Do not try to fight it alone. Select your trigger below and hit the panic escape button immediately.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4 max-w-md mx-auto text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">Identify Current Enemy Trigger</label>
                <div className="grid grid-cols-2 gap-2">
                  {TRIGGERS.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTrigger(t)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        trigger === t 
                          ? "bg-red-500/10 border-red-500/30 text-red-400 shadow-sm" 
                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:bg-zinc-850"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 block">Detail your mental state (Optional)</label>
                <textarea
                  placeholder="What triggered you? What visual image, app, or feeling are you struggling with? Be completely honest..."
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  rows={3}
                  className="w-full text-xs text-zinc-100 bg-zinc-950 border border-zinc-850 rounded-xl p-3 outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Panic Button */}
            <div className="pt-2">
              <button
                onClick={handleEscapeAssault}
                className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-2xl text-sm shadow-[0_4px_15px_rgba(220,38,38,0.25)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.4)] transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                id="panic-trigger-btn"
              >
                <Flame className="w-5 h-5 animate-bounce" /> ACTIVATE AI ESCAPE PROTOCOL
              </button>
            </div>
          </motion.div>
        ) : loading ? (
          /* Loading Immersive State */
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-zinc-950 text-zinc-100 rounded-3xl p-12 text-center space-y-8 flex flex-col justify-center items-center min-h-[400px] border border-zinc-850"
          >
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-spin border-t-transparent" />
            </div>

            <div className="space-y-3 max-w-md">
              <h3 className="text-xl font-bold tracking-tight animate-pulse text-red-400">Intercepting Neural Trigger...</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Our server-side counselor is searching the scripture vault, preparing a custom prayer of deliverance, and establishing immediate physiological loop-breakers...
              </p>
            </div>
          </motion.div>
        ) : (
          /* Immersive Counsel Output */
          <motion.div
            key="counsel-output"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Warning / Fallback Notice Banner if API key missing */}
            {errorDetails && errorDetails.type === "API_KEY_MISSING" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs flex gap-3 items-start text-zinc-300 shadow-2xs">
                <Settings className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-spin-slow" />
                <div className="space-y-1">
                  <span className="font-bold block text-zinc-100">Note: Gemini Secret Key Offline</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    To enable dynamically generated counseling, configure your <strong>GEMINI_API_KEY</strong> under the <strong>Settings &gt; Secrets</strong> panel. In the meantime, enjoy this premium offline tactical defense kit.
                  </p>
                </div>
              </div>
            )}

            {/* Counselor Word */}
            <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-sm relative overflow-hidden space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs">
                <Heart className="w-4 h-4 fill-amber-500/20" /> WORD OF COURAGE
              </div>
              <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-medium">
                {counsel?.message}
              </p>
            </div>

            {/* Scripture Shield box */}
            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 rounded-3xl p-6 md:p-8 shadow-md space-y-4 relative overflow-hidden border border-zinc-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  YOUR RECITED SHIELD
                </span>
                
                <button
                  onClick={copyScripture}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  title="Copy Scripture"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <blockquote className="text-base md:text-lg font-black italic text-zinc-100 leading-relaxed pt-2">
                "{counsel?.scriptureText}"
              </blockquote>
              <cite className="block text-amber-400 font-bold text-xs not-italic">
                — {counsel?.scriptureReference}
              </cite>
            </div>

            {/* Sincere Prayer Card */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-3xl p-6 md:p-8 space-y-3">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                DELIVERANCE PRAYER (SAY ALOUD WITH CONVICTION)
              </span>
              <p className="text-zinc-100 font-extrabold text-sm leading-relaxed italic">
                "{counsel?.prayer}"
              </p>
            </div>

            {/* Practical Action Steps */}
            <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-sm space-y-4">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-wider block">
                3 IMMEDIATE PHYSICAL LOOP BREAKERS
              </span>

              <div className="space-y-3">
                {counsel?.practicalActions.map((act, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
                    <span className="w-6 h-6 bg-red-500/10 text-red-400 rounded-full font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-red-500/20">
                      {idx + 1}
                    </span>
                    <p className="text-zinc-300 text-xs font-bold leading-relaxed">{act}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Query Reset Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setCounsel(null)}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-full text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Reset Counselor Escape Room
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
