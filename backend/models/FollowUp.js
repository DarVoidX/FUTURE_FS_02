const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Lead ID is required'],
    },
    note: {
      type: String,
      required: [true, 'Note is required'],
      trim: true,
    },
    nextFollowUpDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

followUpSchema.index({ leadId: 1 });
followUpSchema.index({ nextFollowUpDate: 1 });

module.exports = mongoose.model('FollowUp', followUpSchema);
