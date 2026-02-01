'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    try {
      // Hash all passwords
      const adminPassword = await bcrypt.hash('Admin123!Test', saltRounds);
      const clientPassword = await bcrypt.hash('Client123!', saltRounds);
      const assistantPassword = await bcrypt.hash('Assistant123!', saltRounds);

      const now = new Date();

      // Create test users
      const users = [
        // Admin Account
        {
          email: 'admin@milassist.com',
          password: adminPassword,
          role: 'admin',
          full_name: 'Admin User',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },

        // Client Accounts
        {
          email: 'client1@example.com',
          password: clientPassword,
          role: 'client',
          full_name: 'John Smith',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          email: 'client2@example.com',
          password: clientPassword,
          role: 'client',
          full_name: 'Sarah Johnson',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          email: 'client3@example.com',
          password: clientPassword,
          role: 'client',
          full_name: 'Michael Chen',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },

        // Virtual Assistant Accounts
        {
          email: 'va1@milassist.com',
          password: assistantPassword,
          role: 'assistant',
          full_name: 'Emily Rodriguez',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          email: 'va2@milassist.com',
          password: assistantPassword,
          role: 'assistant',
          full_name: 'Jessica Martinez',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          email: 'va3@milassist.com',
          password: assistantPassword,
          role: 'assistant',
          full_name: 'Amanda Williams',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          email: 'va4@milassist.com',
          password: assistantPassword,
          role: 'assistant',
          full_name: 'Lisa Anderson',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        },
        {
          email: 'va5@milassist.com',
          password: assistantPassword,
          role: 'assistant',
          full_name: 'Maria Garcia',
          email_verified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now
        }
      ];

      // Insert users
      await queryInterface.bulkInsert('Users', users);

      // Get user IDs for VA profiles (we need to query the database)
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id, email FROM Users WHERE email IN ('va1@milassist.com', 'va2@milassist.com', 'va3@milassist.com', 'va4@milassist.com', 'va5@milassist.com')`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Create a map of email to user ID
      const userIdMap = {};
      insertedUsers.forEach(user => {
        userIdMap[user.email] = user.id;
      });

      // Get client IDs for company profiles
      const insertedClients = await queryInterface.sequelize.query(
        `SELECT id, email FROM Users WHERE email IN ('client1@example.com', 'client2@example.com', 'client3@example.com')`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const clientIdMap = {};
      insertedClients.forEach(client => {
        clientIdMap[client.email] = client.id;
      });

      // Create client profiles/company info
      const clientProfiles = [
        {
          userId: clientIdMap['client1@example.com'],
          company: 'TechStart Inc',
          industry: 'Technology',
          companySize: '10-50',
          website: 'https://techstart.example.com',
          phone: '+1-555-0101',
          createdAt: now,
          updatedAt: now
        },
        {
          userId: clientIdMap['client2@example.com'],
          company: 'Marketing Solutions LLC',
          industry: 'Marketing',
          companySize: '50-200',
          website: 'https://marketingsolutions.example.com',
          phone: '+1-555-0102',
          createdAt: now,
          updatedAt: now
        },
        {
          userId: clientIdMap['client3@example.com'],
          company: 'Legal Advisors Group',
          industry: 'Legal Services',
          companySize: '5-10',
          website: 'https://legaladvisors.example.com',
          phone: '+1-555-0103',
          createdAt: now,
          updatedAt: now
        }
      ];

      await queryInterface.bulkInsert('ClientProfiles', clientProfiles);

      // Create VA profiles
      const vaProfiles = [
        {
          userId: userIdMap['va1@milassist.com'],
          specialization: 'Administrative Support',
          tier: 'entry-level',
          hourlyRate: 25.00,
          bio: 'Experienced administrative support specialist with strong organizational skills. Proficient in calendar management, email handling, data entry, and document preparation. Detail-oriented and reliable.',
          skills: JSON.stringify(['Calendar Management', 'Email Management', 'Data Entry', 'Microsoft Office', 'Google Workspace', 'Scheduling']),
          availability: JSON.stringify({
            monday: ['09:00-17:00'],
            tuesday: ['09:00-17:00'],
            wednesday: ['09:00-17:00'],
            thursday: ['09:00-17:00'],
            friday: ['09:00-17:00']
          }),
          timezone: 'America/New_York',
          languages: JSON.stringify(['English', 'Spanish']),
          is_available: true,
          years_of_experience: 2,
          createdAt: now,
          updatedAt: now
        },
        {
          userId: userIdMap['va2@milassist.com'],
          specialization: 'Executive Assistant',
          tier: 'intermediate',
          hourlyRate: 35.00,
          bio: 'Professional executive assistant with 5+ years of experience supporting C-level executives. Expert in managing complex schedules, travel arrangements, and confidential matters. Exceptional communication and problem-solving skills.',
          skills: JSON.stringify(['Executive Support', 'Travel Planning', 'Meeting Coordination', 'Project Management', 'Confidentiality', 'Communication', 'Problem Solving']),
          availability: JSON.stringify({
            monday: ['08:00-18:00'],
            tuesday: ['08:00-18:00'],
            wednesday: ['08:00-18:00'],
            thursday: ['08:00-18:00'],
            friday: ['08:00-16:00']
          }),
          timezone: 'America/Chicago',
          languages: JSON.stringify(['English']),
          is_available: true,
          years_of_experience: 5,
          createdAt: now,
          updatedAt: now
        },
        {
          userId: userIdMap['va3@milassist.com'],
          specialization: 'Project Manager',
          tier: 'expert',
          hourlyRate: 50.00,
          bio: 'Certified Project Manager (PMP) with 8+ years of experience managing complex projects across multiple industries. Expert in Agile/Scrum methodologies, risk management, and stakeholder communication. Proven track record of delivering projects on time and within budget.',
          skills: JSON.stringify(['Project Management', 'Agile/Scrum', 'Risk Management', 'Budget Management', 'Team Leadership', 'Stakeholder Management', 'Jira', 'Asana', 'MS Project']),
          availability: JSON.stringify({
            monday: ['07:00-19:00'],
            tuesday: ['07:00-19:00'],
            wednesday: ['07:00-19:00'],
            thursday: ['07:00-19:00'],
            friday: ['07:00-15:00']
          }),
          timezone: 'America/Los_Angeles',
          languages: JSON.stringify(['English']),
          is_available: true,
          years_of_experience: 8,
          certifications: JSON.stringify(['PMP', 'Certified ScrumMaster']),
          createdAt: now,
          updatedAt: now
        },
        {
          userId: userIdMap['va4@milassist.com'],
          specialization: 'Social Media Manager',
          tier: 'specialist',
          hourlyRate: 45.00,
          bio: 'Creative social media manager with 6+ years of experience building and managing brand presence across all major platforms. Expert in content creation, community management, analytics, and paid advertising. Strong understanding of current trends and best practices.',
          skills: JSON.stringify(['Social Media Management', 'Content Creation', 'Community Management', 'Analytics', 'Facebook Ads', 'Instagram Marketing', 'LinkedIn', 'Hootsuite', 'Canva', 'Copywriting']),
          availability: JSON.stringify({
            monday: ['10:00-18:00'],
            tuesday: ['10:00-18:00'],
            wednesday: ['10:00-18:00'],
            thursday: ['10:00-18:00'],
            friday: ['10:00-18:00'],
            saturday: ['12:00-16:00']
          }),
          timezone: 'America/Denver',
          languages: JSON.stringify(['English', 'French']),
          is_available: true,
          years_of_experience: 6,
          createdAt: now,
          updatedAt: now
        },
        {
          userId: userIdMap['va5@milassist.com'],
          specialization: 'Executive Support',
          tier: 'senior',
          hourlyRate: 60.00,
          bio: 'Senior executive support professional with 10+ years of experience supporting multiple executives and managing high-level operations. Expert in strategic planning, business operations, and cross-functional coordination. Trusted advisor with exceptional judgment and discretion.',
          skills: JSON.stringify(['Executive Support', 'Strategic Planning', 'Business Operations', 'Board Meeting Coordination', 'Confidential Document Management', 'High-Level Communication', 'Crisis Management', 'International Business']),
          availability: JSON.stringify({
            monday: ['06:00-20:00'],
            tuesday: ['06:00-20:00'],
            wednesday: ['06:00-20:00'],
            thursday: ['06:00-20:00'],
            friday: ['06:00-18:00']
          }),
          timezone: 'America/New_York',
          languages: JSON.stringify(['English', 'Spanish', 'Portuguese']),
          is_available: true,
          years_of_experience: 10,
          certifications: JSON.stringify(['Certified Administrative Professional', 'Executive MBA']),
          createdAt: now,
          updatedAt: now
        }
      ];

      await queryInterface.bulkInsert('VAProfiles', vaProfiles);

      console.log('✅ Test accounts created successfully!');
      console.log('   - 1 Admin account');
      console.log('   - 3 Client accounts');
      console.log('   - 5 Virtual Assistant accounts');
      console.log('   - 3 Client profiles');
      console.log('   - 5 VA profiles');

    } catch (error) {
      console.error('❌ Error creating test accounts:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Delete in reverse order to handle foreign key constraints

      // Delete VA profiles
      await queryInterface.bulkDelete('VAProfiles', {
        userId: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT id FROM Users WHERE email IN ('va1@milassist.com', 'va2@milassist.com', 'va3@milassist.com', 'va4@milassist.com', 'va5@milassist.com'))`
          )
        }
      });

      // Delete client profiles
      await queryInterface.bulkDelete('ClientProfiles', {
        userId: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT id FROM Users WHERE email IN ('client1@example.com', 'client2@example.com', 'client3@example.com'))`
          )
        }
      });

      // Delete all test users
      await queryInterface.bulkDelete('Users', {
        email: {
          [Sequelize.Op.in]: [
            'admin@milassist.com',
            'client1@example.com',
            'client2@example.com',
            'client3@example.com',
            'va1@milassist.com',
            'va2@milassist.com',
            'va3@milassist.com',
            'va4@milassist.com',
            'va5@milassist.com'
          ]
        }
      });

      console.log('✅ Test accounts removed successfully!');

    } catch (error) {
      console.error('❌ Error removing test accounts:', error);
      throw error;
    }
  }
};
