import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, SlidersHorizontal, Trash2, Pencil, Eye,
  ChevronLeft, ChevronRight, ChevronDown, Loader2, Users, X,
  TrendingUp, Target, Sparkles
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import LeadForm from '../components/leads/LeadForm';
import { getLeads, createLead, updateLead, deleteLead, getAnalytics } from '../api/leads';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUSES  = ['New','Contacted','Qualified','Proposal Sent','Converted','Lost'];
const SOURCES   = ['Website','LinkedIn','Instagram','Referral','Email Campaign','Facebook','Cold Outreach'];
const PRIORITIES = ['Low','Medium','High','Urgent'];

const Leads = () => {
  const [leads, setLeads]         = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, pages:1 });
  const [loading, setLoading]     = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editLead, setEditLead]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch]       = useState('');
  const [filters, setFilters]     = useState({ status:'', source:'', priority:'', startDate:'', endDate:'' });
  const [page, setPage]           = useState(1);
  const [analytics, setAnalytics] = useState(null);
  const { addNotification }       = useNotifications();
  const navigate                  = useNavigate();

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data.data);
    } catch {}
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, ...filters };
      if (search) params.search = search;
      const data = await getLeads(params);
      setLeads(data.data || []);
      setPagination(data.pagination || { total:0, page:1, pages:1 });
    } catch { toast.error('Failed to load leads'); }
    finally { setLoading(false); }
  }, [page, search, filters]);

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
  }, [fetchLeads, fetchAnalytics]);

  const handleCreate = async fd => {
    setFormLoading(true);
    try {
      await createLead(fd);
      toast.success('Lead created');
      addNotification({ title: 'New Lead', message: `${fd.fullName} added`, icon: '👤' });
      setShowForm(false); fetchLeads(); fetchAnalytics();
    } catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async fd => {
    setFormLoading(true);
    try {
      await updateLead(editLead._id, fd);
      toast.success('Lead updated');
      if (fd.status === 'Converted') addNotification({ title: 'Lead Converted! 🎉', message: editLead.fullName, icon: '🎉' });
      setEditLead(null); fetchLeads(); fetchAnalytics();
    } catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    try { await deleteLead(deleteId); toast.success('Lead deleted'); setDeleteId(null); fetchLeads(); fetchAnalytics(); }
    catch { toast.error('Failed to delete'); }
  };

  const clearFilters = () => { setFilters({ status:'',source:'',priority:'',startDate:'',endDate:'' }); setSearch(''); setPage(1); };
  const activeCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  return (
    <Layout pageTitle="Leads" pageSubtitle={`${pagination.total} total records`}>
      <div className="space-y-6">
        {/* ─── Toolbar (Full Width) ─── */}
        <div className="flex flex-wrap items-center gap-3 card p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search leads…"
              className="input pl-9 pr-4 text-sm"
            />
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary gap-2.5"
            style={activeCount > 0 ? { color: 'var(--color-teal)', borderColor: 'rgba(46, 125, 114, 0.3)' } : {}}
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[11px] font-bold flex items-center justify-center"
                style={{ background: 'var(--color-teal)', color: '#fff' }}>{activeCount}</span>
            )}
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {activeCount > 0 && (
            <button onClick={clearFilters} className="btn-ghost gap-2">
              <X size={14} /> Clear
            </button>
          )}

          <div className="ml-auto">
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={15} /> New lead
            </button>
          </div>
        </div>

        {/* ─── Filter panel ─── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="card p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: 'Status',   key: 'status',    opts: STATUSES  },
                  { label: 'Source',   key: 'source',    opts: SOURCES   },
                  { label: 'Priority', key: 'priority',  opts: PRIORITIES },
                ].map(f => (
                  <div key={f.key}>
                    <label className="input-label">{f.label}</label>
                    <select className="input py-2 text-xs"
                      value={filters[f.key]}
                      onChange={e => { setFilters(p => ({ ...p, [f.key]: e.target.value })); setPage(1); }}>
                      <option value="">All</option>
                      {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="input-label">From</label>
                  <input type="date" className="input py-2 text-xs"
                    value={filters.startDate}
                    onChange={e => { setFilters(p => ({ ...p, startDate: e.target.value })); setPage(1); }}
                    style={{ colorScheme: 'light' }} />
                </div>
                <div>
                  <label className="input-label">To</label>
                  <input type="date" className="input py-2 text-xs"
                    value={filters.endDate}
                    onChange={e => { setFilters(p => ({ ...p, endDate: e.target.value })); setPage(1); }}
                    style={{ colorScheme: 'light' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main Grid: Table Left, Stats Right ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Table Container Column */}
          <div className="lg:col-span-3 card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
              </div>
            ) : leads.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Users size={18} style={{ color: 'var(--text-muted)' }} /></div>
                <p className="text-sm font-semibold text-text-1">No leads found</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {activeCount > 0 ? 'Try adjusting your filters' : 'Add your first lead to get started'}
                </p>
                {activeCount === 0 && (
                  <button onClick={() => setShowForm(true)} className="btn-primary btn-sm mt-2">
                    <Plus size={12} /> New lead
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="hidden sm:table-cell">Company</th>
                      <th>Status</th>
                      <th className="hidden md:table-cell">Priority</th>
                      <th className="hidden lg:table-cell">Source</th>
                      <th className="hidden lg:table-cell">Added</th>
                      <th className="text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <motion.tr
                        key={lead._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.025 }}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0"
                              style={{ background: 'var(--color-teal-dim)', color: 'var(--color-teal)', border: '1px solid var(--color-teal-dim)' }}>
                              {(lead.fullName || '?')[0]}
                            </div>
                            <div>
                              <p className="text-[15px] font-semibold text-text-1 tracking-snug-2">{lead.fullName || 'Unnamed Lead'}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          <span className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>{lead.company || '—'}</span>
                        </td>
                        <td><Badge type="status" value={lead.status} /></td>
                        <td className="hidden md:table-cell"><Badge type="priority" value={lead.priority} /></td>
                        <td className="hidden lg:table-cell"><Badge type="source" value={lead.source} /></td>
                        <td className="hidden lg:table-cell">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1 pr-1">
                            {[
                              { icon: Eye,    title: 'View',   action: () => navigate(`/leads/${lead._id}`), hoverColor: 'var(--color-teal)' },
                              { icon: Pencil, title: 'Edit',   action: () => setEditLead(lead),              hoverColor: 'var(--color-warning)' },
                              { icon: Trash2, title: 'Delete', action: () => setDeleteId(lead._id),           hoverColor: 'var(--color-danger)' },
                            ].map(({ icon: Icon, title, action, hoverColor }) => (
                              <button
                                key={title}
                                onClick={action}
                                title={title}
                                className="btn-icon btn-ghost"
                                onMouseEnter={e => e.currentTarget.style.color = hoverColor}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                style={{ color: 'var(--text-muted)' }}
                              >
                                <Icon size={14} />
                              </button>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5"
                style={{ borderTop: '1px solid var(--border-color)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(page-1)*15+1}–{Math.min(page*15, pagination.total)} of {pagination.total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p-1))}
                    disabled={page === 1}
                    className="btn-secondary btn-sm disabled:opacity-30"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="text-xs px-2" style={{ color: 'var(--text-secondary)' }}>
                    {page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p+1))}
                    disabled={page === pagination.pages}
                    className="btn-secondary btn-sm disabled:opacity-30"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        {/* Right Column: Lead Summary & Stats */}
        <div className="lg:col-span-1 space-y-5">
          <div className="card p-5 space-y-5">
            <div>
              <p className="text-base font-bold text-text-1">Lead Summary</p>
              <p className="text-xs text-text-muted mt-0.5">Real-time stats overview</p>
            </div>
            
            <div className="space-y-4">
              {/* Total Leads */}
              <div className="p-3.5 rounded-xl bg-[var(--background-cream)] border border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-3 uppercase tracking-wider">Total Leads</p>
                  <p className="text-2xl font-black font-display text-text-1 mt-1">{analytics?.totalLeads ?? pagination.total}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-teal-dim)] border border-[var(--color-teal-dim)]">
                  <Users size={18} style={{ color: 'var(--color-teal)' }} />
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="p-3.5 rounded-xl bg-[var(--background-cream)] border border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-3 uppercase tracking-wider">Conversion</p>
                  <p className="text-2xl font-black font-display text-text-1 mt-1">{analytics?.conversionRate ?? 0}%</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-teal-dim)] border border-[var(--color-teal-dim)]">
                  <TrendingUp size={18} style={{ color: 'var(--color-teal)' }} />
                </div>
              </div>
            </div>

            {/* Status breakdown */}
            {analytics?.pipeline && (
              <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                <p className="text-xs font-bold text-text-3 uppercase tracking-wider">Pipeline Stages</p>
                <div className="space-y-2.5">
                  {Object.entries(analytics.pipeline).map(([stage, count]) => {
                    const pct = analytics.totalLeads ? Math.round((count / analytics.totalLeads) * 100) : 0;
                    return (
                      <div key={stage} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-text-2">{stage}</span>
                          <span className="text-text-1 font-bold">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--color-teal)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Modals */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Lead" size="lg">
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
      </Modal>
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="lg">
        <LeadForm initialData={editLead} onSubmit={handleUpdate} onCancel={() => setEditLead(null)} loading={formLoading} />
      </Modal>
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead" size="sm">
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 size={20} style={{ color: 'var(--color-danger)' }} />
          </div>
          <p className="text-sm font-semibold text-text-1 mb-1">Delete this lead?</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Leads;
