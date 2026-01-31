/**
 * Google Calendar Sync Service
 * Uses Google Calendar API for calendar synchronization
 */

const { google } = require('googleapis');
const { logger } = require('../config/logger');

class GoogleCalendarService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.APP_URL || 'http://localhost:3000'}/api/calendar/callback/google`
        );

        this.scopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
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
            logger.info('Google Calendar tokens obtained');
            return tokens;
        } catch (error) {
            logger.error('Error getting Google Calendar tokens:', error);
            throw error;
        }
    }

    // Get Calendar client
    getCalendarClient(accessToken, refreshToken) {
        this.oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        return google.calendar({ version: 'v3', auth: this.oauth2Client });
    }

    // List calendars
    async listCalendars(accessToken, refreshToken) {
        try {
            const calendar = this.getCalendarClient(accessToken, refreshToken);
            const response = await calendar.calendarList.list();
            
            return response.data.items.map(cal => ({
                id: cal.id,
                name: cal.summary,
                description: cal.description || '',
                timezone: cal.timeZone,
                isPrimary: cal.primary || false,
                backgroundColor: cal.backgroundColor,
            }));
        } catch (error) {
            logger.error('Error listing Google calendars:', error);
            throw error;
        }
    }

    // Get events
    async getEvents(accessToken, refreshToken, options = {}) {
        const {
            calendarId = 'primary',
            timeMin = new Date().toISOString(),
            timeMax = null,
            maxResults = 50,
        } = options;

        try {
            const calendar = this.getCalendarClient(accessToken, refreshToken);
            
            const params = {
                calendarId,
                timeMin,
                maxResults,
                singleEvents: true,
                orderBy: 'startTime',
            };

            if (timeMax) {
                params.timeMax = timeMax;
            }

            const response = await calendar.events.list(params);
            
            return response.data.items.map(event => ({
                id: event.id,
                title: event.summary,
                description: event.description || '',
                location: event.location || '',
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                isAllDay: !event.start.dateTime,
                attendees: event.attendees?.map(a => ({
                    email: a.email,
                    name: a.displayName || '',
                    status: a.responseStatus,
                })) || [],
                meetingLink: event.hangoutLink || '',
                conferenceData: event.conferenceData,
            }));
        } catch (error) {
            logger.error('Error getting Google Calendar events:', error);
            throw error;
        }
    }

    // Create event
    async createEvent(accessToken, refreshToken, eventData) {
        const {
            calendarId = 'primary',
            title,
            description = '',
            location = '',
            start,
            end,
            attendees = [],
            addMeetLink = false,
        } = eventData;

        try {
            const calendar = this.getCalendarClient(accessToken, refreshToken);

            const event = {
                summary: title,
                description,
                location,
                start: {
                    dateTime: start,
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: end,
                    timeZone: 'UTC',
                },
                attendees: attendees.map(email => ({ email })),
            };

            // Add Google Meet link
            if (addMeetLink) {
                event.conferenceData = {
                    createRequest: {
                        requestId: `meet-${Date.now()}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                };
            }

            const response = await calendar.events.insert({
                calendarId,
                resource: event,
                conferenceDataVersion: addMeetLink ? 1 : 0,
                sendUpdates: 'all',
            });

            logger.info(`Created Google Calendar event: ${response.data.id}`);
            return {
                id: response.data.id,
                htmlLink: response.data.htmlLink,
                meetLink: response.data.hangoutLink,
            };
        } catch (error) {
            logger.error('Error creating Google Calendar event:', error);
            throw error;
        }
    }

    // Update event
    async updateEvent(accessToken, refreshToken, eventId, eventData) {
        const {
            calendarId = 'primary',
            title,
            description,
            location,
            start,
            end,
        } = eventData;

        try {
            const calendar = this.getCalendarClient(accessToken, refreshToken);

            const event = {};
            if (title) event.summary = title;
            if (description) event.description = description;
            if (location) event.location = location;
            if (start) event.start = { dateTime: start, timeZone: 'UTC' };
            if (end) event.end = { dateTime: end, timeZone: 'UTC' };

            const response = await calendar.events.patch({
                calendarId,
                eventId,
                resource: event,
                sendUpdates: 'all',
            });

            logger.info(`Updated Google Calendar event: ${eventId}`);
            return response.data;
        } catch (error) {
            logger.error('Error updating Google Calendar event:', error);
            throw error;
        }
    }

    // Delete event
    async deleteEvent(accessToken, refreshToken, eventId, calendarId = 'primary') {
        try {
            const calendar = this.getCalendarClient(accessToken, refreshToken);
            
            await calendar.events.delete({
                calendarId,
                eventId,
                sendUpdates: 'all',
            });

            logger.info(`Deleted Google Calendar event: ${eventId}`);
        } catch (error) {
            logger.error('Error deleting Google Calendar event:', error);
            throw error;
        }
    }

    // Sync events to database
    async syncToDatabase(userId, accessToken, refreshToken, CalendarEventModel) {
        try {
            const events = await this.getEvents(accessToken, refreshToken, {
                maxResults: 100,
            });

            let synced = 0;
            for (const event of events) {
                const existing = await CalendarEventModel.findOne({
                    where: {
                        userId,
                        externalId: event.id,
                        provider: 'google',
                    },
                });

                if (!existing) {
                    await CalendarEventModel.create({
                        userId,
                        externalId: event.id,
                        provider: 'google',
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        startTime: event.start,
                        endTime: event.end,
                        isAllDay: event.isAllDay,
                        attendees: JSON.stringify(event.attendees),
                        meetingLink: event.meetingLink,
                    });
                    synced++;
                } else {
                    // Update existing
                    await existing.update({
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        startTime: event.start,
                        endTime: event.end,
                        attendees: JSON.stringify(event.attendees),
                        meetingLink: event.meetingLink,
                    });
                }
            }

            logger.info(`Synced ${synced} new Google Calendar events for user ${userId}`);
            return { synced, total: events.length };
        } catch (error) {
            logger.error('Error syncing Google Calendar events:', error);
            throw error;
        }
    }
}

module.exports = new GoogleCalendarService();
