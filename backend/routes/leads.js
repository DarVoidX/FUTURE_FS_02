const express = require('express');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// @route   GET /api/leads/analytics/summary
// @desc    Get dashboard analytics
// @access  Private
router.get('/analytics/summary', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });
    const proposalLeads = await Lead.countDocuments({ status: 'Proposal Sent' });

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Leads by source
    const sourceStats = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Priority distribution
    const priorityStats = await Lead.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
        convertedLeads,
        lostLeads,
        proposalLeads,
        conversionRate: parseFloat(conversionRate),
        sourceStats,
        monthlyGrowth,
        priorityStats,
        pipeline: {
          New: newLeads,
          Contacted: contactedLeads,
          Qualified: qualifiedLeads,
          'Proposal Sent': proposalLeads,
          Converted: convertedLeads,
          Lost: lostLeads,
        },
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leads
// @desc    Get all leads with filters, search, pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      source,
      priority,
      startDate,
      endDate,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (status) query.status = status;
    if (source) query.source = source;
    if (priority) query.priority = priority;

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/leads
// @desc    Create new lead
// @access  Private
router.post(
  '/',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const leadData = {
        ...req.body,
        activities: [
          {
            type: 'created',
            description: `Lead created by ${req.user.fullName || req.user.username}`,
            newValue: req.body.status || 'New',
          },
        ],
      };

      const lead = await Lead.create(leadData);

      res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
    } catch (error) {
      console.error('Create lead error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'A lead with this email already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const { status, notes, ...otherUpdates } = req.body;

    // Track status change activity
    if (status && status !== lead.status) {
      lead.activities.push({
        type: 'status_changed',
        description: `Status changed from ${lead.status} to ${status}`,
        oldValue: lead.status,
        newValue: status,
      });
      lead.status = status;

      if (status === 'Converted') {
        lead.activities.push({
          type: 'converted',
          description: 'Lead has been converted to a client! 🎉',
          newValue: 'Converted',
        });
      }
    }

    // Track notes update
    if (notes && notes !== lead.notes) {
      lead.activities.push({
        type: 'note_added',
        description: 'Notes updated',
        newValue: notes,
      });
      lead.notes = notes;
    }

    // Apply other updates
    Object.keys(otherUpdates).forEach((key) => {
      if (key !== '_id' && key !== 'activities' && key !== 'createdAt') {
        lead[key] = otherUpdates[key];
      }
    });

    const updatedLead = await lead.save();
    res.json({ success: true, data: updatedLead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await Lead.findByIdAndDelete(req.params.id);
    await FollowUp.deleteMany({ leadId: req.params.id });

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
