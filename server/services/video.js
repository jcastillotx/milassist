/**
 * Mock Video Conferencing Service
 * Simulates Zoom, Google Meet, Webex, and Teams APIs for development.
 * In production, replace with actual SDK implementations.
 */

const crypto = require('crypto');

class MockVideoService {
    constructor() {
        this.providers = {
            zoom: {
                authUrl: 'https://zoom.us/oauth/authorize',
                tokenUrl: 'https://zoom.us/oauth/token'
            },
            meet: {
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token'
            },
            webex: {
                authUrl: 'https://webexapis.com/v1/authorize',
                tokenUrl: 'https://webexapis.com/v1/access_token'
            },
            teams: {
                authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
            }
        };
    }

    /**
     * Generate authorization URL
     */
    getAuthUrl(provider, redirectUri, state) {
        const config = this.providers[provider];
        if (!config) throw new Error('Invalid provider');

        const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`] || 'mock_client_id';
        return `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
    }

    /**
     * Exchange code for tokens (MOCKED)
     */
    async exchangeCodeForTokens(provider, code) {
        console.log(`[MockVideo] Exchanging code for ${provider} tokens`);
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            access_token: `mock_video_token_${crypto.randomBytes(16).toString('hex')}`,
            refresh_token: `mock_video_refresh_${crypto.randomBytes(16).toString('hex')}`,
            expires_in: 3600
        };
    }

    /**
     * Create meeting (MOCKED)
     */
    async createMeeting(provider, accessToken, meetingData) {
        console.log(`[MockVideo] Creating ${provider} meeting: ${meetingData.title}`);
        await new Promise(resolve => setTimeout(resolve, 300));

        const meetingId = crypto.randomBytes(8).toString('hex');
        const passcode = Math.floor(100000 + Math.random() * 900000).toString();

        const urls = {
            zoom: `https://zoom.us/j/${meetingId}?pwd=${passcode}`,
            meet: `https://meet.google.com/${meetingId}`,
            webex: `https://meet.webex.com/${meetingId}`,
            teams: `https://teams.microsoft.com/l/meetup-join/${meetingId}`
        };

        return {
            meetingId,
            meetingUrl: urls[provider],
            passcode: provider === 'zoom' ? passcode : null,
            startUrl: provider === 'zoom' ? `https://zoom.us/s/${meetingId}` : null
        };
    }

    /**
     * Delete meeting (MOCKED)
     */
    async deleteMeeting(provider, accessToken, meetingId) {
        console.log(`[MockVideo] Deleting ${provider} meeting: ${meetingId}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    }
}

module.exports = new MockVideoService();
