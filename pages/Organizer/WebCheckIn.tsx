import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS, MOCK_ATTENDEES } from '../../constants/mockData';
import Badge from '../../components/Shared/UI/Badge';
import { Search, QrCode, CheckCircle, Clock } from 'lucide-react';

const WebCheckIn: React.FC = () => {
    const user = MOCK_USERS[1];
    const [searchTerm, setSearchTerm] = useState('');
    const [attendees, setAttendees] = useState(MOCK_ATTENDEES);

    const handleCheckIn = (id: string) => {
        setAttendees(prev => prev.map(a =>
            a.id === id
                ? { ...a, checkInStatus: 'CHECKED_IN', checkInTime: new Date().toISOString() }
                : a
        ));
    };

    return (
        <DashboardLayout user={user}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Attendees</h1>
                    <p className="text-gray-500">Manage guest lists and check-ins for your events.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Total Attendees</p>
                    <p className="text-2xl font-bold mt-2">{attendees.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Checked In</p>
                    <p className="text-2xl font-bold mt-2 text-green-600">
                        {attendees.filter(a => a.checkInStatus === 'CHECKED_IN').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold mt-2 text-orange-500">
                        {attendees.filter(a => a.checkInStatus === 'PENDING').length}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or ticket ID..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Attendee</th>
                                <th className="px-6 py-4 font-semibold">Ticket Details</th>
                                <th className="px-6 py-4 font-semibold">Event</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendees.map((attendee) => (
                                <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{attendee.name}</p>
                                        <p className="text-xs text-gray-500">{attendee.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <QrCode size={16} className="text-gray-400" />
                                            <span className="text-sm font-mono text-gray-700">{attendee.ticketId}</span>
                                        </div>
                                        <p className="text-xs text-[#FF006E] mt-0.5">{attendee.ticketType}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900 truncate max-w-[150px]">{attendee.eventName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {attendee.checkInStatus === 'CHECKED_IN' ? (
                                            <Badge variant="success">Checked In</Badge>
                                        ) : (
                                            <Badge variant="neutral">Pending</Badge>
                                        )}
                                        {attendee.checkInTime && <p className="text-[10px] text-gray-400 mt-1">{new Date(attendee.checkInTime).toLocaleTimeString()}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {attendee.checkInStatus === 'PENDING' && (
                                            <button
                                                onClick={() => handleCheckIn(attendee.id)}
                                                className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                                            >
                                                <CheckCircle size={14} /> Check In
                                            </button>
                                        )}
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

export default WebCheckIn;
