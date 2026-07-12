import React, { useState } from "react";
import { CURATED_READINGS, ReadingCategory } from "../data/readings";
import { RecommendedRead } from "../types";
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowLeft, 
  CheckCircle, 
  Check, 
  ChevronRight, 
  Brain, 
  Bookmark,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReadingsLibraryProps {
  onMarkReadingCompleted: () => void;
}

const CATEGORY_TAGS: Record<ReadingCategory, { label: string; bg: string }> = {
  science: { label: "Science & Dopamine", bg: "bg-amber-500/10 text-amber-500 border border-amber-500/20", },
  theology: { label: "Sacred Sexuality", bg: "bg-amber-500/10 text-amber-500 border border-amber-500/20", },
  tactics: { label: "Tactical Defense", bg: "bg-amber-500/10 text-amber-500 border border-amber-500/20", },
  testimony: { label: "Historic Testimony", bg: "bg-amber-500/10 text-amber-500 border border-amber-500/20", },
  daily_discipline: { label: "Spiritual Disciplines", bg: "bg-amber-500/10 text-amber-500 border border-amber-500/20", },
};

export default function ReadingsLibrary({ onMarkReadingCompleted }: ReadingsLibraryProps) {
  const [selectedRead, setSelectedRead] = useState<RecommendedRead | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<string | null>(null);
  const [completedReads, setCompletedReads] = useState<string[]>([]);

  const handleAnswerSubmit = (qIdx: number) => {
    const qKey = `${selectedRead?.id}-q-${qIdx}`;
    if (!answers[qKey]?.trim()) return;

    setShowAnswerFeedback(qKey);
    setTimeout(() => {
      setShowAnswerFeedback(null);
    }, 2000);
  };

  const handleCompleteArticle = () => {
    if (!selectedRead) return;
    
    if (!completedReads.includes(selectedRead.id)) {
      setCompletedReads([...completedReads, selectedRead.id]);
    }
    
    onMarkReadingCompleted();
    setSelectedRead(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 text-zinc-100" id="readings-library">
      <AnimatePresence mode="wait">
        {!selectedRead ? (
          /* List View */
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-zinc-850 text-amber-500 border border-zinc-800 rounded-2xl">
                <BookOpen className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-zinc-100">Intellectual & Spiritual Armoury</h2>
                <p className="text-zinc-400 text-sm max-w-xl">
                  Deep readings, research, and biographies to equip your mind. Understanding the mechanics of desire is your greatest defense.
                </p>
              </div>
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="readings-grid">
              {CURATED_READINGS.map((read) => {
                const tag = CATEGORY_TAGS[read.category];
                const isCompleted = completedReads.includes(read.id);
                return (
                  <div 
                    key={read.id}
                    className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tag.bg}`}>
                          {tag.label}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                          <Clock className="w-3.5 h-3.5" /> {read.readTimeMinutes} Min Read
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-zinc-100 tracking-tight leading-snug">
                        {read.title}
                      </h3>
                      
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {read.summary}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 pt-1">
                        <User className="w-3.5 h-3.5" /> {read.author}
                      </div>
                    </div>

                    <div className="pt-3 flex justify-between items-center border-t border-zinc-850">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5" /> READ COMPLETED
                        </span>
                      ) : (
                        <div />
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedRead(read);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-full text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
                      >
                        Open Guide <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Immersive Reading View */
          <motion.div 
            key="reader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-8 pb-12"
          >
            {/* Navigation back */}
            <button
              onClick={() => setSelectedRead(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-4 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Library
            </button>

            {/* Premium Reading Sheet */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-sm overflow-hidden" id="reading-pane">
              <div className="bg-zinc-950/40 p-8 border-b border-zinc-800 space-y-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${CATEGORY_TAGS[selectedRead.category].bg}`}>
                  {CATEGORY_TAGS[selectedRead.category].label}
                </span>

                <h1 className="text-2xl md:text-3xl font-black text-zinc-100 tracking-tight leading-tight">
                  {selectedRead.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-zinc-500">
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedRead.author}</span>
                  <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedRead.readTimeMinutes} Min Read</span>
                </div>
              </div>

              {/* Editorial Reading Content */}
              <div className="p-8 md:p-10 space-y-6 text-zinc-300 text-sm leading-relaxed font-serif max-w-none">
                {selectedRead.content.map((para, idx) => (
                  <p key={idx} className="indent-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Interactive Reflection Questions Sheet */}
            <div className="bg-zinc-950/40 rounded-3xl border border-zinc-800 p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-zinc-100 text-base flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-500" /> Mental Sieve: Reflection Questions
                </h3>
                <p className="text-zinc-400 text-xs">
                  Active learning rewrites neural connections. Type your honest reflections to secure this knowledge in your prefrontal cortex.
                </p>
              </div>

              <div className="space-y-6">
                {selectedRead.reflectionQuestions.map((qText, qIdx) => {
                  const qKey = `${selectedRead.id}-q-${qIdx}`;
                  const isSubmitted = showAnswerFeedback === qKey;
                  return (
                    <div key={qIdx} className="space-y-2.5 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                      <h4 className="font-bold text-zinc-200 text-xs leading-relaxed">
                        Question {qIdx + 1}: {qText}
                      </h4>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your honest response here..."
                          value={answers[qKey] || ""}
                          onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                          className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                        <button
                          onClick={() => handleAnswerSubmit(qIdx)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs transition-all flex items-center gap-1 active:scale-95"
                        >
                          {isSubmitted ? "Saved" : "Save"}
                        </button>
                      </div>

                      {isSubmitted && (
                        <span className="text-[10px] font-bold text-emerald-400 block animate-fadeIn">
                          ✓ Response written in active memory. Well done.
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mark Done Checkbox */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left space-y-0.5">
                <h4 className="font-bold text-zinc-100 text-sm">Completed reading this guide?</h4>
                <p className="text-zinc-400 text-xs">Marking this article completed logs a clean progress reading check.</p>
              </div>
              <button
                onClick={handleCompleteArticle}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-full text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <CheckCircle className="w-4 h-4" /> Yes, Mark Guide Completed
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
