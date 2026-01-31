# Calendar Provider Setup Guide

Complete guide for connecting all supported calendar providers to MilAssist.

---

## 📅 Supported Calendar Providers

| Provider | Protocol | Meeting Links | Status |
|----------|----------|---------------|--------|
| Google Calendar | Google API | Google Meet | ✅ Ready |
| Office365 Calendar | Microsoft Graph | Teams | ✅ Ready |
| Outlook.com | Microsoft Graph | Teams | ✅ Ready |
| iCloud Calendar | CalDAV | Manual | ✅ Ready |
| Yahoo Calendar | CalDAV | Manual | ✅ Ready |
| Fastmail | CalDAV | Manual | ✅ Ready |
| Any CalDAV | CalDAV | Manual | ✅ Ready |

---

## 🔧 Setup Instructions by Provider

### 1. Google Calendar (OAuth)

**Requirements:**
- Google Cloud Console project
- Calendar API enabled
- OAuth 2.0 credentials

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Enable "Google Calendar API"
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-app.com/api/oauth/google/callback`
5. Copy Client ID and Client Secret to Vercel environment variables

**Environment Variables:**
```bash
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

**Usage in App:**
```javascript
const googleCalendar = require('./services/googleCalendar');

// Get events
const events = await googleCalendar.getEvents(accessToken, refreshToken, {
  calendarId: 'primary',
  timeMin: new Date().toISOString(),
  maxResults: 50
});

// Create event with Google Meet link
const event = await googleCalendar.createEvent(accessToken, refreshToken, {
  title: 'Team Standup',
  start: '2024-02-01T10:00:00Z',
  end: '2024-02-01T10:30:00Z',
  attendees: ['user@example.com'],
  addMeetLink: true  // ← Automatically adds Google Meet
});
```

**Features:**
- ✅ List all calendars
- ✅ Create/read/update/delete events
- ✅ Automatic Google Meet link generation
- ✅ Attendee management
- ✅ Background sync every 15 minutes
- ✅ Token auto-refresh

---

### 2. Office365 / Outlook Calendar (OAuth)

**Requirements:**
- Azure AD app registration
- Calendar.ReadWrite delegated permission
- OnlineMeetings.ReadWrite (for Teams meetings)

**Setup Steps:**

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Create new registration:
   - Name: MilAssist Calendar Integration
   - Supported account types: Multitenant
   - Redirect URI: `https://your-app.com/api/oauth/microsoft/callback`
4. Add API permissions:
   - Microsoft Graph → Delegated → `Calendars.ReadWrite`
   - Microsoft Graph → Delegated → `OnlineMeetings.ReadWrite`
5. Create client secret in "Certificates & secrets"
6. Copy Application (client) ID and secret to Vercel

**Environment Variables:**
```bash
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MICROSOFT_TENANT_ID=common
```

**Usage in App:**
```javascript
const office365Calendar = require('./services/office365Calendar');

// Get events
const events = await office365Calendar.getEvents(accessToken, {
  calendarId: 'primary',
  startDateTime: '2024-02-01T00:00:00Z',
  endDateTime: '2024-03-01T00:00:00Z'
});

// Create event with Teams meeting
const event = await office365Calendar.createEvent(accessToken, {
  title: 'Client Review',
  start: '2024-02-01T14:00:00Z',
  end: '2024-02-01T15:00:00Z',
  attendees: ['client@example.com'],
  addTeamsMeeting: true  // ← Automatically adds Teams meeting
});
```

**Features:**
- ✅ List all calendars
- ✅ Create/read/update/delete events
- ✅ Automatic Teams meeting link generation
- ✅ Attendee management
- ✅ Background sync every 15 minutes
- ✅ Works with Outlook.com and Office365

---

### 3. iCloud Calendar (CalDAV)

**Requirements:**
- Apple ID
- App-specific password (2FA must be enabled)

**Setup Steps:**

