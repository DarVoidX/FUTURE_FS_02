import { useState } from 'react';
import { Loader2, Calendar, MessageSquare } from 'lucide-react';

const FollowUpForm = ({ leadId, onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    note: '',
    nextFollowUpDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, leadId });
    setForm({ note: '', nextFollowUpDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field flex items-center gap-2">
          <MessageSquare size={14} /> Follow-up Note *
        </label>
        <textarea
          className="input-field resize-none"
          value={form.note}
          onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="e.g. Requested proposal, Follow-up scheduled for Friday, Interested in website redesign..."
          rows={3}
          required
        />
      </div>

      <div>
        <label className="label-field flex items-center gap-2">
          <Calendar size={14} /> Next Follow-up Date (Optional)
        </label>
        <input
          type="date"
          className="input-field"
          value={form.nextFollowUpDate}
          onChange={(e) => setForm((prev) => ({ ...prev, nextFollowUpDate: e.target.value }))}
          style={{ colorScheme: 'light' }}
        />
      </div>

      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? 'Adding...' : 'Add Follow-up'}
      </button>
    </form>
  );
};

export default FollowUpForm;
