/* ─── Status configs ─── */
const STATUS = {
  New:            { cls: 'status-new',       dot: 'var(--color-blue)' },
  Contacted:      { cls: 'status-contacted', dot: 'var(--color-warning)' },
  Qualified:      { cls: 'status-qualified', dot: 'var(--color-purple)' },
  'Proposal Sent':{ cls: 'status-proposal',  dot: 'var(--color-teal)' },
  Converted:      { cls: 'status-converted', dot: 'var(--color-success)' },
  Lost:           { cls: 'status-lost',      dot: 'var(--color-danger)' },
};

const PRIORITY = {
  Low:    { cls: 'priority-low',    dot: 'var(--text-muted)' },
  Medium: { cls: 'priority-medium', dot: 'var(--color-warning)' },
  High:   { cls: 'priority-high',   dot: 'var(--color-danger)' },
  Urgent: { cls: 'priority-urgent', dot: 'var(--color-danger)' },
};

const SOURCE_COLOR = {
  Website:         'var(--color-blue)',
  LinkedIn:        'var(--color-purple)',
  Instagram:       'var(--color-accent)',
  Referral:        'var(--color-success)',
  'Email Campaign':'var(--color-warning)',
  Facebook:        'var(--color-blue)',
  'Cold Outreach': 'var(--color-purple)',
  Other:           'var(--text-muted)',
};

const Badge = ({ type = 'status', value, className = '' }) => {
  let config;

  if (type === 'status') {
    config = STATUS[value];
    if (!config) config = { cls: 'priority-low', dot: '#9CA3AF' };
    return (
      <span className={`badge ${config.cls} ${className}`}>
        <span className="badge-dot" style={{ background: config.dot }} />
        {value}
      </span>
    );
  }

  if (type === 'priority') {
    config = PRIORITY[value];
    if (!config) config = { cls: 'priority-low', dot: '#9CA3AF' };
    return (
      <span className={`badge ${config.cls} ${className}`}>
        {value === 'Urgent' && <span className="text-[10px] leading-none">●</span>}
        {value}
      </span>
    );
  }

  if (type === 'source') {
    const color = SOURCE_COLOR[value] || '#9CA3AF';
    return (
      <span
        className={`badge ${className}`}
        style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}
      >
        {value}
      </span>
    );
  }

  return <span className={`badge priority-low ${className}`}>{value}</span>;
};

export { STATUS, PRIORITY, SOURCE_COLOR };
export default Badge;
