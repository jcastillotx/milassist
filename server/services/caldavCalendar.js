/**
 * CalDAV Calendar Service
 * Universal calendar sync for iCloud, Yahoo, Fastmail, and other CalDAV providers
 */

const dav = require('dav');
const ICAL = require('ical.js');
const { logger } = require('../config/logger');

class CalDAVCalendarService {
    constructor() {
        this.connections = new Map();
    }

    /**
     * Create CalDAV client and connect
     * @param {string} connectionId - Unique connection identifier
     * @param {object} config - CalDAV configuration
     * @param {string} config.serverUrl - CalDAV server URL (e.g., https://caldav.icloud.com)
     * @param {string} config.username - Username or Apple ID
     * @param {string} config.password - Password or app-specific password
     */
    async connect(connectionId, config) {
        try {
            const xhr = new dav.transport.Basic(
                new dav.Credentials({
                    username: config.username,
                    password: config.password,
                })
            );

            const account = await dav.createAccount({
                server: config.serverUrl,
                xhr: xhr,
                loadCollections: true,
            });

            this.connections.set(connectionId, { account, config });
            logger.info(`CalDAV connected: ${connectionId}`);

            return account;
        } catch (error) {
            logger.error(`CalDAV connection failed for ${connectionId}:`, error);
            throw new Error(`Failed to connect to CalDAV server: ${error.message}`);
        }
    }

    /**
     * List all calendars
     * @param {string} connectionId - Connection identifier
     */
    async listCalendars(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection) {
            throw new Error('CalDAV connection not found. Call connect() first.');
        }

