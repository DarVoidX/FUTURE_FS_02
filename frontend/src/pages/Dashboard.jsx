import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Phone, Star, CheckCircle2, XCircle,
  TrendingUp, Plus, ArrowRight, Loader2
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { getAnalytics, getLeads } from '../api/leads';
import { format } from 'date-fns';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, leadsData] = await Promise.all([
          getAnalytics(),
          getLeads({ limit: 5, sort: '-createdAt' }),
        ]);
        setAnalytics(analyticsData.data);
        setRecentLeads(leadsData.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = analytics
    ? [
        { title: 'Total Leads', value: analytics.totalLeads, icon: Users, color: 'accent', delay: 0 },
        { title: 'New Leads', value: analytics.newLeads, icon: UserPlus, color: 'blue', delay: 0.05 },
        { title: 'Contacted', value: analytics.contactedLeads, icon: Phone, color: 'warning', delay: 0.1 },
        { title: 'Qualified', value: analytics.qualifiedLeads, icon: Star, color: 'accent', delay: 0.15 },
        { title: 'Converted', value: analytics.convertedLeads, icon: CheckCircle2, color: 'success', delay: 0.2 },
        { title: 'Lost', value: analytics.lostLeads, icon: XCircle, color: 'danger', delay: 0.25 },
        { title: 'Conversion Rate', value: analytics.conversionRate, icon: TrendingUp, color: 'success', delay: 0.3, suffix: '%' },
      ]
    : [];

  return (
    <Layout pageTitle="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin" style={{ color: '#00E5FF' }} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
              </h2>
              <p className="mt-1 text-sm" style={{ color: '#94A3B8' }}>
                Here's what's happening with your leads today.
              </p>
            </div>
            <button
              onClick={() => navigate('/leads')}
              className="btn-primary hidden sm:flex"
            >
              <Plus size={16} /> Add Lead
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stats.map((stat, i) => (
              <div key={stat.title} className={i === stats.length - 1 ? 'col-span-2 sm:col-span-1' : ''}>
                <StatCard {...stat} />
              </div>
            ))}
          </div>

          {/* Recent Leads + Pipeline Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div
              className="lg:col-span-2 rounded-2xl p-6"
              style={{
                background: 'rgba(18, 26, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Recent Leads</h3>
                <button
                  onClick={() => navigate('/leads')}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: '#00E5FF' }}
                >
                  View all <ArrowRight size={12} />
                </button>
              </div>

              <div className="space-y-3">
                {recentLeads.length === 0 ? (
                  <div className="text-center py-8">
                    <Users size={32} className="mx-auto mb-3 text-slate-600" />
                    <p className="text-sm text-slate-500">No leads yet. Add your first lead!</p>
                    <button onClick={() => navigate('/leads')} className="btn-primary mt-4 mx-auto">
                      <Plus size={14} /> Add Lead
                    </button>
                  </div>
                ) : (
                  recentLeads.map((lead, i) => (
                    <motion.div
                      key={lead._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
                      style={{ border: '1px solid transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #00E5FF22, #7C3AED22)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}
                      >
                        {lead.fullName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{lead.fullName}</p>
                        <p className="text-xs truncate" style={{ color: '#64748B' }}>
                          {lead.company || lead.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge type="status" value={lead.status} />
                        <span className="text-xs hidden sm:block" style={{ color: '#64748B' }}>
                          {format(new Date(lead.createdAt), 'MMM d')}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Pipeline Overview */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(18, 26, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Pipeline</h3>
                <button
                  onClick={() => navigate('/pipeline')}
                  className="text-xs transition-colors flex items-center gap-1"
                  style={{ color: '#00E5FF' }}
                >
                  View <ArrowRight size={12} />
                </button>
              </div>

              {analytics?.pipeline && (
                <div className="space-y-3">
                  {Object.entries(analytics.pipeline).map(([stage, count]) => {
                    const total = analytics.totalLeads || 1;
                    const pct = Math.round((count / total) * 100);
                    const stageColors = {
                      New: '#3B82F6',
                      Contacted: '#F59E0B',
                      Qualified: '#00E5FF',
                      'Proposal Sent': '#7C3AED',
                      Converted: '#22C55E',
                      Lost: '#EF4444',
                    };
                    const color = stageColors[stage] || '#94A3B8';
                    return (
                      <div key={stage}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-white">{stage}</span>
                          <span className="text-xs" style={{ color: '#94A3B8' }}>{count}</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
