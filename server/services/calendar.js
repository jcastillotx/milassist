/**
 * Mock Calendar Service
 * Simulates Google Calendar and Outlook Calendar APIs for development.
 * In production, replace with actual SDK implementations.
 */

const crypto = require('crypto');

class MockCalendarService {
    constructor() {
        this.providers = {
            google: {
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token',
                scopes: ['https://www.googleapis.com/auth/calendar']
            },
            outlook: {
                authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                scopes: ['https://graph.microsoft.com/Calendars.ReadWrite']
            }
        };
    }

    /**
     * Generate authorization URL
     */
    getAuthUrl(provider, redirectUri, state) {
        const config = this.providers[provider];
        if (!config) throw new Error('Invalid provider');

        const clientId = process.env[`${provider.toUpperCase()}_CALENDAR_CLIENT_ID`] || 'mock_client_id';
        return `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(' '))}&state=${state}`;
    }

    /**
     * Exchange code for tokens (MOCKED)
     */
    async exchangeCodeForTokens(provider, code) {
        console.log(`[MockCalendar] Exchanging code for ${provider} tokens`);
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            access_token: `mock_cal_token_${crypto.randomBytes(16).toString('hex')}`,
            refresh_token: `mock_cal_refresh_${crypto.randomBytes(16).toString('hex')}`,
            expires_in: 3600
        };
    }

    /**
     * Get calendar events (MOCKED)
     */
    async getEvents(provider, accessToken, startDate, endDate) {
        console.log(`[MockCalendar] Fetching ${provider} events`);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return mock events
        return [
            {
                id: '1',
                title: 'Team Meeting',
                start: new Date(Date.now() + 86400000).toISOString(),
                end: new Date(Date.now() + 90000000).toISOString(),
                description: 'Weekly team sync'
            },
            {
                id: '2',
                title: 'Client Call',
                start: new Date(Date.now() + 172800000).toISOString(),
                end: new Date(Date.now() + 176400000).toISOString(),
                description: 'Quarterly review'
            }
        ];
    }

    /**
     * Create calendar event (MOCKED)
     */
    async createEvent(provider, accessToken, eventData) {
        console.log(`[MockCalendar] Creating ${provider} event: ${eventData.title}`);
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            id: crypto.randomBytes(8).toString('hex'),
            ...eventData
        };
    }

    /**
     * Update calendar event (MOCKED)
     */
    async updateEvent(provider, accessToken, eventId, eventData) {
        console.log(`[MockCalendar] Updating ${provider} event: ${eventId}`);
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
            id: eventId,
            ...eventData
        };
    }

    /**
     * Delete calendar event (MOCKED)
     */
    async deleteEvent(provider, accessToken, eventId) {
        console.log(`[MockCalendar] Deleting ${provider} event: ${eventId}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    }
}

module.exports = new MockCalendarService();
