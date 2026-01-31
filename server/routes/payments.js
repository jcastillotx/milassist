const express = require('express');
const router = express.Router();
const stripe = require('../services/stripe');
const { Invoice, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Create Payment Intent
router.post('/create-intent', authenticateToken, async (req, res) => {
    try {
        const { invoiceId } = req.body;

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

        // Ensure user owns this invoice
        if (invoice.clientId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Amount must be integer (cents)
        const amount = Math.round(invoice.amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            description: `Invoice #${invoice.id}`,
            metadata: { invoiceId: invoice.id }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

// Webhook endpoint with mandatory signature verification
// SECURITY: This endpoint REQUIRES stripe signature verification
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    // Require webhook secret - fail hard if not configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured - rejecting webhook');
        return res.status(500).json({ 
            error: 'Webhook endpoint not properly configured' 
        });
    }
    
    if (!sig) {
        console.error('[Webhook] Missing stripe-signature header');
        return res.status(400).json({ 
            error: 'Missing signature header' 
        });
    }

    let event;
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err.message);
        return res.status(400).json({ 
            error: `Webhook signature verification failed: ${err.message}` 
        });
    }

    // Process verified event
    try {
        if (event.type === 'payment_intent.succeeded') {
            const invoiceId = event.data.object.metadata?.invoiceId;
            if (invoiceId) {
                console.log(`[Webhook] Payment succeeded for Invoice ${invoiceId}`);
                const invoice = await Invoice.findByPk(invoiceId);
                if (invoice) {
                    invoice.status = 'paid';
                    invoice.paidAt = new Date();
                    await invoice.save();
                    console.log(`[Webhook] Invoice ${invoiceId} marked as paid`);
                }
            }
        }
    } catch (err) {
        console.error('[Webhook] Error processing event:', err);
        return res.status(500).json({ error: 'Event processing failed' });
    }

    res.json({ received: true });
});

module.exports = router;
