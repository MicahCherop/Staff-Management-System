import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/db';
import { Archive, Search, MapPin, Calendar, FileText, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { User } from '../types';

const ExitedStaff = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [exitedStaff, setExitedStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExited = async () => {
      setLoading(true);
      const branch = (isAdmin || isManager) ? undefined : user?.profile?.branch;
      const data = await userService.getUsers(branch, 'exited') as User[];
      setExitedStaff(data || []);
      setLoading(false);
    };
    fetchExited();
  }, []);

  const filtered = exitedStaff.filter(s => 
    s.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Personnel Archive</h1>
          <p className="text-slate-500">Historical logs of disconnected entity synchronization</p>
        </div>
        
        {(isAdmin || isManager) && (
          <button className="flex items-center gap-2 bg-white/5 text-slate-300 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/10 transition-all border border-white/5">
            <Download size={16} className="text-emerald-400" />
            <span>Export Registry</span>
          </button>
        )}
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input 
            type="text"
            placeholder="Search disconnected entities..."
            className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-slate-300 placeholder:text-slate-700 outline-none font-bold text-xs uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Disconnected Entity</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Tenure Window</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Cut Date</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Context</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Node</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-8 px-6"><div className="h-2 bg-white/5 rounded w-full" /></td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((staff) => (
                  <tr key={staff.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center font-bold text-slate-500">
                          <Archive size={16} className="group-hover:text-amber-500/50 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-300">{staff.displayName}</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">{staff.jobTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={12} className="text-emerald-500/30" />
                        <span className="text-[10px] font-mono uppercase tracking-tighter">Joined {format(new Date(staff.joinedAt), 'MMM yyyy')}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-[10px] font-mono font-bold text-slate-400">
                      {staff.exitDate ? format(new Date(staff.exitDate), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FileText size={12} className="text-rose-500/30" />
                        <span className="text-[10px] italic">{staff.exitedReason || 'Resignation'}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">{staff.branch}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Archive size={40} className="mx-auto text-white/5 mb-4" />
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Archive Empty</p>
                    <p className="text-[10px] text-slate-700 mt-1 uppercase tracking-widest">No disconnected entries synchronized</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExitedStaff;
