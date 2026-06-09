import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, X, CheckCheck, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getLeads } from '../../api/leads';
import { formatDistanceToNow } from 'date-fns';

const Header = ({ pageTitle }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead, clearNotifications } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await getLeads({ search: q, limit: 5 });
        setSearchResults(data.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectResult = (lead) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    navigate(`/leads/${lead._id}`);
  };

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-6 py-4 flex-shrink-0"
      style={{
        background: 'rgba(10, 15, 28, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-white">{pageTitle}</h1>
        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                initial={{ width: 40, opacity: 0.5 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    color: 'white',
                  }}
                />
                <button
                  onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X size={14} className="text-slate-500" />
                </button>

                {/* Results dropdown */}
                <AnimatePresence>
                  {(searchResults.length > 0 || searching) && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full mt-2 w-full rounded-xl overflow-hidden z-50"
                      style={{
                        background: '#121A2A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                      }}
                    >
                      {searching ? (
                        <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                      ) : (
                        searchResults.map((lead) => (
                          <button
                            key={lead._id}
                            onClick={() => handleSelectResult(lead)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', color: 'white' }}
                            >
                              {lead.fullName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">{lead.fullName}</div>
                              <div className="text-xs text-slate-500 truncate">{lead.company || lead.email}</div>
                            </div>
                            <ChevronRight size={14} className="text-slate-600 flex-shrink-0" />
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowSearch(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <Search size={16} className="text-slate-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllRead();
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Bell size={16} className="text-slate-400" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: '#EF4444', color: 'white' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
                style={{
                  background: '#121A2A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <>
                        <button onClick={markAllRead} className="text-xs text-slate-500 hover:text-accent transition-colors">
                          <CheckCheck size={14} />
                        </button>
                        <button onClick={clearNotifications} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-slate-600" />
                      <p className="text-sm text-slate-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex gap-3 px-4 py-3 transition-colors"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                          style={{ background: 'rgba(0, 229, 255, 0.1)' }}
                        >
                          {notif.icon || '🔔'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.message}</p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={() => navigate('/settings')}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', color: 'white' }}
          >
            {user?.fullName?.[0] || user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="text-xs font-medium text-white hidden sm:block">
            {user?.fullName || user?.username}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
