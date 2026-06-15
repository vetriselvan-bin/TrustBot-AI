import React from "react";
import { SystemMetrics } from "../types";
import { Shield, Sparkles, TrendingUp, Clock, UserCheck, CheckSquare, BarChart, ChevronRight } from "lucide-react";

interface AnalyticsViewProps {
  metrics: SystemMetrics;
  isDark: boolean;
}

export default function AnalyticsView({ metrics, isDark }: AnalyticsViewProps) {
  // Pure responsive SVG line/area charts representing Daily Inquiries and Resolutions
  const dailyData = metrics.dailyRequests;
  const maxVal = Math.max(...dailyData.map(d => d.count), 160);

  // SLA Stats calculation
  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Oversight Portal</h2>
          <p className="text-xs text-gray-400">Cumulative performance SLA parameters representing conversational accuracy and secure system health logs.</p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-600 text-white text-xs font-mono font-bold shadow-md">
          <Shield className="w-4 h-4" />
          <span>General Trust Level: {metrics.trustScore}%</span>
        </div>
      </div>

      {/* CORE COUNTER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Queries */}
        <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">Total Handled Logs</span>
            <p className="text-2xl font-extrabold tracking-tight">{metrics.responseCount} calls</p>
            <p className="text-[10px] text-emerald-500 font-bold">+18.2% this session</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Average response latency */}
        <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">SLA Avg Speed</span>
            <p className="text-2xl font-extrabold tracking-tight">{metrics.avgDurationSec}s</p>
            <p className="text-[10px] text-emerald-500 font-bold">100% compliance</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Accuracy Score */}
        <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">Classification Accuracy</span>
            <p className="text-2xl font-extrabold tracking-tight">{metrics.accuracyScore}%</p>
            <p className="text-[10px] text-emerald-500 font-bold">Verified by audits</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Human escalation */}
        <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">Escalation rate</span>
            <p className="text-2xl font-extrabold tracking-tight">{metrics.escalationRate}%</p>
            <p className="text-[10px] text-gray-400 font-mono">Standard deviation optimal</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* DETAILED GRAPHS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* GRAPH 1: SVG Column Chart for Volume Analysis (col-span-8) */}
        <div className="lg:col-span-8 p-6 rounded-2xl border bg-white dark:bg-gray-900 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest">Incoming Volume vs Resolved</h3>
              <p className="text-xs text-gray-400">Weekly ticket logs metrics tracking</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-violet-500 inline-block" /> Total Cases</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Resolved Cases</span>
            </div>
          </div>

          {/* SVG Column Chart */}
          <div className="relative h-64 w-full pt-4">
            <svg viewBox="0 0 600 220" className="w-full h-full">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="580" y2="20" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" strokeDasharray="4" />
              <line x1="40" y1="80" x2="580" y2="80" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" strokeDasharray="4" />
              <line x1="40" y1="140" x2="580" y2="140" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" strokeDasharray="4" />
              <line x1="40" y1="180" x2="580" y2="180" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />

              {/* Bar loop */}
              {dailyData.map((item, idx) => {
                const stepX = 50 + idx * 75;
                const barWidth = 14;
                const heightCount = (item.count / maxVal) * 150;
                const heightResolved = (item.resolved / maxVal) * 150;
                
                return (
                  <g key={idx}>
                    {/* Background hover bar */}
                    <rect x={stepX - 15} y="10" width="55" height="175" fill="transparent" className="hover:fill-gray-100/30 dark:hover:fill-gray-800/10 cursor-pointer transition" />
                    
                    {/* Count Column (Violet) */}
                    <rect 
                      x={stepX - 8} 
                      y={180 - heightCount} 
                      width={barWidth} 
                      height={heightCount} 
                      className="fill-violet-500 dark:fill-violet-600 rounded-sm" 
                    />
                    
                    {/* Resolved Column (Emerald) */}
                    <rect 
                      x={stepX + 8} 
                      y={180 - heightResolved} 
                      width={barWidth} 
                      height={heightResolved} 
                      className="fill-emerald-500 rounded-sm" 
                    />

                    {/* Day text */}
                    <text x={stepX + 5} y="200" textAnchor="middle" className="fill-gray-500 font-mono text-[10px] font-semibold">{item.day}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <p className="text-[11px] text-gray-400 italic">
            *Resolutes match incoming prompts with an average delta of ~4% within our target customer feedback bounds.
          </p>
        </div>

        {/* GRAPH 2: Segment trust visualization (col-span-4) */}
        <div className="lg:col-span-4 p-6 rounded-2xl border bg-white dark:bg-gray-900 flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest">Trust Integrity Index</h3>
            <p className="text-xs text-gray-400">Security & Sentiment combined index</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/30 border space-y-4 text-center">
            <div className="text-4xl font-extrabold text-violet-600">{metrics.trustScore}%</div>
            
            <div className="space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span>Model Accuracy</span>
                <span className="font-mono font-bold text-gray-700 dark:text-gray-300">97.2%</span>
              </div>
              <div className="h-1.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: "97.2%" }} />
              </div>

              <div className="flex items-center justify-between">
                <span>Sentiment Quotient</span>
                <span className="font-mono font-bold text-gray-700 dark:text-gray-300">82.5%</span>
              </div>
              <div className="h-1.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: "82.5%" }} />
              </div>

              <div className="flex items-center justify-between">
                <span>Escalation Avoidance</span>
                <span className="font-mono font-bold text-gray-700 dark:text-gray-300">96.5%</span>
              </div>
              <div className="h-1.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "96.5%" }} />
              </div>
            </div>
          </div>
          
          <div className="text-[11px] text-gray-400 leading-normal text-center">
            Calculated out of {metrics.responseCount} active dialog streams. Last calibrated 2026-06-15.
          </div>
        </div>

      </div>
    </div>
  );
}
