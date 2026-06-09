const express = require('express');
const { body, validationResult } = require('express-validator');
const FollowUp = require('../models/FollowUp');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// @route   POST /api/followups
// @desc    Create a follow-up for a lead
// @access  Private
router.post(
  '/',
  [
    body('leadId').notEmpty().withMessage('Lead ID is required'),
    body('note').trim().notEmpty().withMessage('Note is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { leadId, note, nextFollowUpDate } = req.body;

      // Verify lead exists
      const lead = await Lead.findById(leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      const followUp = await FollowUp.create({
        leadId,
        note,
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : undefined,
        createdBy: req.user._id,
      });

      // Add activity to lead
      lead.activities.push({
        type: 'followup_added',
        description: `Follow-up added: "${note}"`,
        newValue: note,
      });
      await lead.save();

      res.status(201).json({
        success: true,
        data: followUp,
        message: 'Follow-up added successfully',
      });
    } catch (error) {
      console.error('Create follow-up error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/followups/:leadId
// @desc    Get all follow-ups for a lead
// @access  Private
router.get('/:leadId', async (req, res) => {
  try {
    const followUps = await FollowUp.find({ leadId: req.params.leadId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: followUps });
  } catch (error) {
    console.error('Get follow-ups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/followups/:id
// @desc    Update follow-up status
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    res.json({ success: true, data: followUp, message: 'Follow-up updated' });
  } catch (error) {
    console.error('Update follow-up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
