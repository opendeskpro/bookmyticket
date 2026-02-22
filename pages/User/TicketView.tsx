import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, Download, Share2, Printer, MapPin, Calendar as CalendarIcon, Clock, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const TicketView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        events ( title, event_date, venue, banner_url, start_time ),
                        tickets ( * )
                    `)
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setBooking(data);
            } catch (err: any) {
                console.error("Error fetching ticket:", err);
                toast.error("Ticket not found");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTicket();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#FF006E]" size={40} />
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Ticket not found</h2>
            <button onClick={() => navigate('/')} className="text-[#FF006E] font-bold">Return Home</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-xl w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-[#FF006E] transition-colors print:hidden"
                >
                    <ChevronLeft size={20} /> Back
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-100 flex flex-col">
                    {/* Event Header */}
                    <div className="relative h-48">
                        <img
                            src={booking.events?.banner_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop'}
                            className="w-full h-full object-cover"
                            alt="Event Banner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-8 right-8 text-white">
                            <h2 className="text-2xl font-black leading-tight tracking-tight uppercase">{booking.events?.title}</h2>
                            <div className="flex items-center gap-4 mt-2 text-sm font-bold opacity-90">
                                <span className="flex items-center gap-1.5"><CalendarIcon size={14} /> {new Date(booking.events?.event_date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {booking.booking_time || booking.events?.start_time || '19:00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 flex flex-col items-center bg-white relative">
                        <div className="w-full border-b border-dashed border-gray-200 pb-10 mb-10 flex flex-col items-center">
                            <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 mb-8">
                                <QrCode size={160} className="text-gray-900" />
                            </div>

                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Booking ID</p>
                                <p className="text-2xl font-mono font-black text-gray-900">{booking.id.slice(0, 13).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-y-8 gap-x-12 border-b border-dashed border-gray-200 pb-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Ticket Type</p>
                                <p className="font-black text-gray-900 text-lg uppercase">{booking.tickets?.[0]?.type || 'Standard'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Seat/Qty</p>
                                <p className="font-black text-gray-900 text-lg uppercase">
                                    {booking.tickets?.map((t: any) => `${t.seat_row}${t.seat_number}`).join(', ') || booking.quantity}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Venue</p>
                                <p className="font-black text-gray-900 text-sm">{booking.events?.venue || 'Main Stadium'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Price Paid</p>
                                <p className="font-black text-[#FF006E] text-xl">₹{booking.total_amount}</p>
                            </div>
                        </div>

                        {/* Protective Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 pointer-events-none opacity-[0.03] select-none">
                            <p className="text-8xl font-black uppercase tracking-tighter">OFFICIAL TICKET</p>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 p-6 flex items-center justify-between border-t border-gray-100 print:hidden">
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-[#FF006E] transition-all shadow-xl shadow-slate-200"
                            >
                                <Printer size={16} /> Print Ticket
                            </button>
                        </div>
                    </div>

                    {/* Left/Right decorative cutouts */}
                    <div className="absolute bottom-24 -left-5 w-10 h-10 bg-gray-50 rounded-full shadow-inner"></div>
                    <div className="absolute bottom-24 -right-5 w-10 h-10 bg-gray-50 rounded-full shadow-inner"></div>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    This is an electronically generated ticket. <br />
                    Please present the QR code at the venue for validation.
                </p>
            </div>
        </div>
    );
};

export default TicketView;
