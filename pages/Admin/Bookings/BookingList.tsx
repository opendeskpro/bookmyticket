import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, Download, Eye, MoreHorizontal, CheckCircle2,
    XCircle, Clock, AlertCircle, ChevronDown, X, MapPin,
    Calendar, User, CreditCard, Receipt, QrCode
} from 'lucide-react';

interface Booking {
    id: string;
    event: string;
    organizer: string;
    customer: string;
    paid: string;
    received: string;
    method: string;
    status: string;
    scan: string;
    date?: string;
    location?: string;
}

interface BookingListProps {
    status?: 'all' | 'completed' | 'pending' | 'rejected' | 'report';
}

const BookingList: React.FC<BookingListProps> = ({ status = 'all' }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && !(event.target as Element).closest('.dropdown-container')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    const getTitle = () => {
        switch (status) {
            case 'completed': return 'Completed Bookings';
            case 'pending': return 'Pending Bookings';
            case 'rejected': return 'Rejected Bookings';
            case 'report': return 'Booking Reports';
            default: return 'All Bookings';
        }
    };

    // Mock Data based on screenshot
    const allBookings: Booking[] = [
        { id: '#691852196fac4', event: 'Small Business Ideas', organizer: 'organizer', customer: 'Jone Doe', paid: '$240', received: '$209', method: 'Citibank', status: 'Completed', scan: 'Already Scanned', date: 'Nov 15, 2025', location: 'Rockingham, North Carolina' },
        { id: '#6918520adbd49', event: 'Design Research by Australia', organizer: 'Admin', customer: 'Jone Doe', paid: '$36', received: '-', method: 'Citibank', status: 'Pending', scan: 'Already Scanned', date: 'Nov 14, 2025', location: 'Sydney, Australia' },
        { id: '#691851c14a1d2', event: 'Betsson Peruvian Volleyball', organizer: 'organizer', customer: 'Jone Doe', paid: '$192', received: '$167.2', method: 'Citibank', status: 'Rejected', scan: '0/6', date: 'Nov 13, 2025', location: 'Lima, Peru' },
        { id: '#691076a642e39', event: 'Betsson Peruvian Volleyball', organizer: 'organizer', customer: 'Goutam Sharma', paid: '$396', received: '$344.85', method: 'Citibank', status: 'Completed', scan: '9/10', date: 'Nov 10, 2025', location: 'Lima, Peru' },
        { id: '#690f3c3c47df8', event: 'Betsson Peruvian Volleyball', organizer: 'organizer', customer: 'Guest', paid: '$201.41', received: '$173.94', method: 'Citibank', status: 'Completed', scan: '2/10', date: 'Nov 09, 2025', location: 'Lima, Peru' },
        { id: '#6909ab03bed94', event: 'Designer carrier conference', organizer: 'organizer', customer: 'Guest', paid: '$220', received: '$190', method: 'Citibank', status: 'Completed', scan: '1/12', date: 'Nov 05, 2025', location: 'Berlin, Germany' },
        { id: '#6909814fd9284', event: 'Motivation for online business', organizer: 'organizer', customer: 'Guest', paid: '0', received: '0', method: '-', status: 'Free', scan: 'Already Scanned', date: 'Nov 04, 2025', location: 'Online' },
        { id: '#690867bf032a8', event: 'Decoration of the marriage', organizer: 'ambrose', customer: 'Guest', paid: '$100', received: '$95', method: 'paypal', status: 'Completed', scan: '0/2', date: 'Nov 01, 2025', location: 'Delhi, India' },
    ];

    const bookings = allBookings.filter(b => {
        if (status === 'all' || !status) return true;
        return b.status.toLowerCase() === status.toLowerCase();
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-500';
            case 'pending': return 'bg-orange-500';
            case 'rejected': return 'bg-red-500';
            case 'free': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getScanColor = (scan: string) => {
        if (scan === 'Already Scanned') return 'bg-green-100 text-green-700 border-green-200';
        if (scan.includes('/')) return 'bg-slate-100 text-slate-700 border-slate-200';
        return 'bg-gray-100 text-gray-700';
    };

    const handleOpenDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDrawerOpen(true);
        setOpenDropdownId(null);
    };

    return (
        <div className={`relative min-h-full flex flex-col ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="p-6 flex-1">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{getTitle()}</h2>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                            Manage and view all your {status === 'all' ? '' : status} bookings here.
                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row gap-4 items-center justify-between ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={16} />
                            <input
                                type="text"
                                placeholder="Search By Booking Id"
                                className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 placeholder:text-gray-600' : 'bg-slate-50 border-slate-200 placeholder:text-slate-400'}`}
                            />
                        </div>
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={16} />
                            <input
                                type="text"
                                placeholder="Search By Event Title"
                                className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 placeholder:text-gray-600' : 'bg-slate-50 border-slate-200 placeholder:text-slate-400'}`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Payment</span>
                            <select className={`px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                                <option>All</option>
                                <option>Paid</option>
                                <option>Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'border-gray-700 bg-[#1e2736]' : 'border-slate-200 bg-white shadow-sm'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className={`text-xs uppercase font-semibold ${theme === 'dark' ? 'bg-[#131922] text-gray-400' : 'bg-slate-50 text-slate-500'}`}>
                                <tr>
                                    <th className="px-4 py-4 w-10">
                                        <input type="checkbox" className="rounded border-gray-600 bg-transparent" />
                                    </th>
                                    <th className="px-4 py-4 whitespace-nowrap">Booking ID</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Event</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Organizer</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Customer</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Cust. Paid</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Org. Received</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Paid Via</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Payment Status</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Ticket Scan Status</th>
                                    <th className="px-4 py-4 text-center whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-slate-100'}`}>
                                {bookings.map((booking, idx) => (
                                    <tr key={idx} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-[#131922]/50' : 'hover:bg-slate-50'}`}>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="rounded border-gray-600 bg-transparent" />
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                            {booking.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-blue-500 hover:underline cursor-pointer font-medium block max-w-[180px] truncate" title={booking.event}>
                                                {booking.event}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {booking.organizer === 'Admin' ? (
                                                <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
                                            ) : (
                                                <span className="text-blue-500 hover:underline cursor-pointer">{booking.organizer}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-blue-500 hover:underline cursor-pointer">{booking.customer}</span>
                                        </td>
                                        <td className={`px-4 py-3 font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>{booking.paid}</td>
                                        <td className={`px-4 py-3 font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>{booking.received}</td>
                                        <td className={`px-4 py-3 uppercase text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{booking.method}</td>
                                        <td className="px-4 py-3">
                                            <span className={`${getStatusColor(booking.status)} text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide inline-flex items-center gap-1 whitespace-nowrap`}>
                                                {booking.status}
                                                {booking.status === 'Pending' && <Clock size={10} />}
                                                {booking.status === 'Completed' && <CheckCircle2 size={10} />}
                                                {booking.status === 'Rejected' && <XCircle size={10} />}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border whitespace-nowrap ${getScanColor(booking.scan)}`}>
                                                {booking.scan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="relative dropdown-container inline-block">
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === booking.id ? null : booking.id)}
                                                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1 mx-auto whitespace-nowrap"
                                                >
                                                    Select <ChevronDown size={12} />
                                                </button>

                                                {openDropdownId === booking.id && (
                                                    <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-xl z-50 overflow-hidden border ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700' : 'bg-white border-slate-100'
                                                        } animate-in fade-in zoom-in-95 duration-200 origin-top-right`}>
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleOpenDetails(booking)}
                                                                className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-[#131922] hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                                    }`}
                                                            >
                                                                Details
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setOpenDropdownId(null);
                                                                    window.open(`/#/admin/bookings/invoice/${encodeURIComponent(booking.id)}`, '_blank');
                                                                }}
                                                                className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-[#131922] hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                                    }`}
                                                            >
                                                                Invoice
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setOpenDropdownId(null);
                                                                    // Handle Delete
                                                                }}
                                                                className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 ${theme === 'dark' ? 'hover:bg-red-900/20' : ''
                                                                    }`}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className={`px-6 py-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-gray-700 bg-[#131922]' : 'border-slate-100 bg-slate-50'}`}>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-slate-500'}`}>Showing 1 to 8 of 8 entries</span>
                        <div className="flex gap-1">
                            <button className={`px-3 py-1 rounded border text-xs ${theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-slate-200 text-slate-400'}`} disabled>Prev</button>
                            <button className="px-3 py-1 rounded bg-[#2563eb] text-white text-xs font-bold shadow-lg shadow-blue-500/30">1</button>
                            <button className={`px-3 py-1 rounded border text-xs ${theme === 'dark' ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Drawer Background Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Side Drawer Content */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[500px] z-[300] shadow-2xl transition-transform duration-500 ease-out transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} ${theme === 'dark' ? 'bg-[#0c1017] border-l border-white/5' : 'bg-white border-l border-slate-200'}`}>
                {selectedBooking && (
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Drawer Header */}
                        <div className={`px-8 py-6 flex items-center justify-between border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Booking Details</h3>
                                <p className={`text-xs mt-1 font-mono ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>{selectedBooking.id}</p>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white/40 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

                            {/* Summary Card */}
                            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-blue-50/50 border-blue-100'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-blue-500">{selectedBooking.event}</h4>
                                        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <MapPin size={12} className="text-[#38bdf8]" />
                                            {selectedBooking.location}
                                        </div>
                                    </div>
                                    <span className={`${getStatusColor(selectedBooking.status)} text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-black/5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paid Amount</p>
                                        <p className="text-xl font-black mt-1">{selectedBooking.paid}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scan Status</p>
                                        <p className={`text-xs font-bold mt-2 px-2 py-1 rounded-md border inline-block ${getScanColor(selectedBooking.scan)}`}>
                                            {selectedBooking.scan}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-500 flex items-center gap-2">
                                        <User size={14} /> Customer Information
                                    </h5>
                                    <div className={`grid grid-cols-2 gap-x-6 gap-y-4 p-5 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Name</p>
                                            <p className="text-sm font-bold mt-1 text-blue-500">{selectedBooking.customer}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</p>
                                            <p className="text-sm font-bold mt-1">customer@example.com</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                                            <p className="text-sm font-bold mt-1">+1 234 567 890</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-500 flex items-center gap-2">
                                        <CreditCard size={14} /> Payment Details
                                    </h5>
                                    <div className={`grid grid-cols-2 gap-x-6 gap-y-4 p-5 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Method</p>
                                            <p className="text-sm font-bold mt-1 uppercase">{selectedBooking.method}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date</p>
                                            <p className="text-sm font-bold mt-1">{selectedBooking.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Currency</p>
                                            <p className="text-sm font-bold mt-1">USD</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Info */}
                            <div className="space-y-4">
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                    <Receipt size={14} /> Ticket Information
                                </h5>
                                <div className={`p-5 rounded-xl border-dashed border-2 flex items-center justify-between ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</p>
                                            <p className="text-sm font-bold mt-1">2 Tickets</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Check-in Status</p>
                                            <p className={`text-sm font-bold mt-1 ${selectedBooking.scan.includes('/') ? 'text-orange-500' : 'text-green-500'}`}>{selectedBooking.scan}</p>
                                        </div>
                                    </div>
                                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center p-2 ${theme === 'dark' ? 'bg-white' : 'bg-white shadow-inner'}`}>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedBooking.id}`} className="w-full h-full" alt="QR" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className={`p-8 border-t flex gap-4 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <button
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    window.open(`/#/admin/bookings/invoice/${encodeURIComponent(selectedBooking.id)}`, '_blank');
                                }}
                                className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Receipt size={16} /> Get Invoice
                            </button>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingList;
