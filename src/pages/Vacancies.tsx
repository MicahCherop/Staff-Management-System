import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { vacancyService } from '../services/db';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Vacancy } from '../types';

const Vacancies = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVacancies = async () => {
    setLoading(true);
    const branch = (isAdmin || isManager) ? undefined : user?.profile?.branch;
    const data = await vacancyService.getVacancies(branch) as Vacancy[];
    setVacancies(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Vacancy Hub</h1>
          <p className="text-slate-500">Manage internal job openings and new personnel placement</p>
        </div>

        {(isAdmin || isManager) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            <span>Post Requisition</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card h-48 animate-pulse" />
          ))
        ) : vacancies.map((vacancy) => (
          <div key={vacancy.id} className="glass-card flex flex-col p-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="bg-white/5 p-4 rounded-2xl text-emerald-400 border border-white/5">
                <Briefcase size={28} />
              </div>
              <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                vacancy.status === 'open' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                  : 'bg-white/5 text-slate-500 border-white/10'
              }`}>
                {vacancy.status}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 truncate group-hover:text-emerald-400 transition-colors tracking-tight">{vacancy.title}</h3>
            
            <div className="flex flex-wrap items-center gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500/40" />
                <span>{vacancy.branch}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-emerald-500/40" />
                <span>STAMP {format(new Date(vacancy.postedAt), 'MMM dd')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-auto">
              <div className="flex -space-x-3 items-center">
                {[1,2,3].map(i => (
                  <div key={i} className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-xl">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] ml-2">
                  +08
                </div>
              </div>
              <button className="flex items-center gap-3 text-emerald-400 font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                Review Pipeline
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card bg-emerald-950/20 border-emerald-500/20 p-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">System Insights</p>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Placement Matrix</h2>
          <p className="text-slate-500 text-sm">Tracking organizational growth synchronization</p>
        </div>
        <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
          <div className="text-center">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">Sync Time</p>
            <p className="text-4xl font-light text-white">12 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">DAYS</span></p>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">Throughput</p>
            <p className="text-4xl font-light text-emerald-400">24 <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">%</span></p>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">Load Factor</p>
            <p className="text-4xl font-light text-blue-400">08</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900/90 border border-white/10 rounded-[40px] w-full max-w-xl p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Create Requisition</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Designation Title</label>
                  <input type="text" placeholder="e.g. Credit Operations Manager" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-slate-700 focus:border-emerald-500/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Operational Branch</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white appearance-none focus:border-emerald-500/50">
                      <option className="bg-slate-900">Nairobi HQ</option>
                      <option className="bg-slate-900">Mombasa</option>
                      <option className="bg-slate-900">Kisumu</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Logical Status</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white appearance-none focus:border-emerald-500/50">
                      <option className="bg-slate-900">Full-time</option>
                      <option className="bg-slate-900">Contract</option>
                      <option className="bg-slate-900">Part-time</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Technical Requirements</label>
                  <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-slate-700 resize-none focus:border-emerald-500/50" placeholder="Detail departmental needs..." />
                </div>

                <button className="w-full bg-emerald-500 text-slate-900 py-6 rounded-3xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl shadow-emerald-500/20 mt-4 active:scale-[0.98] transition-all">
                  Initialize Requisition
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vacancies;