        try {
            const calendars = connection.account.calendars.map(cal => ({
                id: cal.url,
                name: cal.displayName,
                description: cal.description || '',
                color: cal.calendarColor || null,
                timezone: cal.timezone || 'UTC',
                url: cal.url,
            }));

            return calendars;
        } catch (error) {
            logger.error(`Failed to list CalDAV calendars:`, error);
            throw error;
        }
    }

    /**
     * Get events from a calendar
     * @param {string} connectionId - Connection identifier
     * @param {object} options - Query options
     * @param {string} options.calendarUrl - Calendar URL
     * @param {Date} options.timeMin - Start date
     * @param {Date} options.timeMax - End date
     * @param {number} options.maxResults - Maximum number of results
     */
    async getEvents(connectionId, options = {}) {
        const connection = this.connections.get(connectionId);
        if (!connection) {
            throw new Error('CalDAV connection not found. Call connect() first.');
        }

        try {
            const calendar = connection.account.calendars.find(
                cal => cal.url === options.calendarUrl
            );

            if (!calendar) {
                throw new Error('Calendar not found');
            }

            const timeMin = options.timeMin || new Date();
            const timeMax = options.timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            const objects = await dav.syncCalendar(calendar, {
                xhr: connection.account.credentials,
                syncMethod: 'webdav',
                filters: [{
                    type: 'comp-filter',
                    attrs: { name: 'VCALENDAR' },
                    children: [{
                        type: 'comp-filter',
                        attrs: { name: 'VEVENT' },
                        children: [{
                            type: 'time-range',
                            attrs: {
                                start: this._toICalDate(timeMin),
                                end: this._toICalDate(timeMax),
                            },
                        }],
                    }],
                }],
            });

            const events = objects
                .filter(obj => obj.calendarData)
                .map(obj => this._parseICalEvent(obj))
                .filter(event => event !== null)
                .slice(0, options.maxResults || 100);

            return events;
        } catch (error) {
            logger.error(`Failed to get CalDAV events:`, error);
            throw error;
        }
    }

    /**
     * Create a new calendar event
     * @param {string} connectionId - Connection identifier
     * @param {string} calendarUrl - Calendar URL
     * @param {object} eventData - Event data
     */
    async createEvent(connectionId, calendarUrl, eventData) {
        const connection = this.connections.get(connectionId);
        if (!connection) {
            throw new Error('CalDAV connection not found. Call connect() first.');
        }

        try {
            const calendar = connection.account.calendars.find(
                cal => cal.url === calendarUrl
            );

            if (!calendar) {
                throw new Error('Calendar not found');
            }

            // Create iCal format event
            const icalEvent = this._createICalEvent(eventData);

            const vcalendar = new ICAL.Component(['vcalendar', [], []]);
            vcalendar.updatePropertyWithValue('prodid', '-//MilAssist//CalDAV Client//EN');
            vcalendar.updatePropertyWithValue('version', '2.0');
            vcalendar.addSubcomponent(icalEvent);

            const calendarData = vcalendar.toString();

            const calendarObject = await dav.createCalendarObject(calendar, {
                filename: `${eventData.uid || this._generateUID()}.ics`,
                data: calendarData,
                xhr: connection.account.credentials,
            });

            logger.info(`CalDAV event created: ${calendarObject.url}`);

            return this._parseICalEvent(calendarObject);
        } catch (error) {
            logger.error(`Failed to create CalDAV event:`, error);
            throw error;
        }
    }

    /**
     * Update an existing calendar event
     * @param {string} connectionId - Connection identifier
     * @param {string} eventUrl - Event URL
     * @param {object} eventData - Updated event data
     */
    async updateEvent(connectionId, eventUrl, eventData) {
        const connection = this.connections.get(connectionId);
        if (!connection) {
            throw new Error('CalDAV connection not found. Call connect() first.');
        }

        try {
            // Get existing event
            const calendar = connection.account.calendars.find(cal => 
                eventUrl.startsWith(cal.url)
            );

            if (!calendar) {
                throw new Error('Calendar not found');
            }

            // Fetch the existing event
            const xhr = connection.account.credentials;
            const response = await xhr.send({
                method: 'GET',
                url: eventUrl,
            });

            const jcalData = ICAL.parse(response.body);
            const vcalendar = new ICAL.Component(jcalData);
            const vevent = vcalendar.getFirstSubcomponent('vevent');

            // Update properties
            if (eventData.title) {
                vevent.updatePropertyWithValue('summary', eventData.title);
            }
            if (eventData.description) {
                vevent.updatePropertyWithValue('description', eventData.description);
            }
            if (eventData.location) {
                vevent.updatePropertyWithValue('location', eventData.location);
            }
            if (eventData.start) {
                vevent.updatePropertyWithValue('dtstart', this._toICalTime(eventData.start));
            }
            if (eventData.end) {
                vevent.updatePropertyWithValue('dtend', this._toICalTime(eventData.end));
            }

            // Update the event
            await dav.updateCalendarObject(calendar, {
                url: eventUrl,
                data: vcalendar.toString(),
                etag: response.headers.etag,
                xhr: xhr,
            });

            logger.info(`CalDAV event updated: ${eventUrl}`);

            return { success: true, url: eventUrl };
        } catch (error) {
            logger.error(`Failed to update CalDAV event:`, error);
            throw error;
        }
    }

    /**
     * Delete a calendar event
     * @param {string} connectionId - Connection identifier
     * @param {string} eventUrl - Event URL
     */
    async deleteEvent(connectionId, eventUrl) {
        const connection = this.connections.get(connectionId);
        if (!connection) {
            throw new Error('CalDAV connection not found. Call connect() first.');
        }

        try {
            const calendar = connection.account.calendars.find(cal =>
                eventUrl.startsWith(cal.url)
            );

            if (!calendar) {
                throw new Error('Calendar not found');
            }

            await dav.deleteCalendarObject(calendar, {
                url: eventUrl,
                xhr: connection.account.credentials,
            });

            logger.info(`CalDAV event deleted: ${eventUrl}`);

            return { success: true };
        } catch (error) {
            logger.error(`Failed to delete CalDAV event:`, error);
            throw error;
        }
    }

    /**
     * Sync all events to database
     * @param {string} userId - User ID
     * @param {string} connectionId - Connection identifier
     * @param {string} calendarUrl - Calendar URL
     * @param {object} CalendarEventModel - Sequelize model
     */
    async syncToDatabase(userId, connectionId, calendarUrl, CalendarEventModel) {
        try {
            const events = await this.getEvents(connectionId, {
                calendarUrl,
                timeMin: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
                timeMax: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year ahead
                maxResults: 500,
            });

            let synced = 0;
            let updated = 0;

            for (const event of events) {
                const [record, created] = await CalendarEventModel.upsert({
                    userId,
                    externalId: event.id,
                    provider: 'caldav',
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startTime: event.start,
                    endTime: event.end,
                    isAllDay: event.isAllDay,
                    attendees: JSON.stringify(event.attendees || []),
                    status: event.status,
                    meetingLink: event.meetingLink,
                }, {
                    returning: true,
                });

                if (created) {
                    synced++;
                } else {
                    updated++;
                }
            }

            logger.info(`CalDAV sync completed: ${synced} new, ${updated} updated`);

            return { synced, updated, total: events.length };
        } catch (error) {
            logger.error('CalDAV sync to database failed:', error);
            throw error;
        }
    }

    /**
     * Parse iCal event to standard format
     */
    _parseICalEvent(calendarObject) {
        try {
            const jcalData = ICAL.parse(calendarObject.calendarData);
            const vcalendar = new ICAL.Component(jcalData);
            const vevent = vcalendar.getFirstSubcomponent('vevent');

            if (!vevent) {
                return null;
            }

            const event = new ICAL.Event(vevent);

            return {
                id: event.uid,
                url: calendarObject.url,
                title: event.summary || 'Untitled Event',
                description: event.description || '',
                location: event.location || '',
                start: event.startDate.toJSDate(),
                end: event.endDate.toJSDate(),
                isAllDay: event.startDate.isDate,
                status: event.status || 'confirmed',
                attendees: this._parseAttendees(vevent),
                organizer: event.organizer || null,
                meetingLink: this._extractMeetingLink(event.description),
            };
        } catch (error) {
            logger.error('Failed to parse iCal event:', error);
            return null;
        }
    }

    /**
     * Create iCal event component
     */
    _createICalEvent(eventData) {
        const vevent = new ICAL.Component('vevent');
        
        vevent.addPropertyWithValue('uid', eventData.uid || this._generateUID());
        vevent.addPropertyWithValue('summary', eventData.title);
        vevent.addPropertyWithValue('description', eventData.description || '');
        vevent.addPropertyWithValue('location', eventData.location || '');
        
        const dtstart = ICAL.Time.fromJSDate(new Date(eventData.start));
        vevent.addPropertyWithValue('dtstart', dtstart);
        
        const dtend = ICAL.Time.fromJSDate(new Date(eventData.end));
        vevent.addPropertyWithValue('dtend', dtend);
        
        vevent.addPropertyWithValue('dtstamp', ICAL.Time.now());
        vevent.addPropertyWithValue('status', eventData.status || 'CONFIRMED');

        // Add attendees
        if (eventData.attendees && eventData.attendees.length > 0) {
            eventData.attendees.forEach(email => {
                const attendee = vevent.addPropertyWithValue('attendee', `mailto:${email}`);
                attendee.setParameter('partstat', 'NEEDS-ACTION');
                attendee.setParameter('role', 'REQ-PARTICIPANT');
            });
        }

        return vevent;
    }

    /**
     * Parse attendees from vevent component
     */
    _parseAttendees(vevent) {
        const attendees = [];
        const attendeeProps = vevent.getAllProperties('attendee');

        attendeeProps.forEach(prop => {
            const email = prop.getFirstValue().replace('mailto:', '');
            attendees.push(email);
        });

        return attendees;
    }

    /**
     * Extract meeting link from description
     */
    _extractMeetingLink(description) {
        if (!description) return null;

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = description.match(urlRegex);

        if (matches) {
            // Look for common meeting URLs
            const meetingLink = matches.find(url =>
                url.includes('zoom.us') ||
                url.includes('teams.microsoft.com') ||
                url.includes('meet.google.com') ||
                url.includes('webex.com')
            );

            return meetingLink || matches[0];
        }

        return null;
    }

    /**
     * Generate unique UID
     */
    _generateUID() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@milassist.com`;
    }

    /**
     * Convert Date to iCal format
     */
    _toICalDate(date) {
        return ICAL.Time.fromJSDate(date).toString();
    }

    /**
     * Convert Date to iCal Time
     */
    _toICalTime(dateString) {
        return ICAL.Time.fromJSDate(new Date(dateString));
    }

    /**
     * Disconnect CalDAV connection
     */
    disconnect(connectionId) {
        this.connections.delete(connectionId);
        logger.info(`CalDAV disconnected: ${connectionId}`);
    }
}

module.exports = new CalDAVCalendarService();
