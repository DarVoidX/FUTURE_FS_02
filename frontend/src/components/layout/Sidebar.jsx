import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, GitBranch, BarChart3, Settings,
  LogOut, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/leads',     icon: Users,           label: 'Leads'     },
  { path: '/pipeline',  icon: GitBranch,       label: 'Pipeline'  },
  { path: '/analytics', icon: BarChart3,       label: 'Analytics' },
  { path: '/settings',  icon: Settings,        label: 'Settings'  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = (user?.fullName || user?.username || 'A')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full flex-shrink-0 z-10"
      style={{
        background: 'var(--background-cream)',
        borderRight: '1px solid var(--border-color-medium)',
      }}
    >
      {/* ─── Logo ─── */}
      <div className="flex items-center gap-3.5 px-5 py-6 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#121212', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
            <ellipse cx="12" cy="12" rx="9" ry="3.2" transform="rotate(-30 12 12)" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="12" cy="12" rx="9" ry="3.2" transform="rotate(45 12 12)" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <span className="text-base font-extrabold text-text-1 tracking-tight-2 leading-none font-display">
                OrbitFlow
              </span>
              <span className="block text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                CRM Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Nav ─── */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2 : 1.75}
                  className={`nav-icon flex-shrink-0 ${isActive ? '!text-accent' : ''}`}
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[15px] font-semibold font-sans"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ─── User ─── */}
      <div className="px-2.5 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border-color)' }}>
        {/* Avatar row */}
        <div
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-1 ${collapsed ? 'justify-center' : ''}`}
          style={{ background: 'var(--background-darker-sand)' }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}>
            {initials}
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-bold text-text-1 truncate tracking-snug-2">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`nav-link w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} strokeWidth={1.75} className="nav-icon flex-shrink-0 text-red-500/60" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500/70"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ─── Collapse toggle ─── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-20 transition-all duration-200"
        style={{
          background: 'var(--background-white)',
          border: '1px solid var(--border-color-medium)',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow-ambient)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color-medium)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
