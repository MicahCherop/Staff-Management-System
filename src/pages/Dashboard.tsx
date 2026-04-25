import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService, attendanceService, leaveService } from '../services/db';
import { 
  Users, 
  UserCheck, 
  UserX, 
  CalendarClock, 
  TrendingUp, 
  MapPin,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [stats, setStats] = useState({
    totalStaff: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
  });
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState(user?.profile?.branch || 'All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const branch = branchFilter === 'All' ? undefined : branchFilter;
      
      const [allUsers, todayAttendance, allLeaves] = await Promise.all([
        userService.getUsers(branch),
        attendanceService.getAttendance(format(new Date(), 'yyyy-MM-dd'), branch),
        leaveService.getLeaves(branch)
      ]);

      const activeUsers = allUsers || [];
      const attendance = todayAttendance || [];
      const leaves = allLeaves || [];

      setStats({
        totalStaff: activeUsers.length,
        present: attendance.filter((a: any) => a.status === 'present').length,
        absent: attendance.filter((a: any) => a.status === 'absent').length,
        onLeave: attendance.filter((a: any) => a.status === 'leave').length,
      });
      setLoading(false);
    };

    fetchData();
  }, [branchFilter]);

  const kpis = [
    { name: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'bg-blue-500', trend: '+2% from last month' },
    { name: 'Present Today', value: stats.present, icon: UserCheck, color: 'bg-emerald-500', trend: '92% attendance rate' },
    { name: 'Absent Today', value: stats.absent, icon: UserX, color: 'bg-rose-500', trend: 'Requires follow up' },
    { name: 'On Leave', value: stats.onLeave, icon: CalendarClock, color: 'bg-amber-500', trend: '3 pending requests' },
  ];

  const chartData = [
    { name: 'Mon', present: 45, absent: 5 },
    { name: 'Tue', present: 48, absent: 2 },
    { name: 'Wed', present: 42, absent: 8 },
    { name: 'Thu', present: 50, absent: 0 },
    { name: 'Fri', present: 47, absent: 3 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500">Real-time attendance and staff metrics for {branchFilter} branch</p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {['All', 'Nairobi', 'Mombasa', 'Kisumu'].map(b => (
              <button
                key={b}
                onClick={() => setBranchFilter(b)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  branchFilter === b 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`${kpi.color} p-3 rounded-2xl text-white shadow-lg`}>
                <kpi.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp size={14} />
                <span>8%</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{kpi.name}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{kpi.value}</h3>
            <p className="text-xs text-slate-400 font-medium">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">Weekly Attendance Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-xs text-slate-500 font-medium">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full" />
                <span className="text-xs text-slate-500 font-medium">Absent</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="present" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                <Bar dataKey="absent" fill="#e2e8f0" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Staff by Branch</h3>
          <div className="flex-1 space-y-6">
            {[
              { name: 'Nairobi HQ', count: 124, color: '#6366f1' },
              { name: 'Mombasa', count: 56, color: '#10b981' },
              { name: 'Kisumu', count: 32, color: '#f59e0b' },
            ].map(branch => (
              <div key={branch.name} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">{branch.name}</span>
                  <span className="text-xs font-bold text-slate-400">{branch.count} staff</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${(branch.count / 212) * 100}%`, backgroundColor: branch.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-100 transition-all text-sm">
            Detailed Branch Report
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
