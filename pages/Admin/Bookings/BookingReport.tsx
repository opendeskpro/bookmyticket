import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Download, Calendar, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';

const BookingReport: React.FC = () => {
    const { theme } = useTheme();
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('All');
    const [paymentStatus, setPaymentStatus] = useState('All');

    // Mock Data based on screenshot and usual structure
    const [bookings, setBookings] = useState([
        { id: '#691852196fac4', event: 'Small Business Ideas', organizer: 'organizer', customer: 'Jone Doe', paid: 240, received: 209, method: 'Citibank', status: 'Completed', date: '2025-11-15' },
        { id: '#6918520adbd49', event: 'Design Research by Australia', organizer: 'Admin', customer: 'Jone Doe', paid: 36, received: 0, method: 'Citibank', status: 'Pending', date: '2025-11-14' },
        { id: '#691851c14a1d2', event: 'Betsson Peruvian Volleyball', organizer: 'organizer', customer: 'Jone Doe', paid: 192, received: 167.2, method: 'Citibank', status: 'Rejected', date: '2025-11-13' },
        { id: '#691076a642e39', event: 'Betsson Peruvian Volleyball', organizer: 'organizer', customer: 'Goutam Sharma', paid: 396, received: 344.85, method: 'Citibank', status: 'Completed', date: '2025-11-10' },
    ]);

    const handleExportCSV = () => {
        const headers = ['Booking ID', 'Event', 'Organizer', 'Customer', 'Paid', 'Received', 'Method', 'Status', 'Date'];
        const rows = bookings.map(b => [
            b.id,
            b.event,
            b.organizer,
            b.customer,
            b.paid,
            b.received,
            b.method,
            b.status,
            b.date
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Booking_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-500';
            case 'pending': return 'bg-orange-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="p-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Booking Report</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Filter and export booking data for accounting and analysis.
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all"
                >
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {/* Filter Card */}
            <div className={`p-8 rounded-[2rem] border mb-10 ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>From Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                            <input
                                type="date"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-[#131922] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>To Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                            <input
                                type="date"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-[#131922] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Payment Method</label>
                        <select
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-[#131922] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option>All</option>
                            <option>Citibank</option>
                            <option>Paypal</option>
                            <option>Stripe</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Payment Status</label>
                        <select
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-[#131922] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                        >
                            <option>All</option>
                            <option>Completed</option>
                            <option>Pending</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#38bdf8]/20 transition-all flex items-center gap-2">
                        <Search size={16} /> Search Report
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className={`rounded-[2rem] border overflow-hidden ${theme === 'dark' ? 'border-white/5 bg-[#131922]' : 'border-slate-200 bg-white shadow-2xl'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'bg-[#1e2736] text-white/30' : 'bg-slate-50 text-slate-400'}`}>
                            <tr>
                                <th className="px-8 py-6">Booking ID</th>
                                <th className="px-8 py-6">Event</th>
                                <th className="px-8 py-6 text-center">Org. Received</th>
                                <th className="px-8 py-6">Paid Via</th>
                                <th className="px-8 py-6">Payment Status</th>
                                <th className="px-8 py-6 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {bookings.map((booking, idx) => (
                                <tr key={idx} className={`group transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-8 py-5 font-black ${theme === 'dark' ? 'text-white/80' : 'text-slate-800'}`}>
                                        {booking.id}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{booking.event}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-tight ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Organizer: {booking.organizer}</span>
                                        </div>
                                    </td>
                                    <td className={`px-8 py-5 text-center font-mono font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        ${booking.received}
                                    </td>
                                    <td className={`px-8 py-5 uppercase text-[10px] font-black tracking-[0.1em] ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                                        {booking.method}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`${getStatusColor(booking.status)} text-white text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-2`}>
                                            {booking.status}
                                            {booking.status === 'Completed' && <CheckCircle2 size={10} />}
                                            {booking.status === 'Pending' && <Clock size={10} />}
                                            {booking.status === 'Rejected' && <XCircle size={10} />}
                                        </span>
                                    </td>
                                    <td className={`px-8 py-5 text-right font-bold text-xs ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                                        {booking.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {bookings.length === 0 && (
                    <div className="py-20 text-center">
                        <Filter className="mx-auto text-white/5 mb-4" size={48} />
                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">No records found for the selected criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingReport;
