import React, { useState } from "react";
import { UserAccount, ChatSession } from "../types";
import { Users, FileText, Settings, Download, Plus, Bot, Shield, Trash2, CheckCircle } from "lucide-react";

interface AdminDashboardViewProps {
  users: UserAccount[];
  chatSessions: ChatSession[];
  onAddUser: (email: string, name: string, company: string, role: 'admin' | 'customer') => void;
  onDeleteUser: (email: string) => void;
  isDark: boolean;
}

export default function AdminDashboardView({
  users,
  chatSessions,
  onAddUser,
  onDeleteUser,
  isDark
}: AdminDashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'chatbot' | 'logs'>('users');
  
  // User creation states
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState<'customer' | 'admin'>('customer');
  const [addUserSuccess, setAddUserSuccess] = useState("");

  // Bot response parameter configurations
  const [botTemperature, setBotTemperature] = useState(0.5);
  const [botConfidenceLimit, setBotConfidenceLimit] = useState(0.85);
  const [tamiliDefaultOn, setTamiliDefaultOn] = useState(true);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState("");

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    onAddUser(newEmail, newName, newCompany, newRole);
    setNewEmail("");
    setNewName("");
    setNewCompany("");
    setAddUserSuccess("User tenant loaded successfully into security workspace!");
    setTimeout(() => setAddUserSuccess(""), 3000);
  };

  const saveSettings = () => {
    setSaveSettingsSuccess("Model configuration weights updated successfully!");
    setTimeout(() => setSaveSettingsSuccess(""), 3000);
  };

  // CSV Report Generator (creates dynamic download of active conversation analytics!)
  const exportCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SESSIONID,USER_EMAIL,DIALOGUE_TITLE,LOG_STATUS,MESSAGES_COUNT\n";
    
    chatSessions.forEach(session => {
      const row = `"${session.id}","${session.userEmail}","${session.title.replace(/"/g, '""')}","${session.status}",${session.messages.length}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TrustBotAI_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Administration Control</h2>
          <p className="text-xs text-gray-400">Review user access, adjust chat bot temperature weights, and download comprehensive compliance spreadsheets.</p>
        </div>
        
        {/* CSV Report Trigger */}
        <button
          onClick={exportCSVReport}
          id="export-csv-btn"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Telemetry Audit</span>
        </button>
      </div>

      {/* Sub Navigation Selectors */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 gap-4">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`py-3 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition ${activeSubTab === 'users' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <span className="flex items-center gap-1.5 px-1"><Users className="w-4 h-4" /> Accounts Directory</span>
        </button>
        <button
          onClick={() => setActiveSubTab('chatbot')}
          className={`py-3 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition ${activeSubTab === 'chatbot' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <span className="flex items-center gap-1.5 px-1"><Settings className="w-4 h-4" /> Bot Response Config</span>
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`py-3 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition ${activeSubTab === 'logs' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <span className="flex items-center gap-1.5 px-1"><FileText className="w-4 h-4" /> Live Dialog logs</span>
        </button>
      </div>

      {/* TAB CONTENT 1: User Management */}
      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* USER ADD PANEL */}
          <div className="lg:col-span-5 p-6 rounded-2xl border bg-white dark:bg-gray-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400">Load New Security Tenant</h3>
            
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent dark:border-gray-800 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400">Workspace / Org</label>
                  <input
                    type="text"
                    placeholder="e.g. Kumar Info"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent dark:border-gray-800 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400">Security Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent dark:border-gray-800 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400">Security Clearance Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('customer')}
                    className={`py-1.5 text-xs rounded-lg font-semibold border transition ${newRole === 'customer' ? 'bg-violet-50 border-violet-500 text-violet-700' : 'border-gray-200 dark:border-gray-800'}`}
                  >
                    Standard customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`py-1.5 text-xs rounded-lg font-semibold border transition ${newRole === 'admin' ? 'bg-violet-50 border-violet-500 text-violet-700' : 'border-gray-200 dark:border-gray-800'}`}
                  >
                    System admin
                  </button>
                </div>
              </div>

              {addUserSuccess ? (
                <div className="p-2.5 text-center text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/10 rounded-xl">
                  {addUserSuccess}
                </div>
              ) : (
                <button
                  type="submit"
                  id="add-user-btn"
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-violet-600 hover:bg-violet-700 shadow flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Provision New Tenant Card</span>
                </button>
              )}
            </form>
          </div>

          {/* USER FOLDERS DIRECTORY */}
          <div className="lg:col-span-7 p-6 rounded-2xl border bg-white dark:bg-gray-900 space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400">Authorized Workspace Tenant Register</h3>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[350px] overflow-y-auto pr-2">
              {users.map((item) => (
                <div key={item.email} className="py-3 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{item.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{item.email} {item.companyName && `• ${item.companyName}`}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase ${item.role === 'admin' ? 'bg-indigo-500/15 text-indigo-500' : 'bg-slate-100 dark:bg-gray-800 text-gray-500'}`}>
                      {item.role}
                    </span>
                    <button
                      onClick={() => onDeleteUser(item.email)}
                      disabled={item.email === "vetriselvanv2008@gmail.com"}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition disabled:opacity-30"
                      title="De-authorize user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: Chatbot response tweaks */}
      {activeSubTab === 'chatbot' && (
        <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 space-y-6 max-w-2xl text-left">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base">Gemini 3.5 Flash Model Parameter Adjuster</h3>
          </div>
          
          <div className="space-y-5">
            {/* Range 1: Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">Model Temperature (Creativity vs Determinism)</span>
                <span className="font-mono text-gray-500">{botTemperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={botTemperature}
                onChange={(e) => setBotTemperature(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">Lower temperatures guarantee strict compliance regarding technical credentials, while higher scores generate creative dialogues.</p>
            </div>

            {/* Range 2: Confidence threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">SLA Confidence Guardrail Limit</span>
                <span className="font-mono text-gray-500">{botConfidenceLimit}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={botConfidenceLimit}
                onChange={(e) => setBotConfidenceLimit(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">If the model's confidence falls below this value during intent analysis, the thread triggers automated human priority hand-off.</p>
            </div>

            {/* Tamil Toggle */}
            <div className="flex items-center justify-between py-2 border-y border-gray-50 dark:border-gray-800">
              <div className="text-xs text-left">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Default Tamil Bilingual Recognition</p>
                <p className="text-[10px] text-gray-400">Allows instant localized translation loops without user prompt configurations.</p>
              </div>
              <button
                onClick={() => setTamiliDefaultOn(!tamiliDefaultOn)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors ${tamiliDefaultOn ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-800'}`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${tamiliDefaultOn ? 'translate-x-5.5' : 'translate-x-0'}`} />
              </button>
            </div>

            {saveSettingsSuccess ? (
              <div className="p-3 text-center text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                {saveSettingsSuccess}
              </div>
            ) : (
              <button
                onClick={saveSettings}
                id="save-settings-btn"
                className="py-2.5 px-6 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-700 text-white shadow-md transition"
              >
                Save Model Configuration weights
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Raw Logs viewer */}
      {activeSubTab === 'logs' && (
        <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-400">Live Active Audit Dialogue logs</h3>
          
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
            {chatSessions.map((session) => (
              <div key={session.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-slate-50/20 text-left space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold font-mono text-gray-400 border-b pb-2">
                  <span>LOG ID: {session.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold text-white ${session.status === 'escalated' ? 'bg-red-500' : session.status === 'resolved' ? 'bg-indigo-500' : 'bg-amber-500'}`}>
                    {session.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Dialogue Focus: <strong className="text-gray-700 dark:text-gray-300">{session.title}</strong></p>
                  <p className="text-xs text-gray-400">Active Tenant: <span className="font-mono">{session.userEmail}</span></p>
                </div>

                <div className="p-2.5 rounded bg-white dark:bg-gray-950 border border-dashed text-xs space-y-1.5 max-h-[140px] overflow-y-auto">
                  {session.messages.map((m, idx) => (
                    <div key={idx} className="flex gap-1.5 leading-normal">
                      <span className="font-bold uppercase text-[9px] text-gray-400 shrink-0 font-mono">{m.sender}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
