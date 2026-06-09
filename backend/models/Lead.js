const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['created', 'status_changed', 'note_added', 'followup_added', 'converted', 'updated'],
    required: true,
  },
  description: { type: String, required: true },
  oldValue: { type: String },
  newValue: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['Website', 'LinkedIn', 'Instagram', 'Referral', 'Email Campaign', 'Facebook', 'Cold Outreach', 'Other'],
      default: 'Website',
    },
    service: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'],
      default: 'New',
    },
    notes: {
      type: String,
      trim: true,
    },
    activities: [activitySchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    expectedCloseDate: {
      type: Date,
    },
    dealValue: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Indexes for search performance
leadSchema.index({ fullName: 'text', email: 'text', company: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
