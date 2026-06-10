import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'default', suffix = '', trend, trendValue, delay = 0 }) => {
  const colorMap = {
    default: { icon: 'var(--text-muted)', dot: 'var(--border-color-medium)' },
    accent:  { icon: 'var(--color-accent)', dot: 'var(--color-accent)' },
    success: { icon: 'var(--color-success)', dot: 'var(--color-success)' },
    warning: { icon: 'var(--color-warning)', dot: 'var(--color-warning)' },
    danger:  { icon: 'var(--color-danger)', dot: 'var(--color-danger)' },
    blue:    { icon: 'var(--color-blue)', dot: 'var(--color-blue)' },
    purple:  { icon: 'var(--color-purple)', dot: 'var(--color-purple)' },
  };

  const c = colorMap[color] || colorMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.4, 0, 0.2, 1] }}
      className="kpi-block group"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle colored indicator line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${c.dot}40, transparent)` }}
      />

      {/* Icon + trend row */}
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--background-cream)', border: '1px solid var(--border-color-medium)' }}
        >
          <Icon size={16} style={{ color: c.icon }} strokeWidth={2} />
        </div>

        {trend !== undefined && (
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={
              trend >= 0
                ? { background: 'var(--color-success-dim)', color: 'var(--color-success)' }
                : { background: 'var(--color-danger-dim)', color: 'var(--color-danger)' }
            }
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trendValue ?? trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <div
          className="kpi-value"
          style={{
            color: 'var(--text-primary)',
            ...( `${value}${suffix}`.length > 4 && { fontSize: '2rem' } )
          }}
        >
          {value}{suffix}
        </div>
        <div className="kpi-label mt-2">{title}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
