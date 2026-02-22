import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS, MOCK_EVENTS } from '../../constants/mockData';
import Button from '../../components/Shared/UI/Button';
import Badge from '../../components/Shared/UI/Badge';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizerEvents: React.FC = () => {
    const user = MOCK_USERS[1];
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter events for this organizer
    const events = MOCK_EVENTS.filter(e => e.organizerId === user.id);

    return (
        <DashboardLayout user={user}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">My Events</h1>
                    <p className="text-gray-500">Manage your upcoming and past events.</p>
                </div>
                <Button onClick={() => navigate('/organizer/create-event')}>
                    + Create New Event
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Event Details</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Sales</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-900">{event.title}</p>
                                                <p className="text-xs text-gray-500">{event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900">{event.date}</p>
                                        <p className="text-xs text-gray-500">{event.time}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={event.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                                            {event.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-32">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>{event.soldTickets || 0} sold</span>
                                                <span className="text-gray-400">{event.totalTickets || event.totalSeats} total</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#FF006E]"
                                                    style={{ width: `${((event.soldTickets || 0) / (event.totalTickets || event.totalSeats || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrganizerEvents;
