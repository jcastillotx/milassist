import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';

const NotFound = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafafa',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)'
            }}>
                {/* 404 Illustration */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 2rem',
                    backgroundColor: '#eff6ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)'
                }}>
                    404
                </div>

                {/* Error Message */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--color-text)',
                    marginBottom: '1rem'
                }}>
                    Page Not Found
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2rem',
                    lineHeight: 1.6
                }}>
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="primary">
                            <Icon name="home" size={18} />
                            Return to Home
                        </Button>
                    </Link>
                    <Link to="/contact" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary">
                            <Icon name="message" size={18} />
                            Contact Support
                        </Button>
                    </Link>
                </div>

                {/* Helpful Links */}
                <div style={{
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--color-border)'
                }}>
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '1rem'
                    }}>
                        Looking for something specific?
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/about" style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            About Us
                        </Link>
                        <Link to="/services" style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            Services
                        </Link>
                        <Link to="/login" style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            Login
                        </Link>
                        <Link to="/contact" style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
