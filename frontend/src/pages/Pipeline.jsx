import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Loader2, ExternalLink } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import LeadForm from '../components/leads/LeadForm';
import { getLeads, createLead, updateLead } from '../api/leads';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];

const STAGE_CONFIG = {
  New:            { color: 'var(--color-blue)', dim: 'var(--color-blue-dim)',  border: 'var(--border-color)'  },
  Contacted:      { color: 'var(--color-warning)', dim: 'var(--color-warning-dim)', border: 'var(--border-color)'  },
  Qualified:      { color: 'var(--color-purple)', dim: 'var(--color-purple-dim)', border: 'var(--border-color)'  },
  'Proposal Sent':{ color: 'var(--color-teal)', dim: 'var(--color-teal-dim)', border: 'var(--border-color)' },
  Converted:      { color: 'var(--color-success)', dim: 'var(--color-success-dim)', border: 'var(--border-color)'  },
  Lost:           { color: 'var(--color-danger)', dim: 'var(--color-danger-dim)', border: 'var(--border-color)' },
};

const PRIORITY_DOT = { Low: 'var(--text-muted)', Medium: 'var(--color-warning)', High: 'var(--color-danger)', Urgent: 'var(--color-danger)' };

/* ─── Lead Card ─── */
const LeadCard = ({ lead, index, onView }) => {
  const cfg = STAGE_CONFIG[lead.status] || STAGE_CONFIG.New;

  return (
    <Draggable draggableId={lead._id} index={index}>
      {(prov, snap) => (
        <div
          ref={prov.innerRef}
          {...prov.draggableProps}
          {...prov.dragHandleProps}
          style={{ ...prov.draggableProps.style }}
        >
          <motion.div
            layout
            className="pipeline-card group mb-3 relative overflow-hidden"
            style={{
              borderLeft: `4px solid ${cfg.color}`,
              paddingLeft: '14px',
              ...(snap.isDragging ? {
                border: `1px solid ${cfg.color}`,
                borderLeft: `4px solid ${cfg.color}`,
                boxShadow: 'var(--shadow-hover), 0 0 0 1px rgba(0,0,0,0.08)',
                transform: 'rotate(1.5deg)',
              } : {})
            }}
          >
            {/* Priority dot */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: PRIORITY_DOT[lead.priority] || 'var(--text-muted)' }}
                />
                <span className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {lead.priority}
                </span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onView(lead); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center animate-pulse"
                style={{ background: 'var(--background-cream)', color: 'var(--text-secondary)' }}
              >
                <ExternalLink size={11} />
              </button>
            </div>

            {/* Name */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[11px] font-extrabold flex-shrink-0"
                style={{ background: `${cfg.color}15`, color: cfg.color }}>
                {(lead.fullName || '?')[0]}
              </div>
              <p className="text-[15px] font-bold text-text-1 leading-tight tracking-snug-2 truncate">
                {lead.fullName || 'Unnamed Lead'}
              </p>
            </div>

            {/* Company / Service */}
            {lead.company && (
              <p className="text-sm mb-3 truncate" style={{ color: 'var(--text-secondary)' }}>{lead.company}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2.5"
              style={{ borderTop: '1px solid var(--border-color)' }}>
              <Badge type="source" value={lead.source} />
              {lead.budget && (
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{lead.budget}</span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

/* ─── Pipeline Page ─── */
const Pipeline = () => {
  const [columns, setColumns]       = useState({});
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { addNotification }         = useNotifications();
  const navigate                    = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads({ limit: 200 });
      const grouped = {};
      STAGES.forEach(s => (grouped[s] = []));
      (data.data || []).forEach(lead => { if (grouped[lead.status]) grouped[lead.status].push(lead); });
      setColumns(grouped);
    } catch { toast.error('Failed to load pipeline'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination || source.droppableId === destination.droppableId) return;
    const from = source.droppableId, to = destination.droppableId;

    const next = { ...columns };
    const [moved] = next[from].splice(source.index, 1);
    moved.status = to;
    next[to].splice(destination.index, 0, moved);
    setColumns({ ...next });

    try {
      await updateLead(draggableId, { status: to });
      toast.success(to === 'Converted' ? `🎉 ${moved.fullName} converted!` : `Moved to ${to}`);
      if (to === 'Converted') addNotification({ title: 'Lead Converted!', message: moved.fullName, icon: '🎉' });
    } catch { toast.error('Failed to move'); fetchLeads(); }
  };

  const handleCreate = async fd => {
    setFormLoading(true);
    try {
      await createLead(fd);
      toast.success('Lead created');
      setShowForm(false); fetchLeads();
    } catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFormLoading(false); }
  };

  const getStageBudgetSum = (stageLeads) => {
    const sum = stageLeads.reduce((acc, lead) => {
      if (!lead.budget) return acc;
      const num = parseInt(lead.budget.replace(/[^0-9]/g, ''), 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    if (sum === 0) return null;
    return sum >= 100000 ? `₹${(sum / 100000).toFixed(1)}L` : sum >= 1000 ? `₹${(sum / 1000).toFixed(0)}k` : `₹${sum}`;
  };

  const totalLeads = Object.values(columns).reduce((s, arr) => s + arr.length, 0);

  return (
    <Layout pageTitle="Pipeline" pageSubtitle={`${totalLeads} total leads across ${STAGES.length} stages`}>
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-end">
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={15} /> New lead
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={22} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {STAGES.map(stage => {
                  const cfg = STAGE_CONFIG[stage];
                  const leads = columns[stage] || [];
                  const budgetSum = getStageBudgetSum(leads);

                  return (
                    <div key={stage} className="pipeline-col">
                      {/* Column header */}
                      <div className="px-4 pt-4 pb-3 rounded-t-[20px] relative overflow-hidden"
                        style={{ borderTop: `4px solid ${cfg.color}` }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text-1">
                              {stage}
                            </span>
                          </div>
                          <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums"
                            style={{ background: cfg.dim, color: cfg.color, border: `1px solid ${cfg.color}20` }}
                          >
                            {leads.length}
                          </span>
                        </div>
                        {budgetSum && (
                          <div className="text-xs font-bold text-text-3 tracking-snug flex items-center gap-1">
                            <span>Total value:</span>
                            <span className="text-text-2">{budgetSum}</span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div style={{ height: '1px', background: `linear-gradient(90deg, ${cfg.color}30, transparent)`, margin: '0 16px' }} />

                      {/* Droppable */}
                      <Droppable droppableId={stage}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.droppableProps}
                            className="p-3 flex-1 overflow-y-auto no-scrollbar transition-colors duration-150"
                            style={{
                              minHeight: 380,
                              background: snap.isDraggingOver ? `${cfg.dim}` : 'transparent',
                              borderRadius: '0 0 20px 20px',
                            }}
                          >
                            {leads.map((lead, i) => (
                              <LeadCard
                                key={lead._id}
                                lead={lead}
                                index={i}
                                onView={l => navigate(`/leads/${l._id}`)}
                              />
                            ))}
                            {prov.placeholder}

                            {leads.length === 0 && !snap.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                  style={{ background: 'var(--background-darker-sand)', border: '1px solid var(--border-color)' }}>
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color, opacity: 0.5 }} />
                                </div>
                                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Drop here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </div>
          </DragDropContext>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Lead" size="lg">
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
      </Modal>
    </Layout>
  );
};

export default Pipeline;
