import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Phone, Star, CheckCircle2, XCircle,
  TrendingUp, Plus, ArrowRight, Loader2, ArrowUpRight,
  Zap, Target, Calendar, Clock, ChevronRight, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import { getAnalytics, getLeads } from '../api/leads';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { padMonthlyData } from '../utils/chartUtils';

/* ── Tiny helpers ─────────────────────────────────────────── */
const fmt = n => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n ?? 0);
const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);

/* ── Color Themes for Charts ───────────────────────────────── */
const SOURCE_COLORS = {
  Website: 'var(--color-blue)',
  LinkedIn: 'var(--color-purple)',
  Instagram: 'var(--color-accent)',
  Referral: 'var(--color-success)',
  'Email Campaign': 'var(--color-warning)',
  Facebook: 'var(--color-blue)',
  'Cold Outreach': 'var(--color-purple)',
  Other: 'var(--text-muted)'
};

const PRIORITY_COLORS = {
  Low: 'var(--text-muted)',
  Medium: 'var(--color-warning)',
  High: 'var(--color-danger)',
  Urgent: 'var(--color-accent)'
};



/* ── Custom tooltip ───────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs shadow-xl"
      style={{ background: 'var(--background-white)', border: '1px solid var(--border-color-medium)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name.toLowerCase() === 'leads' ? 'Leads' : 'Converted'}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Solid StatCard ───────────────────────────────── */
const GlassStatCard = ({ title, value, icon: Icon, suffix = '', change, colorName, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 group cursor-default"
    style={{
      background: 'var(--background-white)',
      border: '1px solid var(--border-color-medium)',
      boxShadow: 'var(--shadow-ambient)',
    }}
  >
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: `var(--color-${colorName}-dim)`,
          border: `1px solid var(--border-color-medium)`
        }}
      >
        <Icon size={15} style={{ color: `var(--color-${colorName})` }} />
      </div>
      {change !== undefined && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: change >= 0 ? 'var(--color-success-dim)' : 'var(--color-danger-dim)',
            color: change >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
            border: `1px solid ${change >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`
          }}
        >
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-3xl font-extrabold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
        {fmt(value)}{suffix}
      </p>
      <p className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{title}</p>
    </div>
  </motion.div>
);

// Ring progress component removed

