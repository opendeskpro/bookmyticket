
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, User, TicketStatus, PricingBreakup } from '../../types';
import {
  ChevronLeft,
  ShieldCheck,
  Loader2,
  ReceiptText,
  ArrowRight,
  CheckCircle2,
  Zap,
  Info,
  Tag,
  Armchair,
  Ticket,
  Maximize2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api.ts';

interface BookingPageProps {
  events: Event[];
  user: User;
  onBook: (ticket: any) => void;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  category: 'Elite' | 'Gold' | 'Silver';
  price: number;
  status: 'available' | 'booked' | 'selected';
}

const SEAT_CATEGORIES = {
  Elite: { price: 1500, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  Gold: { price: 800, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  Silver: { price: 500, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' }
};

const BookingPage: React.FC<BookingPageProps> = ({ events, user, onBook }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(events.find(e => e.id === eventId) || null);
  const [step, setStep] = useState<'SEATS' | 'CHECKOUT'>('SEATS');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock seats
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (!event && eventId) {
      api.events.get(eventId).then(setEvent).catch(err => setError(err.message));
    }
  }, [eventId, event]);

  useEffect(() => {
    if (event) {
      const generatedSeats: Seat[] = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      rows.forEach((row, rowIndex) => {
        for (let i = 1; i <= 12; i++) {
          let category: 'Elite' | 'Gold' | 'Silver' = 'Silver';
          if (rowIndex < 2) category = 'Elite';
          else if (rowIndex < 5) category = 'Gold';

          generatedSeats.push({
            id: `${row}${i}`,
            row,
            number: i,
            category,
            price: SEAT_CATEGORIES[category].price,
            status: Math.random() < 0.15 ? 'booked' : 'available'
          });
        }
      });
      setSeats(generatedSeats);
    }
  }, [event]);

  if (!event) {
    return <div className="p-20 text-center">{error || "Event not found"}</div>;
  }

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return;

    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        setError("You can only book up to 6 seats at a time.");
        setTimeout(() => setError(null), 3000);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalBasePrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 45 * selectedSeats.length : 0;
  const totalAmount = totalBasePrice + convenienceFee;

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    setIsProcessing(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError("Please log in to book tickets.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await api.bookings.create({
        event_id: event.id,
        seats: selectedSeats.map(s => s.id),
        total_amount: totalAmount,
        quantity: selectedSeats.length
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
    <div className="bg-[#050716] min-h-screen">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-50 bg-[#080c1f]/80 backdrop-blur-xl border-b border-slate-800/60 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-white">{event.title}</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{event.venue} | {event.date} | {event.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700"></div> Available</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-600"></div> Booked</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div> Selected</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff3366]">
            <AlertCircle size={14} /> Cancellation Policy
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Seat Map Area */}
        <div className="lg:col-span-8 p-12 border-r border-slate-800/60 flex flex-col items-center">
          {/* Screen */}
          <div className="w-3/4 h-2 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full mb-2 shadow-[0_10px_40px_rgba(6,182,212,0.15)]"></div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mb-20">All eyes this way</p>

          {/* Seat Grid */}
          <div className="space-y-4">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
              <div key={row} className="flex items-center gap-4">
                <span className="w-4 text-[10px] font-black text-slate-700">{row}</span>
                <div className="flex gap-2.5">
                  {seats.filter(s => s.row === row).map(seat => (
                    <button
                      key={seat.id}
                      disabled={seat.status === 'booked'}
                      onClick={() => toggleSeat(seat)}
                      className={`w-7 h-7 rounded-md text-[9px] font-black border transition-all flex items-center justify-center
                          ${seat.status === 'booked' ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed opacity-40' :
                          selectedSeats.find(s => s.id === seat.id)
                            ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : `bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-500 hover:text-white`
                        }`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
                <span className="w-4 text-[10px] font-black text-slate-700">{row}</span>
              </div>
            ))}
          </div>

          {/* Price Legends */}
          <div className="mt-20 flex gap-12">
            {Object.entries(SEAT_CATEGORIES).map(([cat, info]) => (
              <div key={cat} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-sm ${info.bg} ${info.border} border`}></div>
                <div className="leading-none">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${info.color}`}>{cat}</p>
                  <p className="text-[14px] font-black text-white mt-1">₹{info.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 bg-[#080c1f]/40 p-10 h-[calc(100vh-80px)] sticky top-20">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex items-center justify-between group">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <ReceiptText className="text-amber-500" /> Booking Summary
                </h3>
                {selectedSeats.length > 0 && (
                  <button onClick={() => setSelectedSeats([])} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {selectedSeats.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-900/50 rounded-full border border-slate-800 flex items-center justify-center mx-auto">
                    <Armchair className="text-slate-700" size={32} />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Select some seats to continue</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-4 scrollbar-hide">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl group transition-all hover:bg-slate-900">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${SEAT_CATEGORIES[seat.category].bg} ${SEAT_CATEGORIES[seat.category].color}`}>
                            {seat.id}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{seat.category} Section</p>
                            <p className="text-[13px] font-black text-white">Row {seat.row}, Seat {seat.number}</p>
                          </div>
                        </div>
                        <p className="text-[13px] font-black text-amber-500">₹{seat.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-800 space-y-4">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Base Total</span>
                      <span className="text-white">₹{totalBasePrice}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Convenience Fees</span>
                      <span className="text-white">₹{convenienceFee}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ff3366]">Grand Total</span>
                      <span className="text-3xl font-black text-white">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || isProcessing}
                className="w-full bg-amber-500 text-slate-950 py-6 rounded-[2rem] font-black uppercase text-[13px] tracking-[0.1em] shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <>Complete Payment <ArrowRight size={18} /></>}
              </button>

              <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure SSL Encrypted Transaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
