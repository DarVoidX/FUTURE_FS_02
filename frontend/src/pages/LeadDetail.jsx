import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Edit3, Trash2, Phone, Mail, Building2, Briefcase,
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

const InfoRow = ({ icon: Icon, label, value }) => (
  value ? (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0, 229, 255, 0.08)' }}>
        <Icon size={15} style={{ color: '#00E5FF' }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: '#64748B' }}>{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  ) : null
);

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEdit, setShowEdit] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const { addNotification } = useNotifications();

  const fetchLead = useCallback(async () => {
    try {
      const [leadData, followUpData] = await Promise.all([
        getLead(id),
        getFollowUps(id),
      ]);
      setLead(leadData.data);
      setFollowUps(followUpData.data || []);
    } catch (err) {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      const data = await updateLead(id, formData);
      setLead(data.data);
      toast.success('Lead updated!');
      if (formData.status === 'Converted') {
        addNotification({ title: 'Lead Converted! 🎉', message: `${lead.fullName} is now a client!`, icon: '🎉' });
      }
      setShowEdit(false);
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFollowUp = async (data) => {
    setFollowUpLoading(true);
    try {
      const result = await createFollowUp(data);
      setFollowUps((prev) => [result.data, ...prev]);
      toast.success('Follow-up added!');
      addNotification({ title: 'Follow-up Added', message: data.note.slice(0, 50), icon: '📋' });
      setShowFollowUp(false);
      fetchLead(); // Refresh to get updated activities
    } catch (err) {
      toast.error('Failed to add follow-up');
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Lead Detail">
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin" style={{ color: '#00E5FF' }} />
        </div>
      </Layout>
    );
  }

  if (!lead) return null;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'followups', label: `Follow-ups (${followUps.length})`, icon: MessageSquare },
    { key: 'timeline', label: 'Timeline', icon: Calendar },
  ];

  return (
    <Layout pageTitle={lead.fullName}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back button + actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/leads')}
            className="btn-secondary"
          >
            <ArrowLeft size={16} /> Back to Leads
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFollowUp(true)} className="btn-secondary">
              <Plus size={15} /> Follow-up
            </button>
            <button onClick={() => setShowEdit(true)} className="btn-secondary">
              <Edit3 size={15} /> Edit
            </button>
            <button onClick={() => setShowDelete(true)} className="btn-danger">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

        {/* Lead Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(18, 26, 42, 0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex flex-wrap items-start gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00E5FF22, #7C3AED22)',
                border: '1px solid rgba(0,229,255,0.3)',
                color: '#00E5FF',
              }}
            >
              {lead.fullName[0]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{lead.fullName}</h1>
                {lead.status === 'Converted' && (
                  <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <CheckCircle2 size={12} /> Client
                  </div>
                )}
              </div>
              <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>
                {lead.jobTitle && `${lead.jobTitle} `}{lead.company && `at ${lead.company}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge type="status" value={lead.status} />
                <Badge type="priority" value={lead.priority} />
                <Badge type="source" value={lead.source} />
              </div>
            </div>

            {/* Date */}
            <div className="text-right">
              <p className="text-xs" style={{ color: '#64748B' }}>Created</p>
              <p className="text-sm text-white">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</p>
              <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === tab.key ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                color: activeTab === tab.key ? '#00E5FF' : '#94A3B8',
                border: activeTab === tab.key ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid transparent',
              }}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="rounded-2xl p-6"
                style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-semibold text-white mb-4">Contact Information</h3>
                <InfoRow icon={Mail} label="Email" value={lead.email} />
                <InfoRow icon={Phone} label="Phone" value={lead.phone} />
                <InfoRow icon={Building2} label="Company" value={lead.company} />
                <InfoRow icon={Briefcase} label="Job Title" value={lead.jobTitle} />
                <InfoRow icon={Globe} label="Lead Source" value={lead.source} />
              </div>

              {/* Deal Info */}
              <div className="rounded-2xl p-6"
                style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-semibold text-white mb-4">Deal Information</h3>
                <InfoRow icon={Briefcase} label="Service Interested In" value={lead.service} />
                <InfoRow icon={DollarSign} label="Budget Range" value={lead.budget} />

                {/* Notes */}
                {lead.notes && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-xs mb-2" style={{ color: '#64748B' }}>Notes</p>
                    <p className="text-sm text-white leading-relaxed">{lead.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'followups' && (
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-white">Follow-up History</h3>
                <button onClick={() => setShowFollowUp(true)} className="btn-primary text-xs py-2">
                  <Plus size={14} /> Add Follow-up
                </button>
              </div>

              {followUps.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={32} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-sm text-slate-500">No follow-ups yet</p>
                  <button onClick={() => setShowFollowUp(true)} className="btn-primary mt-4 mx-auto">
                    <Plus size={14} /> Add First Follow-up
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {followUps.map((fu, i) => (
                    <motion.div
                      key={fu._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                      >
                        <MessageSquare size={14} style={{ color: '#3B82F6' }} />
                      </div>
                      <div className="flex-1 p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-sm text-white">{fu.note}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs" style={{ color: '#64748B' }}>
                            {format(new Date(fu.createdAt), 'MMM d, yyyy · h:mm a')}
                          </span>
                          {fu.nextFollowUpDate && (
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
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

          {activeTab === 'timeline' && (
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(18, 26, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-white mb-6">Activity Timeline</h3>
              <ActivityTimeline activities={lead.activities || []} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Lead" size="lg">
        <LeadForm initialData={lead} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} loading={formLoading} />
      </Modal>

      {/* Follow-up Modal */}
      <Modal isOpen={showFollowUp} onClose={() => setShowFollowUp(false)} title="Add Follow-up" size="md">
        <FollowUpForm leadId={id} onSubmit={handleFollowUp} loading={followUpLoading} />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Lead" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 size={24} style={{ color: '#EF4444' }} />
          </div>
          <p className="text-white font-medium">Delete {lead.fullName}?</p>
          <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>This action cannot be undone.</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowDelete(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleDelete} className="btn-danger flex-1 justify-center">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default LeadDetail;
