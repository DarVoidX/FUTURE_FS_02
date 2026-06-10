import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Plus, GitBranch, MessageSquare, CheckCircle2, Bell, PenLine, User
} from 'lucide-react';

const activityConfig = {
  created: { icon: User, color: 'var(--color-blue)', bg: 'var(--color-blue-dim)', label: 'Lead Created' },
  status_changed: { icon: GitBranch, color: 'var(--color-warning)', bg: 'var(--color-warning-dim)', label: 'Status Changed' },
  note_added: { icon: PenLine, color: 'var(--color-purple)', bg: 'var(--color-purple-dim)', label: 'Note Added' },
  followup_added: { icon: Bell, color: 'var(--color-teal)', bg: 'var(--color-teal-dim)', label: 'Follow-up Added' },
  converted: { icon: CheckCircle2, color: 'var(--color-success)', bg: 'var(--color-success-dim)', label: 'Converted' },
  updated: { icon: PenLine, color: 'var(--text-muted)', bg: 'rgba(0,0,0,0.03)', label: 'Updated' },
};

const ActivityTimeline = ({ activities = [] }) => {
  if (!activities.length) {
    return (
      <div className="text-center py-8">
        <MessageSquare size={32} className="mx-auto mb-3 text-text-3" />
        <p className="text-sm text-text-3">No activity yet</p>
      </div>
    );
  }

  const sorted = [...activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, var(--color-accent-border), transparent)' }}
      />

      <div className="space-y-4">
        {sorted.map((activity, index) => {
          const config = activityConfig[activity.type] || activityConfig.updated;
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4 pl-0"
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                style={{ background: config.bg, border: `1px solid var(--border-color)` }}
              >
                <Icon size={14} style={{ color: config.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-text-1 leading-snug">{activity.description}</p>
                    {activity.oldValue && activity.newValue && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full text-text-2 font-medium"
                          style={{ background: 'rgba(0,0,0,0.03)' }}>
                          {activity.oldValue}
                        </span>
                        <span className="text-xs text-text-3">→</span>
                        <span className="text-xs px-2 py-0.5 rounded-full text-text-2 font-medium"
                          style={{ background: 'var(--color-success-dim)' }}>
                          {activity.newValue}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-text-3 flex-shrink-0 mt-0.5">
                    {activity.createdAt
                      ? format(new Date(activity.createdAt), 'MMM d, h:mm a')
                      : '—'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
