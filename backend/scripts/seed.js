require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');

const sampleLeads = [
  {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@techstartup.in',
    phone: '+91 98765 43210',
    company: 'TechStartup India',
    jobTitle: 'CEO',
    source: 'LinkedIn',
    service: 'Website Redesign',
    budget: '₹8,00,000 - ₹15,00,000',
    priority: 'High',
    status: 'Qualified',
    notes: 'Very interested in a complete brand overhaul. Has budget approved.',
  },
  {
    fullName: 'Rohan Gupta',
    email: 'rohan@globalretail.in',
    phone: '+91 91234 56789',
    company: 'Global Retail India',
    jobTitle: 'Marketing Director',
    source: 'Referral',
    service: 'Digital Marketing Strategy',
    budget: '₹4,00,000 - ₹8,00,000',
    priority: 'Urgent',
    status: 'Proposal Sent',
    notes: 'Referred by existing client. Decision expected this week.',
  },
  {
    fullName: 'Sneha Reddy',
    email: 'sneha.r@designstudio.co.in',
    phone: '+91 88888 77777',
    company: 'Design Studio Co.',
    jobTitle: 'Founder',
    source: 'Instagram',
    service: 'Brand Identity',
    budget: '₹2,00,000 - ₹4,00,000',
    priority: 'Medium',
    status: 'Contacted',
    notes: 'Interested in logo and branding package.',
  },
  {
    fullName: 'Amit Verma',
    email: 'amit.verma@fintech.ventures',
    phone: '+91 99999 88888',
    company: 'Fintech Ventures',
    jobTitle: 'CTO',
    source: 'Cold Outreach',
    service: 'Mobile App Development',
    budget: '₹40,00,000+',
    priority: 'High',
    status: 'Converted',
    notes: 'Signed contract for mobile app. Great client.',
  },
  {
    fullName: 'Karan Malhotra',
    email: 'karan@boutique.in',
    phone: '+91 77777 66666',
    company: 'Boutique Shop Online',
    jobTitle: 'Owner',
    source: 'Facebook',
    service: 'E-commerce Development',
    budget: '₹6,00,000 - ₹12,00,000',
    priority: 'Medium',
    status: 'New',
    notes: 'Looking to launch online store. Needs guidance.',
  },
  {
    fullName: 'Vikram Singh',
    email: 'vsingh@consulting.pro',
    phone: '+91 96666 55555',
    company: 'Singh Consulting Pro',
    jobTitle: 'Managing Partner',
    source: 'Website',
    service: 'SEO & Content Strategy',
    budget: '₹1,50,000 - ₹3,00,000',
    priority: 'Low',
    status: 'Lost',
    notes: 'Went with a competitor. Follow up in 6 months.',
  },
  {
    fullName: 'Priya Patel',
    email: 'priya@healthtech.med',
    phone: '+91 95555 44444',
    company: 'HealthTech Med',
    jobTitle: 'Product Manager',
    source: 'Email Campaign',
    service: 'SaaS Development',
    budget: '₹25,00,000 - ₹40,00,000',
    priority: 'Urgent',
    status: 'Qualified',
    notes: 'Large project for patient management system.',
  },
  {
    fullName: 'Ananya Iyer',
    email: 'aiyer@realestate.group',
    phone: '+91 94444 33333',
    company: 'Iyer Real Estate Group',
    jobTitle: 'CEO',
    source: 'Referral',
    service: 'CRM Integration',
    budget: '₹12,00,000 - ₹20,00,000',
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
