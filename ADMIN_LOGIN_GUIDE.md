# 🔐 Admin Login Guide - Vercel Deployment

## 📍 Your Deployment Information

**Repository**: `jcastillotx/milassist`  
**Branch**: `agent/lets-review-the-implementation-plan-and-continue-f-16-uo-blackbox`  
**Latest Commit**: `26ba4ad - feat: add Vercel deployment configuration`

---

## 🚀 Accessing Your Deployed Application

### Step 1: Find Your Vercel URL

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your `milassist` project
3. Your URL will be something like:
   - `https://milassist.vercel.app`
   - `https://milassist-[hash].vercel.app`

### Step 2: Access Admin Panel

Navigate to:
```
https://your-app.vercel.app/admin
```

---

## 👤 Creating Your First Admin User

### **IMPORTANT**: No Admin User Exists Yet

Your Payload CMS deployment does **NOT** have any users created. You need to create the first admin user through the web interface.

### First-Time Setup Process:

1. **Navigate to Admin Panel**:
   ```
   https://your-app.vercel.app/admin
   ```

2. **You'll See "Create First User" Screen**:
   - This appears automatically on first access
   - No existing credentials needed

3. **Fill in the Form**:
   ```
   Full Name: [Your Name]
   Email: [your-email@example.com]
   Password: [Choose a secure password - min 8 characters]
   Confirm Password: [Same password]
   ```

4. **Click "Create"**

5. **You're Now Logged In!**
   - This user automatically has `admin` role
   - Full access to all collections and settings

---

## 🔑 Admin User Details

### User Roles Available:
- **admin** - Full system access (what you'll create first)
- **assistant** - Virtual assistant access
- **client** - Regular user access
- **family** - Family member access

### Your First Admin User Will Have:
- ✅ Full access to all collections
- ✅ Ability to create/edit/delete any data
- ✅ Access to all API endpoints
- ✅ Ability to create other users
- ✅ System configuration access

---

## ⚙️ Required Environment Variables

**CRITICAL**: Ensure these are set in Vercel:

### Minimum Required:
```bash
PAYLOAD_SECRET=<your-secure-secret-min-32-chars>
DATABASE_URI=postgresql://user:pass@host:5432/dbname
PAYLOAD_PUBLIC_SERVER_URL=https://your-app.vercel.app
```

### To Set in Vercel:
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add each variable:
   - `PAYLOAD_SECRET` - Generate with: `openssl rand -base64 32`
   - `DATABASE_URI` - Your PostgreSQL connection string (Supabase/Neon/etc)
   - `PAYLOAD_PUBLIC_SERVER_URL` - Your Vercel app URL

### Optional (for full functionality):
```bash
# AWS S3 Storage
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
S3_BUCKET=milassist-uploads

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-secret
```

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: Check your `DATABASE_URI` environment variable in Vercel settings

### Issue: "Invalid secret key"
**Solution**: Ensure `PAYLOAD_SECRET` is set and is at least 32 characters

### Issue: Can't access /admin
**Solution**: 
- Check deployment logs in Vercel
- Ensure build completed successfully
- Verify `vercel.json` routing is correct

### Issue: "Create First User" doesn't appear
**Solution**: 
- Database might already have users
- Check database directly or reset it
- Or use password reset if you forgot credentials

---

## 📝 After Creating Admin User

### Next Steps:

1. **Secure Your Account**:
   - Use a strong, unique password
   - Enable 2FA if available
   - Don't share credentials

2. **Create Additional Users**:
   - Go to Users collection
   - Click "Create New"
   - Assign appropriate roles

3. **Configure OAuth** (Optional):
   - Set up Google/Microsoft OAuth
   - Allow SSO for easier login

4. **Test API Access**:
   ```bash
   # Login via API
   curl -X POST https://your-app.vercel.app/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"your-password"}'
   ```

---

## 🎯 Quick Reference

| What | Where |
|------|-------|
| **Admin Panel** | `https://your-app.vercel.app/admin` |
| **API Endpoint** | `https://your-app.vercel.app/api` |
| **Login API** | `POST /api/users/login` |
| **Logout API** | `POST /api/users/logout` |
| **Current User** | `GET /api/users/me` |

---

## 🔐 Security Best Practices

1. ✅ Use strong passwords (min 12 characters, mixed case, numbers, symbols)
2. ✅ Set `PAYLOAD_SECRET` to a cryptographically secure random string
3. ✅ Use environment variables, never hardcode credentials
4. ✅ Enable HTTPS only (Vercel does this automatically)
5. ✅ Regularly rotate secrets and passwords
6. ✅ Monitor access logs for suspicious activity
7. ✅ Limit admin role to only necessary users

---

## 📞 Need Help?

- **Payload CMS Docs**: https://payloadcms.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Repo**: https://github.com/jcastillotx/milassist

---

**Last Updated**: January 13, 2026  
**Deployment Status**: ✅ Ready for first admin user creation
