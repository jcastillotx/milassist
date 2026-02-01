# Vercel Environment Variables Setup

This document lists all environment variables needed for deployment on Vercel.

## 🔑 Core Application

```bash
# Node Environment
NODE_ENV=production

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars

# Frontend URL (for OAuth redirects)
FRONTEND_URL=https://your-app.vercel.app

# Database (PostgreSQL on Vercel, Supabase, or elsewhere)
DATABASE_URL=postgresql://username:password@host:5432/database
```

## 💳 Stripe Payment Integration

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## ☁️ AWS S3 File Storage

```bash
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
S3_BUCKET=milassist-documents
```

## 📧 Email Integration

### Gmail (Google APIs)
```bash
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

### Office365 / Outlook (Microsoft Graph)
```bash
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MICROSOFT_TENANT_ID=common
```

### IMAP (Universal - No global config needed)
*IMAP credentials are stored per-user in the database*

## 📅 Calendar Integration

### Google Calendar
*Uses same Google OAuth credentials as Gmail above*

### Office365 Calendar
*Uses same Microsoft OAuth credentials as above*

### CalDAV (iCloud, Yahoo, Fastmail, etc.)
*Per-user credentials stored in database*

**Example CalDAV Configurations:**

**iCloud:**
```json
{
  "serverUrl": "https://caldav.icloud.com",
  "username": "your-apple-id@icloud.com",
  "password": "app-specific-password",
  "calendarUrl": "https://caldav.icloud.com/xxxxxxxxx/calendars/work/"
}
```

**Yahoo Calendar:**
```json
{
  "serverUrl": "https://caldav.calendar.yahoo.com",
  "username": "your-email@yahoo.com",
  "password": "app-password",
  "calendarUrl": "https://caldav.calendar.yahoo.com/dav/your-email@yahoo.com/Calendar/inbox/"
}
```

**Fastmail:**
```json
{
  "serverUrl": "https://caldav.fastmail.com",
  "username": "your-email@fastmail.com",
  "password": "your-password",
  "calendarUrl": "https://caldav.fastmail.com/dav/calendars/user/your-email@fastmail.com/Default/"
}
```

## 📞 Twilio Communication

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

## 🎥 Video Conferencing (Optional)

### Zoom
```bash
ZOOM_CLIENT_ID=xxxxxxxxxxxxx
ZOOM_CLIENT_SECRET=xxxxxxxxxxxxx
ZOOM_WEBHOOK_SECRET_TOKEN=xxxxxxxxxxxxx
```

### Microsoft Teams
*Uses same Microsoft credentials as above*

### Google Meet
*Uses same Google credentials as above*

## 🔧 Sync Settings (Optional)

```bash
# Sync intervals in minutes
EMAIL_SYNC_INTERVAL=5
CALENDAR_SYNC_INTERVAL=15

# Enable/disable features
ENABLE_EMAIL_SYNC=true
ENABLE_CALENDAR_SYNC=true
ENABLE_VIDEO_CONFERENCING=true
```

## 📊 Logging & Monitoring (Optional)

```bash
# Sentry Error Tracking
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxxxxxxxxxx

# Log Level
LOG_LEVEL=info

# Redis (for caching)
REDIS_URL=redis://username:password@host:6379
```

---

## 🚀 Quick Deploy Steps

### 1. In Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable from above
4. Select environment: Production, Preview, or Development

### 2. Required Variables (Minimum):

For basic deployment, you MUST have:
- `JWT_SECRET`
- `DATABASE_URL`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY` (if using payments)
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` (if using file uploads)

### 3. OAuth Variables:

For each integration you want to enable:
- **Gmail/Google Calendar**: Add `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- **Office365/Outlook**: Add `MICROSOFT_CLIENT_ID` + `MICROSOFT_CLIENT_SECRET`
- **Twilio**: Add `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN`

### 4. User-Specific Credentials:

These are stored in the database per user:
- IMAP email credentials
- CalDAV calendar credentials (iCloud, Yahoo, etc.)

Users will connect their accounts through the frontend UI.

---

## 🔒 Security Notes

1. **Never commit these values to git**
2. **Use Vercel's encrypted environment variables**
3. **Rotate secrets regularly**
4. **Use app-specific passwords** for email services
5. **Enable 2FA** on all service accounts
6. **Use least-privilege IAM roles** for AWS

---

## 📝 Environment Variable Priority

Vercel checks environment variables in this order:
1. Environment-specific (Production/Preview/Development)
2. All environments
3. `.env` file (local development only)

Use environment-specific variables for:
- Different database URLs (dev vs prod)
- Test Stripe keys (dev) vs live keys (prod)
- Development vs production OAuth redirect URLs

---

## ✅ Verification

After setting up, verify each integration:

```bash
# Test email sync
curl https://your-app.vercel.app/api/email-sync/test

# Test calendar sync
curl https://your-app.vercel.app/api/calendar-sync/test

# Test file upload
curl -X POST https://your-app.vercel.app/api/documents/upload

# Test payments
curl https://your-app.vercel.app/api/payments/health
```

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [Microsoft App Registration](https://portal.azure.com/)
- [AWS IAM Console](https://console.aws.amazon.com/iam/)
- [Stripe Dashboard](https://dashboard.stripe.com/)

---

## 🆘 Troubleshooting

**Issue: OAuth redirect mismatch**
- Solution: Add `https://your-app.vercel.app/api/oauth/callback` to OAuth providers

**Issue: Database connection fails**
- Solution: Verify `DATABASE_URL` format and connection pooling settings

**Issue: File uploads fail**
- Solution: Check AWS credentials and S3 bucket permissions (public read for signed URLs)

**Issue: CalDAV connection timeout**
- Solution: Verify server URL format and app-specific passwords are enabled