/* ════════════════════════════════════════════════════════════
   Dashboard Component
═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [a, l] = await Promise.all([getAnalytics(), getLeads({ limit: 5, sort: '-createdAt' })]);
        setAnalytics(a.data);
        setRecentLeads(l.data || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <Layout pageTitle="Dashboard">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={22} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    </Layout>
  );

  const statCards = analytics ? [
    { title: 'Total Leads',     value: analytics.totalLeads,     icon: Users,        colorName: 'blue',    delay: 0    },
    { title: 'New This Month',  value: analytics.newLeads,       icon: UserPlus,     colorName: 'purple',  delay: 0.05 },
    { title: 'Contacted',       value: analytics.contactedLeads, icon: Phone,        colorName: 'warning', delay: 0.10 },
    { title: 'Qualified',       value: analytics.qualifiedLeads, icon: Star,         colorName: 'teal',    delay: 0.15 },
    { title: 'Converted',       value: analytics.convertedLeads, icon: CheckCircle2, colorName: 'success', delay: 0.20 },
    { title: 'Lost',            value: analytics.lostLeads,      icon: XCircle,      colorName: 'danger',  delay: 0.25 },
    { title: 'Conv. Rate',      value: analytics.conversionRate, icon: TrendingUp,   colorName: 'teal',    delay: 0.30, suffix: '%' },
  ] : [];

  const pipelineStages = analytics?.pipeline ? Object.entries(analytics.pipeline) : [];
  const totalLeads = analytics?.totalLeads || 1;

  const stageColors = {
    New: '#1B243B', Contacted: '#E0A926', Qualified: '#2E7D72',
    'Proposal Sent': '#E8A598', Converted: '#0C5043', Lost: '#D94E4E'
  };

  const chartData = padMonthlyData(
    analytics?.monthlyGrowth || [],
    analytics?.totalLeads || 0,
    analytics?.conversionRate || 0
  );

  const dynamicInsights = [];
  if (analytics) {
    if (analytics.newLeads > 0) {
      dynamicInsights.push({
        icon: Zap,
        text: `${analytics.newLeads} new lead${analytics.newLeads > 1 ? 's' : ''} awaiting response — follow up now.`,
        color: '#D94E4E'
      });
    }
    if (analytics.proposalLeads > 0) {
      dynamicInsights.push({
        icon: Target,
        text: `${analytics.proposalLeads} active proposal${analytics.proposalLeads > 1 ? 's' : ''} in pipeline. High conversion probability.`,
        color: '#2E7D72'
      });
    }
    if (analytics.conversionRate > 0) {
      dynamicInsights.push({
        icon: Sparkles,
        text: `Lead conversion rate is at ${analytics.conversionRate}% this month. Great performance!`,
        color: '#E8A598'
      });
    }
  }
  if (dynamicInsights.length === 0) {
    dynamicInsights.push({
      icon: Sparkles,
      text: 'No dynamic insights available. Add more leads and advance them through pipeline stages.',
      color: '#2E7D72'
    });
  }

  return (
    <Layout pageTitle="Dashboard" pageSubtitle={format(now, 'EEEE, MMMM d, yyyy')}>
      <div className="space-y-6 pb-8">

        {/* ─── Hero Greeting ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display leading-none mb-1.5"
              style={{ color: 'var(--text-primary)' }}>
              {greeting},&nbsp;
              <span style={{ color: 'var(--color-accent)' }}>{user?.fullName?.split(' ')[0] || user?.username || 'Admin'}</span> 👋
            </h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Here's your OrbitFlow CRM overview for today.
            </p>
          </div>
          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => navigate('/leads')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: '10px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,90,80,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent-dim)'}
            >
              <Plus size={15} /> New Lead
            </button>
          </div>
        </motion.div>

        {/* ─── KPI Stat Cards ────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {statCards.map(s => <GlassStatCard key={s.title} {...s} />)}
        </div>

        {/* ─── Row 2: Area Chart + Pipeline ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Area Chart — 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="lg:col-span-3 card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Lead Trends</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Month-over-month growth</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#D94E4E' }} />
                  Leads
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#0C5043' }} />
                  Converted
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gLead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-teal)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-teal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color-medium)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="var(--color-accent)" strokeWidth={2.5} fill="url(#gLead)" dot={false} />
                <Area type="monotone" dataKey="converted" name="Converted" stroke="var(--color-teal)" strokeWidth={2.5} fill="url(#gConv)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pipeline Funnel — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Pipeline</p>
              <button onClick={() => navigate('/pipeline')}
                className="text-xs font-semibold flex items-center gap-1 transition-colors"
                style={{ color: '#FF6B57' }}>
                Board <ArrowRight size={11} />
              </button>
            </div>
            <div className="space-y-3.5">
              {pipelineStages.map(([stage, count], i) => {
                const p = pct(count, totalLeads);
                const color = stageColors[stage] || '#66625C';
                return (
                  <motion.div key={stage}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.05 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tabular-nums" style={{ color }}>{count}</span>
                        <span className="text-[10px]" style={{ color: '#66625C' }}>{p}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${p}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: [0.4,0,0.2,1] }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ─── Row 3: Recent Leads + AI Insights ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Recent Leads — 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="lg:col-span-7 card overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Recent Leads</p>
              <button onClick={() => navigate('/leads')}
                className="text-xs font-semibold flex items-center gap-1 font-sans transition-colors"
                style={{ color: '#FF6B57' }}>
                View all <ArrowRight size={11} />
              </button>
            </div>
            <div className="flex-1 divide-y divide-[rgba(0,0,0,0.04)] dark:divide-[rgba(255,255,255,0.04)]">
              {recentLeads.length === 0 ? (
                <div className="py-16 text-center">
                  <Users size={22} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No leads yet</p>
                  <button onClick={() => navigate('/leads')} className="btn-primary btn-sm mt-3">
                    <Plus size={12} /> Add lead
                  </button>
                </div>
              ) : recentLeads.slice(0, 5).map((lead, i) => (
                <motion.button
                  key={lead._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left group transition-all duration-150 hover:bg-[rgba(255,107,87,0.03)]"
                  style={{ background: 'transparent' }}
                >
                  <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,107,87,0.1)', color: '#FF6B57' }}>
                    {(lead.fullName || '?')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-text-1">{lead.fullName}</p>
                    <p className="text-xs truncate mt-0.5 text-text-2">
                      {lead.company || lead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge type="status" value={lead.status} />
                    <ChevronRight size={13} className="opacity-0 group-hover:opacity-60 transition-opacity text-text-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & AI Insights — 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-5 card p-6 flex flex-col relative overflow-hidden"
            style={{
              background: 'var(--background-cream)',
              border: '1px solid var(--color-accent-border)',
              boxShadow: 'var(--shadow-ambient)',
            }}
          >
            {/* Background glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', filter: 'blur(20px)' }} />
            
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)' }}>
                <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
              </div>
              <p className="text-base font-bold text-text-1">Quick Actions & CRM Tips</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
                style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}>
                LIVE
              </span>
            </div>

            <div className="space-y-3.5 flex-1">
              {dynamicInsights.map((ins, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}15` }}
                >
                  <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ins.color}15`, border: `1px solid ${ins.color}25` }}>
                    <ins.icon size={13} style={{ color: ins.color }} />
                  </div>
                  <p className="text-[13px] leading-relaxed font-semibold text-text-1">{ins.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
              <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider">
                ✦ Powered by OrbitFlow Engine · Updated just now
              </p>
            </div>
          </motion.div>
        </div>

        {/* ─── Row 4: Leads by Source + Leads by Priority ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Leads by Source (Real Data) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-base font-bold text-text-1">Leads by Source</p>
                <p className="text-xs text-text-3 mt-0.5">Distribution across acquisition channels</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-text-2">
                Real-time
              </span>
            </div>
            
            {(!analytics?.sourceStats || analytics.sourceStats.length === 0) ? (
              <div className="py-10 text-center text-xs text-text-3">No source statistics available</div>
            ) : (
              <div className="space-y-4">
                {analytics.sourceStats.slice(0, 4).map((s, i) => {
                  const name = s._id || 'Other';
                  const count = s.count || 0;
                  const total = analytics?.totalLeads || 1;
                  const pct = Math.min(100, Math.round((count / total) * 100));
                  const color = SOURCE_COLORS[name] || '#888888';
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-xs font-semibold text-text-2">{name}</span>
                        </div>
                        <span className="text-xs font-bold text-text-1 tabular-nums">{count} lead{count > 1 ? 's' : ''} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.6 + i * 0.05 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Leads by Priority (Real Data) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-base font-bold text-text-1">Leads by Priority</p>
                <p className="text-xs text-text-3 mt-0.5">Lead concentration by ticket priority</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-text-2">
                Real-time
              </span>
            </div>

            {(!analytics?.priorityStats || analytics.priorityStats.length === 0) ? (
              <div className="py-10 text-center text-xs text-text-3">No priority statistics available</div>
            ) : (
              <div className="space-y-4">
                {['Urgent', 'High', 'Medium', 'Low'].map((level, i) => {
                  const match = analytics.priorityStats.find(p => (p._id || '').toLowerCase() === level.toLowerCase());
                  const count = match ? match.count : 0;
                  const total = analytics?.totalLeads || 1;
                  const pct = Math.min(100, Math.round((count / total) * 100));
                  const color = PRIORITY_COLORS[level] || '#888888';
                  return (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-xs font-semibold text-text-2">{level}</span>
                        </div>
                        <span className="text-xs font-bold text-text-1 tabular-nums">{count} lead{count > 1 ? 's' : ''} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.65 + i * 0.05 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
