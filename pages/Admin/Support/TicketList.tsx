import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, PlusCircle, MoreHorizontal, Eye, Trash2, UserPlus, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Ticket {
    id: string;
    userType: 'Customer' | 'Organizer';
    username: string;
    email: string;
    subject: string;
    status: 'Open' | 'Pending' | 'Closed';
    date: string;
    priority: 'High' | 'Medium' | 'Low';
}

const MOCK_TICKETS: Ticket[] = [
    { id: '1024', userType: 'Organizer', username: 'event_pro', email: 'pro@events.com', subject: 'Payout not received yet', status: 'Pending', date: '2026-02-15', priority: 'High' },
    { id: '1023', userType: 'Customer', username: 'john_doe', email: 'john@gmail.com', subject: 'Cannot download ticket', status: 'Open', date: '2026-02-14', priority: 'Medium' },
    { id: '1022', userType: 'Organizer', username: 'music_fest', email: 'contact@fest.com', subject: 'How to add co-organizer?', status: 'Closed', date: '2026-02-12', priority: 'Low' },
    { id: '1021', userType: 'Customer', username: 'alice_w', email: 'alice@yahoo.com', subject: 'Refund request for cancelled event', status: 'Open', date: '2026-02-10', priority: 'High' },
    { id: '1020', userType: 'Organizer', username: 'tech_conf', email: 'support@techconf.io', subject: 'Badge printing issues', status: 'Pending', date: '2026-02-09', priority: 'Medium' },
];

const TicketList: React.FC<{ filter?: 'pending' | 'open' | 'closed' }> = ({ filter }) => {
    const { theme } = useTheme();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

    // Initial filter based on prop or route
    const currentFilter = filter || (location.pathname.includes('pending') ? 'pending' : location.pathname.includes('open') ? 'open' : location.pathname.includes('closed') ? 'closed' : 'all');

    const statusColors = {
        Open: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        Closed: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.includes(searchTerm);

        const matchesFilter = currentFilter === 'all'
            ? true
            : ticket.status.toLowerCase() === currentFilter;

        return matchesSearch && matchesFilter;
    });

    const handleDelete = (id: string) => {
        if (confirm('Delete this ticket?')) {
            setTickets(tickets.filter(t => t.id !== id));
        }
    };

    return (
        <div className={`p-6 md:p-10 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                            Manage support requests from customers and organizers.
                        </p>
                    </div>
                </div>

                <div className={`p-6 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`} size={18} />
                            <input
                                type="text"
                                placeholder="Search by ID, Subject, or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark'
                                        ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF] text-white placeholder:text-white/20'
                                        : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF] text-slate-900 placeholder:text-slate-400'
                                    }`}
                            />
                        </div>
                        <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                            {['all', 'pending', 'open', 'closed'].map(tab => (
                                <Link
                                    key={tab}
                                    to={tab === 'all' ? '/admin/support' : `/admin/support/${tab}`}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${currentFilter === tab
                                            ? 'bg-white dark:bg-[#3A86FF] text-black dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>ID</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>User</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Subject</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Status</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Last Update</th>
                                    <th className={`py-4 px-4 text-right text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className={`border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                        <td className="py-4 px-4 font-mono text-xs opacity-70">#{ticket.id}</td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <div className="font-bold flex items-center gap-2">
                                                    {ticket.username}
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${ticket.userType === 'Organizer' ? 'border-purple-500/30 text-purple-500 bg-purple-500/10' : 'border-slate-500/30 text-slate-500 bg-slate-500/10'}`}>
                                                        {ticket.userType}
                                                    </span>
                                                </div>
                                                <div className="text-xs opacity-50 flex items-center gap-1">
                                                    <Mail size={10} /> {ticket.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Link to={`/admin/support/ticket/${ticket.id}`} className="font-bold hover:text-[#3A86FF] transition-colors">
                                                {ticket.subject}
                                            </Link>
                                            <div className="text-[10px] opacity-50 mt-1 uppercase tracking-wider font-bold">Priority: {ticket.priority}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[ticket.status]}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-xs opacity-70">
                                            {ticket.date}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="relative group">
                                                    <button className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-white/60' : 'text-slate-400'}`}>
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                    {/* Dropdown Menu (Hover based for simplicity in execution) */}
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1e2736] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden hidden group-hover:block z-50">
                                                        <Link to={`/admin/support/ticket/${ticket.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold transition-colors">
                                                            <Eye size={14} /> View Details
                                                        </Link>
                                                        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold transition-colors text-left">
                                                            <UserPlus size={14} /> Assign To
                                                        </button>
                                                        <button onClick={() => handleDelete(ticket.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 text-xs font-bold transition-colors text-left">
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredTickets.length === 0 && (
                        <div className="py-20 text-center opacity-50">
                            No tickets found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketList;
