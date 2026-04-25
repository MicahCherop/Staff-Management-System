import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  PieChart as ChartIcon, 
  Download, 
  Filter, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';

const Reports = () => {
  const { isAdmin } = useAuth();
  const [reportType, setReportType] = useState('attendance');
  const [timeRange, setTimeRange] = useState('This Month');

  const attendanceData = [
    { name: 'Week 1', present: 95, late: 2, absent: 3 },
    { name: 'Week 2', present: 92, late: 5, absent: 3 },
    { name: 'Week 3', present: 98, late: 1, absent: 1 },
    { name: 'Week 4', present: 94, late: 3, absent: 3 },
  ];

  const leaveData = [
    { name: 'Jan', annual: 12, sick: 4, other: 2 },
    { name: 'Feb', annual: 8, sick: 12, other: 1 },
    { name: 'Mar', annual: 15, sick: 5, other: 5 },
    { name: 'Apr', annual: 20, sick: 3, other: 2 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Intelligence Hub</h1>
          <p className="text-slate-500">Generate and export organizational synchronization reports</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-transform">
            <Download size={16} />
            <span>Generate PDF</span>
          </button>
          <button className="p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-400">
            <FileSpreadsheet size={20} />
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-card bg-slate-900/40 p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Analytical Target</label>
          <div className="flex items-center gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5">
            <button 
              onClick={() => setReportType('attendance')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${reportType === 'attendance' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Attendance
            </button>
            <button 
              onClick={() => setReportType('leaves')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${reportType === 'leaves' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Leaves
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Temporal Window</label>
          <div className="relative">
            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40" size={16} />
            <select 
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest outline-none focus:border-emerald-500/30 transition-all appearance-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option className="bg-slate-900">This Week</option>
              <option className="bg-slate-900">This Month</option>
              <option className="bg-slate-900">Last Quarter</option>
              <option className="bg-slate-900">Full Year</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Operational Node</label>
          <div className="relative">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40" size={16} />
            <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest outline-none focus:border-emerald-500/30 transition-all appearance-none">
              <option className="bg-slate-900">All Branches</option>
              <option className="bg-slate-900">Nairobi HQ</option>
              <option className="bg-slate-900">Mombasa</option>
              <option className="bg-slate-900">Kisumu</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-1">Visualization Engine</p>
            <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Performance Aggregator</h3>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Primary Metric</span>
            </div>
          </div>
        </div>

        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            {reportType === 'attendance' ? (
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', color: '#64748b' }} />
                <Bar name="Present" dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Late" dataKey="late" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                <Bar name="Absent" dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={leaveData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', color: '#64748b' }} />
                <Line type="monotone" name="Annual" dataKey="annual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                <Line type="monotone" name="Sick" dataKey="sick" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                <Line type="monotone" name="Other" dataKey="other" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card bg-emerald-500 text-slate-900 border-none p-10 flex flex-col justify-between shrink-0 h-full min-h-[280px] shadow-[0_20px_50px_rgba(16,185,129,0.2)]">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-inner">
              <TrendingUp size={24} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-2">Efficiency Analysis</p>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Organization Thruput</h3>
            <p className="text-slate-900/70 text-sm leading-relaxed font-medium">Nairobi HQ shows a 4% increase in synchronization compared to previous segments.</p>
          </div>
          <button className="mt-8 flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest bg-slate-900 text-white px-6 py-4 rounded-2xl w-fit hover:scale-105 transition-all shadow-xl">
            Deep Drill <ArrowRight size={16} />
          </button>
        </div>

        <div className="lg:col-span-2 glass-card p-10 bg-slate-900/40">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-10 font-mono">Summary Matrix</h3>
          <div className="space-y-4">
            {[
              { label: 'Dominant Leave Segment', value: 'Annual Leave (42%)', sub: '+12% Rel Factor' },
              { label: 'Network Score', value: '94.2%', sub: 'Target: 95.0% - OK' },
              { label: 'Peak Connection Streak', value: 'Jane Doe (84 Cycles)', sub: 'Nairobi Node' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 group hover:bg-white/[0.05] transition-colors">
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">{row.label}</p>
                  <p className="text-white font-bold text-lg tracking-tight uppercase">{row.value}</p>
                </div>
                <p className="text-[9px] font-bold text-emerald-500/50 uppercase tracking-widest font-mono">{row.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
