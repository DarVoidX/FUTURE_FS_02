import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, Target, Users, CheckCircle2, UserPlus } from 'lucide-react';
import {
  ComposedChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import { getAnalytics } from '../api/leads';
import { padMonthlyData } from '../utils/chartUtils';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const SOURCE_COLORS = {
  Website: 'var(--color-blue)', LinkedIn: 'var(--color-purple)', Instagram: 'var(--color-accent)',
  Referral: 'var(--color-success)', 'Email Campaign': 'var(--color-warning)',
  Facebook: 'var(--color-blue)', 'Cold Outreach': 'var(--color-purple)', Other: 'var(--text-muted)',
};

const PIPELINE_COLORS = {
  New: 'var(--color-blue)', Contacted: 'var(--color-warning)', Qualified: 'var(--color-purple)',
  'Proposal Sent': 'var(--color-teal)', Converted: 'var(--color-success)', Lost: 'var(--color-danger)',
};

const PRIORITY_COLORS = {
  Low: 'var(--text-muted)',
  Medium: 'var(--color-warning)',
  High: 'var(--color-danger)',
  Urgent: 'var(--color-accent)',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3"
      style={{ background: 'var(--background-white)', border: '1px solid var(--border-color-medium)', boxShadow: 'var(--shadow-hover)' }}>
      <p className="text-sm font-semibold text-text-1 mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold tabular-nums">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="card p-6 hover:shadow-hover transition-all duration-300"
  >
    <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
      {title}
    </h3>
    {children}
  </motion.div>
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try { const d = await getAnalytics(); setAnalytics(d.data); }
      catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <Layout pageTitle="Analytics">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    </Layout>
  );

  const monthlyData = padMonthlyData(
    analytics?.monthlyGrowth || [],
    analytics?.totalLeads || 0,
    analytics?.conversionRate || 0
  );

  const sourceData = (analytics?.sourceStats || []).map(s => ({
    name: s._id || 'Other', value: s.count, color: SOURCE_COLORS[s._id] || 'var(--text-muted)',
  }));

  const pipelineData = analytics?.pipeline
    ? Object.entries(analytics.pipeline).map(([stage, count]) => ({
        stage, count, fill: PIPELINE_COLORS[stage] || 'var(--text-muted)',
      }))
    : [];

  const priorityData = (analytics?.priorityStats || []).map(p => ({
    name: p._id || 'Low', value: p.count, fill: PRIORITY_COLORS[p._id] || 'var(--text-muted)',
  }));

  return (
    <Layout pageTitle="Analytics" pageSubtitle="Performance at a glance">
      <div className="space-y-8 w-full">

        {/* ─── Top KPIs ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads"      value={analytics?.totalLeads || 0}      icon={Users}        color="default" delay={0}    />
          <StatCard title="New Leads"        value={analytics?.newLeads || 0}        icon={UserPlus}     color="default" delay={0.03} />
          <StatCard title="Converted"        value={analytics?.convertedLeads || 0}   icon={CheckCircle2} color="success" delay={0.06} />
          <StatCard title="Conversion Rate"  value={analytics?.conversionRate || 0}   icon={Target}       color="accent"  delay={0.09}  suffix="%" />
        </div>

        {/* ─── Charts Row 1 ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Monthly growth — 2 cols */}
          <div className="lg:col-span-2">
            <ChartCard title="Lead Growth & Conversion Rate" delay={0.12}>
              {monthlyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <svg className="mx-auto mb-2 opacity-40" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-sm font-semibold text-text-1">No growth trends yet</p>
                  <p className="text-xs text-text-muted">Add leads to see month-over-month performance statistics</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={monthlyData} margin={{ left: -20, right: -10 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color-medium)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar yAxisId="left" name="New Leads" dataKey="Leads" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={24} />
                    <Line yAxisId="right" name="Converted Leads" type="monotone" dataKey="Converted" stroke="var(--color-teal)" strokeWidth={3.5} dot={{ fill: 'var(--color-teal)', r: 4, stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--color-teal)', stroke: '#ffffff', strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Source pie — 1 col */}
          <ChartCard title="By Source" delay={0.2}>
            {sourceData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-xs" style={{ color: 'var(--text-muted)' }}>No data</div>
            ) : (
              <div className="space-y-3">
                <div className="relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      {/* Frosted Glass background track under the pie */}
                      <Pie data={[{value: 1}]} cx="50%" cy="50%" innerRadius={34} outerRadius={56} fill="rgba(0,0,0,0.01)" stroke="rgba(0,0,0,0.04)" strokeWidth={1} isAnimationActive={false} />
                      <Pie data={sourceData} cx="50%" cy="50%" innerRadius={36} outerRadius={54}
                        paddingAngle={2.5} dataKey="value">
                        {sourceData.map((e, i) => <Cell key={i} fill={e.color} stroke="#ffffff" strokeWidth={2} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Solid lens overlay in the center */}
                  <div className="absolute w-12 h-12 rounded-full border pointer-events-none flex flex-col items-center justify-center shadow-sm"
                    style={{ background: 'var(--background-white)', borderColor: 'var(--border-color-medium)' }}>
                    <span className="text-[9px] font-bold tracking-wider uppercase text-text-3 font-display">Source</span>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  {sourceData.slice(0, 5).map(s => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                      </div>
                      <span className="text-xs font-bold text-text-1 tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* ─── Charts Row 2 ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Pipeline bar */}
          <ChartCard title="Pipeline Breakdown" delay={0.25}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineData} layout="vertical" barSize={12} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="bar-New" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-blue)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-blue)" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="bar-Contacted" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="bar-Qualified" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-purple)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-purple)" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="bar-Proposal Sent" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-teal)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-teal)" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="bar-Converted" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="bar-Lost" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-danger)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-danger)" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={88} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {pipelineData.map((e, i) => (
                    <Cell key={i} fill={`url(#bar-${e.stage})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Conversion funnel */}
          <ChartCard title="Conversion Funnel" delay={0.3}>
            <div className="space-y-4">
              {pipelineData.map(({ stage, count }) => {
                const total = analytics?.totalLeads || 1;
                const pct = Math.min(100, Math.round((count / total) * 100));
                const color = PIPELINE_COLORS[stage] || 'var(--text-muted)';
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-text-1">{stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs tabular-nums font-bold" style={{ color }}>{count}</span>
                        <span className="text-[11px] w-8 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="progress-track h-2.5 bg-black/5 rounded-full overflow-hidden border border-black/5 shadow-inner">
                      <motion.div
                        className="progress-fill h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${color}cc, ${color})`,
                          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Priority distribution progress bars */}
          <ChartCard title="Leads By Priority" delay={0.35}>
            {priorityData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-xs text-text-3">No priority data</div>
            ) : (
              <div className="space-y-4">
                {priorityData.map(({ name, value, fill }) => {
                  const total = analytics?.totalLeads || 1;
                  const pct = Math.min(100, Math.round((value / total) * 100));
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text-1">{name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs tabular-nums font-bold" style={{ color: fill }}>{value}</span>
                          <span className="text-[11px] w-8 text-right tabular-nums text-text-3">{pct}%</span>
                        </div>
                      </div>
                      <div className="progress-track h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
                        <motion.div
                          className="progress-fill h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${fill}cc, ${fill})`,
                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0,0,0,0.05)'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartCard>
        </div>

        {/* ─── Row 3: Monthly Insights Summary ─── */}
        <div className="grid grid-cols-1 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 font-display" style={{ color: 'var(--color-teal)' }}>
              Monthly Insights Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text-1">Conversion Optimization</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  Your conversion rate is currently at {analytics?.conversionRate ?? 0}%. A 5% increase in lead response times could yield up to {Math.round((analytics?.newLeads ?? 0) * 0.1)} additional conversions this month.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text-1">Lead Generation Insights</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  {sourceData.length > 0 ? `The primary driver of leads is "${sourceData[0]?.name}" contributing ${sourceData[0]?.value} leads. Consider reallocating resources to maximize this channel's output.` : 'Ensure you capture the lead source for all contacts to analyze ROI on customer acquisition channels.'}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text-1">Pipeline Health</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  You have {analytics?.newLeads ?? 0} new leads that require initial outreach. Prioritize "Urgent" and "High" importance status tickets to minimize sales cycle latency.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
};

export default Analytics;
