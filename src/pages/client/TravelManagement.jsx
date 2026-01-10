import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const TravelManagement = () => {
    const [trips, setTrips] = useState([]);
    const [showBuilder, setShowBuilder] = useState(false);
    const [newTrip, setNewTrip] = useState({ destination: '', start_date: '', end_date: '', flight: '', hotel: '' });

    // Mock fetch or real fetch
    useEffect(() => {
        // In real app, fetch from /api/trips
        setTrips([
            { id: 1, destination: 'New York, NY', start_date: '2023-12-01', status: 'booked' }
        ]);
    }, []);

    const handleCreate = async () => {
        // Mock create
        const trip = { id: Date.now(), ...newTrip, status: 'draft' };
        setTrips([...trips, trip]);
        setShowBuilder(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Travel Management</h2>
                <Button onClick={() => setShowBuilder(!showBuilder)}>
                    {showBuilder ? 'Cancel Trip' : '+ Plan New Trip'}
                </Button>
            </div>

            {showBuilder && (
                <Card className="bg-blue-50 border-blue-100">
                    <h3 className="font-bold text-lg mb-4">Trip Builder</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Destination</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={newTrip.destination}
                                onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded"
                                    value={newTrip.start_date}
                                    onChange={e => setNewTrip({ ...newTrip, start_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded"
                                    value={newTrip.end_date}
                                    onChange={e => setNewTrip({ ...newTrip, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Flight Preferences</label>
                            <textarea
                                className="w-full p-2 border rounded text-sm"
                                placeholder="e.g. Delta, Window Seat, Morning departure"
                                value={newTrip.flight}
                                onChange={e => setNewTrip({ ...newTrip, flight: e.target.value })}
                            />
                            <div className="mt-2 text-xs text-right">
                                <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                    Check Google Flights ↗
                                </a>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hotel Preferences</label>
                            <textarea
                                className="w-full p-2 border rounded text-sm"
                                placeholder="e.g. Downtown, 4-star, Gym required"
                                value={newTrip.hotel}
                                onChange={e => setNewTrip({ ...newTrip, hotel: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleCreate}>Save Draft Trip</Button>
                    </div>
                </Card>
            )}

            <div className="space-y-4">
                {trips.map(trip => (
                    <Card key={trip.id} className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{trip.destination}</h3>
                            <p className="text-gray-500 text-sm">{trip.start_date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
               ${trip.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
             `}>
                            {trip.status}
                        </span>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TravelManagement;
