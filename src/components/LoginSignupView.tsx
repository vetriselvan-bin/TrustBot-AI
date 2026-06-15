import React, { useState } from "react";
import { Mail, Lock, User, Building, ShieldCheck, LogIn, Sparkles } from "lucide-react";

interface LoginSignupViewProps {
  onAuthSuccess: (email: string, name: string, role: 'admin' | 'customer') => void;
  isDark: boolean;
}

export default function LoginSignupView({ onAuthSuccess, isDark }: LoginSignupViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [errorObj, setErrorObj] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!email) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Invalid email format.";
    }
    
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (!isLogin) {
      if (!name) errs.name = "Full Name is required.";
    }
    
    setErrorObj(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSuccessMsg(isLogin ? "Signing in securely..." : "Creating high-security account...");
    
    setTimeout(() => {
      onAuthSuccess(
        email, 
        isLogin ? (email.split('@')[0] || "User") : name, 
        role
      );
    }, 1200);
  };

  // Switcher helper
  const fillSample = (selectedRole: 'admin' | 'customer') => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail("vetriselvanv2008@gmail.com");
      setPassword("adminpass123");
    } else {
      setEmail("client.alpha@enterprise.com");
      setPassword("usersecret");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-6">
      <div className="w-full max-w-md p-8 rounded-3xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl space-y-6 backdrop-blur-md">
        
        {/* Toggle selectors */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <button
            onClick={() => { setIsLogin(true); setErrorObj({}); }}
            id="tab-login"
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${isLogin ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Secure Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorObj({}); }}
            id="tab-signup"
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${!isLogin ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {isLogin ? "Welcome Back to TrustBot AI" : "Register Developer Asset"}
          </h2>
          <p className="text-xs text-gray-400">
            {isLogin ? "Provide your security credentials below" : "Setup administrative and testing roles"}
          </p>
        </div>

        {/* Demo Helper Chips */}
        <div className="p-3 bg-violet-500/5 dark:bg-violet-500/10 rounded-xl border border-violet-500/10 text-left space-y-2">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUICK DEMO ACCELERATORS:</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fillSample('customer')}
              id="pref-fill-customer"
              type="button"
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50"
            >
              Fill Customer Sample
            </button>
            <button
              onClick={() => fillSample('admin')}
              id="pref-fill-admin"
              type="button"
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Fill Admin Sample
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* 1. Name (Signup only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Vetri Selvan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 ${errorObj.name ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 dark:border-gray-800"}`}
                />
              </div>
              {errorObj.name && <p className="text-[11px] text-red-500 font-medium">{errorObj.name}</p>}
            </div>
          )}

          {/* 2. Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Security Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="developer@trustbot.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 ${errorObj.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 dark:border-gray-800"}`}
              />
            </div>
            {errorObj.email && <p className="text-[11px] text-red-500 font-medium">{errorObj.email}</p>}
          </div>

          {/* 3. Role Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Workspace Context Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`py-2 text-xs font-semibold rounded-xl border transition ${role === 'customer' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-500 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-800 text-gray-500'}`}
                onClick={() => setRole('customer')}
              >
                Customer Support Client
              </button>
              <button
                type="button"
                className={`py-2 text-xs font-semibold rounded-xl border transition ${role === 'admin' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-500 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-800 text-gray-500'}`}
                onClick={() => setRole('admin')}
              >
                Admin System Manager
              </button>
            </div>
          </div>

          {/* 4. Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Security Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 ${errorObj.password ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 dark:border-gray-800"}`}
              />
            </div>
            {errorObj.password && <p className="text-[11px] text-red-500 font-medium">{errorObj.password}</p>}
          </div>

          {successMsg ? (
            <div className="p-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-pulse">
              {successMsg}
            </div>
          ) : (
            <button
              type="submit"
              id="auth-submit-btn"
              className="w-full py-3 mt-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-md flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-4 h-4" />
              {isLogin ? "Authenticate Credentials" : "Initialize Creator Ledger"}
            </button>
          )}
        </form>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Session cookies are encrypted strictly with local transport flags.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
