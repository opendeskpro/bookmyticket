import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EVENTS, MOCK_BOOKINGS } from '../../constants/mockData';

const UserDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                    <p className="text-3xl font-bold mt-2">{MOCK_BOOKINGS.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
                    <p className="text-3xl font-bold mt-2">2</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Wallet Balance</h3>
                    <p className="text-3xl font-bold mt-2">₹500</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_EVENTS.map(event => (
                    <div
                        key={event.id}
                        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => navigate(`/user/event/${event.id}`)}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#1E293B] shadow-sm">
                                {event.category || 'Event'}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#FF006E] mb-3 uppercase tracking-wide">
                                {event.date}
                            </div>
                            <h3 className="font-bold text-lg text-[#1E293B] mb-2 line-clamp-2 leading-tight group-hover:text-[#FF006E] transition-colors h-12">
                                {event.title}
                            </h3>
                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-dashed border-gray-100">
                                <span className="text-sm text-gray-500 truncate">{event.city}</span>
                                <span className="font-bold text-[#1E293B]">₹{event.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
