import React, { useState } from 'react';
import { MOCK_EVENTS } from '../../constants/mockData';
import { Search, Filter, MapPin, Calendar, Clock } from 'lucide-react';
import Button from '../../components/Shared/UI/Button';
import Card from '../../components/Shared/UI/Card';
import Badge from '../../components/Shared/UI/Badge';
import { useNavigate } from 'react-router-dom';

const BrowseEvents: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Browse Events</h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF006E] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search events, cities..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF006E]/20 focus:border-[#FF006E] transition-all bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" leftIcon={<Filter size={18} />}>
                        Filters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())).map(event => (
                    <div
                        key={event.id}
                        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                        onClick={() => navigate(`/user/event/${event.id}`)}
                    >
                        <div className="relative h-48 overflow-hidden shrink-0">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#1E293B] shadow-sm">
                                {event.category || 'Event'}
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#FF006E] mb-3 uppercase tracking-wide">
                                {event.date}
                            </div>
                            <h3 className="font-bold text-lg text-[#1E293B] mb-2 line-clamp-2 leading-tight group-hover:text-[#FF006E] transition-colors h-12">
                                {event.title}
                            </h3>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-100">
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

export default BrowseEvents;
