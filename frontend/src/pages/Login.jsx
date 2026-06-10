import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  useEffect(() => {
    const originalTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
    return () => {
      if (originalTheme) {
        document.documentElement.setAttribute('data-theme', originalTheme);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const skipStart = () => {
      try {
        video.playbackRate = 0.55;
      } catch (err) {
        console.warn("Failed to set video playbackRate:", err);
      }

      // Only skip if near the very beginning
      if (video.currentTime < 1.5) {
        video.currentTime = 1.5;
      }
    };

    // Seek back before end to create a seamless loop (no freeze gap)
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 1.5) {
        video.currentTime = 1.5;
      }
    };

    // Handle race condition: metadata might already be available
    if (video.readyState >= 1) {
      skipStart();
    } else {
      video.addEventListener('loadedmetadata', skipStart);
    }

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('loadedmetadata', skipStart);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'var(--background-base)' }}
    >
      {/* ─── Left Panel: Branding ─── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] flex-shrink-0 p-10 relative overflow-hidden z-10"
        style={{ background: 'var(--background-cream)', borderRight: '1px solid var(--border-color-medium)' }}
      >
        {/* Seamless looping background video — full vibrancy, no fog */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            transform: 'scale(1.3)',
            transformOrigin: 'center',
            filter: 'contrast(1.15) saturate(1.25) brightness(1.05)',
          }}
        >
          <source src="/bag.mp4" type="video/mp4" />
        </video>

        {/* Semi-transparent light dark overlay to maximize video color vibrancy */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />

        {/* Subtle vignette at bottom only — keeps stats readable and adds depth */}
        <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#121212', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 6px 16px rgba(0,0,0,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
              <ellipse cx="12" cy="12" rx="9" ry="3.2" transform="rotate(-30 12 12)" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="12" cy="12" rx="9" ry="3.2" transform="rotate(45 12 12)" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight-2 font-display" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)' }}>OrbitFlow CRM</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <h2
            className="font-extrabold leading-none tracking-tighter-2 mb-6 font-display"
            style={{ fontSize: '3rem', color: '#FFFFFF' }}
          >
            <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.5)' }}>Close more.</span><br />
            <span className="text-gradient-coral font-display">Do less.</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#FFFFFF', maxWidth: '300px', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.75)', fontWeight: 500 }}>
            The modern CRM for agencies and consultants who want to focus on clients, not spreadsheets.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-5 relative z-10"
        >
          {[
            { val: '3×', label: 'Faster pipeline' },
            { val: '94%', label: 'Retention rate' },
            { val: '₹999', label: 'Per month' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-lg font-bold tracking-tight-2 text-white font-display" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.75)' }}>{s.val}</div>
              <div className="text-[10px] mt-0.5 leading-none" style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 2px 3px rgba(0,0,0,0.75)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── Right Panel: Form ─── */}
      <div 
        className="flex-1 flex items-center justify-center lg:justify-start p-8 lg:pl-36 relative overflow-hidden bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/anime.png")' }}
      >
        {/* Minimal overlay to let the anime character pop */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div
            className="card p-8 sm:p-10 animate-float-smooth shadow-2xl"
            style={{ borderRadius: '24px', background: 'var(--background-cream)' }}
          >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#121212', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
                <ellipse cx="12" cy="12" rx="9" ry="3.2" transform="rotate(-30 12 12)" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="12" cy="12" rx="9" ry="3.2" transform="rotate(45 12 12)" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>OrbitFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight-2 mb-1.5 font-display" style={{ color: 'var(--text-primary)' }}>Sign in</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Username</label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="input"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full py-2.5 mt-2"
              disabled={loading}
              whileTap={{ scale: 0.99 }}
            >
              {loading
                ? <Loader2 size={15} className="animate-spin" />
                : <><span>Continue</span><ArrowRight size={14} /></>
              }
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-6 px-4 py-3.5 rounded-xl"
            style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
              Demo access
            </p>
            <div className="space-y-1">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Username — <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>admin</span>
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Password — <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>Admin@2026</span>
              </p>
            </div>
          </div>
          <p className="text-center mt-8 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            © 2026 OrbitFlow. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default Login;
