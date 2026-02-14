import React, { useState } from 'react';
import { Event, User, UserRole } from '../../types';
import { Calendar, MapPin, Users, Heart, Share2, Search, Filter, CheckCircle2, X, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface RSVPPageProps {
  events: Event[];
  user: User | null;
}

const RSVPPage: React.FC<RSVPPageProps> = ({ events, user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const rsvpEvents = events.filter(e => 
    (e.category === 'Community' || e.category === 'Workshop' || (e.tickets && e.tickets[0]?.price === 0)) &&
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRSVP = (id: string) => {
    if (rsvpedIds.includes(id)) return;
    setRsvpedIds([...rsvpedIds, id]);
  };

  const handleCreateRsvp = () => {
    setShowRsvpModal(true);
  };

  const handleChoice = (type: 'waitlist' | 'guest') => {
    setShowRsvpModal(false);
    navigate(`/rsvp/create?type=${type}`);
  };

  return (
    <div className="bg-[#fffcfd] min-h-screen pb-24 relative">
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-black mb-4 tracking-tight">RSVP For Community</h1>
              <p className="text-slate-400 text-xl font-medium max-w-2xl">
                Join local meetups, open-mic nights, and community workshops.
              </p>
            </div>
            <button 
              onClick={handleCreateRsvp}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all"
            >
              Organise RSVP
            </button>
          </div>
          
          <div className="max-w-xl mx-auto md:mx-0 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Find community meetups..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-16 pr-6 py-5 text-lg outline-none focus:ring-2 ring-amber-500/50 transition-all backdrop-blur-md"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-black text-slate-900">Upcoming Meetups</h2>
          <button className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <Filter size={14} /> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rsvpEvents.map(event => (
            <div key={event.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-amber-100/10 overflow-hidden group">
              <div className="aspect-video relative overflow-hidden">
                <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                <div className="absolute top-4 right-4 flex gap-2">
                   <button className="p-3 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-amber-500 shadow-lg transition-colors">
                      <Heart size={18} />
                   </button>
                   <button className="p-3 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-amber-500 shadow-lg transition-colors">
                      <Share2 size={18} />
                   </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Free RSVP
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-black text-slate-900 mb-4 truncate group-hover:text-amber-500 transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Calendar size={16} className="text-amber-500" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <MapPin size={16} className="text-amber-500" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Users size={16} className="text-amber-500" />
                    {Math.floor(Math.random() * 20) + 5} Attending
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleRSVP(event.id)}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      rsvpedIds.includes(event.id) 
                      ? 'bg-green-50 text-green-600 border border-green-100 cursor-default' 
                      : 'bg-amber-500 text-white shadow-lg shadow-amber-100 hover:bg-orange-500'
                    }`}
                  >
                    {rsvpedIds.includes(event.id) ? <><CheckCircle2 size={18} /> Going</> : 'RSVP Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRsvpModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowRsvpModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[1.2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-orange-600 p-10 md:p-14 text-center text-white relative">
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl md:text-4xl font-black mb-3">RSVP Management</h2>
              <p className="text-[15px] font-medium opacity-90">Choose your preferred RSVP management style</p>
            </div>

            <div className="p-8 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 bg-white">
              <button 
                onClick={() => handleChoice('waitlist')}
                className="bg-[#fff9e6] p-12 md:p-14 rounded-[1rem] border border-[#ffecb3] text-center group hover:scale-[1.01] transition-all hover:shadow-xl hover:shadow-yellow-100/50"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">⏳</div>
                <h3 className="text-xl font-black text-[#1e293b] mb-4">Waitlist System</h3>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                  Automated waitlist management for overbooked events
                </p>
              </button>

              <button 
                onClick={() => handleChoice('guest')}
                className="bg-[#e6fff5] p-12 md:p-14 rounded-[1rem] border border-[#b3ffdb] text-center relative group hover:scale-[1.01] transition-all hover:shadow-xl hover:shadow-green-100/50"
              >
                <div className="absolute top-5 right-5 flex gap-2">
                  <div className="p-1.5 bg-white/60 rounded-lg text-[#94a3b8] shadow-sm">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">🎫</div>
                <h3 className="text-xl font-black text-[#1e293b] mb-4">Guest Registration</h3>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                  Basic form with name, email, and attendance confirmation
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVPPage;