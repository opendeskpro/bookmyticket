
import React from 'react';
// import { QRCodeSVG } from 'qrcode.react';
import {
    CalendarDays,
    MapPin,
    Clock,
    User,
    Ticket as TicketIcon,
    ShieldCheck,
    Info,
    ChevronRight
} from 'lucide-react';

interface TicketTemplateProps {
    event: {
        title: string;
        description: string;
        date: string;
        time: string;
        venue: string;
        banner: string;
    };
    booking: {
        id: string;
        date: string;
        duration: string;
        seats: string[];
        price: number;
        tax: number;
        total: number;
        paymentMethod: string;
        status: string;
    };
}

const TicketTemplate: React.FC<TicketTemplateProps> = ({ event, booking }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Top Banner & Header */}
            <div className="flex bg-[#f8fafc] border-b border-slate-200">
                <div className="w-[350px] h-[400px] flex-shrink-0 relative overflow-hidden">
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <TicketIcon size={14} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Official Ticket</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-10 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{event.title}</h2>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md">{event.description}</p>
                        </div>
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center w-[84px] h-[84px]">
                            {/* <QRCodeSVG value={booking.id} size={84} level="H" /> */}
                            <ShieldCheck size={40} className="text-emerald-500 opacity-20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8 mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</p>
                            <p className="text-sm font-bold text-slate-800">{event.date} {event.time}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue</p>
                            <p className="text-sm font-bold text-slate-800">{event.venue}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Billing Address</p>
                            <p className="text-sm font-medium text-slate-500 italic">As per registered profile</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 py-6 border-y border-slate-100 mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking Date</p>
                            <p className="text-sm font-bold text-slate-800">{booking.date}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</p>
                            <p className="text-sm font-bold text-slate-800">{booking.duration}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking ID</p>
                            <p className="text-sm font-bold text-slate-800 font-mono">#{booking.id.slice(-10).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section / Row</p>
                            <p className="text-sm font-bold text-slate-800">Elite / A</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seat Numbers</p>
                            <p className="text-sm font-bold text-slate-800">{booking.seats.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Data Section */}
            <div className="px-10 py-8 bg-[#f8fafc] border-b border-slate-200">
                <div className="grid grid-cols-3 gap-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Price</p>
                        <p className="text-lg font-black text-slate-900 mt-1">₹ {booking.price} INR</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tax & Fees</p>
                        <p className="text-lg font-black text-slate-900 mt-1">₹ {booking.tax} INR</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">₹ {booking.total} INR</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <div className="flex gap-8">
                        <span className="text-slate-400">Payment Method: <span className="text-slate-800">{booking.paymentMethod}</span></span>
                        <span className="text-slate-400">Payment Status: <span className="text-emerald-500">{booking.status}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <ShieldCheck size={14} className="text-emerald-500" /> Digitally Verified Ticket
                    </div>
                </div>
            </div>

            {/* Important Information */}
            <div className="p-10 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Important Information</h3>
                </div>
                <ul className="space-y-4">
                    {[
                        "We are BookMyTicket and we are dedicated to selling tickets for the best events in the country. However, you must remember that we are not the organizers of the event.",
                        "Therefore, in the event of any eventuality, you will have to contact the company organizing the event through official customer service channels.",
                        "If you decide to purchase from unauthorized points of sale, the responsibility will be yours; tickets may be counterfeit or adulterated.",
                        "Do not disclose or share the ticket barcode/QR code with third parties to prevent digital duplication.",
                        "IMPORTANT! When you arrive at the event you must present your ticket (printed or virtual) along with your identification document."
                    ].map((text, i) => (
                        <li key={i} className="flex gap-4">
                            <div className="w-1 h-1 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{text}</p>
                        </li>
                    ))}
                </ul>

                <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400">Downloaded on {new Date().toLocaleDateString()}</p>
                    <div className="flex items-center gap-6">
                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">Support Center</button>
                        <div className="w-px h-3 bg-slate-200"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">www.bookmyticket.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketTemplate;
