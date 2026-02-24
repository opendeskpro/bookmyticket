import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Share2, ArrowLeft } from 'lucide-react';
import Button from '../../components/Shared/UI/Button';
import Badge from '../../components/Shared/UI/Badge';
import SeatMap from '../../components/User/SeatMap';
import { api } from '../../lib/api';
import { Event } from '../../types';

const UserEventDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [ticketQuantity, setTicketQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        (async () => {
            try {
                const fetched = await api.events.get(id);
                if (!cancelled) setEvent(fetched);
            } catch {
                if (!cancelled) setEvent(null);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (!event) return <div className="p-6">Event not found</div>;

    const handleSeatClick = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= 6) return alert("Max 6 seats allowed");
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const totalAmount = event.isSeatBookingEnabled
        ? selectedSeats.length * event.price
        : ticketQuantity * event.price;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Banner */}
            <div className="relative h-[400px]">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute top-6 left-6">
                    <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={20} />}>
                        Back
                    </Button>
                </div>

                <div className="absolute bottom-0 w-full p-8 text-white max-w-7xl mx-auto">
                    <Badge className="bg-[#FF006E] text-white mb-4 border-0">{event.category}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
                    <div className="flex flex-wrap gap-6 text-gray-200">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-[#FF006E]" />
                            <span className="font-medium">{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-[#FF006E]" />
                            <span className="font-medium">{event.location}, {event.city}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
                        <h2 className="text-xl font-bold border-b border-gray-100 pb-4">About Event</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Organizer</p>
                                <p className="font-bold text-gray-900">Pro Events Ltd.</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Terms</p>
                                <p className="font-bold text-gray-900 text-sm">Age 18+ • No Refund</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-bold border-b border-gray-100 pb-6 mb-8">Select Tickets</h2>

                        {event.isSeatBookingEnabled ? (
                            <SeatMap
                                selectedSeats={selectedSeats}
                                onSeatClick={handleSeatClick}
                                price={event.price}
                            />
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div>
                                    <p className="font-bold text-lg">General Admission</p>
                                    <p className="text-gray-500">Standard entry ticket</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100"
                                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-bold w-8 text-center">{ticketQuantity}</span>
                                    <button
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100"
                                        onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 mb-1 uppercase tracking-widest text-xs font-bold">Total Price</p>
                            <p className="text-4xl font-bold text-gray-900">₹{totalAmount}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Ticket Price</span>
                                <span className="font-medium">₹{event.price} x {event.isSeatBookingEnabled ? selectedSeats.length : ticketQuantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Booking Fee</span>
                                <span className="font-medium">₹0</span>
                            </div>
                            {event.isSeatBookingEnabled && selectedSeats.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Selected Seats</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map(seat => (
                                            <Badge key={seat} variant="neutral" className="bg-gray-100 text-gray-600">{seat}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full h-12 text-lg shadow-[#FF006E]/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            disabled={event.isSeatBookingEnabled ? selectedSeats.length === 0 : ticketQuantity === 0}
                        >
                            Proceed to Pay
                        </Button>

                        <div className="mt-6 flex justify-center">
                            <button className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-900">
                                <Share2 size={16} /> Share Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEventDetails;
