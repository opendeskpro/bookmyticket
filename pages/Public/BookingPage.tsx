
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, User, TicketStatus, PricingBreakup } from '../../types.ts';
// Fix: Added missing Ticket import from lucide-react to resolve the component not found error
import { ChevronLeft, ShieldCheck, Loader2, ReceiptText, ArrowRight, CheckCircle2, Zap, Info, Tag, Armchair, Ticket } from 'lucide-react';
import { api } from '../../lib/api.ts';

interface BookingPageProps {
  events: Event[];
  user: User;
  onBook: (ticket: any) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ events, user, onBook }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(events.find(e => e.id === eventId) || null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!event && eventId) {
      api.events.get(eventId).then(setEvent).catch(err => setError(err.message));
    }
  }, [eventId, event]);

  if (!event) {
    return <div className="p-20 text-center">{error || "Event not found"}</div>;
  }

  const handleBooking = async () => {
    if (!selectedTicket) return;

    setIsProcessing(true);
    setError(null);
    const ticketType = event.tickets.find(t => t.id === selectedTicket);
    const token = localStorage.getItem('token');

    if (!token) {
      setError("Please log in to book tickets.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await api.bookings.create({
        event_id: event.id,
        ticket_type_id: selectedTicket,
        quantity: 1 // Simple booking for now
      }, token);

      onBook(response);
      navigate('/my-tickets');
    } catch (err: any) {
      setError(err.message || "Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#fffcfd] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-slate-900 transition-colors">
          <ChevronLeft size={16} /> Back to Event
        </button>

        <h1 className="text-4xl font-black text-slate-900 mb-2">Secure Checkout</h1>
        <p className="text-slate-500 font-medium mb-12">{event.title}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Ticket Selection */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Ticket className="text-amber-500" /> Select Pass Type
            </h3>
            {event.tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`w-full p-8 rounded-[2rem] border-2 text-left transition-all ${selectedTicket === ticket.id
                  ? 'border-amber-500 bg-amber-50/50 shadow-lg'
                  : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-black text-slate-900">{ticket.name}</p>
                  <p className="text-xl font-black text-amber-600">₹{ticket.price || 0}</p>
                </div>
                <p className="text-xs text-slate-500 font-medium">Full access to the main arena and stalls.</p>
              </button>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 sticky top-28">
              <h3 className="text-xl font-black flex items-center gap-3"><ReceiptText className="text-amber-500" /> Order Summary</h3>

              <div className="space-y-4 pb-8 border-b border-white/10 text-sm font-medium">
                <div className="flex justify-between text-slate-400">
                  <span>Passes</span>
                  <span className="text-white">₹{event.tickets.find(t => t.id === selectedTicket)?.price || 0}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Convenience Fee</span>
                  <span className="text-white">₹45</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total Amount</span>
                <span className="text-3xl font-black">₹{(event.tickets.find(t => t.id === selectedTicket)?.price || 0) + 45}</span>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedTicket || isProcessing}
                className="w-full bg-amber-500 text-slate-950 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <>Confirm & Pay <ArrowRight size={18} /></>}
              </button>

              <div className="flex items-center gap-3 justify-center pt-4 opacity-50">
                <ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">SSL Secured Transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
