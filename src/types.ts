export interface RelapseRecord {
  id: string;
  timestamp: number; // ms since epoch
  trigger: string; // e.g., "Boredom", "Stress", "Social Media", "Late Night", "Loneliness"
  note: string;
}

export interface DailyProgressLog {
  dateString: string; // YYYY-MM-DD
  status: "clean" | "relapsed";
  urgesIntensity: number; // 0 to 10
  mood: number; // 1 to 5
  prayed: boolean;
  readingDone: boolean;
  notes: string;
}

export interface Streak {
  id: string;
  startDate: number; // timestamp when streak started
  lastRelapseDate: number | null; // timestamp of last relapse, or null if never relapsed
  currentDays: number;
  longestDays: number;
  relapseHistory: RelapseRecord[];
}

export interface Scripture {
  id: string;
  reference: string; // e.g., "1 Corinthians 6:18-20"
  text: string;
  category: "fleeing_lust" | "grace_and_mercy" | "self_control" | "purity_of_mind" | "spiritual_warfare";
  insight: string; // deep practical lesson on how this helps avoid lust
}

export interface RecommendedRead {
  id: string;
  title: string;
  author: string;
  category: "science" | "theology" | "tactics" | "testimony" | "daily_discipline";
  summary: string;
  readTimeMinutes: number;
  content: string[]; // split into paragraphs
  reflectionQuestions: string[];
}

export interface CounselorResponse {
  message: string;
  scriptureReference: string;
  scriptureText: string;
  prayer: string;
  practicalActions: string[];
}
