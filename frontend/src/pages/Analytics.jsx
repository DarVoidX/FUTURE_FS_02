import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, Target, Users } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import { getAnalytics } from '../api/leads';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SOURCE_COLORS = {
  Website: '#3B82F6',
  LinkedIn: '#0077B5',
  Instagram: '#E1306C',
  Referral: '#22C55E',
  'Email Campaign': '#F59E0B',
  Facebook: '#1877F2',
  'Cold Outreach': '#7C3AED',
  Other: '#94A3B8',
};

const PIPELINE_COLORS = {
  New: '#3B82F6',
  Contacted: '#F59E0B',
  Qualified: '#00E5FF',
  'Proposal Sent': '#7C3AED',
  Converted: '#22C55E',
  Lost: '#EF4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm"
      style={{ background: '#121A2A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const chartCardStyle = {
    background: 'rgba(18, 26, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(12px)',
  };

  if (loading) {
    return (
      <Layout pageTitle="Analytics">
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin" style={{ color: '#00E5FF' }} />
        </div>
      </Layout>
    );
  }

  // Prepare chart data
  const monthlyData = analytics?.monthlyGrowth?.map((m) => ({
    month: MONTHS[m._id.month - 1],
    Leads: m.count,
  })) || [];

  const sourceData = analytics?.sourceStats?.map((s) => ({
    name: s._id || 'Other',
    value: s.count,
    color: SOURCE_COLORS[s._id] || '#94A3B8',
  })) || [];

  const pipelineData = analytics?.pipeline
    ? Object.entries(analytics.pipeline).map(([stage, count]) => ({
        stage,
        count,
        fill: PIPELINE_COLORS[stage] || '#94A3B8',
      }))
    : [];

  return (
    <Layout pageTitle="Analytics">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-white">Analytics Overview</h2>
          <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
            Performance metrics and growth insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Leads"
            value={analytics?.totalLeads || 0}
            icon={Users}
            color="accent"
            delay={0}
          />
          <StatCard
            title="Conversion Rate"
            value={analytics?.conversionRate || 0}
            icon={Target}
            color="success"
            suffix="%"
            delay={0.05}
          />
          <StatCard
            title="Converted"
            value={analytics?.convertedLeads || 0}
            icon={TrendingUp}
            color="success"
            delay={0.1}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6"
            style={chartCardStyle}
          >
            <h3 className="text-base font-semibold text-white mb-6">Monthly Lead Growth</h3>
            {monthlyData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Leads"
                    stroke="#00E5FF"
                    strokeWidth={2}
                    fill="url(#leadGradient)"
                    dot={{ fill: '#00E5FF', r: 4 }}
                    activeDot={{ r: 6, fill: '#00E5FF' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Pipeline Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-6"
            style={chartCardStyle}
          >
            <h3 className="text-base font-semibold text-white mb-6">Pipeline Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineData} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fill: '#94A3B8', fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6"
            style={chartCardStyle}
          >
            <h3 className="text-base font-semibold text-white mb-6">Leads by Source</h3>
            {sourceData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No data</div>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {sourceData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-xs text-slate-400 truncate">{s.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl p-6"
            style={chartCardStyle}
          >
            <h3 className="text-base font-semibold text-white mb-6">Conversion Funnel</h3>
            <div className="space-y-3">
              {pipelineData.map(({ stage, count }) => {
                const total = analytics?.totalLeads || 1;
                const pct = Math.min(100, Math.round((count / total) * 100));
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-white">{stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#94A3B8' }}>{count} leads</span>
                        <span className="text-xs font-semibold" style={{ color: PIPELINE_COLORS[stage] }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: PIPELINE_COLORS[stage] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
