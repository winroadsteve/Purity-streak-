import React, { useState } from "react";
import { CURATED_SCRIPTURES, ScriptureCategory } from "../data/scriptures";
import { Scripture } from "../types";
import { 
  BookOpen, 
  Search, 
  Compass, 
  Lightbulb, 
  Flame, 
  Layers, 
  CheckCircle2, 
  Heart,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORY_LABELS: Record<ScriptureCategory, { label: string; desc: string; bg: string; text: string }> = {
  fleeing_lust: { 
    label: "Fleeing Lust", 
    desc: "Radical amputation of triggers and instant evacuation.",
    bg: "bg-red-500/10 border-red-500/20", 
    text: "text-red-400" 
  },
  grace_and_mercy: { 
    label: "Grace & Mercy", 
    desc: "Forgiveness, restoring strength, and standing back up.",
    bg: "bg-amber-500/10 border-amber-500/20", 
    text: "text-amber-400" 
  },
  self_control: { 
    label: "Self-Control", 
    desc: "Saturating your mind to command your physical impulses.",
    bg: "bg-emerald-500/10 border-emerald-500/20", 
    text: "text-emerald-400" 
  },
  purity_of_mind: { 
    label: "Purity of Mind", 
    desc: "Guarding your focus and thinking on noble, true things.",
    bg: "bg-blue-500/10 border-blue-500/20", 
    text: "text-blue-400" 
  },
  spiritual_warfare: { 
    label: "Spiritual Warfare", 
    desc: "Drawing the Sword of the Word to command demonic triggers to depart.",
    bg: "bg-zinc-800 border-zinc-700", 
    text: "text-zinc-300" 
  },
};

const EMOTION_TEMPTATIONS = [
  { trigger: "Bored / Idle", cat: "purity_of_mind", advice: "The mind needs a sacred assignment. Read a scripture, then start a physical or intellectual project immediately." },
  { trigger: "Angry / Stressed", cat: "grace_and_mercy", advice: "Stress shrinks your resistance. Bring your frustration to Jesus in silence. Recalibrate under His mercy." },
  { trigger: "Lonely / Isolated", cat: "fleeing_lust", advice: "Isolation is the enemy's hunting ground. Flee your private room, go into public space or call an accountability brother." },
  { trigger: "Tired / Exhausted", cat: "self_control", advice: "Willpower is lowest when fatigued. Put your phone away entirely, close your eyes, and sleep in holiness." },
  { trigger: "Immediate Attack", cat: "spiritual_warfare", advice: "Do not debate. Speak the scripture aloud right now to break the psychic trigger loop. Splash cold water on your face." },
];

export default function BibleVault() {
  const [selectedCategory, setSelectedCategory] = useState<ScriptureCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "finder">("library");
  
  // Finder tab states
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);

  // Daily Scripture is the first scripture
  const dailyScripture = CURATED_SCRIPTURES[0];

  const filteredScriptures = CURATED_SCRIPTURES.filter((scripture) => {
    const matchesCategory = selectedCategory === "all" || scripture.category === selectedCategory;
    const matchesSearch = 
      scripture.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scripture.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scripture.insight.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 text-zinc-100 animate-fadeIn" id="bible-vault">
      {/* Vault Header Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-zinc-100 rounded-3xl p-8 shadow-md relative overflow-hidden border border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 tracking-wider uppercase border border-amber-500/20">
            <BookOpen className="w-3.5 h-3.5" /> The Sword of the Spirit
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Bible Scripture Vault</h1>
          <p className="text-zinc-300 text-sm leading-relaxed">
            "For the word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit." – Hebrews 4:12
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 pb-px gap-4">
        <button
          onClick={() => setActiveTab("library")}
          className={`pb-3 font-bold text-sm transition-all border-b-2 relative cursor-pointer ${
            activeTab === "library" ? "border-amber-500 text-amber-500" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Scripture Library
        </button>
        <button
          onClick={() => setActiveTab("finder")}
          className={`pb-3 font-bold text-sm transition-all border-b-2 relative flex items-center gap-1.5 cursor-pointer ${
            activeTab === "finder" ? "border-amber-500 text-amber-500" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Compass className="w-4 h-4" /> Trigger Scripture Finder
        </button>
      </div>

      {activeTab === "library" ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Daily Scripture Highlight */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32 text-amber-500" />
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" /> SCRIPTURE OF THE DAY FOR STRENGTH
            </div>
            <blockquote className="text-lg font-extrabold text-zinc-100 italic leading-relaxed">
              "{dailyScripture.text}"
            </blockquote>
            <cite className="block font-black text-zinc-400 text-sm mt-3 not-italic">
              — {dailyScripture.reference}
            </cite>
            <div className="mt-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-3xs">
              <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5" /> Purity Insight
              </span>
              <p className="text-zinc-300 text-xs leading-relaxed">{dailyScripture.insight}</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between" id="search-filter-row">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search scripture reference, keyword, or insight..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-zinc-100 outline-none placeholder-zinc-500 focus:ring-amber-500 focus:border-amber-500 shadow-3xs"
              />
            </div>

            {/* Category Select */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                  selectedCategory === "all" 
                    ? "bg-amber-500 border-amber-500 text-zinc-950 font-black" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850"
                }`}
              >
                All Categories
              </button>
              {(Object.keys(CATEGORY_LABELS) as ScriptureCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-amber-500 border-amber-500 text-zinc-950 font-black" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850"
                  }`}
                >
                  {CATEGORY_LABELS[cat].label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Scriptures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="scriptures-grid">
            {filteredScriptures.length > 0 ? (
              filteredScriptures.map((scripture) => {
                const catInfo = CATEGORY_LABELS[scripture.category];
                return (
                  <div 
                    key={scripture.id}
                    className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-3">
                      {/* Tag */}
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${catInfo.bg} ${catInfo.text}`}>
                        {catInfo.label}
                      </span>

                      <h3 className="font-extrabold text-zinc-100 text-base">
                        {scripture.reference}
                      </h3>

                      <p className="text-zinc-300 text-xs italic leading-relaxed">
                        "{scripture.text}"
                      </p>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Sentinel Insight
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {scripture.insight}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-500 space-y-2">
                <Search className="w-10 h-10 mx-auto text-zinc-600 animate-pulse" />
                <h4 className="font-bold text-zinc-300 text-sm">No Scriptures Found</h4>
                <p className="text-xs">Try adjusting your category filter or search terms.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Scripture Finder Trigger State Tab */
        <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-2 text-center">
            <Compass className="w-10 h-10 mx-auto text-amber-500 animate-spin-slow" />
            <h3 className="text-lg font-bold text-zinc-100">Settle Your Mind. Identify the Threat.</h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
              Select your current physiological or emotional vulnerability state. We will provide a direct strategic directive and the exact scripture to arrest the neural trigger.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {EMOTION_TEMPTATIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedEmotion(idx)}
                className={`p-4 rounded-2xl border text-center flex flex-col justify-center items-center transition-all cursor-pointer ${
                  selectedEmotion === idx 
                    ? "bg-amber-500 border-amber-500 text-zinc-950 font-black scale-102 shadow-lg" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                }`}
              >
                <Flame className="w-5 h-5 mb-2 text-orange-500 shrink-0" />
                <span className="text-xs font-extrabold">{item.trigger}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedEmotion !== null && (
              <motion.div
                key={selectedEmotion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6"
              >
                <div className="border-b border-zinc-800 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                    TACTICAL ESCAPE DIRECTIVE
                  </span>
                  <h4 className="text-xl font-bold text-zinc-100 mt-1">
                    How to defeat {EMOTION_TEMPTATIONS[selectedEmotion].trigger} trigger
                  </h4>
                  <p className="text-zinc-300 text-xs mt-2 bg-zinc-950 p-4 rounded-xl border border-zinc-850 leading-relaxed font-medium">
                    {EMOTION_TEMPTATIONS[selectedEmotion].advice}
                  </p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">
                    RECITED WEAPON (MEDITATE & QUOTE ALOUD)
                  </span>

                  {CURATED_SCRIPTURES
                    .filter((sc) => sc.category === EMOTION_TEMPTATIONS[selectedEmotion].cat)
                    .slice(0, 1)
                    .map((sc) => (
                      <div key={sc.id} className="space-y-3">
                        <blockquote className="text-base font-extrabold italic text-zinc-100 leading-relaxed bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                          "{sc.text}"
                        </blockquote>
                        <cite className="block font-black text-zinc-400 text-xs not-italic">
                          — {sc.reference}
                        </cite>
                        <div className="text-zinc-400 text-xs leading-relaxed pt-2">
                          <strong>Why this works right now:</strong> {sc.insight}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
