/**
 * Real Stripe Service
 * Uses the official Stripe Node.js SDK
 */

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Validate Stripe configuration
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('ERROR: STRIPE_SECRET_KEY environment variable is required');
    throw new Error('STRIPE_SECRET_KEY environment variable is required for payment processing');
}

// Initialize real Stripe SDK
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('[Stripe] Initialized with real Stripe SDK');

module.exports = stripe;
