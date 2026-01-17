# Vercel Environment Variables Setup

## 🔧 Required Environment Variables

Your MilAssist Payload CMS deployment requires the following environment variables to be configured in Vercel Dashboard.

## 📋 Step-by-Step Setup

### 1. Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **milassist** project
3. Navigate to **Settings** → **Environment Variables**

### 2. Add Required Variables

Add the following environment variables:

#### **PAYLOAD_SECRET** (Required)
- **Name**: `PAYLOAD_SECRET`
- **Value**: Generate a secure random string
- **Environments**: Production, Preview, Development

**Generate value using:**
```bash
openssl rand -base64 32
```

Example value: `a8f3k2j9d8s7f6h5g4j3k2l1m0n9b8v7c6x5z4a3s2d1`

---

#### **DATABASE_URI** (Required)
- **Name**: `DATABASE_URI`
- **Value**: Your PostgreSQL connection string
- **Environments**: Production, Preview, Development

**Format:**
```
postgresql://username:password@host:port/database?sslmode=require
```

**Example:**
```
postgresql://milassist_user:securepass123@db.example.com:5432/milassist_prod?sslmode=require
```

**Options for Database:**
- **Vercel Postgres**: Use Vercel's built-in PostgreSQL
- **Supabase**: Free PostgreSQL hosting
- **Railway**: PostgreSQL with free tier
- **Neon**: Serverless PostgreSQL

---

#### **PAYLOAD_PUBLIC_SERVER_URL** (Required)
- **Name**: `PAYLOAD_PUBLIC_SERVER_URL`
- **Value**: Your Vercel deployment URL
- **Environments**: Production, Preview, Development

**Format:**
```
https://your-app.vercel.app
```

**Example:**
```
https://milassist.vercel.app
```

---

#### **NODE_ENV** (Optional - Auto-set by Vercel)
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environments**: Production

*Note: Vercel automatically sets this for production deployments*

---

## 🚀 Quick Setup Commands

### Generate PAYLOAD_SECRET
```bash
openssl rand -base64 32
```

### Test Database Connection (Local)
```bash
psql "postgresql://username:password@host:port/database?sslmode=require"
```

---

## 📝 Vercel Dashboard Instructions

### Adding Environment Variables:

1. **Go to Project Settings**
   - Dashboard → Your Project → Settings → Environment Variables

2. **Click "Add New"**
   - Enter variable name (e.g., `PAYLOAD_SECRET`)
   - Enter variable value
   - Select environments (Production, Preview, Development)
   - Click "Save"

3. **Repeat for all required variables**

4. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"

---

## ✅ Verification

After adding environment variables and redeploying:

1. **Check Deployment Logs**
   - Vercel Dashboard → Deployments → Latest Deployment → View Function Logs
   - Look for successful build and no environment variable errors

2. **Test Admin Panel**
   - Navigate to: `https://your-app.vercel.app/admin`
   - Should see "Create First User" screen
   - If you see errors, check logs for missing variables

3. **Test API Endpoint**
   - Navigate to: `https://your-app.vercel.app/api/health`
   - Should return 200 OK status

---

## 🔒 Security Best Practices

1. **Never commit secrets to Git**
   - `.env` files are in `.gitignore`
   - Use Vercel dashboard for production secrets

2. **Use different secrets per environment**
   - Different `PAYLOAD_SECRET` for production vs preview
   - Different database for production vs development

3. **Rotate secrets regularly**
   - Update `PAYLOAD_SECRET` every 90 days
   - Update database passwords periodically

4. **Use SSL for database connections**
   - Always include `?sslmode=require` in `DATABASE_URI`

---

## 🐛 Troubleshooting

### Error: "PAYLOAD_SECRET is required"
- **Solution**: Add `PAYLOAD_SECRET` environment variable in Vercel dashboard
- **Generate**: `openssl rand -base64 32`

### Error: "Cannot connect to database"
- **Solution**: Verify `DATABASE_URI` is correct
- **Test**: Try connecting locally with the same connection string
- **Check**: Ensure database allows connections from Vercel IPs

### Error: "Environment Variable references Secret which does not exist"
- **Solution**: This error is now fixed - `vercel.json` no longer references secrets
- **Action**: Commit and push the updated `vercel.json`

### Deployment still failing?
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure database is accessible from Vercel
4. Check that `payload/package.json` has correct build scripts

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Payload CMS Configuration](https://payloadcms.com/docs/configuration/overview)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

## 🎯 Summary Checklist

- [ ] Generate `PAYLOAD_SECRET` with `openssl rand -base64 32`
- [ ] Set up PostgreSQL database (Vercel Postgres, Supabase, Railway, or Neon)
- [ ] Add `PAYLOAD_SECRET` to Vercel environment variables
- [ ] Add `DATABASE_URI` to Vercel environment variables
- [ ] Add `PAYLOAD_PUBLIC_SERVER_URL` to Vercel environment variables
- [ ] Commit and push updated `vercel.json` (without secret references)
- [ ] Redeploy from Vercel dashboard
- [ ] Test admin panel at `https://your-app.vercel.app/admin`
- [ ] Create first admin user

---

**Last Updated**: January 13, 2026
**Status**: Ready for deployment after environment variables are configured
