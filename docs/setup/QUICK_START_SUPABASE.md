# 🚀 Quick Start with Supabase

Get your MilAssist application running with Supabase in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Supabase account (free at [supabase.com](https://supabase.com))

---

## Step 1: Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `milassist`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

---

## Step 2: Get Connection String (1 minute)

1. In Supabase Dashboard, go to **Settings** → **Database**
2. Find **"Connection string"** section
3. Select **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Add `?sslmode=require` at the end

**Example:**
```
postgresql://postgres:MyPass123@db.abcdefg.supabase.co:5432/postgres?sslmode=require
```

---

## Step 3: Configure Local Environment (1 minute)

```bash
# Navigate to payload directory
cd /vercel/sandbox/payload

# Create .env file
cat > .env << 'EOF'
DATABASE_URI=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require
PAYLOAD_SECRET=$(openssl rand -base64 32)
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
EOF

# Edit .env and replace YOUR_PASSWORD and YOUR_PROJECT with actual values
nano .env
```

Or manually create `.env` file:
```env
DATABASE_URI=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require
PAYLOAD_SECRET=your-generated-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

---

## Step 4: Install & Run (1 minute)

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start development server
npm run dev
```

Server will start at: **http://localhost:3000**

---

## Step 5: Create Admin User (30 seconds)

1. Open browser: **http://localhost:3000/admin**
2. Fill in the "Create First User" form:
   - **Email**: your-email@example.com
   - **Password**: (secure password)
3. Click **"Create"**

✅ **Done!** You're now logged into the admin panel.

---

## 🎯 Verify Everything Works

### Check Database Tables
1. Go to Supabase Dashboard
2. Click **"Table Editor"**
3. You should see tables: `users`, `trips`, `documents`, etc.

### Test API
```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok"}`

---

## 🚀 Deploy to Vercel

### 1. Add Environment Variables to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add:
   - `DATABASE_URI`: (your Supabase connection string)
   - `PAYLOAD_SECRET`: (generate with `openssl rand -base64 32`)
   - `PAYLOAD_PUBLIC_SERVER_URL`: `https://your-app.vercel.app`

### 2. Deploy
```bash
git add .
git commit -m "Configure Supabase database"
git push origin main
```

Vercel will automatically deploy!

### 3. Access Production
- Admin: `https://your-app.vercel.app/admin`
- API: `https://your-app.vercel.app/api`

---

## 🐛 Troubleshooting

### "Connection refused"
- Check Supabase project is active (not paused)
- Verify connection string is correct
- Ensure `?sslmode=require` is appended

### "Password authentication failed"
- Double-check password in connection string
- Reset password in Supabase Dashboard → Settings → Database

### "Module not found"
```bash
cd /vercel/sandbox/payload
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 📚 Full Documentation

- **Detailed Setup**: See `SUPABASE_SETUP.md`
- **Environment Variables**: See `VERCEL_ENV_SETUP.md`
- **Admin Login**: See `ADMIN_LOGIN_GUIDE.md`

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] `.env` file created with correct values
- [ ] Dependencies installed (`npm install`)
- [ ] Application built (`npm run build`)
- [ ] Dev server running (`npm run dev`)
- [ ] Admin user created at `/admin`
- [ ] Tables visible in Supabase Table Editor
- [ ] Environment variables added to Vercel
- [ ] Code pushed and deployed

---

**Need Help?** Check `SUPABASE_SETUP.md` for detailed troubleshooting and advanced configuration.
