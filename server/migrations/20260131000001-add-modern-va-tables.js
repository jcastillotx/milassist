'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create AuditLogs table
    await queryInterface.createTable('AuditLogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'low'
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      targetUserId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      resourceType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resourceId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      action: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      details: {
        type: Sequelize.JSON,
        allowNull: true
      },
      archived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      archivedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for AuditLogs
    await queryInterface.addIndex('AuditLogs', ['userId']);
    await queryInterface.addIndex('AuditLogs', ['targetUserId']);
    await queryInterface.addIndex('AuditLogs', ['eventType']);
    await queryInterface.addIndex('AuditLogs', ['severity']);
    await queryInterface.addIndex('AuditLogs', ['createdAt']);
    await queryInterface.addIndex('AuditLogs', ['resourceType', 'resourceId']);

    // Create AccessControls table
    await queryInterface.createTable('AccessControls', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      resourceType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resourceId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      grantedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for AccessControls
    await queryInterface.addIndex('AccessControls', ['userId']);
    await queryInterface.addIndex('AccessControls', ['resourceType', 'resourceId']);
    await queryInterface.addIndex('AccessControls', ['expiresAt']);

    // Create VAProfiles table
    await queryInterface.createTable('VAProfiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM(
          'executive_support',
          'crm_sales_ops',
          'growth_marketing',
          'financial_admin',
          'technical_pm',
          'customer_success'
        ),
        allowNull: false
      },
      tier: {
        type: Sequelize.ENUM('general', 'specialized', 'executive', 'technical'),
        allowNull: false,
        defaultValue: 'general'
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      skills: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      certifications: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      toolProficiency: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      languages: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      availabilitySchedule: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      weeklyCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 40
      },
      currentLoad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      yearsExperience: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      industries: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tagline: {
        type: Sequelize.STRING,
        allowNull: true
      },
      portfolio: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      status: {
        type: Sequelize.ENUM('available', 'busy', 'unavailable'),
        defaultValue: 'available'
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true
      },
      completedTasks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      responseTime: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      backgroundCheckStatus: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: true
      },
      backgroundCheckDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ndaSigned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ndaSignedDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for VAProfiles
    await queryInterface.addIndex('VAProfiles', ['userId']);
    await queryInterface.addIndex('VAProfiles', ['role']);
    await queryInterface.addIndex('VAProfiles', ['tier']);
    await queryInterface.addIndex('VAProfiles', ['status']);

    // Create VAMatches table
    await queryInterface.createTable('VAMatches', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vaId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'VAProfiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      matchScore: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      scoreBreakdown: {
        type: Sequelize.JSON,
        allowNull: true
      },
      requirements: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('suggested', 'reviewed', 'accepted', 'rejected'),
        defaultValue: 'suggested'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for VAMatches
    await queryInterface.addIndex('VAMatches', ['clientId']);
    await queryInterface.addIndex('VAMatches', ['vaId']);
    await queryInterface.addIndex('VAMatches', ['status']);
    await queryInterface.addIndex('VAMatches', ['matchScore']);

    // Create Emails table
    await queryInterface.createTable('Emails', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      messageId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      threadId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provider: {
        type: Sequelize.ENUM('gmail', 'office365', 'imap'),
        allowNull: false
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false
      },
      to: {
        type: Sequelize.JSON,
        allowNull: false
      },
      cc: {
        type: Sequelize.JSON,
        allowNull: true
      },
      bcc: {
        type: Sequelize.JSON,
        allowNull: true
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: true
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      htmlBody: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isStarred: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      labels: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      receivedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for Emails
    await queryInterface.addIndex('Emails', ['userId']);
    await queryInterface.addIndex('Emails', ['messageId']);
    await queryInterface.addIndex('Emails', ['threadId']);
    await queryInterface.addIndex('Emails', ['receivedAt']);

    // Create CalendarEvents table
    await queryInterface.createTable('CalendarEvents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      eventId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provider: {
        type: Sequelize.ENUM('google', 'microsoft', 'caldav'),
        allowNull: false
      },
      calendarId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isAllDay: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      attendees: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      organizer: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('confirmed', 'tentative', 'cancelled'),
        defaultValue: 'confirmed'
      },
      meetingLink: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reminders: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      recurrence: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for CalendarEvents
    await queryInterface.addIndex('CalendarEvents', ['userId']);
    await queryInterface.addIndex('CalendarEvents', ['eventId', 'provider']);
    await queryInterface.addIndex('CalendarEvents', ['startTime']);
    await queryInterface.addIndex('CalendarEvents', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CalendarEvents');
    await queryInterface.dropTable('Emails');
    await queryInterface.dropTable('VAMatches');
    await queryInterface.dropTable('VAProfiles');
    await queryInterface.dropTable('AccessControls');
    await queryInterface.dropTable('AuditLogs');
  }
};
