import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const Services = () => {
  const [loading, setLoading] = useState(null);

  // Load Stripe.js
  const loadStripe = () => {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.head.appendChild(script);
    }
  };

  // Handle Stripe checkout
  const handleCheckout = async (planId, planName, price) => {
    setLoading(planId);

    try {
      // Load Stripe if not already loaded
      if (!window.Stripe) {
        await new Promise((resolve) => {
          loadStripe();
          const checkStripe = setInterval(() => {
            if (window.Stripe) {
              clearInterval(checkStripe);
              resolve();
            }
          }, 100);
        });
      }

      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

      // Create checkout session
      const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planName,
          price: parseInt(price.replace('$', '')),
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const services = [
    {
      icon: 'clipboard',
      title: 'Task Management',
      description: 'Delegate daily tasks to your personal assistant. From scheduling appointments to managing to-do lists.',
      features: ['Task tracking', 'Priority management', 'Progress updates', 'Team collaboration'],
    },
    {
      icon: 'plane',
      title: 'Travel Coordination',
      description: 'PCS moves, vacations, or emergency travel - we handle all the logistics so you can focus on your family.',
      features: ['Flight bookings', 'Hotel reservations', 'Itinerary planning', 'Travel alerts'],
    },
    {
      icon: 'document',
      title: 'Document Management',
      description: 'Organize, store, and manage important documents. Never lose track of critical paperwork again.',
      features: ['Secure storage', 'Easy retrieval', 'Document sharing', 'Version control'],
    },
    {
      icon: 'search',
      title: 'Research Services',
      description: 'Need information? Our team conducts thorough research on any topic you need.',
      features: ['Market research', 'School comparisons', 'Housing options', 'Local resources'],
    },
    {
      icon: 'email',
      title: 'Communication Support',
      description: 'Stay connected with integrated email, calendar, and messaging capabilities.',
      features: ['Email integration', 'Calendar sync', 'Video meetings', 'Message management'],
    },
    {
      icon: 'robot',
      title: 'AI-Powered Assistance',
      description: 'Our AI assistant is available 24/7 to answer questions and provide instant support.',
      features: ['Instant responses', '24/7 availability', 'Smart suggestions', 'Learning system'],
    },
  ];

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '5 hours assistant support',
        'Task management',
        'Email integration',
        'Basic AI assistance',
      ],
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Most popular for families',
      features: [
        '20 hours assistant support',
        'All Basic features',
        'Travel coordination',
        'Document management',
        'Priority support',
      ],
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$149',
      period: '/month',
      description: 'Complete family support',
      features: [
        'Unlimited assistant support',
        'All Professional features',
        'Dedicated assistant',
        'Research services',
        'Custom integrations',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="portal-page">
      {/* Hero Section */}
      <div className="portal-page-hero">
        <span className="portal-page-badge">Services</span>
        <h1 className="portal-page-title">How We Can Help You</h1>
        <p className="portal-page-subtitle">
          Comprehensive support services designed specifically for military families.
          Let us handle the details while you focus on what matters most.
        </p>
      </div>

      {/* Services Grid */}
      <div className="portal-content-section">
        <div className="portal-services-grid">
          {services.map((service, index) => (
            <div key={index} className="portal-service-card card">
              <span className="portal-service-icon"><Icon name={service.icon} size={28} /></span>
              <h3 className="portal-service-title">{service.title}</h3>
              <p className="portal-service-description">{service.description}</p>
              <ul className="portal-service-features">
                {service.features.map((feature, i) => (
                  <li key={i}>
                    <Icon name="check" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="portal-content-section">
        <h2 className="portal-section-heading">Simple, Transparent Pricing</h2>
        <p className="portal-section-subheading">
          Choose the plan that fits your family's needs. All plans include a 14-day free trial.
        </p>
        <div className="portal-pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`portal-pricing-card card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.highlighted && <span className="portal-pricing-badge">Most Popular</span>}
              <h3 className="portal-pricing-name">{plan.name}</h3>
              <div className="portal-pricing-price">
                <span className="portal-pricing-amount">{plan.price}</span>
                <span className="portal-pricing-period">{plan.period}</span>
              </div>
              <p className="portal-pricing-description">{plan.description}</p>
              <ul className="portal-pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Icon name="check" size={16} color="var(--color-primary)" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.id, plan.name, plan.price)}
                disabled={loading === plan.id}
                className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} portal-pricing-btn`}
              >
                {loading === plan.id ? (
                  <>
                    <span className="portal-spinner"></span>
                    Processing...
                  </>
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="portal-content-section">
        <h2 className="portal-section-heading">Frequently Asked Questions</h2>
        <div className="portal-faq-list">
          <div className="portal-faq-item card">
            <h4>How do I get started?</h4>
            <p>Simply create an account, choose your plan, and you'll be matched with a dedicated assistant within 24 hours.</p>
          </div>
          <div className="portal-faq-item card">
            <h4>Can I change plans later?</h4>
            <p>You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
          </div>
          <div className="portal-faq-item card">
            <h4>Is my data secure?</h4>
            <p>Yes! We use bank-level encryption and are fully compliant with military security standards.</p>
          </div>
          <div className="portal-faq-item card">
            <h4>What if I'm not satisfied?</h4>
            <p>We offer a 30-day money-back guarantee. If you're not happy, we'll refund your payment, no questions asked.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
