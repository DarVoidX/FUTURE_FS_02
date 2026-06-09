import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Loader2, Eye, GitBranch, ExternalLink } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import LeadForm from '../components/leads/LeadForm';
import { getLeads, createLead, updateLead } from '../api/leads';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];

const stageColors = {
  New: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  Contacted: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  Qualified: { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)', border: 'rgba(0,229,255,0.3)' },
  'Proposal Sent': { color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)' },
  Converted: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  Lost: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

const priorityDots = {
  Low: '#94A3B8',
  Medium: '#F59E0B',
  High: '#EF4444',
  Urgent: '#FF4D4D',
};

const LeadCard = ({ lead, index, onClick }) => {
  return (
    <Draggable draggableId={lead._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
          }}
        >
          <motion.div
            layout
            className="rounded-xl p-4 cursor-grab active:cursor-grabbing group"
            style={{
              background: snapshot.isDragging ? 'rgba(18, 26, 42, 0.98)' : 'rgba(18, 26, 42, 0.9)',
              border: snapshot.isDragging
                ? '1px solid rgba(0, 229, 255, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: snapshot.isDragging
                ? '0 16px 48px rgba(0,0,0,0.6), 0 0 20px rgba(0,229,255,0.15)'
                : '0 4px 16px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #00E5FF22, #7C3AED22)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}
                >
                  {lead.fullName[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight line-clamp-1">{lead.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  title={lead.priority}
                  style={{ background: priorityDots[lead.priority] || '#94A3B8' }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); onClick(lead); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF' }}
                >
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>

            {/* Company */}
            {lead.company && (
              <p className="text-xs mb-2 line-clamp-1" style={{ color: '#64748B' }}>{lead.company}</p>
            )}

            {/* Service */}
            {lead.service && (
              <p className="text-xs mb-3 line-clamp-1" style={{ color: '#94A3B8' }}>{lead.service}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <Badge type="source" value={lead.source} className="text-[10px] px-2 py-0.5" />
              {lead.budget && (
                <span className="text-[10px]" style={{ color: '#64748B' }}>{lead.budget}</span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

const Pipeline = () => {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads({ limit: 200 });
      const leads = data.data || [];

      const grouped = {};
      STAGES.forEach((s) => (grouped[s] = []));
      leads.forEach((lead) => {
        if (grouped[lead.status]) {
          grouped[lead.status].push(lead);
        }
      });
      setColumns(grouped);
    } catch (err) {
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    // Optimistic update
    const newColumns = { ...columns };
    const [moved] = newColumns[sourceStage].splice(source.index, 1);
    moved.status = destStage;
    newColumns[destStage].splice(destination.index, 0, moved);
    setColumns({ ...newColumns });

    try {
      await updateLead(draggableId, { status: destStage });
      if (destStage === 'Converted') {
        toast.success(`🎉 ${moved.fullName} converted to client!`);
        addNotification({ title: 'Lead Converted! 🎉', message: `${moved.fullName} has been converted!`, icon: '🎉' });
      } else {
        toast.success(`Lead moved to ${destStage}`);
        addNotification({ title: 'Status Updated', message: `${moved.fullName} moved to ${destStage}`, icon: '📋' });
      }
    } catch (err) {
      toast.error('Failed to update lead status');
      fetchLeads(); // Revert on error
    }
  };

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await createLead(formData);
      toast.success('Lead created!');
      addNotification({ title: 'New Lead', message: `${formData.fullName} added to pipeline`, icon: '👤' });
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout pageTitle="Pipeline">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Sales Pipeline</h2>
            <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
              Drag and drop leads between stages
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary" id="pipeline-add-lead-btn">
            <Plus size={16} /> Add Lead
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin" style={{ color: '#00E5FF' }} />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {STAGES.map((stage) => {
                  const config = stageColors[stage];
                  const leads = columns[stage] || [];
                  return (
                    <div key={stage} className="pipeline-column" style={{ width: 280 }}>
                      {/* Column header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
                        style={{
                          background: config.bg,
                          borderBottom: `1px solid ${config.border}`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: config.color, boxShadow: `0 0 8px ${config.color}` }}
                          />
                          <span className="text-sm font-semibold" style={{ color: config.color }}>
                            {stage}
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
                        >
                          {leads.length}
                        </span>
                      </div>

                      {/* Droppable area */}
                      <Droppable droppableId={stage}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 p-3 space-y-3 overflow-y-auto transition-colors duration-200"
                            style={{
                              minHeight: 200,
                              background: snapshot.isDraggingOver
                                ? `rgba(${stage === 'Converted' ? '34,197,94' : '0,229,255'}, 0.03)`
                                : 'transparent',
                            }}
                          >
                            {leads.map((lead, index) => (
                              <LeadCard
                                key={lead._id}
                                lead={lead}
                                index={index}
                                onClick={(l) => navigate(`/leads/${l._id}`)}
                              />
                            ))}
                            {provided.placeholder}

                            {leads.length === 0 && !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center py-8 text-center">
                                <GitBranch size={20} className="mb-2 text-slate-700" />
                                <p className="text-xs text-slate-600">Drop leads here</p>
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

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Lead" size="lg">
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
      </Modal>
    </Layout>
  );
};

export default Pipeline;
