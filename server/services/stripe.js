/**
 * Mock Stripe Service
 * Simulates the Stripe Node.js SDK for development and testing.
 */

const uuid = require('crypto').randomUUID;

class MockStripe {
    constructor() {
        this.paymentIntents = {
            create: async ({ amount, currency, description, metadata }) => {
                console.log(`[MockStripe] Creating PaymentIntent: ${amount} ${currency}`);
                return {
                    id: `pi_${uuid()}`,
                    amount,
                    currency,
                    description,
                    metadata,
                    status: 'requires_payment_method',
                    client_secret: `pi_${uuid()}_secret_${uuid()}`,
                    created: Date.now() / 1000
                };
            },
            confirm: async (id, { payment_method }) => {
                console.log(`[MockStripe] Confirming PaymentIntent: ${id} with method ${payment_method}`);
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    id,
                    status: 'succeeded',
                };
            }
        };
    }
}

module.exports = new MockStripe();
