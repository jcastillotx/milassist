import React, { useState, useEffect } from 'react';
import API_URL from "../../config/api";
import Card from '../../components/Card';
import Button from '../../components/Button';

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch calendar events
            const calRes = await fetch(`${API_URL}/calendar/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (calRes.ok) {
                const calData = await calRes.json();
                setEvents(calData.events || []);
            }

            // Fetch meetings
            const meetRes = await fetch(`${API_URL}/meetings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (meetRes.ok) {
                const meetData = await meetRes.json();
                setMeetings(meetData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            slots.push({
                time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
                hour
            });
        }
        return slots;
    };

    const getEventsForHour = (hour) => {
        const allItems = [...events, ...meetings];
        return allItems.filter(item => {
            const startHour = new Date(item.start || item.startTime).getHours();
            return startHour === hour;
        });
    };

    if (loading) return <div className="p-6">Loading calendar...</div>;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Calendar</h2>
                    <p className="text-gray-600">{formatDate(selectedDate)}</p>
                </div>
                <Button onClick={() => window.location.href = '/client/meetings/new'}>
                    + New Meeting
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                <div className="space-y-1">
                    {getTimeSlots().map(slot => {
                        const hourEvents = getEventsForHour(slot.hour);
                        return (
                            <div key={slot.hour} className="flex border-t border-gray-100">
                                {/* Time Label */}
                                <div className="w-24 flex-shrink-0 py-3 pr-4 text-sm text-gray-500 text-right">
                                    {slot.time}
                                </div>

                                {/* Event Area */}
                                <div className="flex-1 py-2 min-h-[60px]">
                                    {hourEvents.length > 0 ? (
                                        <div className="space-y-2">
                                            {hourEvents.map((event, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border-l-4 ${
                                                        event.meetingUrl 
                                                            ? 'bg-blue-50 border-blue-500' 
                                                            : 'bg-gray-50 border-gray-400'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">
                                                                {event.title}
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {formatTime(event.start || event.startTime)} - {formatTime(event.end || event.endTime)}
                                                            </div>
                                                            {event.description && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {event.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {event.meetingUrl && (
                                                            <Button
                                                                variant="primary"
                                                                className="text-xs py-1 px-3 ml-3"
                                                                onClick={() => window.open(event.meetingUrl, '_blank')}
                                                            >
                                                                Join Meeting
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
