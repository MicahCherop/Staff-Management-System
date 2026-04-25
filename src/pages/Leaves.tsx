import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { leaveService } from '../services/db';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter,
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { LeaveRequest } from '../types';

const Leaves = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const fetchLeaves = async () => {
    setLoading(true);
    const branch = (isAdmin || isManager) ? undefined : user?.profile?.branch;
    const data = await leaveService.getLeaves(branch) as LeaveRequest[];
    setLeaves(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!user) return;
    await leaveService.updateLeaveStatus(id, status, user.uid);
    await fetchLeaves();
  };

  const filteredLeaves = leaves.filter(l => {
    if (filter === 'All') return true;
    return l.status === filter.toLowerCase();
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Leave Mgmt</h1>
          <p className="text-slate-500">Track and approve personnel time-off requests</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          <span>New Application</span>
        </button>
      </div>

      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Filter className="text-slate-500" size={16} />
          <div className="flex gap-1.5">
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === s 
                    ? 'bg-emerald-500 text-slate-900 shadow-md' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Awaiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-32 animate-pulse" />
          ))
        ) : filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => (
            <div key={leave.id} className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 p-6">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  leave.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-tight">{leave.userName || 'Unknown Personnel'}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{leave.type} • {leave.branch}</p>
                  <p className="text-[9px] font-mono text-slate-600 mt-2 uppercase">STAMP: {format(new Date(leave.createdAt), 'MMM dd, HH:mm')}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-12 gap-y-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-1">Authorization Window</span>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={14} className="text-emerald-500/40" />
                    <span className="text-xs font-mono font-bold">{format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd')}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-1">Logical State</span>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                    leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    leave.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {leave.status === 'approved' && <CheckCircle2 size={10} />}
                    {leave.status === 'rejected' && <XCircle size={10} />}
                    {leave.status === 'pending' && <Clock size={10} />}
                    {leave.status}
                  </span>
                </div>
              </div>

              {(isAdmin || isManager) && leave.status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(leave.id, 'approved')}
                    className="flex-1 sm:flex-none bg-emerald-500 text-slate-900 p-3 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(leave.id, 'rejected')}
                    className="flex-1 sm:flex-none bg-white/5 text-rose-400 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-card py-24 text-center">
            <AlertCircle size={40} className="mx-auto text-white/5 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries found</p>
            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Awaiting application synchronization</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900/90 border border-white/10 rounded-[40px] w-full max-w-lg p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Apply for Leave</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Type of Authorization</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white appearance-none focus:border-emerald-500/50">
                    <option className="bg-slate-900">Annual Leave</option>
                    <option className="bg-slate-900">Sick Leave</option>
                    <option className="bg-slate-900">Maternity/Paternity</option>
                    <option className="bg-slate-900">Compassionate</option>
                    <option className="bg-slate-900">Unpaid</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Segment</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Segment</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Logical Context / Notes</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 resize-none focus:border-emerald-500/50"
                    placeholder="Briefly state reasoning..."
                  />
                </div>

                <button className="w-full bg-emerald-500 text-slate-900 py-5 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl shadow-emerald-500/20 mt-4 active:scale-[0.98] transition-transform">
                  Synchronize Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves;
