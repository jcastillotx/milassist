import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Icon from './Icon';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // Log to error reporting service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
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
                        {/* Error Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 2rem',
                            backgroundColor: '#fee2e2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name="warning" size={40} color="#dc2626" />
                        </div>

                        {/* Error Message */}
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: 'var(--color-text)',
                            marginBottom: '1rem'
                        }}>
                            Oops! Something went wrong
                        </h1>

                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '2rem',
                            lineHeight: 1.6
                        }}>
                            We encountered an unexpected error. Our team has been notified and is working on a fix.
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{
                                textAlign: 'left',
                                marginBottom: '2rem',
                                padding: '1rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}>
                                <summary style={{
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: 'var(--color-text)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Error Details (Development)
                                </summary>
                                <pre style={{
                                    fontSize: '0.75rem',
                                    color: '#dc2626',
                                    overflow: 'auto',
                                    padding: '0.5rem',
                                    backgroundColor: '#ffffff',
                                    borderRadius: 'var(--radius-sm)',
                                    margin: 0
                                }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

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
                                    Go Home
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                onClick={this.handleReset}
                            >
                                <Icon name="refresh" size={18} />
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
