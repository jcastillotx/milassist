#!/usr/bin/env node

/**
 * Generate Payload Secret Script
 * 
 * This script generates a cryptographically secure secret for Payload CMS.
 * 
 * Usage:
 *   node scripts/generate-payload-secret.js
 */

const crypto = require('crypto');

console.log('🔐 Generating Payload CMS Secret...\n');

// Generate a secure random secret (32 bytes = 256 bits)
const secret = crypto.randomBytes(32).toString('base64');

console.log('✅ Generated Secret:\n');
console.log('   ' + secret);
console.log('');
console.log('📋 Add this to your .env file:');
console.log('');
console.log('   PAYLOAD_SECRET=' + secret);
console.log('');
console.log('⚠️  Security Notes:');
console.log('   • Never commit this secret to Git');
console.log('   • Use different secrets for dev/staging/production');
console.log('   • Store securely (password manager or Vercel env vars)');
console.log('   • Rotate every 90 days for best security');
console.log('');
console.log('🚀 For Vercel deployment:');
console.log('   1. Go to Vercel Dashboard → Settings → Environment Variables');
console.log('   2. Add: PAYLOAD_SECRET=' + secret);
console.log('   3. Select: Production, Preview, Development');
console.log('');
