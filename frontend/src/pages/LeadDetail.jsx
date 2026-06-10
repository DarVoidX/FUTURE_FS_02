import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Pencil, Trash2, Phone, Mail, Building2, Briefcase,
  DollarSign, Globe, Calendar, MessageSquare, Activity, Plus,
  Loader2, CheckCircle2
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import LeadForm from '../components/leads/LeadForm';
import FollowUpForm from '../components/leads/FollowUpForm';
import ActivityTimeline from '../components/leads/ActivityTimeline';
import { getLead, updateLead, deleteLead } from '../api/leads';
import { getFollowUps, createFollowUp } from '../api/followups';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';

const Row = ({ icon: Icon, label, value }) =>
  value ? (
    <div className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--background-cream)', border: '1px solid var(--border-color)' }}>
        <Icon size={14} style={{ color: 'var(--text-secondary)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm text-text-1 font-bold truncate">{value}</p>
      </div>
    </div>
  ) : null;

const LeadDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [lead, setLead]         = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('overview');
  const [showEdit, setShowEdit] = useState(false);
  const [showFU, setShowFU]     = useState(false);
  const [showDel, setShowDel]   = useState(false);
  const [editLoading, setEditLoading]   = useState(false);
  const [fuLoading, setFuLoading]       = useState(false);
  const { addNotification } = useNotifications();

  const fetchAll = useCallback(async () => {
    try {
      const [l, f] = await Promise.all([getLead(id), getFollowUps(id)]);
      setLead(l.data); setFollowUps(f.data || []);
    } catch { toast.error('Lead not found'); navigate('/leads'); }
    finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleUpdate = async fd => {
    setEditLoading(true);
    try {
      const d = await updateLead(id, fd);
      setLead(d.data); toast.success('Lead updated');
      if (fd.status === 'Converted') addNotification({ title: 'Converted! 🎉', message: lead.fullName, icon: '🎉' });
      setShowEdit(false);
    } catch { toast.error('Failed to update'); }
    finally { setEditLoading(false); }
  };

  const handleFU = async data => {
    setFuLoading(true);
    try {
      const r = await createFollowUp(data);
      setFollowUps(p => [r.data, ...p]); toast.success('Follow-up added');
      addNotification({ title: 'Follow-up Added', message: data.note.slice(0,50), icon: '📋' });
      setShowFU(false);
    } catch { toast.error('Failed'); }
    finally { setFuLoading(false); }
  };

  const handleDelete = async () => {
    try { await deleteLead(id); toast.success('Lead deleted'); navigate('/leads'); }
    catch { toast.error('Failed'); }
  };

  if (loading) return (
    <Layout pageTitle="Lead">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    </Layout>
  );

  if (!lead) return null;

  const tabs = [
    { key: 'overview', label: 'Overview',        icon: Activity    },
    { key: 'followups',label: `Follow-ups (${followUps.length})`, icon: MessageSquare },
    { key: 'timeline', label: 'Timeline',         icon: Calendar    },
  ];

  return (
    <Layout pageTitle={lead.fullName} pageSubtitle={lead.company || lead.email}>
      <div className="max-w-4xl space-y-6">

        {/* ─── Back + Actions ─── */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/leads')} className="btn-secondary">
            <ArrowLeft size={15} /> Leads
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFU(true)}  className="btn-secondary"><Plus size={15}/> Follow-up</button>
            <button onClick={() => setShowEdit(true)} className="btn-secondary"><Pencil size={14}/> Edit</button>
            <button onClick={() => setShowDel(true)}  className="btn-danger"><Trash2 size={14}/> Delete</button>
          </div>
        </div>

        {/* ─── Lead Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex flex-wrap items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}>
              {(lead.fullName || '?')[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-text-1 tracking-tight-2 font-display">{lead.fullName || 'Unnamed Lead'}</h1>
                {lead.status === 'Converted' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--color-success-dim)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <CheckCircle2 size={11}/> Client
                  </span>
                )}
              </div>
              {(lead.jobTitle || lead.company) && (
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {lead.jobTitle}{lead.jobTitle && lead.company && ' · '}{lead.company}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge type="status"   value={lead.status}   />
                <Badge type="priority" value={lead.priority} />
                <Badge type="source"   value={lead.source}   />
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Added</p>
              <p className="text-sm font-bold text-text-1">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-1.5 p-1.5 rounded-xl w-fit"
          style={{ background: 'var(--background-darker-sand)', border: '1px solid var(--border-color-medium)' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-150"
              style={tab === t.key
                ? { background: 'var(--background-white)', color: 'var(--text-primary)', border: '1px solid var(--border-color-medium)', boxShadow: 'var(--shadow-ambient)' }
                : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' }}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <motion.div key={tab} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.18 }}>
          {tab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="card p-6">
                <p className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
                  Contact
                </p>
                <Row icon={Mail}     label="Email"     value={lead.email}    />
                <Row icon={Phone}    label="Phone"     value={lead.phone}    />
                <Row icon={Building2}label="Company"   value={lead.company}  />
                <Row icon={Briefcase}label="Job Title" value={lead.jobTitle} />
                <Row icon={Globe}    label="Source"    value={lead.source}   />
              </div>
              <div className="card p-6">
                <p className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
                  Deal
                </p>
                <Row icon={Briefcase}  label="Service" value={lead.service} />
                <Row icon={DollarSign} label="Budget"  value={lead.budget}  />
                {lead.notes && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Notes</p>
                    <p className="text-sm text-text-1 leading-relaxed">{lead.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'followups' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
                  Follow-up History
                </p>
                <button onClick={() => setShowFU(true)} className="btn-primary btn-sm">
                  <Plus size={12}/> Add
                </button>
              </div>

              {followUps.length === 0 ? (
                <div className="empty-state py-12">
                  <div className="empty-state-icon"><MessageSquare size={16} style={{ color: 'var(--text-muted)' }}/></div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No follow-ups yet</p>
                  <button onClick={() => setShowFU(true)} className="btn-primary btn-sm mt-2">
                    <Plus size={12}/> Add first
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {followUps.map((fu, i) => (
                    <motion.div
                      key={fu._id}
                      initial={{ opacity:0, x:-8 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: i*0.04 }}
                      className="flex gap-4 p-4 rounded-xl"
                      style={{ background: 'var(--background-cream)', border: '1px solid var(--border-color)' }}
                    >
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                        style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)' }}>
                        <MessageSquare size={12} style={{ color: 'var(--color-accent)' }}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-1">{fu.note}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {format(new Date(fu.createdAt), 'MMM d, yyyy · h:mm a')}
                          </span>
                          {fu.nextFollowUpDate && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full"
                              style={{ background: 'var(--color-warning-dim)', color: 'var(--color-warning)', border: '1px solid var(--border-color-medium)' }}>
                              Next: {format(new Date(fu.nextFollowUpDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'timeline' && (
            <div className="card p-6">
              <p className="text-[11px] uppercase tracking-widest font-bold mb-6" style={{ color: 'var(--text-muted)' }}>
                Activity Timeline
              </p>
              <ActivityTimeline activities={lead.activities || []} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Lead" size="lg">
        <LeadForm initialData={lead} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} loading={editLoading} />
      </Modal>
      <Modal isOpen={showFU} onClose={() => setShowFU(false)} title="Add Follow-up" size="md">
        <FollowUpForm leadId={id} onSubmit={handleFU} loading={fuLoading} />
      </Modal>
      <Modal isOpen={showDel} onClose={() => setShowDel(false)} title="Delete Lead" size="sm">
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 size={18} style={{ color: 'var(--color-danger)' }}/>
          </div>
          <p className="text-sm font-semibold text-text-1 mb-1">Delete {lead.fullName}?</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowDel(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default LeadDetail;
