import React, { useState } from "react";
import { Mail, MessageSquare, PhoneCall, CheckCircle, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

interface ContactViewProps {
  isDark: boolean;
  currentUser: any;
}

export default function ContactView({ isDark, currentUser }: ContactViewProps) {
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState(currentUser?.email || "");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail || !details) return;
    
    // Generate simulated ticket hash
    const generatedId = "TB-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedId);
    setSubject("");
    setDetails("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left max-w-6xl mx-auto">
      
      {/* LEFT: Channel Info Cards (col-span-5) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="text-left space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Direct Support Channels</h2>
          <p className="text-xs text-gray-400">Reach our global engineering crew instantly for priority consultations or secure key resets.</p>
        </div>

        <div className="space-y-4">
          {/* Card 1: Email */}
          <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-start gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-sm">Security & Compliance Desk</h4>
              <p className="text-xs text-gray-500 font-mono">compliance@trustbot.ai</p>
              <p className="text-[11px] text-gray-400 leading-normal">Typically replies inside 1 hour. PGP keys available upon request.</p>
            </div>
          </div>

          {/* Card 2: Slack */}
          <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-start gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-sm">Slack Slack Integration Workspace</h4>
              <p className="text-xs text-gray-500 font-mono">#trustbot-support-dev</p>
              <p className="text-[11px] text-gray-400 leading-normal">Connect live with principal engineers and other developer teams.</p>
            </div>
          </div>

          {/* Card 3: Enterprise callback */}
          <div className="p-5 rounded-2xl border bg-white dark:bg-gray-900 flex items-start gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-sm">Dedicated SLA Hotlines</h4>
              <p className="text-xs text-gray-500 font-mono">+1 (800) 948-TRUST</p>
              <p className="text-[11px] text-gray-400 leading-normal">Premium tier callback lines active 24 / 7 / 365.</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-dashed bg-slate-50 dark:bg-gray-800/10 text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>All conversation audits, ticket descriptions, and metadata logs are encrypted using SHA-256 standard cryptographic ledger controls.</span>
        </div>
      </div>

      {/* RIGHT: Ticket Submission Panel (col-span-7) */}
      <div className="lg:col-span-7 p-6 rounded-3xl border bg-white dark:bg-gray-900 shadow-lg space-y-4">
        <h3 className="text-lg font-bold">Generate SLA Helpdesk Ticket</h3>
        <p className="text-xs text-gray-400">If digital chatbot diagnostics require further physical debugging, create a manual support ticket below to alert our technical director.</p>

        {ticketId ? (
          <div className="p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-lg text-emerald-600">Ticket Dispatched Successfully!</h4>
              <p className="text-xs text-gray-400">Your SLA tracking reference identifier has been loaded into our queue.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white dark:bg-gray-850 border font-mono text-xs max-w-sm mx-auto flex justify-between items-center text-gray-700 dark:text-gray-300">
              <span>TRACKING ID:</span>
              <strong className="text-sm text-violet-600">{ticketId}</strong>
            </div>

            <button
              onClick={() => setTicketId("")}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Submit Another Ticket request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Jenkins"
                  className="w-full px-3 py-2.5 rounded-xl border text-xs bg-transparent dark:border-gray-800"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Authorized Tenant Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@company.com"
                  className="w-full px-3 py-2.5 rounded-xl border text-xs bg-transparent dark:border-gray-800"
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Ticket Priority Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {["Low", "Medium", "High"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 text-xs rounded-lg font-semibold border transition ${priority === p ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400' : 'border-gray-200 dark:border-gray-800 text-gray-400'}`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Subject Summary</label>
              <input
                type="text"
                placeholder="e.g. Sandbox API signature token validation failure"
                className="w-full px-3 py-2.5 rounded-xl border text-xs bg-transparent dark:border-gray-800"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Detailed Issue Description</label>
              <textarea
                required
                placeholder="Submit system parameters, stack logs, or exact wording of customer concerns..."
                className="w-full min-h-[110px] p-3 rounded-xl border text-xs bg-transparent dark:border-gray-800"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <button
              type="submit"
              id="submit-ticket-btn"
              className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-md transition"
            >
              Dispatch Technical Helpdesk Ticket
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
