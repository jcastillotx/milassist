# cPanel / public_html Deployment Guide

This guide covers deploying MilAssist to a traditional web hosting environment using `public_html`.

## Prerequisites
- Node.js Selector (available in most modern cPanel versions)
- PostgreSQL or SQLite (as per your preference)
- SSH access (recommended)

---

## 1. Frontend Deployment (React)

### Build the Application
On your local machine, run:
```bash
npm run build
```
This will create a `dist` folder.

### Upload to public_html
1. Connect via FTP or use cPanel File Manager.
2. Upload all files from the `dist` folder directly into `public_html`.
3. Create an `.htaccess` file in `public_html` to handle React Router:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 2. Backend Deployment (Node.js)

### Preparation
1. Create a folder named `milassist-api` in your **home directory** (one level *above* `public_html`). 
   > [!NOTE]
   > For security, never put your `.env` or backend code directly in `public_html` where it can be downloaded.

2. Upload the `server` folder contents to `milassist-api`.

### cPanel Node.js Selector
1. Go to **Setup Node.js App** in cPanel.
2. Click **Create Application**.
3. **Application root**: `milassist-api`
4. **Application URL**: `api.yourdomain.com` (or a subdirectory like `yourdomain.com/api`)
5. **Application startup file**: `server.js`
6. Click **Create**.
7. Once created, click **Run JS Install** to install dependencies.

---

## 3. Environment Variables
In the cPanel Node.js App interface, add the following variables:

- `NODE_ENV`: `production`
- `PORT`: `3000` (or whatever cPanel assigns)
- `JWT_SECRET`: (Your secret key)
- `DB_DIALECT`: `postgres` (or `sqlite`)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: (Your database credentials)
- `FRONTEND_URL`: `https://yourdomain.com`
- `APP_URL`: `https://api.yourdomain.com`

---

## 4. Connecting Frontend and Backend
Edit your `.env` for the **frontend** before building if you need to point to a specific API URL.

In `src/pages/SetupWizard.jsx` (and elsewhere), ensure the API calls use the correct `APP_URL`.

---

## 5. Security Checklist
1. Ensure `public_html` only contains the built files from `dist`.
2. Ensure your `database.sqlite` (if using SQLite) is in the `milassist-api` folder, NOT in `public_html`.
3. Set up an SSL certificate (Let's Encrypt) in cPanel.

---

## 6. Running the Setup Wizard
Once uploaded and the Node app is started, go to:
`https://yourdomain.com/setup`

This will initialize your database on the server!
