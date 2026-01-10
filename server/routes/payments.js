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

// Simulate Webhook (Since we can't receive real webhooks locally without tunneling)
router.post('/webhook', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'payment_intent.succeeded') {
        const invoiceId = data.object.metadata.invoiceId;
        console.log(`[Webhook] Payment succeeded for Invoice ${invoiceId}`);

        try {
            const invoice = await Invoice.findByPk(invoiceId);
            if (invoice) {
                invoice.status = 'paid';
                await invoice.save();
            }
        } catch (err) {
            console.error('Webhook Error:', err);
        }
    }

    res.json({ received: true });
});

module.exports = router;