1. Go to [appleid.apple.com](https://appleid.apple.com/)
2. Sign in and go to Security
3. Generate app-specific password
4. Find your calendar URL:
   - Open Calendar app on Mac
   - Right-click calendar → "Get Info"
   - Look for CalDAV URL

**Configuration Format:**
```json
{
  "serverUrl": "https://caldav.icloud.com",
  "username": "your-apple-id@icloud.com",
  "password": "xxxx-xxxx-xxxx-xxxx",  // App-specific password
  "calendarUrl": "https://caldav.icloud.com/xxxxxxxxx/calendars/work/"
}
```

**Finding Your Calendar URL:**
```bash
# Calendar URL format:
https://caldav.icloud.com/{dsid}/calendars/{calendar-name}/
```

**Usage in App:**
```javascript
const caldavCalendar = require('./services/caldavCalendar');

// Connect
const connectionId = `icloud_${userId}`;
await caldavCalendar.connect(connectionId, {
  serverUrl: 'https://caldav.icloud.com',
  username: 'user@icloud.com',
  password: 'xxxx-xxxx-xxxx-xxxx'
});

// List calendars
const calendars = await caldavCalendar.listCalendars(connectionId);

// Get events
const events = await caldavCalendar.getEvents(connectionId, {
  calendarUrl: calendars[0].url,
  timeMin: new Date(),
  timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
});

// Create event
await caldavCalendar.createEvent(connectionId, calendars[0].url, {
  title: 'Important Meeting',
  start: '2024-02-01T10:00:00Z',
  end: '2024-02-01T11:00:00Z',
  description: 'Zoom link: https://zoom.us/j/123456789',
  attendees: ['user@example.com']
});
```

**Features:**
- ✅ List all iCloud calendars
- ✅ Create/read/update/delete events
- ✅ Attendee management
- ✅ Background sync every 15 minutes
- ⚠️ No automatic meeting links (add manually to description)

---

### 4. Yahoo Calendar (CalDAV)

**Requirements:**
- Yahoo account
- App password (if 2FA enabled)

**Setup Steps:**

1. Go to [Yahoo Account Security](https://login.yahoo.com/account/security)
2. Enable "Allow apps that use less secure sign in" OR generate app password
3. Use CalDAV endpoint

**Configuration Format:**
```json
{
  "serverUrl": "https://caldav.calendar.yahoo.com",
  "username": "your-email@yahoo.com",
  "password": "your-password-or-app-password",
  "calendarUrl": "https://caldav.calendar.yahoo.com/dav/your-email@yahoo.com/Calendar/inbox/"
}
```

**Calendar URL Structure:**
```bash
https://caldav.calendar.yahoo.com/dav/{username}/Calendar/{calendar-name}/
```

**Usage:** Same as iCloud CalDAV (see above)

---

### 5. Fastmail Calendar (CalDAV)

**Requirements:**
- Fastmail account
- App password recommended

**Setup Steps:**

1. Log in to [Fastmail](https://www.fastmail.com/)
2. Settings → Password & Security → App Passwords
3. Create new app password for "Calendar"

**Configuration Format:**
```json
{
  "serverUrl": "https://caldav.fastmail.com",
  "username": "your-email@fastmail.com",
  "password": "your-app-password",
  "calendarUrl": "https://caldav.fastmail.com/dav/calendars/user/your-email@fastmail.com/Default/"
}
```

**Features:**
- ✅ Full CalDAV support
- ✅ Multiple calendars
- ✅ Fast sync performance
- ✅ Excellent reliability

---

### 6. Generic CalDAV (Any Provider)

Most calendar services support CalDAV. Common providers:

| Provider | Server URL | Port | Notes |
|----------|------------|------|-------|
| iCloud | `caldav.icloud.com` | 443 | Requires app-specific password |
| Yahoo | `caldav.calendar.yahoo.com` | 443 | May need "less secure" enabled |
| Fastmail | `caldav.fastmail.com` | 443 | Excellent CalDAV support |
| AOL | `caldav.aol.com` | 443 | Similar to Yahoo |
| GMX | `caldav.gmx.net` | 443 | European provider |
| Posteo | `posteo.de:8443` | 8443 | Privacy-focused |
| Mailbox.org | `dav.mailbox.org` | 443 | German provider |

**Generic Configuration:**
```json
{
  "serverUrl": "https://caldav.example.com",
  "username": "your-username",
  "password": "your-password",
  "calendarUrl": "https://caldav.example.com/calendars/default/"
}
```

---

## 🔄 Background Sync Configuration

All calendar providers sync automatically via the sync scheduler.

**Default Settings:**
```javascript
// server/services/syncScheduler.js

// Calendars sync every 15 minutes
this.calendarSyncJob = cron.schedule('*/15 * * * *', async () => {
  await this.syncAllCalendars();
});
```

**Customize Sync Intervals:**
```bash
# In Vercel environment variables
CALENDAR_SYNC_INTERVAL=15  # minutes
```

**Manual Sync:**
```javascript
// Trigger manual sync for specific user
await syncScheduler.syncUserCalendar(userId, 'google');
await syncScheduler.syncUserCalendar(userId, 'office365');
await syncScheduler.syncUserCalendar(userId, 'caldav');
```

---

## 💾 Database Storage

All synced calendar events are stored in the `CalendarEvents` table:

```javascript
{
  id: "uuid",
  userId: "user-uuid",
  externalId: "event-id-from-provider",
  provider: "google" | "office365" | "caldav" | "icloud" | "yahoo_calendar",
  title: "Event title",
  description: "Event description",
  location: "Event location",
  startTime: "2024-02-01T10:00:00Z",
  endTime: "2024-02-01T11:00:00Z",
  isAllDay: false,
  attendees: '["user@example.com", "other@example.com"]',
  meetingLink: "https://meet.google.com/abc-defg-hij",
  status: "confirmed" | "tentative" | "cancelled"
}
```

---

## 🎯 Frontend Integration

**Connect Calendar Button:**
```jsx
// Connect Google Calendar
const connectGoogleCalendar = () => {
  window.location.href = '/api/oauth/google?scope=calendar';
};

// Connect Office365 Calendar
const connectOffice365Calendar = () => {
  window.location.href = '/api/oauth/microsoft?scope=calendar';
};

// Connect CalDAV (iCloud/Yahoo/etc.)
const connectCalDAV = async (config) => {
  await fetch('/api/calendar-sync/caldav/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
};
```

**Display User's Calendars:**
```jsx
const calendars = await fetch('/api/calendar-sync/list').then(r => r.json());

calendars.forEach(cal => {
  console.log(`${cal.provider}: ${cal.name}`);
});
```

---

## 🔐 Security Best Practices

1. **Always use HTTPS** for CalDAV connections
2. **Use app-specific passwords** instead of main account passwords
3. **Rotate credentials** every 90 days
4. **Limit OAuth scopes** to only what's needed
5. **Store credentials encrypted** in database
6. **Validate redirect URIs** in OAuth providers
7. **Implement rate limiting** on sync endpoints
8. **Log failed authentication attempts**

---

## 🐛 Troubleshooting

### Google Calendar

**Issue: "Invalid grant" error**
- Solution: Refresh token expired, user needs to re-authorize

**Issue: Meeting link not generated**
- Solution: Set `conferenceDataVersion=1` in createEvent call

### Office365 Calendar

**Issue: "Insufficient privileges" error**
- Solution: Add `Calendars.ReadWrite` and `OnlineMeetings.ReadWrite` permissions in Azure

**Issue: Teams link not included**
- Solution: Set `isOnlineMeeting: true` in event creation

### iCloud Calendar

**Issue: "Authentication failed" error**
- Solution: Generate new app-specific password at appleid.apple.com

**Issue: Can't find calendar URL**
- Solution: Use generic format: `https://caldav.icloud.com/DSID/calendars/calendar-name/`

### Yahoo Calendar

**Issue: Connection timeout**
- Solution: Enable "Allow apps that use less secure sign in" in Yahoo settings

**Issue: Invalid URL**
- Solution: Use full path with username: `/dav/user@yahoo.com/Calendar/inbox/`

---

## 📊 Provider Comparison

| Feature | Google | Office365 | iCloud | Yahoo | Fastmail |
|---------|--------|-----------|--------|-------|----------|
| OAuth | ✅ | ✅ | ❌ | ❌ | ❌ |
| CalDAV | ❌ | ❌ | ✅ | ✅ | ✅ |
| Auto Meeting Links | ✅ Meet | ✅ Teams | ❌ | ❌ | ❌ |
| Multiple Calendars | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recurring Events | ✅ | ✅ | ✅ | ✅ | ✅ |
| Attendee Management | ✅ | ✅ | ✅ | ✅ | ✅ |
| Real-time Push | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reliability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ Testing Checklist

- [ ] Google Calendar OAuth flow
- [ ] Office365 Calendar OAuth flow
- [ ] iCloud CalDAV connection
- [ ] Yahoo CalDAV connection
- [ ] Create event with meeting link
- [ ] Update existing event
- [ ] Delete event
- [ ] List all calendars
- [ ] Background sync runs automatically
- [ ] Manual sync trigger works
- [ ] Events stored in database
- [ ] Error handling for invalid credentials

---

## 📚 Additional Resources

- [Google Calendar API Docs](https://developers.google.com/calendar/api)
- [Microsoft Graph Calendar Docs](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
- [CalDAV RFC 4791](https://datatracker.ietf.org/doc/html/rfc4791)
- [iCloud CalDAV Guide](https://support.apple.com/en-us/HT202361)
- [ical.js Documentation](https://mozilla-comm.github.io/ical.js/)
