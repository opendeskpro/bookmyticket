
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Event, User } from '../../types';
import { api } from '../../lib/api';
import { MapPin, Calendar, Clock, Share2, Heart, ShieldCheck, Ticket, Users, Star, MessageSquare, Send, ChevronLeft, Loader2, Info, Video } from 'lucide-react';
import BookingModal from '../../components/Booking/BookingModal';

interface EventDetailsPageProps {
  events: Event[];
  user: User | null;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ events, user }) => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(events.find(e => e.id === id) || null);
  const [loading, setLoading] = useState(!event);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!event && id) {
      const fetchEvent = async () => {
        try {
          const data = await api.events.get(id);
          if (data) {
            setEvent({
              ...data,
              banner: data.banner_url || data.banner,
              date: data.event_date || data.date,
              time: data.start_time || data.time
            });
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }

    // Check if user has a ticket
    if (user && id) {
      api.bookings.list().then(tickets => {
        const userHasTicket = tickets.some(t => t.eventId === id);
        setHasTicket(userHasTicket);
      });
    }
  }, [id, event, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#FF006E]" size={40} />
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || "Event Not Found"}</h2>
          <Link to="/" className="text-[#FF006E] font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Format Date
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
  const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Determine pricing display
  const minPrice = event.ticketTiers?.length
    ? Math.min(...event.ticketTiers.map(t => t.price))
    : (event.tickets?.[0]?.price || 0);

  return (
    <div className="bg-[#0B0B0B] min-h-screen pb-24 font-sans text-white">

      {/* Banner Section - Full Width */}
      <div className="h-[500px] md:h-[600px] relative overflow-hidden group">
        <img src={event.banner} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-black/60"></div>

        {/* Top Nav Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <Link to="/" className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex gap-4">
            <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Share2 size={20} />
            </button>
            <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-[#FF006E] border border-[#FF006E]/30 hover:bg-[#FF006E]/10 transition-all shadow-[0_0_15px_rgba(255,0,110,0.3)]">
              <Heart size={20} className="fill-[#FF006E]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Title Card */}
            <div className="bg-[#151515] rounded-[2rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF006E]/10 to-transparent blur-3xl rounded-full pointer-events-none -mt-10 -mr-10"></div>
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-[#FF006E]/10 text-[#FF006E] rounded-xl text-[11px] font-black uppercase tracking-widest border border-[#FF006E]/20 shadow-[0_0_10px_rgba(255,0,110,0.2)]">
                    {event.category}
                  </span>
                  {event.status === 'APPROVED' && (
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <ShieldCheck size={14} /> Verified Event
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">{event.title}</h1>

                {/* Organiser Mini Profile */}
                <div className="flex items-center gap-4 pt-6 border-t border-dashed border-white/10">
                  <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden border border-white/10 shadow-inner">
                    <img src={`https://ui-avatars.com/api/?name=${event.organiserId}&background=random`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Organised by</p>
                    <p className="text-sm font-bold text-gray-200">BookMyTicket Official Partner</p>
                  </div>
                  <button className="ml-auto text-xs font-bold text-[#FBB040] border border-[#FBB040]/30 px-4 py-2 rounded-lg hover:bg-[#FBB040]/10 hover:shadow-[0_0_10px_rgba(251,176,64,0.3)] transition-all">
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white drop-shadow-md">About this Event</h2>
              <div className="prose prose-invert prose-lg max-w-none text-gray-400 leading-loose">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Ticket Details Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white drop-shadow-md">Ticket Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(event.ticketTiers && event.ticketTiers.length > 0 ? event.ticketTiers : [{
                  id: 'default',
                  eventId: event.id,
                  name: 'Standard Entry',
                  description: 'General admission to the event.',
                  price: event.tickets?.[0]?.price || 0,
                  capacity: 100,
                  available: 100
                }]).map((tier) => (
                  <div key={tier.id} className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-white/5 shadow-lg hover:shadow-[0_15px_30px_rgba(255,0,110,0.15)] transition-all flex flex-col justify-between gap-4 group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white group-hover:text-[#FF006E] transition-colors">{tier.name}</h3>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          Available
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed mb-4">{tier.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price</span>
                        <span className="text-2xl font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">₹{tier.price}</span>
                      </div>
                      <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        Book <Ticket size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar (Right) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">

              {/* Booking Card */}
              <div className="bg-[#151515] rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-[#FF006E]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF006E]/20 blur-3xl rounded-full pointer-events-none transition-all group-hover:bg-[#FF006E]/30"></div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Price Starts From</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">₹{minPrice}</span>
                      <span className="text-sm font-bold text-gray-500">/ person</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white py-5 rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:shadow-[0_0_35px_rgba(255,0,110,0.7)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Ticket size={24} /> Book Now
                  </button>

                  <p className="text-center mt-4 text-[11px] font-bold text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    100% Secure Transaction
                  </p>
                </div>
              </div>

              {/* Virtual Meeting Join Card */}
              {(event.is_virtual || event.isVirtual) && event.meeting_id && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] rounded-[2rem] p-8 border border-blue-500/20 shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/30">
                        <Video size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Virtual Session</h4>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">MeetSphere Hosted</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                      {hasTicket
                        ? "You have a ticket! You can join the session directly from here."
                        : "Join the live session from anywhere. Book your spot to get access."}
                    </p>

                    {hasTicket ? (
                      <button
                        onClick={() => navigate(`/meeting/${event.meeting_id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                      >
                        Join Meeting <Video size={18} />
                      </button>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <p className="text-xs font-bold text-gray-500">Access restricted to ticket holders</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Details Card */}
              <div className="bg-[#151515] rounded-[2rem] p-8 border border-white/5 shadow-xl space-y-6">
                <h3 className="font-black text-white text-lg drop-shadow-md">Event Details</h3>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF006E] shrink-0 shadow-inner">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-bold text-gray-200 text-lg">{month} {day}, {eventDate.getFullYear()}</p>
                      <p className="text-xs font-bold text-gray-500">{weekday}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00C6FF] shrink-0 shadow-inner">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time</p>
                      <p className="font-bold text-gray-200 text-lg">{event.time}</p>
                      <p className="text-xs font-bold text-gray-500">Duration: 3 Hrs</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FBB040] shrink-0 shadow-inner">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Venue</p>
                      <p className="font-bold text-gray-200 leading-tight">{event.venue || event.location || 'To be announced'}</p>
                      <p className="text-xs font-bold text-gray-500 mt-1">{event.city}, India</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        event={event}
      />

    </div>
  );
};

export default EventDetailsPage;
