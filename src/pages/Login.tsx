import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Login = () => {
  const { user, signIn, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background System Orbs */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-12 relative z-10 border-white/5 shadow-2xl bg-white/[0.02]"
      >
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="bg-emerald-500 p-5 rounded-[24px] text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-8 transform -rotate-6 border border-white/20">
            <Building2 size={36} />
          </div>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em] mb-4">Central Processing Unit</p>
          <h1 className="text-4xl font-bold text-white tracking-tighter mb-3 uppercase">Initialize</h1>
          <p className="text-slate-500 text-xs font-medium max-w-[280px] leading-relaxed uppercase tracking-widest opacity-60">
            MicroFinance Network Access Gateway & Personnel Sync
          </p>
        </div>

        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-4 bg-white text-slate-950 py-5 rounded-3xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-[0.98] group shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-emerald-500/40"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
          <span>Authenticate Identity</span>
          <ArrowRight size={18} className="translate-x-0 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            Terminal Secure Status
          </div>
        </div>
      </motion.div>

      <p className="mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] font-mono">
        © 2026 LOGICAL SYSTEMS INTERFACE
      </p>
    </div>
  );
};

export default Login;
