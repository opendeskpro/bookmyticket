import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event } from '../../types';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Instagram, 
  Twitter, 
  CheckCircle2, 
  Share2, 
  Filter,
  Ticket,
  ChevronRight
} from 'lucide-react';

interface OrganizerProfilePageProps {
  events: Event[];
}

const OrganizerProfilePage: React.FC<OrganizerProfilePageProps> = ({ events }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  // Simulated organizer data - in a real app, this would come from a database query
  const organizer = {
    id: id,
    name: id === 'org1' ? 'Comedy Collective India' : 'Soulfest Productions',
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
    description: 'Bringing the finest live entertainment and cultural experiences to cities across the nation. Specializing in niche workshops and high-energy concerts.',
    verified: true,
    stats: {
      events: 42,
      attendees: '12K+',
      rating: '4.9'
    }
  };

  const organizerEvents = events.filter(e => e.organiserId === id);
  const filteredEvents = activeTab === 'UPCOMING' 
    ? organizerEvents.filter(e => new Date(e.date) >= new Date())
    : organizerEvents.filter(e => new Date(e.date) < new Date());

  return (
    <div className="min-h-screen bg-[#fffcfd] pb-24">
      {/* Brand Hero */}
      <section className="relative h-[350px] overflow-hidden">
        <img src={organizer.banner} className="w-full h-full object-cover blur-sm scale-105" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fffcfd] via-transparent to-black/20"></div>
        
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 w-44 h-44 rounded-[2.5rem] bg-white p-2 shadow-2xl z-10 border border-slate-50">
          <img src={organizer.avatar} className="w-full h-full object-cover rounded-[2rem]" alt={organizer.name} />
          {organizer.verified && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white shadow-lg">
              <ShieldCheck size={20} fill="currentColor" />
            </div>
          )}
        </div>
      </section>

      {/* Info Bar */}
      <section className="max-w-7xl mx-auto px-4 mt-20 md:mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="md:pl-64 flex-1">
            <h1 className="text-4xl font-black text-slate-900 mb-2">{organizer.name}</h1>
            <div className="flex flex-wrap gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#ff3b5c]" /> Mumbai, India</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#ff3b5c]" /> {organizer.stats.attendees} Community Size</span>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-10 py-4 bg-[#ff3b5c] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-pink-100 hover:scale-105 transition-all">
              Follow
            </button>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Profile Body */}
      <section className="max-w-7xl mx-auto px-4 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Events */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-12 border-b border-slate-100">
            <div className="flex gap-10">
              <button 
                onClick={() => setActiveTab('UPCOMING')}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'UPCOMING' ? 'text-[#ff3b5c]' : 'text-slate-300'}`}
              >
                Upcoming Events
                {activeTab === 'UPCOMING' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ff3b5c] rounded-full"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('PAST')}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'PAST' ? 'text-[#ff3b5c]' : 'text-slate-300'}`}
              >
                Past Highlights
                {activeTab === 'PAST' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ff3b5c] rounded-full"></div>}
              </button>
            </div>
            <button className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">
               <Filter size={14} /> Filter
            </button>
          </div>

          <div className="space-y-8">
            {filteredEvents.map(event => (
              <Link to={`/event/${event.id}`} key={event.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-56 h-48 rounded-[2rem] overflow-hidden shrink-0">
                  <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="bg-pink-50 text-[#ff3b5c] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{event.category}</span>
                     {event.tickets[0]?.price === 0 && <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Free RSVP</span>}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#ff3b5c] transition-colors">{event.title}</h3>
                  <div className="flex flex-wrap gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Calendar size={14} className="text-[#ff3b5c]" /> {new Date(event.date).toLocaleDateString()}</span>
                     <span className="flex items-center gap-2"><MapPin size={14} className="text-[#ff3b5c]" /> {event.location}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end border-l border-slate-50 pl-8 hidden md:flex">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Starting from</p>
                   <p className="text-2xl font-black text-slate-900">₹{event.tickets[0]?.price || '0'}</p>
                   <ChevronRight size={24} className="text-slate-200 group-hover:text-[#ff3b5c] group-hover:translate-x-2 transition-all mt-4" />
                </div>
              </Link>
            ))}

            {filteredEvents.length === 0 && (
              <div className="py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <Ticket size={48} className="text-slate-200 mx-auto mb-6" />
                <p className="font-black text-slate-400 uppercase tracking-widest">No events found in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h4 className="text-lg font-black text-slate-900 mb-6">About the Organiser</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
                {organizer.description}
              </p>
              <div className="space-y-4">
                <a href="#" className="flex items-center gap-4 text-xs font-black text-slate-900 hover:text-[#ff3b5c] transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Globe size={18} /></div>
                  Official Website
                </a>
                <a href="#" className="flex items-center gap-4 text-xs font-black text-slate-900 hover:text-[#ff3b5c] transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Instagram size={18} /></div>
                  @comedycollective
                </a>
                <a href="#" className="flex items-center gap-4 text-xs font-black text-slate-900 hover:text-[#ff3b5c] transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Twitter size={18} /></div>
                  Twitter Updates
                </a>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff3b5c] rounded-full blur-[80px] opacity-20"></div>
               <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                 <CheckCircle2 size={18} className="text-yellow-400" />
                 Verified Brand
               </h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                 This organiser is fully vetted by the book my ticket trust & safety team. All transactions are secure and backed by our guarantee.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrganizerProfilePage;