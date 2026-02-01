# MilAssist Test Accounts

This document contains all test account credentials for the MilAssist platform. These accounts are created via the Sequelize seeder and are intended for development and testing purposes only.

## Quick Access URLs

- **Admin Dashboard**: http://localhost:3000/admin
- **Client Dashboard**: http://localhost:3000/client/dashboard
- **VA Dashboard**: http://localhost:3000/assistant/dashboard
- **Login Page**: http://localhost:3000/login

---

## Admin Account

### Admin User
- **Email**: admin@milassist.com
- **Password**: Admin123!Test
- **Role**: admin
- **Full Name**: Admin User
- **Access**: Full platform administration capabilities

**Features**:
- User management (view, edit, suspend users)
- Platform analytics and reporting
- System configuration
- Financial oversight
- Audit logs
- VA approval and tier management

---

## Client Accounts

### Client 1 - Technology Sector
- **Email**: client1@example.com
- **Password**: Client123!
- **Role**: client
- **Full Name**: John Smith
- **Company**: TechStart Inc
- **Industry**: Technology
- **Company Size**: 10-50 employees
- **Phone**: +1-555-0101
- **Website**: https://techstart.example.com

**Use Case**: Startup needing administrative and project management support

### Client 2 - Marketing Sector
- **Email**: client2@example.com
- **Password**: Client123!
- **Role**: client
- **Full Name**: Sarah Johnson
- **Company**: Marketing Solutions LLC
- **Industry**: Marketing
- **Company Size**: 50-200 employees
- **Phone**: +1-555-0102
- **Website**: https://marketingsolutions.example.com

**Use Case**: Marketing agency needing social media and content support

### Client 3 - Legal Sector
- **Email**: client3@example.com
- **Password**: Client123!
- **Role**: client
- **Full Name**: Michael Chen
- **Company**: Legal Advisors Group
- **Industry**: Legal Services
- **Company Size**: 5-10 employees
- **Phone**: +1-555-0103
- **Website**: https://legaladvisors.example.com

**Use Case**: Small law firm needing executive assistant support

**Client Features**:
- Browse and hire virtual assistants
- Post job requirements
- Manage contracts and agreements
- Time tracking and approval
- Invoice management
- Project collaboration
- Performance reviews

---

## Virtual Assistant Accounts

### VA 1 - Entry Level Administrative Support
- **Email**: va1@milassist.com
- **Password**: Assistant123!
- **Role**: assistant
- **Full Name**: Emily Rodriguez
- **Specialization**: Administrative Support
- **Tier**: entry-level
- **Hourly Rate**: $25.00/hour
- **Experience**: 2 years
- **Timezone**: America/New_York (EST)
- **Languages**: English, Spanish

**Skills**: Calendar Management, Email Management, Data Entry, Microsoft Office, Google Workspace, Scheduling

**Availability**:
- Monday - Friday: 9:00 AM - 5:00 PM EST

**Bio**: Experienced administrative support specialist with strong organizational skills. Proficient in calendar management, email handling, data entry, and document preparation. Detail-oriented and reliable.

---

### VA 2 - Intermediate Executive Assistant
- **Email**: va2@milassist.com
- **Password**: Assistant123!
- **Role**: assistant
- **Full Name**: Jessica Martinez
- **Specialization**: Executive Assistant
- **Tier**: intermediate
- **Hourly Rate**: $35.00/hour
- **Experience**: 5 years
- **Timezone**: America/Chicago (CST)
- **Languages**: English

**Skills**: Executive Support, Travel Planning, Meeting Coordination, Project Management, Confidentiality, Communication, Problem Solving

**Availability**:
- Monday - Thursday: 8:00 AM - 6:00 PM CST
- Friday: 8:00 AM - 4:00 PM CST

**Bio**: Professional executive assistant with 5+ years of experience supporting C-level executives. Expert in managing complex schedules, travel arrangements, and confidential matters. Exceptional communication and problem-solving skills.

---

### VA 3 - Expert Project Manager
- **Email**: va3@milassist.com
- **Password**: Assistant123!
- **Role**: assistant
- **Full Name**: Amanda Williams
- **Specialization**: Project Manager
- **Tier**: expert
- **Hourly Rate**: $50.00/hour
- **Experience**: 8 years
- **Timezone**: America/Los_Angeles (PST)
- **Languages**: English
- **Certifications**: PMP, Certified ScrumMaster

**Skills**: Project Management, Agile/Scrum, Risk Management, Budget Management, Team Leadership, Stakeholder Management, Jira, Asana, MS Project

**Availability**:
- Monday - Thursday: 7:00 AM - 7:00 PM PST
- Friday: 7:00 AM - 3:00 PM PST

**Bio**: Certified Project Manager (PMP) with 8+ years of experience managing complex projects across multiple industries. Expert in Agile/Scrum methodologies, risk management, and stakeholder communication. Proven track record of delivering projects on time and within budget.

---

### VA 4 - Specialist Social Media Manager
- **Email**: va4@milassist.com
- **Password**: Assistant123!
- **Role**: assistant
- **Full Name**: Lisa Anderson
- **Specialization**: Social Media Manager
- **Tier**: specialist
- **Hourly Rate**: $45.00/hour
- **Experience**: 6 years
- **Timezone**: America/Denver (MST)
- **Languages**: English, French

**Skills**: Social Media Management, Content Creation, Community Management, Analytics, Facebook Ads, Instagram Marketing, LinkedIn, Hootsuite, Canva, Copywriting

**Availability**:
- Monday - Friday: 10:00 AM - 6:00 PM MST
- Saturday: 12:00 PM - 4:00 PM MST

**Bio**: Creative social media manager with 6+ years of experience building and managing brand presence across all major platforms. Expert in content creation, community management, analytics, and paid advertising. Strong understanding of current trends and best practices.

---

### VA 5 - Senior Executive Support
- **Email**: va5@milassist.com
- **Password**: Assistant123!
- **Role**: assistant
- **Full Name**: Maria Garcia
- **Specialization**: Executive Support
- **Tier**: senior
- **Hourly Rate**: $60.00/hour
- **Experience**: 10 years
- **Timezone**: America/New_York (EST)
- **Languages**: English, Spanish, Portuguese
- **Certifications**: Certified Administrative Professional, Executive MBA

**Skills**: Executive Support, Strategic Planning, Business Operations, Board Meeting Coordination, Confidential Document Management, High-Level Communication, Crisis Management, International Business

**Availability**:
- Monday - Thursday: 6:00 AM - 8:00 PM EST
- Friday: 6:00 AM - 6:00 PM EST

**Bio**: Senior executive support professional with 10+ years of experience supporting multiple executives and managing high-level operations. Expert in strategic planning, business operations, and cross-functional coordination. Trusted advisor with exceptional judgment and discretion.

---

## VA Features

All virtual assistants have access to:
- Profile management (bio, skills, rates, availability)
- Job browsing and application
- Contract management
- Time tracking (clock in/out)
- Invoice generation
- Client communication
- Task management
- Document sharing
- Performance metrics
- Payment history

---

## Role-Based Feature Access Matrix

| Feature | Admin | Client | Virtual Assistant |
|---------|-------|--------|-------------------|
| **User Management** |
| View all users | ✅ | ❌ | ❌ |
| Edit user profiles | ✅ | Own only | Own only |
| Suspend/activate users | ✅ | ❌ | ❌ |
| Approve VA accounts | ✅ | ❌ | ❌ |
| **Financial** |
| View all transactions | ✅ | Own only | Own only |
| Process payments | ✅ | ✅ | ❌ |
| Generate invoices | ✅ | ❌ | ✅ |
| Set payment terms | ✅ | ✅ | ❌ |
| **Contracts** |
| Create contracts | ✅ | ✅ | ❌ |
| Accept contracts | ✅ | ❌ | ✅ |
| Terminate contracts | ✅ | ✅ | ✅ |
| View contract templates | ✅ | ✅ | ✅ |
| **Time Tracking** |
| Clock in/out | ❌ | ❌ | ✅ |
| View time entries | ✅ | ✅ | ✅ |
| Approve time entries | ✅ | ✅ | ❌ |
| Edit time entries | ✅ | ✅ (before approval) | ✅ (own, before approval) |
| **Job Management** |
| Post jobs | ✅ | ✅ | ❌ |
| Apply to jobs | ❌ | ❌ | ✅ |
| Review applications | ✅ | ✅ | ❌ |
| Hire VAs | ✅ | ✅ | ❌ |
| **Analytics** |
| Platform analytics | ✅ | ❌ | ❌ |
| Personal analytics | ✅ | ✅ | ✅ |
| Financial reports | ✅ | ✅ | ✅ |
| Performance metrics | ✅ | ✅ | ✅ |
| **Communication** |
| Direct messaging | ✅ | ✅ | ✅ |
| Broadcast announcements | ✅ | ❌ | ❌ |
| Team collaboration | ✅ | ✅ | ✅ |
| **Settings** |
| System configuration | ✅ | ❌ | ❌ |
| Profile settings | ✅ | ✅ | ✅ |
| Notification preferences | ✅ | ✅ | ✅ |
| Security settings | ✅ | ✅ | ✅ |

---

## Running the Seeder

### Initial Setup

1. **Install dependencies** (if not already done):
   ```bash
   cd /Users/officedesktop/Documents/GitHub/milassist/server
   npm install bcrypt
   ```

2. **Ensure database is set up**:
   ```bash
   # Run migrations first
   npx sequelize-cli db:migrate
   ```

### Run the Seeder

```bash
# Create test accounts
npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js
```

### Verify Accounts

```bash
# Check the database
psql milassist_dev -c "SELECT email, role, full_name FROM \"Users\" WHERE email LIKE '%milassist.com' OR email LIKE '%example.com';"
```

### Rollback (Remove Test Accounts)

```bash
# Remove test accounts
npx sequelize-cli db:seed:undo --seed 20260201000000-test-accounts.js
```

### Re-seed (Refresh Test Data)

```bash
# Remove and recreate
npx sequelize-cli db:seed:undo --seed 20260201000000-test-accounts.js
npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js
```

---

## Testing Scenarios

### Scenario 1: Client Hiring a VA
1. Log in as **client1@example.com**
2. Browse available VAs
3. Post a job requirement
4. Review VA applications
5. Hire VA 2 (Jessica Martinez - Executive Assistant)
6. Create and sign contract
7. Approve time entries
8. Process payment

### Scenario 2: VA Managing Work
1. Log in as **va2@milassist.com**
2. Browse available jobs
3. Apply to client's job posting
4. Accept contract offer
5. Clock in/out for work sessions
6. Submit time entries
7. Generate invoice
8. View payment history

### Scenario 3: Admin Platform Management
1. Log in as **admin@milassist.com**
2. Review all platform users
3. Approve new VA account (if any pending)
4. View transaction reports
5. Monitor active contracts
6. Review platform analytics
7. Generate financial reports

### Scenario 4: Multi-VA Project
1. Client 2 (Marketing) posts social media campaign job
2. VA 4 (Social Media Manager) applies and gets hired
3. Client 2 also needs project management
4. VA 3 (Project Manager) applies and coordinates with VA 4
5. Both VAs track time and collaborate
6. Client reviews and approves work

---

## Security Notes

1. **Development Only**: These accounts are for development and testing only
2. **Password Requirements**: All passwords meet the 8+ character requirement
3. **Email Verification**: All accounts have `email_verified: true` for testing
4. **Active Status**: All accounts are active by default
5. **Production**: DO NOT use these credentials in production
6. **Seeder Safety**: The seeder is idempotent - safe to run multiple times

---

## Troubleshooting

### Seeder Fails with "Users table not found"
**Solution**: Run migrations first
```bash
npx sequelize-cli db:migrate
```

### Duplicate Key Error
**Solution**: Accounts already exist. Run rollback first
```bash
npx sequelize-cli db:seed:undo --seed 20260201000000-test-accounts.js
```

### bcrypt Error
**Solution**: Install bcrypt dependency
```bash
npm install bcrypt
```

### Foreign Key Constraint Error
**Solution**: Ensure tables exist in correct order (Users → ClientProfiles/VAProfiles)

---

## Additional Test Data

### Sample Tasks (for testing)
- **Task 1**: Update company website content (Client 1 → VA 1)
- **Task 2**: Schedule executive meetings for Q1 (Client 3 → VA 2)
- **Task 3**: Manage product launch project (Client 1 → VA 3)
- **Task 4**: Create social media campaign (Client 2 → VA 4)
- **Task 5**: Board meeting preparation (Client 3 → VA 5)

### Sample Time Entries
- 4-hour blocks for administrative tasks
- 8-hour blocks for project management
- 2-hour blocks for social media updates
- Full-day (8+ hours) for executive support

---

## Summary

- **Total Test Accounts**: 9 users
  - 1 Admin
  - 3 Clients (across different industries)
  - 5 Virtual Assistants (across all tiers and specializations)

- **Complete Profiles**: All users have complete profile information
- **Realistic Data**: Industry-appropriate skills, rates, and availability
- **Ready to Test**: All accounts are active and email-verified

For questions or issues, refer to the main project documentation or contact the development team.
