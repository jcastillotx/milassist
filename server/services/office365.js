/**
 * Office365 Email Service
 * Uses Microsoft Graph API for Office365/Outlook email access
 */

const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const { logger } = require('../config/logger');

class Office365EmailService {
    constructor() {
        this.clientId = process.env.MICROSOFT_CLIENT_ID;
        this.clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
        this.tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
        
        if (!this.clientId || !this.clientSecret) {
            logger.warn('Office365 configuration missing - email integration will not work');
        }
    }

    // Get Graph client with access token
    getClient(accessToken) {
        return Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
        });
    }

    // Fetch emails from mailbox
    async fetchEmails(accessToken, options = {}) {
        const {
            folder = 'inbox',
            limit = 50,
            filter = null,
        } = options;

        try {
            const client = this.getClient(accessToken);
            
            let query = client
                .api(`/me/mailFolders/${folder}/messages`)
                .top(limit)
                .select('id,subject,from,toRecipients,receivedDateTime,bodyPreview,body,hasAttachments');

            if (filter) {
                query = query.filter(filter);
            }

            const result = await query.get();
            
            const emails = result.value.map(email => ({
                id: email.id,
                subject: email.subject,
                from: email.from?.emailAddress?.address || 'Unknown',
                fromName: email.from?.emailAddress?.name || '',
                to: email.toRecipients?.map(r => r.emailAddress.address).join(', ') || '',
                date: email.receivedDateTime,
                preview: email.bodyPreview,
                body: email.body?.content || '',
                bodyType: email.body?.contentType || 'text',
                hasAttachments: email.hasAttachments,
            }));

            logger.info(`Fetched ${emails.length} emails from Office365`);
            return emails;
        } catch (error) {
            logger.error('Error fetching Office365 emails:', error);
            throw error;
        }
    }

    // Send email
    async sendEmail(accessToken, to, subject, body, options = {}) {
        const {
            cc = [],
            bcc = [],
            isHtml = true,
            attachments = [],
        } = options;

        try {
            const client = this.getClient(accessToken);

            const message = {
                subject,
                body: {
                    contentType: isHtml ? 'HTML' : 'Text',
                    content: body,
                },
                toRecipients: Array.isArray(to) ? to.map(email => ({
                    emailAddress: { address: email }
                })) : [{
                    emailAddress: { address: to }
                }],
            };

            if (cc.length > 0) {
                message.ccRecipients = cc.map(email => ({
                    emailAddress: { address: email }
                }));
            }

            if (bcc.length > 0) {
                message.bccRecipients = bcc.map(email => ({
                    emailAddress: { address: email }
                }));
            }

            if (attachments.length > 0) {
                message.attachments = attachments.map(att => ({
                    '@odata.type': '#microsoft.graph.fileAttachment',
                    name: att.filename,
                    contentType: att.contentType,
                    contentBytes: att.content.toString('base64'),
                }));
            }

            await client.api('/me/sendMail').post({ message });

            logger.info('Email sent via Office365');
            return { success: true };
        } catch (error) {
            logger.error('Error sending Office365 email:', error);
            throw error;
        }
    }

    // Get folder list
    async getFolders(accessToken) {
        try {
            const client = this.getClient(accessToken);
            const result = await client.api('/me/mailFolders').get();
            
            return result.value.map(folder => ({
                id: folder.id,
                name: folder.displayName,
                unreadCount: folder.unreadItemCount,
                totalCount: folder.totalItemCount,
            }));
        } catch (error) {
            logger.error('Error getting Office365 folders:', error);
            throw error;
        }
    }

    // Mark email as read
    async markAsRead(accessToken, messageId) {
        try {
            const client = this.getClient(accessToken);
            await client.api(`/me/messages/${messageId}`).patch({
                isRead: true,
            });
            logger.info(`Marked email ${messageId} as read`);
        } catch (error) {
            logger.error('Error marking email as read:', error);
            throw error;
        }
    }

    // Sync emails to database
    async syncToDatabase(userId, accessToken, EmailModel) {
        try {
            const emails = await this.fetchEmails(accessToken, { limit: 100 });

            let synced = 0;
            for (const email of emails) {
                const existing = await EmailModel.findOne({
                    where: {
                        userId,
                        messageId: email.id,
                    },
                });

                if (!existing) {
                    await EmailModel.create({
                        userId,
                        messageId: email.id,
                        from: email.from,
                        to: email.to,
                        subject: email.subject,
                        date: email.date,
                        body: email.body,
                        htmlBody: email.bodyType === 'HTML' ? email.body : null,
                        hasAttachments: email.hasAttachments,
                    });
                    synced++;
                }
            }

            logger.info(`Synced ${synced} new emails from Office365 for user ${userId}`);
            return { synced, total: emails.length };
        } catch (error) {
            logger.error('Error syncing Office365 emails:', error);
            throw error;
        }
    }
}

module.exports = new Office365EmailService();
