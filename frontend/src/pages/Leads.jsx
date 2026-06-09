import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Trash2, Edit3, Eye, ChevronLeft, ChevronRight,
  ChevronDown, Loader2, Users, X
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import LeadForm from '../components/leads/LeadForm';
import { getLeads, createLead, updateLead, deleteLead } from '../api/leads';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Instagram', 'Referral', 'Email Campaign', 'Facebook', 'Cold Outreach'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', source: '', priority: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, ...filters };
      if (search) params.search = search;
      const data = await getLeads(params);
      setLeads(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      const data = await createLead(formData);
      toast.success('Lead created successfully! ✨');
      addNotification({ title: 'New Lead Added', message: `${formData.fullName} from ${formData.company || formData.email}`, icon: '👤' });
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      await updateLead(editLead._id, formData);
      toast.success('Lead updated successfully!');
      if (formData.status === 'Converted') {
        addNotification({ title: 'Lead Converted! 🎉', message: `${editLead.fullName} has been converted to a client!`, icon: '🎉' });
      }
      setEditLead(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLead(deleteId);
      toast.success('Lead deleted');
      setDeleteId(null);
      fetchLeads();
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', source: '', priority: '', startDate: '', endDate: '' });
    setSearch('');
    setPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  return (
    <Layout pageTitle="Leads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Lead Management</h2>
            <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
              {pagination.total} total leads
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            id="add-lead-btn"
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>

        {/* Search + Filters */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-48 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email, company..."
                className="input-field pl-9 py-2.5"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary items-center gap-2 ${activeFiltersCount > 0 ? 'border-accent/40 text-accent' : ''}`}
              id="filter-btn"
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: '#00E5FF', color: '#0A0F1C' }}>
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="btn-secondary items-center gap-2">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <label className="label-field text-xs">Status</label>
                    <select className="input-field py-2 text-sm"
                      value={filters.status}
                      onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}>
                      <option value="" style={{ background: '#121A2A' }}>All</option>
                      {STATUSES.map(s => <option key={s} value={s} style={{ background: '#121A2A' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-field text-xs">Source</label>
                    <select className="input-field py-2 text-sm"
                      value={filters.source}
                      onChange={(e) => { setFilters(f => ({ ...f, source: e.target.value })); setPage(1); }}>
                      <option value="" style={{ background: '#121A2A' }}>All</option>
                      {SOURCES.map(s => <option key={s} value={s} style={{ background: '#121A2A' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-field text-xs">Priority</label>
                    <select className="input-field py-2 text-sm"
                      value={filters.priority}
                      onChange={(e) => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(1); }}>
                      <option value="" style={{ background: '#121A2A' }}>All</option>
                      {PRIORITIES.map(p => <option key={p} value={p} style={{ background: '#121A2A' }}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-field text-xs">From Date</label>
                    <input type="date" className="input-field py-2 text-sm"
                      value={filters.startDate}
                      onChange={(e) => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(1); }}
                      style={{ colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label className="label-field text-xs">To Date</label>
                    <input type="date" className="input-field py-2 text-sm"
                      value={filters.endDate}
                      onChange={(e) => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(1); }}
                      style={{ colorScheme: 'dark' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="animate-spin" style={{ color: '#00E5FF' }} />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16">
              <Users size={40} className="mx-auto mb-4 text-slate-600" />
              <p className="text-base font-medium text-slate-400">No leads found</p>
              <p className="text-sm mt-1 text-slate-500">
                {activeFiltersCount > 0 ? 'Try adjusting your filters' : 'Add your first lead to get started'}
              </p>
              {activeFiltersCount === 0 && (
                <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
                  <Plus size={14} /> Add Lead
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th className="hidden sm:table-cell">Company</th>
                    <th>Status</th>
                    <th className="hidden md:table-cell">Priority</th>
                    <th className="hidden lg:table-cell">Source</th>
                    <th className="hidden lg:table-cell">Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #00E5FF22, #7C3AED22)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}
                          >
                            {lead.fullName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{lead.fullName}</p>
                            <p className="text-xs" style={{ color: '#64748B' }}>{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className="text-sm text-slate-300">{lead.company || '—'}</span>
                      </td>
                      <td>
                        <Badge type="status" value={lead.status} />
                      </td>
                      <td className="hidden md:table-cell">
                        <Badge type="priority" value={lead.priority} />
                      </td>
                      <td className="hidden lg:table-cell">
                        <Badge type="source" value={lead.source} />
                      </td>
                      <td className="hidden lg:table-cell">
                        <span className="text-xs" style={{ color: '#64748B' }}>
                          {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/leads/${lead._id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            title="View"
                            style={{ color: '#64748B' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,229,255,0.1)'; e.currentTarget.style.color = '#00E5FF'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditLead(lead)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            title="Edit"
                            style={{ color: '#64748B' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.color = '#F59E0B'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(lead._id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            title="Delete"
                            style={{ color: '#64748B' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                          >
                            <Trash2 size={15} />
                          </button>
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
            <div className="flex items-center justify-between px-4 py-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs" style={{ color: '#64748B' }}>
                Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-slate-400">{page} / {pagination.pages}</span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Lead" size="lg">
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="lg">
        <LeadForm
          initialData={editLead}
          onSubmit={handleUpdate}
          onCancel={() => setEditLead(null)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 size={24} style={{ color: '#EF4444' }} />
          </div>
          <p className="text-white font-medium">Delete this lead?</p>
          <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>
            This action cannot be undone. All follow-ups will also be deleted.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn-danger flex-1 justify-center">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Leads;
