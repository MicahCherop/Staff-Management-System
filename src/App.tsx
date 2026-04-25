import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Clock, 
  FileText, 
  Briefcase, 
  UserMinus, 
  PieChart, 
  LogOut,
  Menu,
  X,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Vacancies from './pages/Vacancies';
import ExitedStaff from './pages/ExitedStaff';
import Reports from './pages/Reports';
import Login from './pages/Login';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3, roles: ['admin', 'manager', 'staff'] },
    { name: 'Directory', path: '/directory', icon: Users, roles: ['admin', 'manager', 'staff'] },
    { name: 'Attendance', path: '/attendance', icon: Clock, roles: ['admin', 'manager', 'staff'] },
    { name: 'Leaves', path: '/leaves', icon: FileText, roles: ['admin', 'manager', 'staff'] },
    { name: 'Vacancies', path: '/vacancies', icon: Briefcase, roles: ['admin', 'manager'] },
    { name: 'Exited Staff', path: '/exited', icon: UserMinus, roles: ['admin', 'manager'] },
    { name: 'Reports', path: '/reports', icon: PieChart, roles: ['admin', 'manager'] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (isAdmin) return true;
    const userRole = user?.profile?.role || 'staff';
    return item.roles.includes(userRole);
  });

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/5 relative z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-xl text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Building2 size={24} />
          </div>
          <span className="font-bold text-lg text-white tracking-widest uppercase">MicroHR</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4">Operations</p>
          {filteredNavItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold shadow-[0_0_30px_rgba(16,185,129,0.05)] border border-emerald-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={location.pathname === item.path ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400 transition-colors'} />
              <span className="text-[11px] uppercase tracking-widest leading-none">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="glass-card bg-emerald-500/5 border-emerald-500/10 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {user?.profile?.displayName?.charAt(0) || user?.displayName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white uppercase truncate">{user?.displayName}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-tighter truncate">{user?.profile?.role || 'Staff'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 text-[9px] font-bold uppercase tracking-widest transition-all border border-white/5"
            >
              <LogOut size={12} />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        <header className="h-20 flex items-center justify-between px-8 glass border-b border-white/5 relative z-10 shrink-0">
          <button 
            className="md:hidden text-slate-400 p-2 hover:bg-white/5 rounded-xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-slate-600">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">System Time</p>
            <span className="text-[10px] font-mono text-emerald-500/60 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">{user?.profile?.branch || 'System'}</p>
              <p className="text-[9px] text-slate-600 uppercase tracking-[0.2em]">Operational Node</p>
            </div>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-10 h-10 border border-white/10 rounded-xl shadow-inner" />
            ) : (
              <div className="w-10 h-10 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 shadow-inner">
                <Building2 size={20} />
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-0">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 glass border-r border-white/10 z-[60] flex flex-col"
          >
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
                  <Building2 size={24} />
                </div>
                <span className="font-bold text-lg text-white tracking-widest uppercase">MicroHR</span>
              </div>
              <button 
                className="text-slate-500 p-2 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              {filteredNavItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
                    location.pathname === item.path
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-[11px] uppercase tracking-widest">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="p-8">
               <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/20"
              >
                <LogOut size={16} />
                <span>Disconnect</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] md:hidden"
        />
      )}
    </div>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/directory" element={<PrivateRoute><Directory /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />
          <Route path="/vacancies" element={<PrivateRoute><Vacancies /></PrivateRoute>} />
          <Route path="/exited" element={<PrivateRoute><ExitedStaff /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
