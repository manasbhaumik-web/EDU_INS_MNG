import React, { useState } from 'react';
import { Shield, Sparkles, LogIn, Award, Landmark, BookOpen, Key, Mail, CheckCircle2 } from 'lucide-react';
import { Role, User } from '../types';

interface LoginPortalProps {
  initialUsers: User[];
  onLoginSuccess: (user: User) => void;
}

export default function LoginPortal({ initialUsers, onLoginSuccess }: LoginPortalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Predefined student & faculty credentials so users can pick right away
  const handleQuickLogin = (selectedUser: User) => {
    setEmailInput(selectedUser.email);
    setPasswordInput('••••••••');
    // Simulate natural transitional delay
    setTimeout(() => {
      onLoginSuccess(selectedUser);
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please input a valid administrative email.');
      return;
    }

    // Try finding in initialUsers list
    const matchedUser = initialUsers.find(
      (u) => u.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
    );

    if (matchedUser) {
      setErrorMsg('');
      onLoginSuccess(matchedUser);
    } else {
      // Create temporary credential for custom logins
      const isCustomStudent = emailInput.includes('student');
      const detectedRole: Role = isCustomStudent ? 'Student' : 'Teacher & Professor';
      
      const customUser: User = {
        id: 'u-custom-' + Math.round(Math.random() * 900),
        name: emailInput.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        email: emailInput,
        role: detectedRole,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      
      onLoginSuccess(customUser);
    }
  };

  const getRoleColorDescription = (role: Role) => {
    switch (role) {
      case 'Super Admin':
        return { badge: 'bg-indigo-900/10 text-indigo-900 border-indigo-200/50', desc: 'Full System Control & Audit settings' };
      case 'CEO & Director':
        return { badge: 'bg-amber-900/10 text-amber-900 border-amber-200/50', desc: 'Strategic Budgets & High-level reports' };
      case 'HOD':
        return { badge: 'bg-blue-900/10 text-blue-900 border-blue-200/50', desc: 'Departments, Curriculums & Class syllabi' };
      case 'HR':
        return { badge: 'bg-slate-900/10 text-slate-900 border-slate-200/50', desc: 'Faculty onboarding & leave allocations' };
      case 'Clerk & Executive':
        return { badge: 'bg-emerald-900/10 text-emerald-900 border-emerald-200/50', desc: 'Student Invoicing & Applications buffer' };
      case 'Teacher & Professor':
        return { badge: 'bg-purple-900/10 text-purple-900 border-purple-200/50', desc: 'Absences roster, syllabus uploads & index edits' };
      case 'Student':
        return { badge: 'bg-rose-900/10 text-rose-900 border-rose-200/50', desc: 'View cumulative GPA dossiers & catalog' };
      default:
        return { badge: 'bg-slate-100 text-slate-800 border-slate-200', desc: 'General Registry clearances' };
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 md:p-8 relative selection:bg-indigo-200">
      
      {/* Decorative Gold Leaf Borders and Watermark */}
      <div className="absolute inset-4 pointer-events-none border border-indigo-200/30 rounded-none z-0" />
      <div className="absolute inset-6 pointer-events-none border border-indigo-300/10 rounded-none z-0" />

      {/* Primary Floating Card */}
      <div className="w-full max-w-5xl bg-white border border-indigo-200 shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden animate-fade-in">
        
        {/* Left Side: Editorial Branding with Oxford crest feeling */}
        <div className="md:w-5/12 bg-indigo-600 text-white p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-indigo-700 relative">
          
          <div className="space-y-6">
            {/* Crest Emblem */}
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500 border border-indigo-400 p-2 text-indigo-100 relative">
              <Landmark className="w-7 h-7 text-indigo-100" />
              <Award className="absolute -bottom-1 -right-1 w-5 h-5 text-indigo-300 fill-indigo-650" />
            </div>

            <div>
              <span className="text-[10px] tracking-[0.25em] font-mono font-bold text-indigo-350 block uppercase">
                Academic Heritage
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight mt-1.5 font-serif text-indigo-100">
                Skyline International
              </h1>
              <p className="text-indigo-200 text-xs mt-3 leading-relaxed font-sans">
                Centennial administrative registry and consolidated records vault. Certified system access matches strict MoE regulatory audits and institutional authority permissions.
              </p>
            </div>
            
            <div className="border-t border-indigo-500/40 my-6" />
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider font-display">Role Autonomy Mapping</p>
                  <p className="text-[10px] text-indigo-200 leading-normal mt-0.5">Application sections automatically load, filter, and lock according to credential metadata.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider font-display">Cryptographic Audit Ledger</p>
                  <p className="text-[10px] text-indigo-200 leading-normal mt-0.5">Every entry alteration, grade modification, and asset booking generates high-fidelity trace hashes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-indigo-500/20 flex items-center justify-between">
            <span className="text-[10px] font-mono text-indigo-300">SYSTEM CLEARANCES V4.2.1</span>
            <span className="text-[9px] bg-indigo-500 text-indigo-100 px-2 py-0.5 font-bold uppercase tracking-widest border border-indigo-400">
              SECURE TLS
            </span>
          </div>
        </div>

        {/* Right Side: The Interactive Credentials Terminal */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-display font-bold text-indigo-900 uppercase tracking-wide">Registry Check-In</h2>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Enter credentials or pick a verified faculty/student dossier to explore active permissions.</p>
              </div>
              <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-150 text-rose-800 text-[11px] font-medium rounded-none animate-shake">
                {errorMsg}
              </div>
            )}

            {/* FORM ENTRY */}
            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Institutional Email Directory
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. arthur.p@edu.org"
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Authority Passphrase Code (TLS Security)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Type anything to authenticate..."
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase tracking-widest text-[10px] py-3.5 rounded-none transition flex items-center justify-center gap-2 cursor-pointer shadow-none border-b-2 border-indigo-900/40"
              >
                <span>Authorize & Unlock Dossiers</span>
                <LogIn className="w-4 h-4 text-indigo-100" />
              </button>
            </form>

            {/* PRESET VERIFIED PROFILES */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                Verified Dossiers (Click to instant single-sign-on)
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1">
                {initialUsers.map((user) => {
                  const roleConfig = getRoleColorDescription(user.role);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickLogin(user)}
                      className="w-full text-left p-2.5 border border-slate-150 hover:border-indigo-300 hover:bg-slate-50/70 transition rounded-none group flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px] group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </p>
                          <p className="font-mono text-[9px] text-slate-500 mt-0.5 truncate max-w-[150px] sm:max-w-none">
                            {user.email}
                          </p>
                        </div>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-none font-bold shrink-0 uppercase tracking-wide ${roleConfig.badge}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-450 mt-1 italic leading-tight">
                        {roleConfig.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-2 font-medium">
            <span>© 2026 Skyline International. All rights reserved.</span>
            <div className="flex gap-2">
              <a href="#rules" className="underline hover:text-indigo-600">Administrative Mandates</a>
              <span>•</span>
              <a href="#moe" className="underline hover:text-indigo-600 font-semibold text-slate-500">MoE Registered</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
