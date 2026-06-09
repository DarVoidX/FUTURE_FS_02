import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/leads', icon: Users, label: 'Leads' },
  { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full flex-shrink-0"
      style={{
        background: 'rgba(12, 18, 32, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
          }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold text-white leading-tight">OrbitFlow</div>
              <div className="text-xs" style={{ color: '#00E5FF' }}>CRM</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive ? 'nav-item-active' : ''
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#00E5FF' : '#94A3B8',
              background: isActive
                ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(0, 229, 255, 0.04))'
                : 'transparent',
              border: isActive ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={19}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: isActive ? '#00E5FF' : '#94A3B8' }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div
        className="px-3 py-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
              color: 'white',
            }}
          >
            {user?.fullName?.[0] || user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <div className="text-xs font-semibold text-white truncate">
                  {user?.fullName || user?.username}
                </div>
                <div className="text-xs capitalize" style={{ color: '#00E5FF' }}>
                  {user?.role}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200"
          style={{ color: '#64748B' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-20"
        style={{
          background: '#121A2A',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#94A3B8',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
          e.currentTarget.style.color = '#00E5FF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = '#94A3B8';
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
