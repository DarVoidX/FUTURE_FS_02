require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');

const sampleLeads = [
  {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@techstartup.com',
    phone: '+1 (555) 234-5678',
    company: 'TechStartup Inc.',
    jobTitle: 'CEO',
    source: 'LinkedIn',
    service: 'Website Redesign',
    budget: '$10,000 - $20,000',
    priority: 'High',
    status: 'Qualified',
    notes: 'Very interested in a complete brand overhaul. Has budget approved.',
  },
  {
    fullName: 'Marcus Chen',
    email: 'marcus@globalretail.io',
    phone: '+1 (555) 345-6789',
    company: 'Global Retail IO',
    jobTitle: 'Marketing Director',
    source: 'Referral',
    service: 'Digital Marketing Strategy',
    budget: '$5,000 - $10,000',
    priority: 'Urgent',
    status: 'Proposal Sent',
    notes: 'Referred by existing client. Decision expected this week.',
  },
  {
    fullName: 'Emily Rodriguez',
    email: 'emily.r@designstudio.co',
    phone: '+1 (555) 456-7890',
    company: 'Design Studio Co.',
    jobTitle: 'Founder',
    source: 'Instagram',
    service: 'Brand Identity',
    budget: '$3,000 - $5,000',
    priority: 'Medium',
    status: 'Contacted',
    notes: 'Interested in logo and branding package.',
  },
  {
    fullName: 'David Kim',
    email: 'david.kim@fintech.ventures',
    phone: '+1 (555) 567-8901',
    company: 'Fintech Ventures',
    jobTitle: 'CTO',
    source: 'Cold Outreach',
    service: 'Mobile App Development',
    budget: '$50,000+',
    priority: 'High',
    status: 'Converted',
    notes: 'Signed contract for mobile app. Great client.',
  },
  {
    fullName: 'Amanda Foster',
    email: 'amanda@boutique.shop',
    phone: '+1 (555) 678-9012',
    company: 'Boutique Shop Online',
    jobTitle: 'Owner',
    source: 'Facebook',
    service: 'E-commerce Development',
    budget: '$8,000 - $15,000',
    priority: 'Medium',
    status: 'New',
    notes: 'Looking to launch online store. Needs guidance.',
  },
  {
    fullName: 'James Wilson',
    email: 'jwilson@consulting.pro',
    phone: '+1 (555) 789-0123',
    company: 'Wilson Consulting Pro',
    jobTitle: 'Managing Partner',
    source: 'Website',
    service: 'SEO & Content Strategy',
    budget: '$2,000 - $4,000',
    priority: 'Low',
    status: 'Lost',
    notes: 'Went with a competitor. Follow up in 6 months.',
  },
  {
    fullName: 'Priya Patel',
    email: 'priya@healthtech.med',
    phone: '+1 (555) 890-1234',
    company: 'HealthTech Med',
    jobTitle: 'Product Manager',
    source: 'Email Campaign',
    service: 'SaaS Development',
    budget: '$30,000 - $50,000',
    priority: 'Urgent',
    status: 'Qualified',
    notes: 'Large project for patient management system.',
  },
  {
    fullName: 'Robert Taylor',
    email: 'rtaylor@realestate.group',
    phone: '+1 (555) 901-2345',
    company: 'Taylor Real Estate Group',
    jobTitle: 'CEO',
    source: 'Referral',
    service: 'CRM Integration',
    budget: '$15,000 - $25,000',
    priority: 'High',
    status: 'New',
    notes: 'Needs custom CRM for property management.',
  },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Lead.deleteMany({});
    await FollowUp.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await Admin.create({
      username: 'admin',
      password: 'Admin@2026',
      fullName: 'Admin User',
      email: 'admin@orbitflow.com',
      role: 'admin',
      company: 'OrbitFlow CRM',
    });
    console.log('👤 Admin created: admin / Admin@2026');

    // Create leads with activities
    const leadsWithActivities = sampleLeads.map((lead) => ({
      ...lead,
      activities: [
        {
          type: 'created',
          description: `Lead created by Admin User`,
          newValue: lead.status,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      ],
    }));

    const createdLeads = await Lead.insertMany(leadsWithActivities);
    console.log(`📋 Created ${createdLeads.length} sample leads`);

    // Create follow-ups
    const followUps = [
      {
        leadId: createdLeads[0]._id,
        note: 'Sent initial proposal via email. Awaiting response.',
        nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        leadId: createdLeads[0]._id,
        note: 'Had discovery call. Client is ready to move forward.',
        createdBy: admin._id,
      },
      {
        leadId: createdLeads[1]._id,
        note: 'Proposal submitted. Decision pending board approval.',
        nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        leadId: createdLeads[2]._id,
        note: 'Follow-up email sent with portfolio samples.',
        nextFollowUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
    ];

    await FollowUp.insertMany(followUps);
    console.log('📝 Created sample follow-ups');

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Login: admin / Admin@2026');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
