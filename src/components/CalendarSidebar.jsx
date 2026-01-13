import React, { useState } from 'react';

const CalendarSidebar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    return Array.from({ length: 5 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(currentDate);

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Sample events
  const events = [
    {
      id: 1,
      title: 'Design Review',
      startTime: '09:00 AM',
      endTime: '09:30 PM',
      date: 'Apr 6, 2025',
      hour: 9,
    },
    {
      id: 2,
      title: 'Product Planning',
      startTime: '11:00 AM',
      endTime: '12:00 PM',
      date: 'Apr 6, 2025',
      hour: 11,
      attendees: 3,
      hasJoinButton: true,
    },
  ];

  const hours = Array.from({ length: 8 }, (_, i) => i + 8); // 8 AM to 3 PM

  const formatHour = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:00 ${suffix}`;
  };

  return (
    <div className="calendar-sidebar">
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-date-section">
          <span className="calendar-label">DATE</span>
          <h3 className="calendar-month">{formatMonth(currentDate)}</h3>
        </div>
        <button className="calendar-select-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Select Date
        </button>
      </div>

      {/* Week Navigation */}
      <div className="calendar-week">
        <button
          className="calendar-nav-btn"
          onClick={() => navigateWeek(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="calendar-days">
          {weekDays.map((day, index) => (
            <button
              key={index}
              className={`calendar-day ${day.toDateString() === selectedDate.toDateString() ? 'active' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <span className="calendar-day-name">{daysOfWeek[index]}</span>
              <span className="calendar-day-number">{day.getDate()}</span>
            </button>
          ))}
        </div>

        <button
          className="calendar-nav-btn"
          onClick={() => navigateWeek(1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Timeline */}
      <div className="calendar-timeline">
        {hours.map((hour) => {
          const event = events.find(e => e.hour === hour);

          return (
            <div key={hour} className="calendar-time-slot">
              <div className="calendar-time-label">{formatHour(hour)}</div>
              <div className="calendar-time-content">
                {hour === 10 && (
                  <div className="calendar-current-time">
                    <div className="calendar-current-time-dot"></div>
                    <div className="calendar-current-time-line"></div>
                  </div>
                )}
                {event && (
                  <div className="calendar-event">
                    <h4 className="calendar-event-title">{event.title}</h4>
                    <p className="calendar-event-time">
                      {event.startTime} - {event.endTime}, {event.date}
                    </p>
                    {event.attendees && (
                      <div className="calendar-event-footer">
                        <div className="calendar-event-attendees">
                          <div className="calendar-attendee"></div>
                          <div className="calendar-attendee"></div>
                          <div className="calendar-attendee"></div>
                          <span className="calendar-attendee-more">+2 more</span>
                        </div>
                      </div>
                    )}
                    {event.hasJoinButton && (
                      <button className="calendar-join-btn">
                        <span className="calendar-join-icon">📅</span>
                        Join Meeting
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarSidebar;
