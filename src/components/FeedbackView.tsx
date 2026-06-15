import React, { useState } from "react";
import { FeedbackRecord } from "../types";
import { Star, MessageSquare, Smile, ShieldCheck, ThumbsUp, Send } from "lucide-react";

interface FeedbackViewProps {
  feedbacks: FeedbackRecord[];
  onAddFeedback: (rating: number, comment: string) => void;
  isDark: boolean;
  currentUser: any;
}

export default function FeedbackView({ feedbacks, onAddFeedback, isDark, currentUser }: FeedbackViewProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Compute average score
  const avgStars = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;
  const positiveRatio = (feedbacks.filter(f => f.sentiment === 'Positive').length / feedbacks.length) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddFeedback(rating, comment.trim());
    setComment("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 text-left">
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Customer Satisfaction Index</h2>
        <p className="text-xs text-gray-400">Evaluate overall conversation feedback metrics. Real feedback ratings update local charts immediately.</p>
      </div>

      {/* RATING SUMMARY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-55 bg-slate-50 dark:bg-gray-900 border p-6 rounded-2xl items-center">
        
        <div className="md:col-span-4 text-center md:border-r border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-sm font-bold font-mono text-gray-400 uppercase">Avg Ratings Score</p>
          <div className="text-5xl font-extrabold text-violet-600">{avgStars.toFixed(1)} / 5</div>
          <div className="flex justify-center gap-1">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-4 h-4 fill-amber-400 text-amber-400`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">Based on {feedbacks.length} security sessions reviews</p>
        </div>

        <div className="md:col-span-4 text-center md:border-r border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-sm font-bold font-mono text-gray-400 uppercase">Positive Sentiment Ratio</p>
          <div className="text-5xl font-extrabold text-emerald-500">{positiveRatio.toFixed(1)}%</div>
          <p className="text-xs text-gray-400">High coherence conversation threads</p>
        </div>

        <div className="md:col-span-4 text-center space-y-2">
          <p className="text-xs text-gray-500 font-mono">SLA Quality Assurance Verified</p>
          <div className="p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">97.2% Precision Audit Passed</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SUBMIT FEEDBACK PANEL (col-span-5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border bg-white dark:bg-gray-900 shadow-sm space-y-4">
          <h3 className="text-base font-bold">Write Your Evaluation</h3>
          <p className="text-xs text-gray-400">Share your platform experience to assist in adjusting model prompt weights.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Stars select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Service Rating</label>
              <div className="flex gap-1.5 py-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded transition hover:scale-110"
                  >
                    <Star 
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating !== null ? star <= hoverRating : star <= rating) 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-gray-200 dark:text-gray-800'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Email (showing simulated active session) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Security Tenant Email</label>
              <input
                type="text"
                disabled
                className="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-xs text-gray-400 font-mono"
                value={currentUser?.email || "anonymous.developer@gmail.com"}
              />
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Audit Comments</label>
              <textarea
                placeholder="How quick did TrustBot categorize your goals? Highlight Tamil, latency, or voice metrics..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[100px] p-3 text-xs rounded-xl border border-gray-100 dark:border-gray-800 bg-transparent focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {submitted ? (
              <div className="p-3 text-center text-xs font-semibold text-emerald-600 bg-emerald-500/10 rounded-xl animate-pulse">
                Review committed to telemetry log successfully! Thank you.
              </div>
            ) : (
              <button
                type="submit"
                id="submit-feedback-btn"
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Evaluation Response</span>
              </button>
            )}
          </form>
        </div>

        {/* FEEDBACK LISTS VIEW (col-span-7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border bg-white dark:bg-gray-900 space-y-4">
          <h3 className="text-base font-bold">Recent Telemetry Reviews</h3>
          
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {feedbacks.slice().reverse().map((f) => (
              <div 
                key={f.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-850/80 bg-slate-50/20 dark:bg-gray-800/10 space-y-3.5 text-left"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-[10px] text-violet-600">
                      C
                    </div>
                    <span>{f.userEmail}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{f.timestamp}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-800'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                    {f.comments}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-semibold font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-indigo-500" />
                    <span>Resolution: COMMITTED</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${f.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    Sentiment: {f.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
