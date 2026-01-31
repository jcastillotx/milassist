/**
 * Real Gmail Integration Service
 * Uses Google APIs for email access
 */

const { google } = require('googleapis');
const { logger } = require('../config/logger');

// Validate Gmail configuration
if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    logger.warn('Gmail configuration missing - email integration will not work');
}

class GmailService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            `${process.env.APP_URL || 'http://localhost:3000'}/api/email/callback/gmail`
        );

        this.scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.modify',
        ];
    }

    // Get authorization URL
    getAuthUrl(state) {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
            state: state,
            prompt: 'consent',
        });
    }

    // Exchange code for tokens
    async getTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            logger.info('Gmail tokens obtained successfully');
            return tokens;
        } catch (error) {
            logger.error('Error getting Gmail tokens:', error);
            throw error;
        }
    }

    // Refresh access token
    async refreshAccessToken(refreshToken) {
        try {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken,
            });
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            logger.info('Gmail token refreshed');
            return credentials;
        } catch (error) {
            logger.error('Error refreshing Gmail token:', error);
            throw error;
        }
    }

    // Get Gmail client with credentials
    getGmailClient(accessToken, refreshToken) {
        this.oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        return google.gmail({ version: 'v1', auth: this.oauth2Client });
    }

    // Fetch emails
    async fetchEmails(accessToken, refreshToken, maxResults = 10) {
        try {
            const gmail = this.getGmailClient(accessToken, refreshToken);
            
            const response = await gmail.users.messages.list({
                userId: 'me',
                maxResults: maxResults,
                q: 'in:inbox',
            });

            const messages = response.data.messages || [];
            const emails = [];

            // Fetch details for each message
            for (const message of messages.slice(0, maxResults)) {
                const details = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full',
                });

                const headers = details.data.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
                const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
                const date = headers.find(h => h.name === 'Date')?.value || '';

                // Get body (simplified)
                let body = '';
                if (details.data.payload.body.data) {
                    body = Buffer.from(details.data.payload.body.data, 'base64').toString();
                } else if (details.data.payload.parts) {
                    const textPart = details.data.payload.parts.find(p => p.mimeType === 'text/plain');
                    if (textPart && textPart.body.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString();
                    }
                }

                emails.push({
                    id: message.id,
                    subject,
                    from,
                    date,
                    snippet: details.data.snippet,
                    body: body.substring(0, 500), // Limit body length
                });
            }

            logger.info(`Fetched ${emails.length} emails from Gmail`);
            return emails;
        } catch (error) {
            logger.error('Error fetching Gmail emails:', error);
            throw error;
        }
    }

    // Send email
    async sendEmail(accessToken, refreshToken, to, subject, body) {
        try {
            const gmail = this.getGmailClient(accessToken, refreshToken);

            const email = [
                `To: ${to}`,
                `Subject: ${subject}`,
                '',
                body,
            ].join('\n');

            const encodedEmail = Buffer.from(email)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const response = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedEmail,
                },
            });

            logger.info(`Email sent via Gmail: ${response.data.id}`);
            return response.data;
        } catch (error) {
            logger.error('Error sending Gmail email:', error);
            throw error;
        }
    }
}

module.exports = new GmailService();
EOF
echo "✓ Created real Gmail service"
