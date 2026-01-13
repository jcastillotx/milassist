# MilAssist Payload CMS Setup Instructions

## 📋 Prerequisites Checklist

Before proceeding, ensure you have:

- [ ] **Node.js 18+** installed
- [ ] **npm** or **yarn** installed
- [ ] **Supabase account** created
- [ ] **Supabase project** created with DATABASE_URI
- [ ] **AWS account** with S3 bucket created
- [ ] **AWS credentials** (Access Key ID and Secret Access Key)
- [ ] **Google OAuth credentials** (Client ID and Secret)
- [ ] **Microsoft OAuth credentials** (Client ID, Secret, and Tenant ID)

---

## 🚀 Step 1: Install Dependencies

```bash
cd /Users/jlaptop/Documents/GitHub/milassist/payload
npm install
```

This will install all required packages including:
- Payload CMS 3.0
- PostgreSQL adapter
- S3 storage plugin
- Next.js 15
- React 19
- And all other dependencies

---

## 🔐 Step 2: Configure Environment Variables

Create a `.env` file in the `payload/` directory:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials:

### Required Configuration

```env
# Payload Configuration
PAYLOAD_SECRET=your-super-secret-key-min-32-characters-change-this-now
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Database (Supabase PostgreSQL)
DATABASE_URI=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# AWS S3 Storage
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET=milassist-uploads
S3_ENDPOINT=https://s3.amazonaws.com

# JWT
JWT_SECRET=your-jwt-secret-key-change-this

# Google OAuth (SSO)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback

# Microsoft OAuth (SSO)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/oauth/microsoft/callback
```

### Optional Configuration (for integrations)

```env
# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Video Conferencing
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret

# Google Services
GOOGLE_CALENDAR_CLIENT_ID=your-google-calendar-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-google-calendar-client-secret
GOOGLE_FLIGHTS_API_KEY=your-google-flights-api-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Environment
NODE_ENV=development
```

---

## 🗄️ Step 3: Set Up AWS S3 Bucket

### Create S3 Bucket

1. Log in to AWS Console
2. Navigate to S3
3. Click "Create bucket"
4. Configure:
   - **Bucket name:** `milassist-uploads` (or your preferred name)
   - **Region:** `us-east-1` (or your preferred region)
   - **Block Public Access:** Uncheck (we'll configure CORS)
   - **Bucket Versioning:** Enable (recommended)

### Configure CORS

Add this CORS configuration to your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Create IAM User

1. Navigate to IAM → Users
2. Click "Create user"
3. User name: `milassist-s3-user`
4. Attach policy: `AmazonS3FullAccess` (or create custom policy)
5. Create access key
6. Save Access Key ID and Secret Access Key

### Custom IAM Policy (Recommended)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::milassist-uploads",
        "arn:aws:s3:::milassist-uploads/*"
      ]
    }
  ]
}
```

---

## 🔑 Step 4: Set Up Google OAuth (SSO)

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** MilAssist Platform
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `http://localhost:5173`
     - `https://your-production-domain.com`
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/oauth/google/callback`
     - `https://your-production-domain.com/api/oauth/google/callback`
6. Save Client ID and Client Secret

### Enable Required APIs

Enable these APIs in Google Cloud Console:
- Google+ API
- Google People API

---

## 🔑 Step 5: Set Up Microsoft OAuth (SSO)

### Create Microsoft App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure:
   - **Name:** MilAssist Platform
   - **Supported account types:** Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI:** 
     - Platform: Web
     - URI: `http://localhost:3000/api/oauth/microsoft/callback`
5. Click **Register**

### Configure App

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Save the secret value (you won't see it again)
4. Go to **API permissions**
5. Add permissions:
   - Microsoft Graph → Delegated permissions
   - `User.Read`
   - `email`
   - `profile`
   - `openid`
6. Grant admin consent

### Get Credentials

- **Application (client) ID** → This is your `MICROSOFT_CLIENT_ID`
- **Client secret value** → This is your `MICROSOFT_CLIENT_SECRET`
- **Directory (tenant) ID** → This is your `MICROSOFT_TENANT_ID` (or use `common` for multi-tenant)

---

## 🏃 Step 6: Run the Development Server

```bash
cd /Users/jlaptop/Documents/GitHub/milassist/payload
npm run dev
```

The server will start at `http://localhost:3000`

---

## 🎨 Step 7: Access the Admin Panel

1. Open browser to `http://localhost:3000/admin`
2. You'll see the Payload admin login screen
3. Create your first admin user:
   - **Email:** admin@milassist.com
   - **Password:** (choose a strong password)
   - **Name:** Admin User
   - **Role:** Admin

---

## ✅ Step 8: Verify Setup

### Test Database Connection
- Admin panel loads without errors
- Can create a user
- User appears in database

### Test S3 Storage
- Upload a file in Documents collection
- File appears in S3 bucket
- Can download file

### Test SSO (Optional)
- Click "Sign in with Google" button
- Redirects to Google OAuth
- Successfully authenticates
- User created in database

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
**Solution:**
- Verify DATABASE_URI is correct
- Check Supabase project is running
- Ensure IP is whitelisted in Supabase

### Error: "PAYLOAD_SECRET is required"
**Solution:**
- Ensure `.env` file exists in `payload/` directory
- PAYLOAD_SECRET must be at least 32 characters
- Restart dev server

### Error: "S3 upload failed"
**Solution:**
- Verify AWS credentials are correct
- Check S3 bucket exists
- Verify CORS configuration
- Check IAM permissions

### Error: "OAuth redirect mismatch"
**Solution:**
- Verify redirect URIs match exactly in OAuth provider settings
- Check GOOGLE_REDIRECT_URI and MICROSOFT_REDIRECT_URI in `.env`
- Ensure no trailing slashes

---

## 📚 Next Steps

Once setup is complete:

1. **Create Collections** - Follow IMPLEMENTATION_CHECKLIST.md Phase 1
2. **Implement SSO Endpoints** - Create OAuth callback handlers
3. **Migrate Data** - Import existing data from old system
4. **Update Frontend** - Connect React app to Payload APIs
5. **Deploy** - Follow deployment guide for Vercel

---

## 📞 Need Help?

- Check [Payload Documentation](https://payloadcms.com/docs)
- Review MIGRATION_PLAN.md for detailed architecture
- Check IMPLEMENTATION_CHECKLIST.md for task-by-task guide
- Join [Payload Discord](https://discord.com/invite/payload)

---

**Last Updated:** 2024-01-09
