import React, { useState, useEffect, useRef } from "react";
import { Message, ChatSession } from "../types";
import { Send, Mic, Volume2, Globe, Sparkles, User, Bot, AlertCircle, Plus, ChevronRight, UserCheck, ShieldAlert, Languages } from "lucide-react";

interface ChatViewProps {
  chatSessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onSendMessage: (text: string) => void;
  isSending: boolean;
  isDark: boolean;
  currentUser: { email: string; name: string; role: 'admin' | 'customer' } | null;
}

export default function ChatView({
  chatSessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onSendMessage,
  isSending,
  isDark,
  currentUser
}: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isSending]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Web Speech API Integration
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition not supported in this iframe context, simulating standard voice token.");
      setTimeout(() => setSpeechError(""), 3500);
      setInputText("Querying Trustbot AI and billing status securely...");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'English' ? 'en-US' : 'ta-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError("");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setSpeechError(`Voice capture status: ${event.error}. Applying speech fallback.`);
        setIsRecording(false);
        setInputText(language === 'English' ? "How do I upgrade payment features?" : "பில்லிங் மற்றும் கார்டு தகவலை மாற்றுவது எப்படி?");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setSpeechError("Failed to trigger microphone input.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[76vh]">
      
      {/* SIDEBAR: Conversation Log History (col-span-3) */}
      <div className="hidden lg:flex lg:col-span-3 flex-col h-full rounded-2xl border bg-gray-50/50 dark:bg-gray-900/30 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900/40">
          <span className="text-xs font-bold font-mono tracking-wider text-gray-500 uppercase">Dialogue Logs</span>
          <button
            onClick={onCreateSession}
            id="new-chat-btn"
            className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition flex items-center justify-center gap-1 text-[11px] font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {chatSessions.map((session) => {
            const isSelected = session.id === activeSessionId;
            const lastMsg = session.messages[session.messages.length - 1];
            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-1.5 ${isSelected ? 'bg-white dark:bg-gray-800 border-violet-500/50 shadow-md ring-1 ring-violet-500/10' : 'bg-transparent border-gray-100 hover:border-gray-200 hover:bg-white dark:border-gray-800/40 dark:hover:bg-gray-800/10'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2 max-w-[120px]">
                    {session.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold capitalize ${session.status === 'escalated' ? 'bg-red-500/10 text-red-500' : session.status === 'resolved' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {session.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate max-w-[170px]">
                  {lastMsg ? lastMsg.text : "No messages yet"}
                </p>
                {lastMsg && lastMsg.intent && (
                  <div className="mt-1 inline-flex self-start items-center gap-1 text-[9px] bg-slate-100 dark:bg-gray-800/80 p-0.5 px-1.5 rounded font-mono text-gray-400">
                    <span>Intent: {lastMsg.intent}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHAT CHASSIS (col-span-9) */}
      <div className="lg:col-span-9 flex flex-col h-full rounded-2xl border bg-white dark:bg-gray-950 overflow-hidden shadow-lg relative">
        
        {/* Top Header details */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">TrustBot AI Engine</h4>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                <span>Active Core: 3.5 Flash</span>
                {currentUser && <span>• Logged: {currentUser.name} ({currentUser.role})</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tamil / English selector chips */}
            <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-0.5 border border-gray-200 dark:border-gray-700/60">
              <button
                onClick={() => setLanguage('English')}
                id="lang-en-btn"
                className={`py-1 px-3 text-xs rounded-lg font-bold transition flex items-center gap-1 ${language === 'English' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>English</span>
              </button>
              <button
                onClick={() => setLanguage('Tamil')}
                id="lang-ta-btn"
                className={`py-1 px-3 text-xs rounded-lg font-bold transition flex items-center gap-1 ${language === 'Tamil' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <span>தமிழ்</span>
              </button>
            </div>
          </div>
        </div>

        {/* MESSAGES LOG WINDOW */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50/20 to-transparent">
          {(!activeSession || activeSession.messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Start a high-trust conversation</p>
              <p className="text-xs text-gray-400">
                Submit raw inquiries or choose Tamil presets. Our system automatically reviews sentiments, catalogs intents with confidence logs, and verifies trust matrices.
              </p>
            </div>
          ) : (
            activeSession.messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              const isSys = msg.sender === 'system';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSys ? 'justify-center' : isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isSys ? (
                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 text-xs border border-orange-100 dark:border-orange-900 max-w-md text-center flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div className={`max-w-[75%] space-y-1.5 text-left`}>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 px-1 font-mono">
                        {isBot ? (
                          <>
                            <span className="flex items-center gap-0.5 text-violet-500">
                              <Bot className="w-3.5 h-3.5" />
                              <span>TRUSTBOT AI API</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-0.5 text-gray-500">
                              <User className="w-3.5 h-3.5" />
                              <span>{currentUser?.name || "CUSTOMER CLIENT"}</span>
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div className={`p-4 rounded-2xl border text-sm shadow-sm ${isBot ? 'bg-gray-50 border-gray-100 text-gray-800 dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-100' : 'bg-violet-600 border-violet-700 text-white'}`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {/* AI Extraction Widgets */}
                      {isBot && (msg.intent || msg.sentiment) && (
                        <div className="flex flex-wrap gap-2 px-1 text-[10px] font-medium font-mono text-gray-400">
                          {msg.intent && (
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border dark:border-gray-700/60">
                              Intent: {msg.intent} ({msg.confidence ? Math.round(msg.confidence * 100) : 90}%)
                            </span>
                          )}
                          {msg.sentiment && (
                            <span className={`px-2 py-0.5 rounded border ${msg.sentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : msg.sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-gray-500/10 border-gray-400/20 text-gray-400'}`}>
                              Sentiment: {msg.sentiment}
                            </span>
                          )}
                          {msg.language && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/25 text-blue-500">
                              Lang: {msg.language}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          {isSending && (
            <div className="flex justify-start">
              <div className="space-y-1.5 text-left max-w-[60%]">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-500 font-mono">
                  <Bot className="w-3.5 h-3.5" />
                  <span>ANALYZING METRICS...</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/40 border p-4 rounded-2xl flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Triggers (If last message is computer or greeting) */}
        <div className="px-4 py-2 border-t bg-gray-50/20 dark:bg-gray-950/20">
          <div className="flex flex-wrap gap-2 text-left">
            <span className="text-[10px] font-mono text-gray-400 py-1.5">PRESETS & SUGGESTED PROMPTS:</span>
            {language === 'English' ? (
              <>
                <button
                  onClick={() => setInputText("How do I configure my default payment and credit card?")}
                  className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 hover:border-violet-500 dark:hover:border-violet-400 text-gray-600 dark:text-gray-300 transition"
                >
                  💳 Billing Details
                </button>
                <button
                  onClick={() => setInputText("We are seeing a server database expired session warning. Help!")}
                  className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 hover:border-violet-500 dark:hover:border-violet-400 text-gray-600 dark:text-gray-300 transition"
                >
                  🚨 Bug report
                </button>
                <button
                  onClick={() => setInputText("Please transfer me to a senior human agent representation immediately.")}
                  className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 hover:border-red-500 dark:hover:border-red-400 text-gray-600 dark:text-gray-300 transition"
                >
                  🧑 Human Transfer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setInputText("வணக்கம், பில்லிங் மற்றும் அட்டை விவரங்களை மாற்றுவதற்கு உதவி தேவை.")}
                  className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 hover:border-violet-500 dark:hover:border-violet-400 text-gray-600 dark:text-gray-300 transition"
                >
                  வணக்கம் & பில்லிங்
                </button>
                <button
                  onClick={() => setInputText("மின்னஞ்சல் கடவுச்சொல்லை மாற்றுவது எவ்வாறு?")}
                  className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-gray-900 hover:border-violet-500 dark:hover:border-violet-400 text-gray-600 dark:text-gray-300 transition"
                >
                  கடவுச்சொல் மாற்று
                </button>
              </>
            )}
          </div>
        </div>

        {/* SPEECH AND CHAT WRITER TOOLBAR */}
        <div className="p-4 border-t bg-white dark:bg-gray-950 flex flex-col gap-2">
          {speechError && (
            <div className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-left">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{speechError}</span>
            </div>
          )}

          {activeSession?.status === "escalated" ? (
            <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs text-center flex items-center justify-center gap-2 font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>LOG ESCALATED: Systems locked. A priority support specialist will respond on this terminal.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoiceInput}
                id="mic-btn"
                className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 border-red-600 text-white animate-pulse' : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'}`}
                title="Voice inputs using browser micro"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={isRecording ? "Listening to your voice..." : "Enter your customer support request/question..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isRecording}
                id="chat-input-field"
                className="flex-1 px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 dark:text-white"
              />

              <button
                onClick={handleSend}
                disabled={isSending || isRecording || !inputText.trim()}
                id="chat-send-btn"
                className="p-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:opacity-40 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
