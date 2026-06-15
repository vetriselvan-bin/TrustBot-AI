import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import LoginSignupView from "./components/LoginSignupView";
import ChatView from "./components/ChatView";
import IntentDashboard from "./components/IntentDashboard";
import KnowledgeBaseView from "./components/KnowledgeBaseView";
import PromptStudioView from "./components/PromptStudioView";
import AnalyticsView from "./components/AnalyticsView";
import FeedbackView from "./components/FeedbackView";
import AdminDashboardView from "./components/AdminDashboardView";
import ContactView from "./components/ContactView";

import { 
  INITIAL_ARTICLES, 
  INITIAL_MOCK_CHATS, 
  INITIAL_METRICS, 
  MOCK_USERS, 
  INITIAL_FEEDBACK 
} from "./data";
import { Message, ChatSession, UserAccount, FeedbackRecord, SystemMetrics } from "./types";
import { Bot, Sun, Moon, ShieldCheck, UserCheck, Menu, X, LogOut, HelpCircle, Terminal } from "lucide-react";

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Theme Toggle: defaults to Light for accessibility, supports fluid transitions
  const [isDark, setIsDark] = useState<boolean>(true);

  // Core App states
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    // Initial logged in user for comfortable experience
    return MOCK_USERS[0]; // Vetri Selvan (Admin)
  });
  
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_MOCK_CHATS);
  const [activeSessionId, setActiveSessionId] = useState<string>("s-101");
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(INITIAL_FEEDBACK);
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [isSending, setIsSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Auth successful trigger
  const handleAuthSuccess = (email: string, name: string, role: 'admin' | 'customer') => {
    const matched = users.find(u => u.email === email);
    if (matched) {
      setCurrentUser(matched);
    } else {
      const newUser: UserAccount = {
        email,
        name,
        role,
        joinedAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
    setActiveTab("chat");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("home");
  };

  // Add user manually via Admin panel
  const handleAddUser = (email: string, name: string, company: string, role: 'admin' | 'customer') => {
    const newUser: UserAccount = {
      email,
      name,
      companyName: company || undefined,
      role,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (email: string) => {
    setUsers(prev => prev.filter(u => u.email !== email));
  };

  // Chat message sending pipeline with Real-time AI processing
  const handleSendMessage = async (text: string) => {
    const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];
    if (!activeSession) return;

    // 1. Pack user message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: "msg-user-" + Date.now(),
      sender: "user",
      text,
      timestamp
    };

    const updatedSessionMessages = [...activeSession.messages, userMsg];
    
    // Optimistic local state update
    setChatSessions(prev => prev.map(session => {
      if (session.id === activeSession.id) {
        return {
          ...session,
          messages: updatedSessionMessages
        };
      }
      return session;
    }));

    setIsSending(true);

    try {
      // 2. Dispatch to full-stack Express API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedSessionMessages.map(m => ({ sender: m.sender, text: m.text })),
          language: text.toLowerCase().includes("tamil") ? "Tamil" : "English"
        })
      });

      const data = await response.json();

      // 3. Pack AI answer with extracted metadata
      const botMsg: Message = {
        id: "msg-bot-" + Date.now(),
        sender: "bot",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: data.intent,
        confidence: data.confidence,
        sentiment: data.sentiment,
        language: data.language,
        escalated: data.escalated
      };

      // 4. Update the active session and escalate if flag is set
      setChatSessions(prev => prev.map(session => {
        if (session.id === activeSession.id) {
          const finalMessages = [...updatedSessionMessages, botMsg];
          if (data.escalated) {
            const systemEscalationMsg: Message = {
              id: "msg-sys-" + Date.now(),
              sender: "system",
              text: "ALERT: Live chat operations suspended. Session transferred to primary customer supervisor Liam O'Connor.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            return {
              ...session,
              messages: [...finalMessages, systemEscalationMsg],
              status: "escalated"
            };
          }
          return {
            ...session,
            messages: finalMessages,
            status: "active"
          };
        }
        return session;
      }));

      // 5. Update global diagnostics histogram
      setMetrics(prev => {
        // Map intent to actual human readable form
        const intentKeyMap: { [key: string]: string } = {
          billing: "Billing & Price",
          account_access: "Account Access",
          technical_troubleshooting: "Technical Bugs",
          escalation_request: "Human Escalation",
          general_greeting: "General Greeting",
          product_inquiry: "Product Inquiry"
        };
        const updatedLabel = intentKeyMap[data.intent] || "General Greeting";
        
        const newDist = { ...prev.intentDistribution };
        newDist[updatedLabel] = (newDist[updatedLabel] || 0) + 1;

        // Tweak sentiment metrics
        let sentimentAdjustment = 0;
        if (data.sentiment === "Positive") sentimentAdjustment = 2;
        if (data.sentiment === "Negative") sentimentAdjustment = -4;

        return {
          ...prev,
          responseCount: prev.responseCount + 1,
          avgSentimentScore: Math.min(Math.max(prev.avgSentimentScore + sentimentAdjustment, 10), 100),
          intentDistribution: newDist,
          trustScore: parseFloat((Math.min(Math.max(prev.trustScore + (data.sentiment === "Positive" ? 0.2 : -0.5), 50), 100)).toFixed(1))
        };
      });

    } catch (err) {
      console.error("Failed to query Express API, applying local robust handler:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateSession = () => {
    const newId = "s-" + (Date.now() % 10000);
    const newSession: ChatSession = {
      id: newId,
      title: "Chat Session #" + (chatSessions.length + 1),
      status: "active",
      userEmail: currentUser?.email || "anonymous.developer@gmail.com",
      messages: []
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  // Accumulate feedbacks reactive
  const handleAddFeedback = (rating: number, comment: string) => {
    const newFeed: FeedbackRecord = {
      id: "f-" + Date.now(),
      userEmail: currentUser?.email || "anonymous.developer@gmail.com",
      rating,
      comments: comment,
      timestamp: "Just now",
      sentiment: rating >= 4 ? "Positive" : "Negative"
    };
    setFeedbacks(prev => [...prev, newFeed]);

    // Update global metrics trust index upon submission
    setMetrics(prev => ({
      ...prev,
      trustScore: parseFloat((Math.min(prev.trustScore + (rating >= 4 ? 0.3 : -1.2), 100)).toFixed(1))
    }));
  };

  // Nav categories definition
  const navigationItems = [
    { id: "home", label: "Overview", roleFlag: "all" },
    { id: "chat", label: "AI Support Chat", roleFlag: "all" },
    { id: "diagnostics", label: "Intent Classifier", roleFlag: "all" },
    { id: "kb", label: "Knowledge Base", roleFlag: "all" },
    { id: "prompt-studio", label: "Prompt Studio", roleFlag: "all" },
    { id: "analytics", label: "Leader Dashboards", roleFlag: "all" },
    { id: "feedback", label: "Customer Reviews", roleFlag: "all" },
    { id: "admin", label: "Admin Space", roleFlag: "admin" },
    { id: "contact", label: "Engineering Line", roleFlag: "all" }
  ];

  return (
    <div className={`min-h-screen text-gray-800 dark:text-gray-100 bg-slate-50 dark:bg-gray-950 font-sans transition-colors duration-200 selection:bg-violet-500/20`}>
      
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md glass border-gray-100 dark:border-gray-900/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/10">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="font-display font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
                TrustBot AI
              </span>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider -mt-0.5">CUSTOMER RESOLUT ENGINE</p>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navigationItems.map((item) => {
              if (item.roleFlag === 'admin' && (!currentUser || currentUser.role !== 'admin')) return null;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${isSelected ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* TOP RIGHT TOOLBAR */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
              title="Toggle Light / Dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Auth Session / Profile trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold font-display">{currentUser.name}</p>
                  <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/10">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 transition"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("login")}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition shadow"
              >
                Authenticate Portal
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAV PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-white dark:bg-gray-905 bg-gray-900 border-b border-gray-800 space-y-1 text-left animate-in fade-in duration-200">
          {navigationItems.map((item) => {
            if (item.roleFlag === 'admin' && (!currentUser || currentUser.role !== 'admin')) return null;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${isSelected ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* APP CONTAINER VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        
        {/* Dynamic component routing based on selected tab state */}
        <div className="transition-all duration-300 transform">
          {activeTab === "home" && (
            <HomeView onNavigate={(tab) => setActiveTab(tab)} isDark={isDark} />
          )}
          
          {activeTab === "login" && (
            <LoginSignupView onAuthSuccess={handleAuthSuccess} isDark={isDark} />
          )}
          
          {activeTab === "chat" && (
            <ChatView
              chatSessions={chatSessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onCreateSession={handleCreateSession}
              onSendMessage={handleSendMessage}
              isSending={isSending}
              isDark={isDark}
              currentUser={currentUser}
            />
          )}

          {activeTab === "diagnostics" && (
            <IntentDashboard messages={chatSessions.flatMap(s => s.messages)} isDark={isDark} />
          )}

          {activeTab === "kb" && (
            <KnowledgeBaseView articles={INITIAL_ARTICLES} isDark={isDark} />
          )}

          {activeTab === "prompt-studio" && (
            <PromptStudioView isDark={isDark} />
          )}

          {activeTab === "analytics" && (
            <AnalyticsView metrics={metrics} isDark={isDark} />
          )}

          {activeTab === "feedback" && (
            <FeedbackView 
              feedbacks={feedbacks} 
              onAddFeedback={handleAddFeedback} 
              isDark={isDark} 
              currentUser={currentUser} 
            />
          )}

          {activeTab === "admin" && (
            <AdminDashboardView
              users={users}
              chatSessions={chatSessions}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              isDark={isDark}
            />
          )}

          {activeTab === "contact" && (
            <ContactView isDark={isDark} currentUser={currentUser} />
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t py-8 text-center text-xs text-gray-400 dark:border-gray-900 bg-white dark:bg-gray-950/60 leading-relaxed max-w-7xl mx-auto rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono">© 2026 TrustBot AI. Built exclusively for Vetri Selvan. All logs are encrypted in transport.</p>
          <div className="flex gap-4 font-semibold text-gray-500">
            <button onClick={() => setActiveTab("kb")} className="hover:underline">Resolution manuals</button>
            <span>•</span>
            <button onClick={() => setActiveTab("contact")} className="hover:underline">Help desk ticket desk</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
