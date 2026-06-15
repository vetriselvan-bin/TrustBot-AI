export interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  // AI metadata
  intent?: string;
  confidence?: number;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  language?: 'English' | 'Tamil';
  escalated?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  status: 'active' | 'resolved' | 'escalated';
  userEmail: string;
}

export interface UserAccount {
  email: string;
  name: string;
  companyName?: string;
  role: 'admin' | 'customer';
  joinedAt: string;
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  language: 'en' | 'ta';
  views: number;
}

export interface FeedbackRecord {
  id: string;
  userEmail: string;
  rating: number;
  comments: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface SystemMetrics {
  trustScore: number;
  responseCount: number;
  avgDurationSec: number;
  escalationRate: number;
  avgSentimentScore: number; // 0 (negative) to 100 (positive)
  accuracyScore: number; // percentage
  intentDistribution: { [key: string]: number };
  dailyRequests: { day: string; count: number; resolved: number }[];
}

export interface PromptOptimizationResult {
  original: string;
  optimized: string;
  improvements: string[];
  tips: string;
}
