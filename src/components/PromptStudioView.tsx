import React, { useState } from "react";
import { Sparkles, Terminal, ArrowRight, CheckCircle, Share2, Clipboard, Zap, Lightbulb } from "lucide-react";

interface PromptStudioViewProps {
  isDark: boolean;
}

export default function PromptStudioView({ isDark }: PromptStudioViewProps) {
  const [draftPrompt, setDraftPrompt] = useState(
    "You are a friendly agent helping users who have card issues and billing problems. Answer nicely."
  );
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [tips, setTips] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copySuccessMsg, setCopySuccessMsg] = useState("");

  const handleOptimize = async () => {
    if (!draftPrompt.trim()) return;
    setIsOptimizing(true);
    setCopySuccessMsg("");

    try {
      const response = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: draftPrompt.trim() }),
      });
      const data = await response.json();
      if (data.optimized) {
        setOptimizedPrompt(data.optimized);
        setImprovements(data.improvements || []);
        setTips(data.tips || "");
      }
    } catch (err) {
      console.error("Optimization failed:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccessMsg("Copied securely to clipboard!");
    setTimeout(() => setCopySuccessMsg(""), 3000);
  };

  const loadPreset = (presetText: string) => {
    setDraftPrompt(presetText);
    setOptimizedPrompt("");
    setImprovements([]);
    setTips("");
  };

  return (
    <div className="space-y-8 text-left">
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-violet-500/10 text-violet-500 border border-violet-500/10 font-mono text-left">
          <span>COGNITIVE PLAYGROUND</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Prompt Engineering Studio</h2>
        <p className="text-xs text-gray-400">Optimize raw natural language instructions into high-trust system prompts using Gemini's semantic engineering model.</p>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono text-gray-400">PRESET STARTERS:</span>
        <button
          onClick={() => loadPreset("You are a billing bot. Help customers with card upgrades or refund statuses. Direct them if angry.")}
          className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-violet-500 transition"
        >
          💳 Core Billing Bot
        </button>
        <button
          onClick={() => loadPreset("Diagnose system issues. Tell them to clear cache and restart. Answer in tech style.")}
          className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-violet-500 transition"
        >
          ⚙️ Engineering Diagnostic
        </button>
        <button
          onClick={() => loadPreset("Tamil customer support. Speak purely in Tamil, guide password changes and login troubles.")}
          className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-violet-500 transition"
        >
          🌐 mixed-language localized
        </button>
      </div>

      {/* COMPARISON SLATE PANE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT WINDOW: Raw draft */}
        <div className="flex flex-col rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase">Input Draft Instructions</span>
            <Terminal className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-5 flex-1 flex flex-col space-y-4">
            <textarea
              className="w-full flex-1 min-h-[220px] p-4 text-xs font-mono rounded-xl border border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-900/10 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-300"
              placeholder="Enter your system guidelines here..."
              value={draftPrompt}
              onChange={(e) => setDraftPrompt(e.target.value)}
            />
            {isOptimizing ? (
              <div className="p-3 text-center text-xs font-semibold bg-violet-600/10 text-violet-500 rounded-xl animate-pulse">
                Refining instruction vectors with Gemini...
              </div>
            ) : (
              <button
                onClick={handleOptimize}
                id="optimize-prompt-btn"
                className="py-3 px-6 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-md flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Optimize with Gemini AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT WINDOW: Engine results */}
        <div className="flex flex-col rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase">Engineered Prompt System output</span>
            {optimizedPrompt && (
              <button
                onClick={() => handleCopyToClipboard(optimizedPrompt)}
                className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Copy Instructions</span>
              </button>
            )}
          </div>
          <div className="p-5 flex-1 min-h-[260px] flex flex-col justify-between">
            {optimizedPrompt ? (
              <div className="space-y-4">
                <pre className="p-4 rounded-xl text-xs font-mono bg-slate-50 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 text-left overflow-y-auto max-h-[250px] border border-dashed leading-relaxed whitespace-pre-wrap">
                  {optimizedPrompt}
                </pre>
                
                {copySuccessMsg && (
                  <p className="text-xs text-center font-semibold text-emerald-500 animate-bounce">{copySuccessMsg}</p>
                )}
              </div>
            ) : (
              <div className="my-auto text-center p-8 text-gray-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-gray-300 animate-spin [animation-duration:12s]" />
                <p className="font-semibold text-xs">Awaiting Refinements</p>
                <p className="text-[11px]">Click 'Optimize with Gemini AI' to generate enterprise system instructions.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* IMPROVEMENTS CHECKLIST & TIPS (Show only when populated) */}
      {optimizedPrompt && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {/* Checklist of changes */}
          <div className="p-6 rounded-2xl border bg-gradient-to-br from-indigo-500/5 to-transparent space-y-4">
            <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Safety & Structure Changes</span>
            </h4>
            <ul className="space-y-3.5">
              {improvements.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="w-4.5 h-4.5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">✓</span>
                  <span className="text-gray-600 dark:text-gray-300 leading-normal">{change}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prompt engineering tips */}
          <div className="p-6 rounded-2xl border bg-gradient-to-br from-violet-500/5 to-transparent space-y-4">
            <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-violet-500 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>Prompt Tuning Tips</span>
            </h4>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 text-xs leading-relaxed text-gray-600 dark:text-gray-300 border">
              {tips}
            </div>
            <div className="text-[11px] text-gray-400 italic">
              *Tuned instructions can be copy-pasted directly into real server configs for optimal Gemini orchestration.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
