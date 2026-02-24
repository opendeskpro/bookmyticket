import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Badge from '../../components/Shared/UI/Badge';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import { User } from '../../types';
import { getEvents } from '../../lib/supabase';

interface AdminEventsProps {
    user: User | null;
}

const AdminEvents: React.FC<AdminEventsProps> = ({ user }) => {
    const admin = user;
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getEvents();
                if (!cancelled) setEvents(data as any[]);
            } catch {
                if (!cancelled) setEvents([]);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <DashboardLayout user={admin}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">All Events</h1>
                    <p className="text-gray-500">Monitor and moderate all events on the platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Event</th>
                            <th className="px-6 py-4 font-semibold">Organizer</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Revenue</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={event.image} alt={event.title} className="w-10 h-10 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{event.title}</p>
                                            <Badge variant="neutral" size="sm">{event.category}</Badge>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    Pro Events Ltd.
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {event.date}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    ₹{((event.soldTickets || 0) * event.price).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                        <AlertTriangle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AdminEvents;
