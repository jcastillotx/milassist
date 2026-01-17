import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY not configured. Stripe checkout will not work.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
}) : null;

const plans: Record<string, { price: number; name: string; description: string }> = {
  basic: {
    price: 2900, // $29.00 in cents
    name: 'Basic Plan',
    description: '5 hours assistant support',
  },
  professional: {
    price: 7900, // $79.00 in cents
    name: 'Professional Plan',
    description: '20 hours assistant support',
  },
  enterprise: {
    price: 14900, // $149.00 in cents
    name: 'Enterprise Plan',
    description: 'Unlimited assistant support',
  },
};

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const { planId, planName } = await request.json();

    if (!plans[planId as string]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = plans[planId as string];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        planId,
        planName,
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
