import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'accent', delay = 0, suffix = '' }) => {
  const colorMap = {
    accent: { bg: 'rgba(0, 229, 255, 0.1)', border: 'rgba(0, 229, 255, 0.2)', text: '#00E5FF', glow: 'rgba(0, 229, 255, 0.15)' },
    success: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', text: '#22C55E', glow: 'rgba(34, 197, 94, 0.15)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', glow: 'rgba(239, 68, 68, 0.15)' },
    purple: { bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.2)', text: '#7C3AED', glow: 'rgba(124, 58, 237, 0.15)' },
    blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6', glow: 'rgba(59, 130, 246, 0.15)' },
  };

  const c = colorMap[color] || colorMap.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{
        background: 'rgba(18, 26, 42, 0.8)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${c.glow}`,
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at top right, ${c.bg} 0%, transparent 60%)`,
        }}
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Icon size={22} style={{ color: c.text }} />
          </div>

          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                trend > 0
                  ? 'bg-green-500/10 text-green-400'
                  : trend < 0
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-slate-500/10 text-slate-400'
              }`}
            >
              {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {Math.abs(trendValue || trend)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <motion.div
            className="text-3xl font-bold"
            style={{ color: c.text }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}{suffix}
          </motion.div>
          <div className="text-sm font-medium" style={{ color: '#94A3B8' }}>
            {title}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
