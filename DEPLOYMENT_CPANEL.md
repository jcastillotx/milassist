# AlmaLinux v8.10.0 / cPanel Deployment Guide

This guide covers deploying MilAssist to a traditional web hosting environment on **AlmaLinux v8.10.0**, specifically for servers **without** CloudLinux or the "Setup Node.js App" tool.

## Prerequisites
- **SSH Access**: Required for installing Node.js and managing the backend.
- **Node.js (NVM)**: Since AlmaLinux might have older system Node versions, using NVM (Node Version Manager) is recommended.
- **Apache mod_proxy**: Ensure your host has enabled `mod_proxy` and `mod_proxy_http`.

---

## 1. Frontend Deployment (React)

### Build and Upload
1. Run `npm run build` locally.
2. Upload the contents of `dist/` to your `public_html` folder.
3. Update `.htaccess` in `public_html` to handle routing and the proxy:

```apache
# 1. Handle React Router (Frontend)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  
  # 2. Reverse Proxy for API
  # This sends all requests starting with /api to your Node.js app
  RewriteRule ^api/(.*) http://localhost:3000/$1 [P,L]
  
  # 3. Handle Refresh/Direct Links
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 2. Backend Deployment (Node.js)

### Install Node.js via NVM (SSH)
On AlmaLinux, if you don't have Node.js 18+, run these commands:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Preparation
1. Create `~/milassist-api` in your home directory (not inside `public_html`).
2. Upload the `server/` folder contents to `~/milassist-api`.
3. In SSH:
   ```bash
   cd ~/milassist-api
   npm install
   cp .env.example .env
   # Edit .env with your DB credentials and secret
   ```

### Running with PM2
```bash
npm install -g pm2
pm2 start server.js --name "milassist-api"
pm2 save
pm2 startup
# Follow the instructions provided by pm2 startup to ensure it starts on reboot
```

### Running with PM2
To keep the server running even if you log out:
1. Install PM2 globally (if allowed):
   ```bash
   npm install -g pm2
   ```
2. Start the app:
   ```bash
   pm2 start server.js --name milassist-api
   pm2 save
   ```

---

## 3. Environment Variables
In your `~/milassist-api/.env`, ensure these are set:
- `NODE_ENV=production`
- `PORT=3000` (Ensure this matches the `.htaccess` proxy rule)
- `ALLOWED_ORIGINS=https://yourdomain.com`
- `APP_URL=https://yourdomain.com/api`

---

## 4. Security Checklist
1. **Never** put the `server` folder or `.env` inside `public_html`.
2. Use a strong `JWT_SECRET`.
3. If using SQLite, ensure the `.sqlite` file stays in `~/milassist-api`.
4. Ensure your hosting provider supports Reverse Proxy (`mod_proxy`) in `.htaccess`.

---

## 5. Running the Setup Wizard
Once the API is running and the `.htaccess` is configured, go to:
`https://yourdomain.com/setup`

This will trigger the initialization wizard via the proxied API!
