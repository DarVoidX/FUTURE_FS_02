import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back! 🚀');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0A0F1C' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
              boxShadow: '0 0 40px rgba(0, 229, 255, 0.3)',
            }}
          >
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">OrbitFlow</h1>
          <p className="mt-1 text-sm" style={{ color: '#00E5FF' }}>CRM Platform</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(18, 26, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0, 229, 255, 0.04)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-sm" style={{ color: '#94A3B8' }}>
              Sign in to your CRM dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label-field">Username</label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748B' }}
                />
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  className="input-field pl-10"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748B' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#64748B' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary w-full justify-center py-3 mt-2 rounded-xl text-sm font-semibold"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-6 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.1)' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#00E5FF' }}>Demo Credentials</p>
            <div className="space-y-1">
              <p className="text-xs" style={{ color: '#94A3B8' }}>
                Username: <span className="text-white font-mono">admin</span>
              </p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>
                Password: <span className="text-white font-mono">Admin@2026</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs" style={{ color: '#475569' }}>
          © 2026 OrbitFlow CRM. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
