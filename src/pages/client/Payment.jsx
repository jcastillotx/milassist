import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Payment = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        // Fetch Invoice Details (Reuse Invoices API or specific endpoint)
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem('token');
                // We'll reuse the list endpoint and filter for now as a shortcut, 
                // or ideally fetch a single invoice if the endpoint supported it.
                // Assuming /invoices returns user's invoices.
                const res = await fetch(`${API_URL}/invoices`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const target = data.find(i => i.id == invoiceId);
                    if (target) setInvoice(target);
                    else setError('Invoice not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load invoice');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [invoiceId]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            // 1. Create Payment Intent
            const intentRes = await fetch(`${API_URL}/payments/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ invoiceId })
            });

            if (!intentRes.ok) throw new Error('Failed to initialize payment');
            const { clientSecret } = await intentRes.json();

            // 2. Simulate User entering card details and "Stripe" processing
            // In a real app, we would use stripe.confirmCardPayment(clientSecret, ...)
            console.log(`Processing payment with secret: ${clientSecret}`);

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // 3. Simulate Webhook Success (Since we can't receive real webhooks)
            // We manually tell the server "Hey, this succeeded" for the simulation
            // In prod, Stripe sends this to us.
            await fetch(`${API_URL}/payments/webhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'payment_intent.succeeded',
                    data: { object: { metadata: { invoiceId } } }
                })
            });

            alert('Payment Successful!');
            navigate('/client/invoices');

        } catch (err) {
            console.error(err);
            setError(err.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!invoice) return <div>Invoice not found</div>;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Secure Payment</h2>

            <Card className="bg-gray-50 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Invoice #{invoice.id}</span>
                    <span className="text-2xl font-bold">${invoice.amount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                    Pay securely with credit card via Stripe (Simulated).
                </div>
            </Card>

            <Card>
                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                            <input
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                                value={cvc}
                                onChange={e => setCvc(e.target.value)}
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 'Processing...' : `Pay $${invoice.amount.toFixed(2)}`}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Payment;
