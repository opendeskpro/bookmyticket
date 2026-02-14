
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event, User, Review } from '../../types.ts';
import { MapPin, Calendar, Clock, Share2, Heart, ShieldCheck, Ticket, Users, Star, MessageSquare, Send, ChevronLeft } from 'lucide-react';

interface EventDetailsPageProps {
  events: Event[];
  user: User | null;
}

// Fixed: Added default export and component implementation for EventDetailsPage
const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ events, user }) => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Link to="/" className="text-amber-500 font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fffcfd] min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="h-[450px] relative overflow-hidden">
        <img src={event.banner} className="w-full h-full object-cover" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                {event.category}
              </div>
              <h1 className="text-5xl font-black text-white tracking-tight leading-tight">{event.title}</h1>
            </div>
            <div className="flex gap-4">
               <button className="p-4 bg-white/10 backdrop-blur rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10">
                 <Share2 size={20} />
               </button>
               <button className="p-4 bg-white/10 backdrop-blur rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10">
                 <Heart size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8">About the Event</h2>
            <p className="text-slate-600 font-medium leading-relaxed text-lg mb-10">
              {event.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500"><Calendar size={24} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Date</p><p className="font-bold text-slate-900">{new Date(event.date).toLocaleDateString()}</p></div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500"><Clock size={24} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Time</p><p className="font-bold text-slate-900">{event.time}</p></div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500"><MapPin size={24} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Location</p><p className="font-bold text-slate-900">{event.location}</p></div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Content - Ticket Widget */}
        <div className="lg:col-span-4">
           <div className="sticky top-28 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-amber-100/10 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900">Tickets</h3>
                 <span className="text-emerald-500 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={14} /> Available</span>
              </div>
              <div className="space-y-4">
                 {event.tickets.map(ticket => (
                    <div key={ticket.id} className="p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-amber-500/20 transition-all flex justify-between items-center group">
                       <div>
                          <p className="font-black text-slate-900 group-hover:text-amber-500 transition-colors">{ticket.name}</p>
                          <p className="text-xs font-bold text-slate-400">₹{ticket.price || 0} / Person</p>
                       </div>
                    </div>
                 ))}
              </div>
              <Link to={`/book/${event.id}`} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-center text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl block">
                Book Tickets Now
              </Link>
              <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-tight">Verified by Book My Ticket Secure Payment</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
