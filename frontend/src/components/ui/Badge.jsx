const statusConfig = {
  New: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
  Contacted: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
  Qualified: { color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.15)', border: 'rgba(0, 229, 255, 0.3)' },
  'Proposal Sent': { color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.15)', border: 'rgba(124, 58, 237, 0.3)' },
  Converted: { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
  Lost: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
};

const priorityConfig = {
  Low: { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' },
  Medium: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
  High: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
  Urgent: { color: '#FF4D4D', bg: 'rgba(255, 77, 77, 0.2)', border: 'rgba(255, 77, 77, 0.4)' },
};

const sourceConfig = {
  Website: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
  LinkedIn: { color: '#0077B5', bg: 'rgba(0, 119, 181, 0.15)', border: 'rgba(0, 119, 181, 0.3)' },
  Instagram: { color: '#E1306C', bg: 'rgba(225, 48, 108, 0.15)', border: 'rgba(225, 48, 108, 0.3)' },
  Referral: { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
  'Email Campaign': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
  Facebook: { color: '#1877F2', bg: 'rgba(24, 119, 242, 0.15)', border: 'rgba(24, 119, 242, 0.3)' },
  'Cold Outreach': { color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.15)', border: 'rgba(124, 58, 237, 0.3)' },
  Other: { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' },
};

const Badge = ({ type = 'status', value, className = '' }) => {
  let config;

  if (type === 'status') config = statusConfig[value];
  else if (type === 'priority') config = priorityConfig[value];
  else if (type === 'source') config = sourceConfig[value];

  if (!config) config = { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      {type === 'priority' && value === 'Urgent' && <span className="mr-1 animate-pulse">🔴</span>}
      {value}
    </span>
  );
};

export { statusConfig, priorityConfig, sourceConfig };
export default Badge;
