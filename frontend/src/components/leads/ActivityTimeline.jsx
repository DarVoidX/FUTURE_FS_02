import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Plus, GitBranch, MessageSquare, CheckCircle2, Bell, PenLine, User
} from 'lucide-react';

const activityConfig = {
  created: { icon: User, color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.1)', label: 'Lead Created' },
  status_changed: { icon: GitBranch, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', label: 'Status Changed' },
  note_added: { icon: PenLine, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', label: 'Note Added' },
  followup_added: { icon: Bell, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Follow-up Added' },
  converted: { icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)', label: 'Converted' },
  updated: { icon: PenLine, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)', label: 'Updated' },
};

const ActivityTimeline = ({ activities = [] }) => {
  if (!activities.length) {
    return (
      <div className="text-center py-8">
        <MessageSquare size={32} className="mx-auto mb-3 text-slate-600" />
        <p className="text-sm text-slate-500">No activity yet</p>
      </div>
    );
  }

  const sorted = [...activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, rgba(0, 229, 255, 0.2), transparent)' }}
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
                style={{ background: config.bg, border: `1px solid ${config.color}30` }}
              >
                <Icon size={14} style={{ color: config.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white leading-snug">{activity.description}</p>
                    {activity.oldValue && activity.newValue && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full text-slate-400"
                          style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                          {activity.oldValue}
                        </span>
                        <span className="text-xs text-slate-500">→</span>
                        <span className="text-xs px-2 py-0.5 rounded-full text-slate-400"
                          style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                          {activity.newValue}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 flex-shrink-0 mt-0.5">
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
