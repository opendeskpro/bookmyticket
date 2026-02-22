import React, { useState } from 'react';
import { X, Calendar, Minus, Plus, ChevronRight, Info } from 'lucide-react';
import { Event, TicketTier } from '../../types';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});

    if (!isOpen) return null;

    // Use event tiers or fallback to a default tier if none exist
    const tiers: TicketTier[] = event.ticketTiers && event.ticketTiers.length > 0
        ? event.ticketTiers
        : [{
            id: 'default',
            eventId: event.id,
            name: 'Standard Entry',
            description: 'General admission to the event.',
            price: event.tickets?.[0]?.price || 0,
            capacity: 100,
            available: 100
        }];

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        // In a real app, we'd fetch available times for this date
        // For now, we auto-select the event time or show time slots
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setStep(2); // Proceed to tickets
    };

    const updateTicketCount = (tierId: string, delta: number) => {
        setTicketCounts(prev => {
            const current = prev[tierId] || 0;
            const newCount = Math.max(0, Math.min(10, current + delta)); // Max 10 tickets
            return { ...prev, [tierId]: newCount };
        });
    };

    const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + (b as number), 0);
    const totalPrice = tiers.reduce((sum, tier) => sum + ((ticketCounts[tier.id] as number) || 0) * tier.price, 0);

    const handleProceed = () => {
        navigate(`/book/${event.id}`, {
            state: {
                selectedDate,
                selectedTime,
                ticketCounts,
                tiers
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full md:w-[500px] md:rounded-[2rem] rounded-t-[2rem] h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{step === 1 ? 'Select Date & Time' : 'Select Tickets'}</h2>
                        <p className="text-xs text-gray-500 font-medium">{event.title}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {step === 1 && (
                        <div className="space-y-8">
                            {/* Date Selection */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Date</h3>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {/* Mock Dates - In real app, generate next 5 days or from event schedule */}
                                    {[0, 1, 2].map((offset) => {
                                        const d = new Date(event.event_date || event.date);
                                        d.setDate(d.getDate() + offset);
                                        const isSelected = selectedDate === d.toISOString();

                                        return (
                                            <button
                                                key={offset}
                                                onClick={() => handleDateSelect(d.toISOString())}
                                                className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl border transition-all ${isSelected ? 'border-[#FF006E] bg-[#fff2f3] text-[#FF006E]' : 'border-gray-200 text-gray-600 hover:border-[#FF006E]/30'}`}
                                            >
                                                <span className="text-xs font-bold uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl font-black">{d.getDate()}</span>
                                                <span className="text-[10px] font-bold uppercase opacity-60">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Selection */}
                            {selectedDate && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Time</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {(event.showtimes && event.showtimes.length > 0 ? event.showtimes : [event.start_time || event.time || '10:00 AM']).map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${selectedTime === time ? 'bg-[#FF006E] text-white border-[#FF006E] shadow-lg shadow-[#FF006E]/20' : 'border-gray-200 text-gray-600 hover:border-[#FF006E]'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            {tiers.map((tier) => (
                                <div key={tier.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{tier.name}</h3>
                                            <p className="text-xs text-gray-500 max-w-[200px] mt-1">{tier.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-black text-gray-900">₹{tier.price}</span>
                                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Available</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <button className="text-xs font-bold text-[#FF006E] flex items-center gap-1 hover:underline">
                                            <Info size={14} /> View Details
                                        </button>

                                        {/* Quantity Counter */}
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                                            <button
                                                onClick={() => updateTicketCount(tier.id, -1)}
                                                disabled={!ticketCounts[tier.id]}
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center font-bold text-gray-900">{ticketCounts[tier.id] || 0}</span>
                                            <button
                                                onClick={() => updateTicketCount(tier.id, 1)}
                                                disabled={((ticketCounts[tier.id] as number) || 0) >= 10}
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-[#FF006E] bg-[#fff2f3] hover:bg-[#FF006E] hover:text-white transition-all disabled:opacity-30"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                    {step === 2 ? (
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-bold uppercase">Total Amount</span>
                                <span className="text-2xl font-black text-gray-900">₹{totalPrice}</span>
                            </div>
                            <button
                                onClick={handleProceed}
                                disabled={totalTickets === 0}
                                className="flex-1 bg-[#FF006E] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#FF006E]/20 hover:bg-[#ff385c] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Proceed {totalTickets > 0 && `(${totalTickets})`} <ChevronRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-xs text-gray-400 font-medium">Please select a date and time to continue</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default BookingModal;
