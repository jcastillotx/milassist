import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '500+', label: 'Vetted Assistants' },
    { value: '1,200+', label: 'Active Clients' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const services = [
    {
      icon: 'calendar',
      title: 'Administrative Support',
      description: 'Calendar management, email handling, document preparation, and data entry to keep your business running smoothly.',
    },
    {
      icon: 'user',
      title: 'Executive Support',
      description: 'High-level support for executives including scheduling, travel coordination, and strategic task management.',
    },
    {
      icon: 'chart',
      title: 'Data & Analytics Support',
      description: 'Data entry, reporting, analysis, and visualization to help you make informed business decisions.',
    },
    {
      icon: 'megaphone',
      title: 'Marketing Support',
      description: 'Social media management, content creation, email campaigns, and marketing coordination.',
    },
  ];

  const audiences = [
    {
      icon: 'building',
      title: 'SMBs/Startups',
      description: 'Growing businesses need flexible, scalable support without the overhead of full-time hires.',
    },
    {
      icon: 'briefcase',
      title: 'Executives',
      description: 'Busy executives who need reliable personal and professional assistance to maximize productivity.',
    },
    {
      icon: 'users',
      title: 'Nonprofits',
      description: 'Mission-driven organizations looking for cost-effective administrative support.',
    },
    {
      icon: 'flag',
      title: 'Defense Adjacent Organizations',
      description: 'Companies and organizations working with or supporting the defense community.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Step 1: Tell Us Your Needs',
      description: 'Complete a brief questionnaire about your business needs, preferred working style, and required skill sets.',
    },
    {
      step: 2,
      title: 'Step 2: Assistant Matching',
      description: 'Our team matches you with vetted military spouse assistants who best fit your requirements and company culture.',
    },
    {
      step: 3,
      title: 'Step 3: Seamless Onboarding',
      description: 'We facilitate introductions and provide a structured onboarding process to ensure a smooth start.',
    },
  ];

  const securityFeatures = [
    {
      icon: 'shield',
      title: 'SOC 2 Compliance',
      description: 'Our platform meets SOC 2 Type II standards for security, availability, and confidentiality.',
    },
    {
      icon: 'lock',
      title: 'Data Encryption',
      description: 'All data is encrypted at rest and in transit using industry-standard AES-256 encryption.',
    },
    {
      icon: 'users',
      title: 'Vetted Assistants',
      description: 'Every assistant undergoes thorough background checks and identity verification.',
    },
    {
      icon: 'eye',
      title: 'Access Controls',
      description: 'Granular permission controls ensure assistants only access what they need.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'CEO, TechStart Inc.',
      image: null,
      rating: 5,
      text: 'MilAssist has been a game-changer for our startup. Our assistant handles everything from scheduling to research, freeing me to focus on growth.',
    },
    {
      name: 'James Rodriguez',
      role: 'Operations Director',
      image: null,
      rating: 5,
      text: 'The quality of work and professionalism from our military spouse assistant exceeds any previous experience with virtual support.',
    },
    {
      name: 'Emily Chen',
      role: 'Marketing Manager',
      image: null,
      rating: 5,
      text: 'Finding reliable, trustworthy support was always a challenge until we found MilAssist. Highly recommend!',
    },
  ];

  const impactStats = [
    { value: '98%', label: 'Client Retention', subtext: 'Year over year' },
    { value: '4.8/5', label: 'Average Rating', subtext: 'From clients' },
    { value: '95%', label: 'Task Completion', subtext: 'On-time delivery' },
    { value: '1,200+', label: 'Happy Clients', subtext: 'And growing' },
  ];

  const whyMilSpouse = [
    {
      icon: 'target',
      title: 'Adaptability & Resilience',
      description: 'Military spouses are experts at adapting to new environments and challenges with grace.',
    },
    {
      icon: 'check',
      title: 'Reliability & Commitment',
      description: 'A strong sense of duty and commitment to excellence in everything they do.',
    },
    {
      icon: 'globe',
      title: 'Diverse Experience',
      description: 'Exposure to diverse cultures and environments brings unique perspectives.',
    },
    {
      icon: 'education',
      title: 'Highly Educated',
      description: 'Military spouses are among the most educated demographic in the workforce.',
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$2,400',
      period: '/mo',
      description: 'Perfect for small businesses and solopreneurs',
      hours: '40 hours/month',
      features: [
        'Dedicated assistant',
        'Email & calendar management',
        'Basic research tasks',
        'Standard response time',
        'Monthly reporting',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$4,800',
      period: '/mo',
      description: 'Ideal for growing businesses with more complex needs',
      hours: '80 hours/month',
      features: [
        'Everything in Starter',
        'Priority matching',
        'Advanced project support',
        'Expedited response time',
        'Weekly check-ins',
        'Backup assistant coverage',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Custom',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for enterprises',
      hours: 'Unlimited',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom workflows',
        'SLA guarantees',
        'Team of assistants',
        'API integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const resources = [
    {
      type: 'Blog',
      title: 'Getting the Most Out of Your Virtual Assistant',
      description: 'Tips and best practices for effective delegation and collaboration.',
      date: 'Jan 5, 2025',
    },
    {
      type: 'Guide',
      title: 'The Security-First Guide to Remote Work',
      description: 'How to maintain data security when working with virtual teams.',
      date: 'Dec 28, 2024',
    },
    {
      type: 'Case Study',
      title: 'How TechStart Scaled with MilAssist',
      description: 'A startup growth story powered by military spouse talent.',
      date: 'Dec 15, 2024',
    },
  ];

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'Most clients are matched with an assistant within 3-5 business days. Our streamlined onboarding process ensures you can start working with your assistant within the first week.',
    },
    {
      question: 'Are the assistants employees or contractors?',
      answer: 'All MilAssist assistants are W-2 employees of MilAssist. This means we handle all payroll, taxes, benefits, and compliance, making it simple for you.',
    },
    {
      question: 'What if my assistant is relocated due to military orders?',
      answer: 'We understand military life! If your assistant needs to relocate, we ensure a smooth transition with a replacement assistant and proper knowledge transfer at no additional cost.',
    },
    {
      question: 'Can I request specific skills or experience?',
      answer: 'Absolutely! During onboarding, you will specify your requirements including industry experience, software proficiency, working hours, and communication preferences.',
    },
    {
      question: 'What security measures are in place?',
      answer: 'We take security seriously. All assistants undergo background checks, sign NDAs, and are trained on data security best practices. Our platform is SOC 2 compliant.',
    },
  ];

  return (
    <div className="portal-landing">
      {/* Hero Section */}
      <section className="portal-hero">
        <div className="portal-hero-content">
          <div className="portal-hero-text">
            <h1 className="portal-hero-title">
              Reliable Virtual Support,<br />
              <span className="portal-hero-highlight">Powered by Military Spouses</span>
            </h1>
            <p className="portal-hero-description">
              Connect with highly skilled, thoroughly vetted military spouse virtual assistants who bring dedication, adaptability, and excellence to every task.
            </p>
            <div className="portal-hero-buttons">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Request Demo
              </Link>
              <Link to="/services" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
            <div className="portal-hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="portal-hero-stat">
                  <span className="portal-hero-stat-value">{stat.value}</span>
                  <span className="portal-hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="portal-hero-image">
            <div className="portal-hero-image-placeholder">
              <Icon name="user" size={80} />
            </div>
          </div>
        </div>
        <div className="portal-hero-trusted">
          <span className="portal-trusted-label">Trusted by companies powered by</span>
          <div className="portal-trusted-logos">
            <span className="portal-trusted-logo">
              <Icon name="building" size={20} /> Excellent
            </span>
            <span className="portal-trusted-stars">
              {[1, 2, 3, 4, 5].map(i => <Icon key={i} name="target" size={16} />)}
            </span>
            <span className="portal-trusted-rating">4.9 / 5</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="portal-section">
        <div className="portal-section-header">
          <h2 className="portal-section-title">Professional Virtual Support Across Core Functions</h2>
          <p className="portal-section-subtitle">
            From administrative tasks to executive support, our military spouse assistants deliver exceptional results across every domain.
          </p>
        </div>
        <div className="portal-services-grid">
          {services.map((service, index) => (
            <div key={index} className="portal-service-card card">
              <div className="portal-service-icon">
                <Icon name={service.icon} size={24} />
              </div>
              <h3 className="portal-service-title">{service.title}</h3>
              <p className="portal-service-description">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="portal-section-cta">
          <Link to="/services" className="btn btn-secondary">
            Explore All Services
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="portal-section portal-section-gray">
        <div className="portal-section-header">
          <h2 className="portal-section-title">Who We Serve</h2>
          <p className="portal-section-subtitle">
            MilAssist supports a diverse range of organizations, from startups to enterprises.
          </p>
        </div>
        <div className="portal-audience-grid">
          {audiences.map((audience, index) => (
            <div key={index} className="portal-audience-card">
              <div className="portal-audience-icon">
                <Icon name={audience.icon} size={28} />
              </div>
              <h3 className="portal-audience-title">{audience.title}</h3>
              <p className="portal-audience-description">{audience.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="portal-section">
        <div className="portal-section-header">
          <h2 className="portal-section-title">How It Works</h2>
          <p className="portal-section-subtitle">
            A straightforward process to connect you with the perfect military spouse assistant.
          </p>
        </div>
        <div className="portal-steps">
          {howItWorks.map((step, index) => (
            <div key={index} className="portal-step">
              <div className="portal-step-number">{step.step}</div>
              <div className="portal-step-content">
                <h3 className="portal-step-title">{step.title}</h3>
                <p className="portal-step-description">{step.description}</p>
              </div>
              {index < howItWorks.length - 1 && (
                <div className="portal-step-connector">
                  <Icon name="arrowRight" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="portal-steps-cta">
          <Link to="/contact" className="btn btn-primary btn-lg">
            Get Started Today
          </Link>
          <Link to="/services" className="btn btn-secondary btn-lg">
            Schedule a Consultation
          </Link>
        </div>
      </section>

      {/* Security Section */}
      <section className="portal-section portal-section-dark">
        <div className="portal-security-content">
          <div className="portal-security-text">
            <h2 className="portal-section-title">Security and Trust Are Non-Negotiable</h2>
            <p className="portal-security-description">
              We understand the importance of protecting your business data. That is why we have built security into every layer of our platform and processes.
            </p>
            <div className="portal-security-features">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="portal-security-feature">
                  <div className="portal-security-feature-icon">
                    <Icon name={feature.icon} size={20} />
                  </div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/data-protection" className="portal-security-link">
              Learn more about our security practices
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="portal-security-badge-container">
            <div className="portal-security-badge">
              <div className="portal-badge-icon">
                <Icon name="shield" size={40} />
              </div>
              <div className="portal-badge-text">
                <span className="portal-badge-title">SOC 2</span>
                <span className="portal-badge-subtitle">Type II Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="portal-section">
        <div className="portal-section-header">
          <h2 className="portal-section-title">What Our Clients Say</h2>
          <p className="portal-section-subtitle">
            Real feedback from companies that partner with MilAssist for their virtual support needs.
          </p>
        </div>
        <div className="portal-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="portal-testimonial-card card">
              <div className="portal-testimonial-rating">
                {[1, 2, 3, 4, 5].map(i => (
                  <Icon key={i} name="target" size={16} color={i <= testimonial.rating ? '#f59e0b' : '#e5e7eb'} />
                ))}
              </div>
              <p className="portal-testimonial-text">"{testimonial.text}"</p>
              <div className="portal-testimonial-author">
                <div className="portal-testimonial-avatar">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="portal-testimonial-info">
                  <span className="portal-testimonial-name">{testimonial.name}</span>
                  <span className="portal-testimonial-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="portal-section portal-section-purple">
        <div className="portal-impact-stats">
          {impactStats.map((stat, index) => (
            <div key={index} className="portal-impact-stat">
              <span className="portal-impact-value">{stat.value}</span>
              <span className="portal-impact-label">{stat.label}</span>
              <span className="portal-impact-subtext">{stat.subtext}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Military Spouses Section */}
      <section className="portal-section">
        <div className="portal-section-header">
          <h2 className="portal-section-title">Why Military Spouses</h2>
          <p className="portal-section-subtitle">
            Military spouses bring unique qualities that make them exceptional virtual assistants.
          </p>
        </div>
        <div className="portal-why-grid">
          <div className="portal-why-features">
            {whyMilSpouse.map((item, index) => (
              <div key={index} className="portal-why-feature">
                <div className="portal-why-icon">
                  <Icon name={item.icon} size={24} />
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="portal-why-image">
            <div className="portal-why-image-placeholder">
              <Icon name="users" size={60} />
              <span>MilAssist is Proud to Work With Military Spouses Nationwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="portal-section portal-section-gray">
        <div className="portal-section-header">
          <h2 className="portal-section-title">Flexible Pricing for Every Need</h2>
          <p className="portal-section-subtitle">
            Choose the plan that fits your business. All plans include a dedicated assistant and our full platform.
          </p>
        </div>
        <div className="portal-pricing-grid">
          {pricing.map((plan, index) => (
            <div key={index} className={`portal-pricing-card card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="portal-pricing-badge">Most Popular</span>}
              <h3 className="portal-pricing-name">{plan.name}</h3>
              <div className="portal-pricing-price">
                <span className="portal-pricing-amount">{plan.price}</span>
                <span className="portal-pricing-period">{plan.period}</span>
              </div>
              <p className="portal-pricing-description">{plan.description}</p>
              <p className="portal-pricing-hours">{plan.hours}</p>
              <ul className="portal-pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Icon name="check" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Military Spouse CTA Section */}
      <section className="portal-section portal-section-cta">
        <div className="portal-cta-content">
          <h2>Are You a Military Spouse?</h2>
          <p>
            Join our network of talented military spouse virtual assistants. Enjoy flexible work that moves with you, competitive pay, and a supportive community.
          </p>
          <div className="portal-cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Apply to Join
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="portal-section">
        <div className="portal-section-header">
          <h2 className="portal-section-title">Resources & Insights</h2>
          <p className="portal-section-subtitle">
            Expert advice, industry insights, and tips for getting the most from virtual assistance.
          </p>
        </div>
        <div className="portal-resources-grid">
          {resources.map((resource, index) => (
            <div key={index} className="portal-resource-card card">
              <span className="portal-resource-type">{resource.type}</span>
              <h3 className="portal-resource-title">{resource.title}</h3>
              <p className="portal-resource-description">{resource.description}</p>
              <span className="portal-resource-date">{resource.date}</span>
            </div>
          ))}
        </div>
        <div className="portal-section-cta">
          <Link to="/resources" className="btn btn-secondary">
            View All Resources
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="portal-section portal-section-gray">
        <div className="portal-section-header">
          <h2 className="portal-section-title">Frequently Asked Questions</h2>
          <p className="portal-section-subtitle">
            Have questions? We have answers. If you do not see what you are looking for, contact us.
          </p>
        </div>
        <div className="portal-faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`portal-faq-item ${openFaq === index ? 'open' : ''}`}>
              <button
                className="portal-faq-question"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <Icon name={openFaq === index ? 'minus' : 'plus'} size={20} />
              </button>
              {openFaq === index && (
                <div className="portal-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="portal-faq-cta">
          <Link to="/contact" className="portal-faq-link">
            Still have questions? Contact us
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="portal-section portal-section-final-cta">
        <div className="portal-final-cta-content">
          <h2>Ready to Get Started?</h2>
          <p>
            Request a demo today and discover how MilAssist can transform your business with reliable, professional virtual support.
          </p>
          <div className="portal-final-cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Request Demo
            </Link>
            <Link to="/contact" className="btn btn-secondary-light btn-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
