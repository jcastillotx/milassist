/**
 * Email and Calendar Background Sync Scheduler
 * Automatically syncs emails and calendars for all connected users
 */

const cron = require('node-cron');
const { logger } = require('../config/logger');
const { EmailConnection, CalendarConnection } = require('../models');
const gmailService = require('./gmail');
const imapService = require('./imap');
const office365Service = require('./office365');
const googleCalendarService = require('./googleCalendar');
const office365CalendarService = require('./office365Calendar');
const caldavCalendarService = require('./caldavCalendar');

class SyncScheduler {
    constructor() {
        this.emailSyncJob = null;
        this.calendarSyncJob = null;
        this.isRunning = false;
    }

    // Start all sync jobs
    start() {
        if (this.isRunning) {
            logger.warn('Sync scheduler already running');
            return;
        }

        this.isRunning = true;
        logger.info('Starting sync scheduler...');

        // Sync emails every 5 minutes
        this.emailSyncJob = cron.schedule('*/5 * * * *', async () => {
            logger.info('Starting scheduled email sync');
            await this.syncAllEmails();
        });

        // Sync calendars every 15 minutes
        this.calendarSyncJob = cron.schedule('*/15 * * * *', async () => {
            logger.info('Starting scheduled calendar sync');
            await this.syncAllCalendars();
        });

        logger.info('Sync scheduler started successfully');
    }

    // Stop all sync jobs
    stop() {
        if (this.emailSyncJob) {
            this.emailSyncJob.stop();
        }
        if (this.calendarSyncJob) {
            this.calendarSyncJob.stop();
        }
        this.isRunning = false;
        logger.info('Sync scheduler stopped');
    }

    // Sync all email connections
    async syncAllEmails() {
        try {
            const connections = await EmailConnection.findAll({
                where: { status: 'active' },
            });

            logger.info(`Syncing ${connections.length} email connections`);

            for (const connection of connections) {
                try {
                    await this.syncEmailConnection(connection);
                } catch (error) {
                    logger.error(`Error syncing email for user ${connection.userId}:`, error);
                    // Continue with next connection
                }
            }

            logger.info('Email sync completed');
        } catch (error) {
            logger.error('Error in syncAllEmails:', error);
        }
    }

    // Sync single email connection
    async syncEmailConnection(connection) {
        const { userId, provider, email, accessToken, refreshToken, imapConfig } = connection;

        try {
            let result;

            switch (provider) {
                case 'gmail':
                    result = await gmailService.syncToDatabase(
                        userId,
                        accessToken,
                        refreshToken,
                        require('../models').Email
                    );
                    break;

                case 'office365':
                case 'outlook':
                    result = await office365Service.syncToDatabase(
                        userId,
                        accessToken,
                        require('../models').Email
                    );
                    break;

                case 'imap':
                    if (!imapConfig) {
                        logger.warn(`IMAP config missing for user ${userId}`);
                        return;
                    }
                    const config = JSON.parse(imapConfig);
                    const connectionId = `imap_${userId}`;
                    result = await imapService.syncToDatabase(
                        userId,
                        connectionId,
                        config,
                        require('../models').Email
                    );
                    break;

                default:
                    logger.warn(`Unknown email provider: ${provider}`);
                    return;
            }

            // Update last sync time
            await connection.update({
                lastSyncAt: new Date(),
                syncStatus: 'success',
            });

            logger.info(`Synced ${result.synced} new emails for ${email} (${provider})`);
        } catch (error) {
            logger.error(`Error syncing ${email}:`, error);
            
            // Update connection with error
            await connection.update({
                syncStatus: 'error',
                lastSyncError: error.message,
            });
        }
    }

    // Sync all calendar connections
    async syncAllCalendars() {
        try {
            const connections = await CalendarConnection.findAll({
                where: { status: 'active' },
            });

            logger.info(`Syncing ${connections.length} calendar connections`);

            for (const connection of connections) {
                try {
                    await this.syncCalendarConnection(connection);
                } catch (error) {
                    logger.error(`Error syncing calendar for user ${connection.userId}:`, error);
                }
            }

            logger.info('Calendar sync completed');
        } catch (error) {
            logger.error('Error in syncAllCalendars:', error);
        }
    }

    // Sync single calendar connection
    async syncCalendarConnection(connection) {
        const { userId, provider, accessToken, refreshToken } = connection;

        try {
            let result;

            switch (provider) {
                case 'google':
                    result = await googleCalendarService.syncToDatabase(
                        userId,
                        accessToken,
                        refreshToken,
                        require('../models').CalendarEvent
                    );
                    break;

                case 'office365':
                case 'outlook':
                    result = await office365CalendarService.syncToDatabase(
                        userId,
                        accessToken,
                        require('../models').CalendarEvent
                    );
                    break;

                case 'caldav':
                case 'icloud':
                case 'yahoo_calendar':
                    // CalDAV requires connection config
                    const caldavConfig = connection.caldavConfig ? JSON.parse(connection.caldavConfig) : null;
                    if (!caldavConfig) {
                        logger.warn(`CalDAV config missing for user ${userId}`);
                        return;
                    }
                    const connectionId = `caldav_${userId}`;
                    await caldavCalendarService.connect(connectionId, caldavConfig);
                    result = await caldavCalendarService.syncToDatabase(
                        userId,
                        connectionId,
                        caldavConfig.calendarUrl,
                        require('../models').CalendarEvent
                    );
                    caldavCalendarService.disconnect(connectionId);
                    break;

                default:
                    logger.warn(`Unknown calendar provider: ${provider}`);
                    return;
            }

            // Update last sync time
            await connection.update({
                lastSyncAt: new Date(),
                syncStatus: 'success',
            });

            logger.info(`Synced ${result.synced} new calendar events for user ${userId} (${provider})`);
        } catch (error) {
            logger.error(`Error syncing calendar for user ${userId}:`, error);
            
            await connection.update({
                syncStatus: 'error',
                lastSyncError: error.message,
            });
        }
    }

    // Manual sync for specific user
    async syncUserEmail(userId, provider) {
        const connection = await EmailConnection.findOne({
            where: { userId, provider },
        });

        if (!connection) {
            throw new Error('Email connection not found');
        }

        return await this.syncEmailConnection(connection);
    }

    // Manual sync for specific user calendar
    async syncUserCalendar(userId, provider) {
        const connection = await CalendarConnection.findOne({
            where: { userId, provider },
        });

        if (!connection) {
            throw new Error('Calendar connection not found');
        }

        return await this.syncCalendarConnection(connection);
    }
}

module.exports = new SyncScheduler();
