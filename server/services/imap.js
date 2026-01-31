/**
 * IMAP Email Sync Service
 * Works with any IMAP provider (Gmail, Yahoo, ProtonMail, custom domains, etc.)
 */

const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { logger } = require('../config/logger');

class IMAPService {
    constructor() {
        this.connections = new Map(); // Store active connections per user
    }

    // Create IMAP connection
    createConnection(config) {
        const { host, port, user, password, tls = true } = config;
        
        return new Imap({
            user,
            password,
            host,
            port: port || 993,
            tls,
            tlsOptions: { rejectUnauthorized: false },
            connTimeout: 10000,
            authTimeout: 5000,
        });
    }

    // Connect and authenticate
    async connect(connectionId, config) {
        return new Promise((resolve, reject) => {
            const imap = this.createConnection(config);
            
            imap.once('ready', () => {
                logger.info(`IMAP connected for ${config.user}`);
                this.connections.set(connectionId, imap);
                resolve(imap);
            });

            imap.once('error', (err) => {
                logger.error('IMAP connection error:', err);
                reject(err);
            });

            imap.connect();
        });
    }

    // Fetch emails from mailbox
    async fetchEmails(connectionId, config, options = {}) {
        const {
            mailbox = 'INBOX',
            limit = 50,
            since = null,
            markAsRead = false,
        } = options;

        try {
            const imap = this.connections.get(connectionId) || await this.connect(connectionId, config);

            return new Promise((resolve, reject) => {
                imap.openBox(mailbox, !markAsRead, (err, box) => {
                    if (err) {
                        logger.error('Error opening mailbox:', err);
                        return reject(err);
                    }

                    // Build search criteria
                    const searchCriteria = ['ALL'];
                    if (since) {
                        searchCriteria.push(['SINCE', since]);
                    }

                    imap.search(searchCriteria, (err, results) => {
                        if (err) {
                            logger.error('Error searching emails:', err);
                            return reject(err);
                        }

                        if (!results || results.length === 0) {
                            logger.info('No emails found');
                            return resolve([]);
                        }

                        // Limit results
                        const uids = results.slice(-limit);
                        const emails = [];

                        const fetch = imap.fetch(uids, {
                            bodies: '',
                            struct: true,
                            markSeen: markAsRead,
                        });

                        fetch.on('message', (msg, seqno) => {
                            let buffer = '';
                            
                            msg.on('body', (stream, info) => {
                                stream.on('data', (chunk) => {
                                    buffer += chunk.toString('utf8');
                                });
                            });

                            msg.once('end', async () => {
                                try {
                                    const parsed = await simpleParser(buffer);
                                    emails.push({
                                        id: seqno,
                                        from: parsed.from?.text || 'Unknown',
                                        to: parsed.to?.text || '',
                                        subject: parsed.subject || 'No Subject',
                                        date: parsed.date,
                                        text: parsed.text || '',
                                        html: parsed.html || '',
                                        attachments: parsed.attachments?.map(a => ({
                                            filename: a.filename,
                                            contentType: a.contentType,
                                            size: a.size,
                                        })) || [],
                                    });
                                } catch (parseErr) {
                                    logger.error('Error parsing email:', parseErr);
                                }
                            });
                        });

                        fetch.once('error', (err) => {
                            logger.error('Fetch error:', err);
                            reject(err);
                        });

                        fetch.once('end', () => {
                            logger.info(`Fetched ${emails.length} emails via IMAP`);
                            resolve(emails);
                        });
                    });
                });
            });
        } catch (error) {
            logger.error('Error in fetchEmails:', error);
            throw error;
        }
    }

    // Send email via SMTP (note: IMAP is for receiving, need SMTP for sending)
    // This would require nodemailer - see below

    // Disconnect
    disconnect(connectionId) {
        const imap = this.connections.get(connectionId);
        if (imap) {
            imap.end();
            this.connections.delete(connectionId);
            logger.info('IMAP connection closed');
        }
    }

    // Get mailbox list
    async getMailboxes(connectionId, config) {
        try {
            const imap = this.connections.get(connectionId) || await this.connect(connectionId, config);

            return new Promise((resolve, reject) => {
                imap.getBoxes((err, boxes) => {
                    if (err) {
                        logger.error('Error getting mailboxes:', err);
                        return reject(err);
                    }
                    resolve(boxes);
                });
            });
        } catch (error) {
            logger.error('Error in getMailboxes:', error);
            throw error;
        }
    }

    // Sync emails to database
    async syncToDatabase(userId, connectionId, config, EmailModel) {
        try {
            const emails = await this.fetchEmails(connectionId, config, {
                limit: 100,
                markAsRead: false,
            });

            let synced = 0;
            for (const email of emails) {
                // Check if email already exists
                const existing = await EmailModel.findOne({
                    where: {
                        userId,
                        messageId: email.id.toString(),
                    },
                });

                if (!existing) {
                    await EmailModel.create({
                        userId,
                        messageId: email.id.toString(),
                        from: email.from,
                        to: email.to,
                        subject: email.subject,
                        date: email.date,
                        body: email.text,
                        htmlBody: email.html,
                        hasAttachments: email.attachments.length > 0,
                        attachments: JSON.stringify(email.attachments),
                    });
                    synced++;
                }
            }

            logger.info(`Synced ${synced} new emails for user ${userId}`);
            return { synced, total: emails.length };
        } catch (error) {
            logger.error('Error syncing emails to database:', error);
            throw error;
        }
    }
}

module.exports = new IMAPService();
