import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const SOURCES = ['Website', 'LinkedIn', 'Instagram', 'Referral', 'Email Campaign', 'Facebook', 'Cold Outreach', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];
const SERVICES = [
  'Website Design', 'Website Development', 'Mobile App Development', 'E-commerce Development',
  'SEO & Content Strategy', 'Digital Marketing', 'Brand Identity', 'Social Media Management',
  'SaaS Development', 'CRM Integration', 'UI/UX Design', 'Consulting', 'Other'
];

const BUDGETS = [
  'Under ₹1,00,000', '₹1,00,000 - ₹3,00,000', '₹3,00,000 - ₹5,00,000', '₹5,00,000 - ₹10,00,000',
  '₹10,00,000 - ₹25,00,000', '₹25,00,000 - ₹50,00,000', '₹50,00,000+', 'Not Decided'
];

const FieldGroup = ({ label, children }) => (
  <div>
    <label className="label-field">{label}</label>
    {children}
  </div>
);

const LeadForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    source: 'Website',
    service: '',
    budget: '',
    priority: 'Medium',
    status: 'New',
    notes: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Full Name *">
          <input
            className="input-field"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Aarav Sharma"
            required
          />
        </FieldGroup>

        <FieldGroup label="Email *">
          <input
            className="input-field"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="aarav@company.in"
            required
          />
        </FieldGroup>

        <FieldGroup label="Phone">
          <input
            className="input-field"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
        </FieldGroup>

        <FieldGroup label="Company">
          <input
            className="input-field"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="TATA Consultancy Services"
          />
        </FieldGroup>

        <FieldGroup label="Job Title">
          <input
            className="input-field"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="CEO, Marketing Director..."
          />
        </FieldGroup>

        <FieldGroup label="Lead Source">
          <select className="input-field" name="source" value={form.source} onChange={handleChange}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FieldGroup>
      </div>

      {/* Service & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Service Interested In">
          <select className="input-field" name="service" value={form.service} onChange={handleChange}>
            <option value="">Select a service...</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FieldGroup>

        <FieldGroup label="Budget Range">
          <select className="input-field" name="budget" value={form.budget} onChange={handleChange}>
            <option value="">Select budget...</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </FieldGroup>
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Priority Level">
          <select className="input-field" name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </FieldGroup>

        <FieldGroup label="Status">
          <select className="input-field" name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FieldGroup>
      </div>

      {/* Notes */}
      <FieldGroup label="Notes">
        <textarea
          className="input-field resize-none"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Add any notes about this lead..."
          rows={4}
        />
      </FieldGroup>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Saving...' : initialData?._id ? 'Update Lead' : 'Create Lead'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary flex-1 justify-center" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default LeadForm;
