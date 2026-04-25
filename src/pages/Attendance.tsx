import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { attendanceService, userService } from '../services/db';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X,
  Search,
  Calendar,
  LogIn,
  LogOut,
  History,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Attendance, User } from '../types';

const AttendancePage = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [currentUserAttendance, setCurrentUserAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markingAttendance, setMarkingAttendance] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    const branch = (isAdmin || isManager) ? undefined : user?.profile?.branch;
    const data = await attendanceService.getAttendance(dateFilter, branch) as Attendance[];
    setAttendance(data || []);
    
    // Find if current user has marked today
    if (dateFilter === format(new Date(), 'yyyy-MM-dd')) {
      const self = data.find(a => a.userId === user?.uid);
      setCurrentUserAttendance(self || null);
    } else {
      setCurrentUserAttendance(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter]);

  const handleMarkAttendance = async (status: 'present' | 'absent') => {
    if (!user) return;
    setMarkingAttendance(true);
    const now = new Date();
    await attendanceService.submitAttendance({
      userId: user.uid,
      userName: user.displayName,
      date: format(now, 'yyyy-MM-dd'),
      status,
      timeIn: format(now, 'HH:mm'),
      branch: user.profile?.branch || 'Nairobi'
    });
    await fetchAttendance();
    setMarkingAttendance(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Daily Logs</h1>
          <p className="text-slate-500">Real-time attendance matrix for {user?.profile?.branch}</p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <Calendar className="text-slate-500 ml-3" size={16} />
          <input 
            type="date"
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-400 bg-transparent outline-none border-none transition-colors focus:text-emerald-400"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Check In/Out Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card bg-emerald-900/10 border-emerald-500/20 relative overflow-hidden p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">Status Control</p>
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">{format(new Date(), 'MMM dd, yyyy')}</h3>
              
              {currentUserAttendance ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex flex-col items-center text-center">
                  <div className="bg-emerald-500 text-slate-900 p-4 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-white font-bold text-lg uppercase tracking-wider">LOGGED IN</p>
                  <p className="text-emerald-400 text-xs font-mono mt-1">ENTRY TIME: {currentUserAttendance.timeIn}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    disabled={markingAttendance}
                    onClick={() => handleMarkAttendance('present')}
                    className="w-full bg-emerald-500 text-slate-900 py-5 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
                  >
                    {markingAttendance ? 'Syncing...' : 'Signal Presence'}
                  </button>
                  <button
                    disabled={markingAttendance}
                    onClick={() => handleMarkAttendance('absent')}
                    className="w-full bg-white/5 text-slate-400 border border-white/5 py-5 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Signal Absence
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card bg-slate-900/40 p-8">
            <div className="flex items-center gap-3 mb-8">
              <Clock size={16} className="text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-200 font-mono">Recent Logs</h3>
            </div>
            
            <div className="flex-1 space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-0.5 bg-emerald-500/30 h-10 rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-white/90 uppercase tracking-tighter">00:0{i} Day Relative</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">Verified @ 08:3{i} AM</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-10 text-[10px] font-bold text-emerald-400 flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-widest">
              Full Log History <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Global Attendance Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col p-0">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Active Branch Matrix</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{attendance.length} Verified Entries</span>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Personnel</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Signal</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Stamp</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Loc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={4} className="py-8 px-6"><div className="h-2 bg-white/5 rounded w-full" /></td></tr>)
                ) : attendance.length > 0 ? (
                  attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-2 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center font-bold text-slate-500 uppercase text-xs">
                            {record.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{record.userName || 'Unknown'}</p>
                            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">ID: {record.userId.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                          record.status === 'present' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : record.status === 'absent' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[10px] font-mono text-slate-400">{record.timeIn || '--:--'}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          <MapPin size={10} className="text-emerald-500/50" />
                          {record.branch}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="inline-flex flex-col items-center">
                        <History size={40} className="text-white/5 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active logs</p>
                        <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Awaiting personnel entry synchronization</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
