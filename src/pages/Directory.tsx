import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/db';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  MapPin, 
  Phone,
  MoreVertical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

const Directory = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [staff, setStaff] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const branch = branchFilter === 'All' ? undefined : branchFilter;
      const data = await userService.getUsers(branch) as User[];
      setStaff(data || []);
      setLoading(false);
    };
    fetchStaff();
  }, [branchFilter]);

  const filteredStaff = staff.filter(s => 
    s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Personnel Core</h1>
          <p className="text-slate-500 text-sm">Synchronize with organizational entity directory</p>
        </div>
        
        {(isAdmin || isManager) && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            <span>Onboard Unit</span>
          </button>
        )}
      </div>

      <div className="glass-card flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input 
            type="text"
            placeholder="Search entity by name or designation..."
            className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-slate-300 placeholder:text-slate-700 outline-none text-xs font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="text-emerald-500/40" size={16} />
          <select 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option className="bg-slate-900">All Nodes</option>
            <option className="bg-slate-900">Nairobi</option>
            <option className="bg-slate-900">Mombasa</option>
            <option className="bg-slate-900">Kisumu</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card animate-pulse h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((person) => (
            <motion.div 
              layout
              key={person.id}
              className="glass-card p-8 group relative overflow-hidden flex flex-col h-full border-white/5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.03] rounded-full blur-2xl -mr-12 -mt-12" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner group-hover:border-emerald-500/30 transition-all">
                  <span className="text-2xl font-bold uppercase tracking-tighter">
                    {person.displayName?.charAt(0)}
                  </span>
                </div>
                <button className="text-slate-700 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="font-bold text-white text-xl tracking-tight group-hover:text-emerald-400 transition-colors uppercase">{person.displayName}</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{person.jobTitle}</p>
                <div className="flex items-center gap-2 text-slate-700 text-[10px] font-bold uppercase tracking-widest pt-2">
                  <MapPin size={12} className="text-emerald-500/20" />
                  <span>{person.branch} SECTOR</span>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-slate-500 group-hover:text-emerald-400/80 transition-colors">
                  <Mail size={14} className="opacity-40" />
                  <span className="text-[10px] font-mono tracking-tighter truncate">{person.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-emerald-500/20" />
                    <span className="text-[9px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                      {person.role}
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setIsAddModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-slate-900/90 border border-white/10 rounded-[40px] w-full max-w-lg p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Onboard Entity</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-600 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Authentication ID (Google Email)</label>
                  <input 
                    type="email"
                    placeholder="entity@mfi-node.tech"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-slate-800 outline-none focus:border-emerald-500/40 transition-all font-mono"
                  />
                  <p className="text-[9px] text-slate-700 ml-1 uppercase tracking-tighter">Entity must possess a valid Google identity provider hash.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Assigned Sector</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/40 appearance-none">
                      <option className="bg-slate-900">Nairobi</option>
                      <option className="bg-slate-900">Mombasa</option>
                      <option className="bg-slate-900">Kisumu</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Tier</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/40 appearance-none">
                      <option className="bg-slate-900">Staff</option>
                      <option className="bg-slate-900">Manager</option>
                      <option className="bg-slate-900">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Logical Designation</label>
                  <input 
                    type="text"
                    placeholder="e.g. Protocol Specialist"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-slate-800 outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>

                <button 
                  className="w-full bg-emerald-500 text-slate-900 py-6 rounded-3xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 mt-6 active:scale-[0.98] transition-all"
                >
                  Create Entity Node
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Directory;
