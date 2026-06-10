import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, X, CheckCheck, Trash2, ChevronRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getLeads } from '../../api/leads';
import { formatDistanceToNow } from 'date-fns';

const Header = ({ pageTitle, pageSubtitle }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead, clearNotifications } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await getLeads({ search: q, limit: 6 });
        setSearchResults(data.data || []);
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 280);
  };

  const handleSelectResult = (lead) => {
    setSearchQuery(''); setSearchResults([]); setShowSearch(false);
    navigate(`/leads/${lead._id}`);
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]); setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-7 py-4 flex-shrink-0"
      style={{
        background: 'var(--background-cream)',
        borderBottom: '1px solid var(--border-color-medium)',
        position: 'sticky',
        top: 0,
        zIndex: 8,
      }}
    >
      {/* Left: page title */}
      <div>
        <h1 className="text-[28px] font-extrabold text-text-1 tracking-tight-2 font-display">{pageTitle}</h1>
        {pageSubtitle && (
          <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>{pageSubtitle}</p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">

        {/* ─── Search ─── */}
        <div ref={searchRef} className="relative">
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                initial={{ width: 36, opacity: 0.6 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 36, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search leads…"
                  className="input pl-8 pr-8 py-2 text-xs"
                  style={{ borderColor: 'var(--color-accent-border)', boxShadow: '0 0 0 3px var(--color-accent-dim)' }}
                />
                <button
                  onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X size={12} style={{ color: 'var(--text-muted)' }} />
                </button>

                {/* Results */}
                <AnimatePresence>
                  {(searchResults.length > 0 || searching) && (
                    <motion.div
                       initial={{ opacity: 0, y: 4 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 4 }}
                       transition={{ duration: 0.12 }}
                       className="absolute top-full mt-1.5 w-full rounded-xl overflow-hidden z-50"
                       style={{
                         background: 'var(--background-white)',
                         border: '1px solid var(--border-color-medium)',
                         boxShadow: 'var(--shadow-hover)',
                       }}
                    >
                      {searching ? (
                        <div className="p-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>Searching…</div>
                      ) : searchResults.map(lead => (
                        <button
                          key={lead._id}
                          onClick={() => handleSelectResult(lead)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100"
                          style={{ borderBottom: '1px solid var(--border-color)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
                            {lead.fullName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text-1 truncate">{lead.fullName}</p>
                            <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{lead.company || lead.email}</p>
                          </div>
                          <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="btn-icon btn-secondary"
                title="Search"
              >
                <Search size={14} />
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Notifications ─── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
            className="btn-icon btn-secondary relative"
            title="Notifications"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: '#EF4444', color: 'white' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'var(--background-white)',
                  border: '1px solid var(--border-color-medium)',
                  boxShadow: 'var(--shadow-float)',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-xs font-semibold text-text-1">Notifications</span>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && <>
                      <button onClick={markAllRead} className="btn-ghost btn-sm p-1"><CheckCheck size={13} /></button>
                      <button onClick={clearNotifications} className="btn-ghost btn-sm p-1 text-red-500/60"><Trash2 size={13} /></button>
                    </>}
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell size={20} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                    </div>
                  ) : notifications.map(n => (
                    <div key={n.id} className="flex gap-3 px-4 py-3"
                      style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                        style={{ background: 'var(--color-accent-dim)' }}>
                        {n.icon || '🔔'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-1">{n.title}</p>
                        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Theme Toggle ─── */}
        <button
          onClick={toggleTheme}
          className="btn-icon btn-secondary"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* ─── Avatar ─── */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-150"
          style={{ background: 'var(--background-cream)', border: '1px solid var(--border-color)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--background-darker-sand)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--background-cream)'}
        >
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-semibold"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
            {(user?.fullName || user?.username || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <span className="text-xs font-medium text-text-1 hidden sm:block tracking-snug-2">
            {user?.fullName?.split(' ')[0] || user?.username}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
