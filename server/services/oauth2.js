/**
 * Mock OAuth2 Service
 * Simulates Gmail and Outlook OAuth2 flows for development.
 * In production, replace with actual Google/Microsoft OAuth2 SDKs.
 */

const crypto = require('crypto');

class MockOAuth2Service {
    constructor() {
        this.providers = {
            gmail: {
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token',
                scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
            },
            outlook: {
                authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                scopes: ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send']
            }
        };
    }

    /**
     * Generate authorization URL
     */
    getAuthUrl(provider, redirectUri, state) {
        const config = this.providers[provider];
        if (!config) throw new Error('Invalid provider');

        // In production, use actual client IDs and construct real OAuth URLs
        const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`] || 'mock_client_id';
        
        return `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(' '))}&state=${state}`;
    }

    /**
     * Exchange authorization code for tokens (MOCKED)
     */
    async exchangeCodeForTokens(provider, code, redirectUri) {
        console.log(`[MockOAuth2] Exchanging code for ${provider} tokens`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return mock tokens
        return {
            access_token: `mock_access_token_${crypto.randomBytes(16).toString('hex')}`,
            refresh_token: `mock_refresh_token_${crypto.randomBytes(16).toString('hex')}`,
            expires_in: 3600,
            token_type: 'Bearer',
            scope: this.providers[provider].scopes.join(' ')
        };
    }

    /**
     * Refresh access token (MOCKED)
     */
    async refreshAccessToken(provider, refreshToken) {
        console.log(`[MockOAuth2] Refreshing ${provider} token`);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            access_token: `mock_refreshed_token_${crypto.randomBytes(16).toString('hex')}`,
            expires_in: 3600,
            token_type: 'Bearer'
        };
    }

    /**
     * Get user email from provider (MOCKED)
     */
    async getUserEmail(provider, accessToken) {
        console.log(`[MockOAuth2] Fetching user email from ${provider}`);
        
        // In production, call actual API endpoints
        return `user_${Date.now()}@${provider === 'gmail' ? 'gmail.com' : 'outlook.com'}`;
    }
}

module.exports = new MockOAuth2Service();
