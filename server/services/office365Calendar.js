/**
 * Office365 Calendar Service
 * Uses Microsoft Graph API for Outlook/Office365 calendar synchronization
 */

const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const { logger } = require('../config/logger');

class Office365CalendarService {
    constructor() {
        this.clientId = process.env.MICROSOFT_CLIENT_ID;
        this.clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
        
        if (!this.clientId || !this.clientSecret) {
            logger.warn('Office365 configuration missing');
        }
    }

    // Get Graph client
    getClient(accessToken) {
        return Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
        });
    }

    // List calendars
    async listCalendars(accessToken) {
        try {
            const client = this.getClient(accessToken);
            const result = await client.api('/me/calendars').get();
            
            return result.value.map(cal => ({
                id: cal.id,
                name: cal.name,
                color: cal.hexColor,
                canEdit: cal.canEdit,
                canShare: cal.canShare,
                isDefaultCalendar: cal.isDefaultCalendar,
            }));
        } catch (error) {
            logger.error('Error listing Office365 calendars:', error);
            throw error;
        }
    }

    // Get events
    async getEvents(accessToken, options = {}) {
        const {
            calendarId = null,
            startDateTime = new Date().toISOString(),
            endDateTime = null,
            top = 50,
        } = options;

        try {
            const client = this.getClient(accessToken);
            
            let apiPath = calendarId 
                ? `/me/calendars/${calendarId}/events`
                : '/me/calendar/events';

            let query = client
                .api(apiPath)
                .top(top)
                .select('id,subject,bodyPreview,location,start,end,attendees,isAllDay,onlineMeeting')
                .orderby('start/dateTime');

            // Add date filter
            if (startDateTime) {
                const filter = endDateTime
                    ? `start/dateTime ge '${startDateTime}' and end/dateTime le '${endDateTime}'`
                    : `start/dateTime ge '${startDateTime}'`;
                query = query.filter(filter);
            }

            const result = await query.get();
            
            return result.value.map(event => ({
                id: event.id,
                title: event.subject,
                description: event.bodyPreview || '',
                location: event.location?.displayName || '',
                start: event.start.dateTime,
                end: event.end.dateTime,
                timezone: event.start.timeZone,
                isAllDay: event.isAllDay,
                attendees: event.attendees?.map(a => ({
                    email: a.emailAddress.address,
                    name: a.emailAddress.name,
                    status: a.status.response,
                })) || [],
                meetingLink: event.onlineMeeting?.joinUrl || '',
            }));
        } catch (error) {
            logger.error('Error getting Office365 calendar events:', error);
            throw error;
        }
    }

    // Create event
    async createEvent(accessToken, eventData) {
        const {
            calendarId = null,
            title,
            description = '',
            location = '',
            start,
            end,
            attendees = [],
            addTeamsMeeting = false,
        } = eventData;

        try {
            const client = this.getClient(accessToken);

            const event = {
                subject: title,
                body: {
                    contentType: 'HTML',
                    content: description,
                },
                start: {
                    dateTime: start,
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: end,
                    timeZone: 'UTC',
                },
                location: {
                    displayName: location,
                },
                attendees: attendees.map(email => ({
                    emailAddress: {
                        address: email,
                    },
                    type: 'required',
                })),
            };

            // Add Teams meeting
            if (addTeamsMeeting) {
                event.isOnlineMeeting = true;
                event.onlineMeetingProvider = 'teamsForBusiness';
            }

            const apiPath = calendarId 
                ? `/me/calendars/${calendarId}/events`
                : '/me/calendar/events';

            const result = await client.api(apiPath).post(event);

            logger.info(`Created Office365 calendar event: ${result.id}`);
            return {
                id: result.id,
                webLink: result.webLink,
                meetLink: result.onlineMeeting?.joinUrl,
            };
        } catch (error) {
            logger.error('Error creating Office365 calendar event:', error);
            throw error;
        }
    }

    // Update event
    async updateEvent(accessToken, eventId, eventData) {
        const {
            title,
            description,
            location,
            start,
            end,
        } = eventData;

        try {
            const client = this.getClient(accessToken);

            const event = {};
            if (title) event.subject = title;
            if (description) event.body = { contentType: 'HTML', content: description };
            if (location) event.location = { displayName: location };
            if (start) event.start = { dateTime: start, timeZone: 'UTC' };
            if (end) event.end = { dateTime: end, timeZone: 'UTC' };

            await client.api(`/me/calendar/events/${eventId}`).patch(event);

            logger.info(`Updated Office365 calendar event: ${eventId}`);
        } catch (error) {
            logger.error('Error updating Office365 calendar event:', error);
            throw error;
        }
    }

    // Delete event
    async deleteEvent(accessToken, eventId) {
        try {
            const client = this.getClient(accessToken);
            await client.api(`/me/calendar/events/${eventId}`).delete();
            
            logger.info(`Deleted Office365 calendar event: ${eventId}`);
        } catch (error) {
            logger.error('Error deleting Office365 calendar event:', error);
            throw error;
        }
    }

    // Sync events to database
    async syncToDatabase(userId, accessToken, CalendarEventModel) {
        try {
            const events = await this.getEvents(accessToken, {
                top: 100,
            });

            let synced = 0;
            for (const event of events) {
                const existing = await CalendarEventModel.findOne({
                    where: {
                        userId,
                        externalId: event.id,
                        provider: 'office365',
                    },
                });

                if (!existing) {
                    await CalendarEventModel.create({
                        userId,
                        externalId: event.id,
                        provider: 'office365',
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

            logger.info(`Synced ${synced} new Office365 calendar events for user ${userId}`);
            return { synced, total: events.length };
        } catch (error) {
            logger.error('Error syncing Office365 calendar events:', error);
            throw error;
        }
    }
}

module.exports = new Office365CalendarService();
