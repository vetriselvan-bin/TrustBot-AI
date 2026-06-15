import React from "react";
import { Bot, MessageSquare, ShieldCheck, Zap, Sparkles, AlertTriangle, ArrowRight, Activity, Database, HeartHandshake } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  isDark: boolean;
}

export default function HomeView({ onNavigate, isDark }: HomeViewProps) {
  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-16 border bg-radial from-violet-500/10 via-transparent to-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Version 3.2 Live - Powered by Gemini Flash</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Advanced Support AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
                You Can Absolute Trust
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              Resolve inquiries in milliseconds, categorize client intent, analyze sentiment, and verify trust parameters instantly with full transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate("chat")}
                id="hero-chat-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Launch Chat Support Client
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("prompt-studio")}
                id="hero-studio-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all font-mono text-sm"
              >
                Prompt Studio
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex justify-center">
            {/* Animated SVG Chatbot Illustration */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center bg-gradient-to-tr from-violet-500/20 to-indigo-500/30 p-1 border border-white/10 shadow-2xl"
            >
              <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 shadow-inner flex flex-col items-center justify-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 animate-pulse" />
                </div>
                
                <div className="text-center space-y-1">
                  <p className="font-bold text-lg">TrustBot Core V3</p>
                  <p className="text-xs text-gray-500 font-mono tracking-wider">STATUS: ONLINE</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-2 text-xs rounded-lg font-mono text-gray-600 dark:text-gray-400 border text-center">
                  Sentiment: Positive<br />
                  Accuracy Level: 97.2%
                </div>
              </div>
              
              {/* Outer floating widgets */}
              <div className="absolute top-4 -left-6 bg-white dark:bg-gray-800/90 border rounded-2xl p-3 shadow-md text-xs font-semibold flex items-center gap-2 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>94.8 Trust Score</span>
              </div>
              <div className="absolute bottom-10 -right-8 bg-white dark:bg-gray-800/90 border rounded-2xl p-3 shadow-md text-xs font-semibold flex items-center gap-2 backdrop-blur-md">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{"< 5ms Latency"}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Problem Statement & Solution Overview */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">The Bottleneck & The Remedy</h2>
          <p className="text-gray-500 dark:text-gray-400">Traditional conversational bots hallucinate and frustrate customers. TrustBot AI bridges accuracy with complete metadata transparency.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Block */}
          <div className="rounded-2xl p-6 md:p-8 bg-red-500/5 border border-red-500/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">The Problem</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 text-left list-disc list-inside">
              <li>Blackbox models: impossible to tell why standard assistance decisions were taken.</li>
              <li>Sunk cost and high churn rate via frustrated customers receiving off-topic advice.</li>
              <li>Inability to identify Tamil / mixed language intents, causing user alienation.</li>
              <li>No organic, zero-latency trigger for professional human live-agent escalation.</li>
            </ul>
          </div>
          
          {/* Solution Block */}
          <div className="rounded-2xl p-6 md:p-8 bg-emerald-500/5 border border-emerald-500/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">The TrustBot AI Solution</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 text-left list-disc list-inside">
              <li>Real-time intent and sentiment logging at every message checkpoint.</li>
              <li>Dynamic Trust Score tracking: guarantees quality responses & brand integrity.</li>
              <li>Seamless native dual-language communication in both English and Tamil.</li>
              <li>Instant context-transfer human escalation upon high-stress thresholds.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Deep Feature Walkthrough */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Engineered to Support Outstanding UX</h2>
          <p className="text-gray-500 dark:text-gray-400">Everything you need to customize, track, and secure customer communications.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/40 hover:shadow-lg transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Intent & Sentiment Dashboard</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Instantly review the underlying sentiment (Positive, Neutral, Negative) and the specific query intents of every customer interaction.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/40 hover:shadow-lg transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Prompt Engineering Studio</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter draft instructions and see Gemini refine them in real-time, detailing specific improvements and optimizations.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/40 hover:shadow-lg transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Native Tamil Support</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Built-in high-accuracy Tamil response framework that welcomes bilingual, mixed, and purely regional support intents with zero delay.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/40 hover:shadow-lg transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Smart Trust Scoring</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Evaluates dialogue coherence, sentiment consistency, and error rate, computing a running trust score metric for every conversation.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/40 hover:shadow-lg transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Frictionless Knowledge Base</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Searchable catalog packed with relevant technical and billing articles in both languages, keeping customer self-reliance high.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/40 hover:shadow-lg transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Human-in-the-Loop Hand-off</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Intelligent escalation algorithms detect client aggravation and hand off complete logs to human agents instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Quick Conversion Form / Call to action */}
      <section className="bg-slate-100 dark:bg-gray-900/60 rounded-3xl border p-8 text-center space-y-6 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold">Ready to Elevate Your Support Metric Benchmark?</h3>
        <p className="text-sm max-w-xl mx-auto text-gray-500 dark:text-gray-400">
          Join hundreds of companies utilizing our secure dialog intelligence systems. Launch a client simulation, or review security logs seamlessly in the administrator portal.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate("chat")}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Open Interactive App Client
          </button>
          <button
            onClick={() => onNavigate("login")}
            className="px-6 py-3 rounded-xl border font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Access My Developer Portal
          </button>
        </div>
      </section>
    </div>
  );
}
