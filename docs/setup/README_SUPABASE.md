# MilAssist with Supabase Database

This project is configured to use **Supabase** as the PostgreSQL database provider.

## 🚀 Quick Start

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) and create a new project
- Save your database password

### 2. Get Connection String
- Supabase Dashboard → Settings → Database → Connection string (URI)
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require`

### 3. Setup Environment
```bash
cd payload
npm run setup:env
# Follow the prompts to configure your .env file
```

Or manually create `.env`:
```env
DATABASE_URI=postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres?sslmode=require
PAYLOAD_SECRET=your-generated-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Install & Run
```bash
npm install
npm run build
npm run dev
```

### 5. Create Admin User
- Open: http://localhost:3000/admin
- Fill in the "Create First User" form

## 🛠️ Utility Scripts

```bash
# Test database connection
npm run test:db

# Generate new Payload secret
npm run generate:secret

# Interactive environment setup
npm run setup:env
```

## 📚 Documentation

- **Quick Start**: `QUICK_START_SUPABASE.md` - Get running in 5 minutes
- **Detailed Setup**: `SUPABASE_SETUP.md` - Complete configuration guide
- **Vercel Deployment**: `VERCEL_ENV_SETUP.md` - Deploy to production
- **Admin Login**: `ADMIN_LOGIN_GUIDE.md` - Access admin panel

## 🔧 Environment Variables

### Required
- `DATABASE_URI` - Supabase PostgreSQL connection string
- `PAYLOAD_SECRET` - Cryptographically secure secret (generate with `npm run generate:secret`)
- `PAYLOAD_PUBLIC_SERVER_URL` - Your application URL

### Optional
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth
- `OPENAI_API_KEY` - AI features

## 🚀 Deployment to Vercel

1. **Add Environment Variables** in Vercel Dashboard:
   - `DATABASE_URI` (Supabase connection string)
   - `PAYLOAD_SECRET` (generate new for production)
   - `PAYLOAD_PUBLIC_SERVER_URL` (your Vercel URL)

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Vercel Auto-deploys** your application

4. **Access Admin**: `https://your-app.vercel.app/admin`

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test your database connection
npm run test:db
```

### Common Errors
- **"Connection refused"**: Check Supabase project is active
- **"Password authentication failed"**: Verify password in connection string
- **"SSL required"**: Ensure `?sslmode=require` is appended

See `SUPABASE_SETUP.md` for detailed troubleshooting.

## 📊 Database Management

### View Tables
- Supabase Dashboard → Table Editor
- See all Payload CMS tables and data

### Backups
- Supabase Dashboard → Database → Backups
- Free tier: Daily backups (7-day retention)

### Monitoring
- Supabase Dashboard → Database → Usage
- Monitor connections, storage, and performance

## 🔒 Security

- ✅ Always use `?sslmode=require` in connection string
- ✅ Store secrets in environment variables only
- ✅ Never commit `.env` files to Git
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate `PAYLOAD_SECRET` every 90 days

## 📞 Support

- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Payload CMS**: [payloadcms.com/community](https://payloadcms.com/community)
- **Issues**: [GitHub Issues](https://github.com/jcastillotx/milassist/issues)

## ✅ Checklist

- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] Database connection tested
- [ ] Application running locally
- [ ] Admin user created
- [ ] Environment variables added to Vercel
- [ ] Deployed to production

---

**Database Provider**: Supabase (PostgreSQL)  
**Deployment Platform**: Vercel  
**CMS**: Payload CMS 3.0
