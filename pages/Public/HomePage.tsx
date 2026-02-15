
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Music,
  Trophy,
  Theater,
  Mic2,
  Users,
  PartyPopper,
  Tv,
  Gamepad2,
  Star,
  Ticket,
  Heart,
  Sparkles,
  ArrowRight,
  Menu,
  Zap,
  Calendar as CalendarIcon,
  Clock,
  LayoutGrid,
  Map as MapIcon
} from 'lucide-react';
import { Event } from '../../types.ts';
import EventMap from '../../components/EventMap.tsx';

interface HomePageProps {
  events: Event[];
}

// Fixed: Added default export and component implementation for HomePage
const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((unit) => (
        <div key={unit.label} className="bg-white border-2 border-[#f0f0f0] rounded-2xl px-5 py-4 flex flex-col items-center min-w-[85px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] transform hover:scale-105 transition-transform">
          <span className="text-3xl font-bold text-[#484848] leading-none mb-1">{unit.value.toString().padStart(2, '0')}</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#767676]">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const categories = [
    { name: 'All', icon: <Menu size={20} /> },
    { name: 'Comedy Show', icon: <Sparkles size={20} /> },
    { name: 'Competition', icon: <Trophy size={20} /> },
    { name: 'Concert', icon: <Music size={20} /> },
    { name: 'Conference', icon: <Users size={20} /> },
    { name: 'Entertainment', icon: <Tv size={20} /> },
    { name: 'Marathon', icon: <Zap size={20} /> },
    { name: 'Musics', icon: <Mic2 size={20} /> },
    { name: 'Party', icon: <PartyPopper size={20} /> },
  ];

  const filteredEvents = events.filter(e =>
    (activeCategory === 'All' || e.category.toLowerCase().includes(activeCategory.toLowerCase())) &&
    (e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white min-h-screen pb-32 text-[#484848]">
      {/* Hero Section - Ticket9 Exact Style */}
      <section className="relative h-[700px] overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Visual Background - YouTube Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/XeaAT-wTLuM?autoplay=1&mute=1&loop=1&playlist=XeaAT-wTLuM&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
          {/* Gradients and Overlays for Text Contrast */}
          <div className="absolute inset-0 bg-[#000000]/50 backdrop-blur-[0.5px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95"></div>
        </div>
        <div className="max-w-[1200px] w-[90%] mx-auto relative z-10 flex flex-col items-center">
          <div className="max-w-5xl space-y-12 flex flex-col items-center">
            <div className="space-y-6">
              <h1 className="text-[48px] max-[992px]:text-[36px] max-[768px]:text-[28px] font-extrabold text-white tracking-tighter leading-tight drop-shadow-2xl">
                Discover Your Next<br />
                <span className="bg-gradient-to-r from-[#FF9650] to-[#FB426E] bg-clip-text text-transparent">Unforgettable Experience</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-lg">
                Explore concerts, shows, nightlife, and exclusive experiences happening around you.
              </p>
            </div>

            <div className="w-full max-w-4xl relative">
              <div className="flex bg-white rounded-2xl p-2 shadow-2xl overflow-hidden group focus-within:ring-4 focus-within:ring-[#ff5862]/10 transition-all border border-black/5">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-8 text-[#767676]" size={20} />
                  <input
                    type="text"
                    placeholder="Search events, concerts, shows..."
                    className="w-full pl-16 pr-8 py-5 bg-transparent text-[16px] font-medium text-[#484848] outline-none placeholder:text-[#767676]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="bg-gradient-to-r from-[#FF9650] to-[#FB426E] text-white px-10 py-5 rounded-xl font-bold text-[16px] flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#ff5862]/20">
                  <Search size={20} /> Search
                </button>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {['Concert', 'Sports', 'Musics', 'Live Shows', 'Comedy Show'].map(tag => (
                  <button key={tag} className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[13px] font-semibold hover:bg-[#ff5862] hover:border-[#ff5862] transition-all">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] w-[90%] mx-auto space-y-32 mt-32">
        {/* Featured Events Section - Image 2 Style */}
        <section className="space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#484848] tracking-tight">Featured Events ✨</h2>
            <p className="text-[#767676] font-medium text-center max-w-lg text-[16px]">
              Explore top events and unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1 gap-8">
            {events.slice(0, 4).map(event => (
              <Link key={event.id} to={`/event/${event.id}`} className="group card-clean overflow-hidden p-2">
                <div className="aspect-[16/10] rounded-[2.25rem] overflow-hidden relative mb-6">
                  <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={event.title} />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-[#767676] hover:text-[#ff5862] border border-black/5 transition-all shadow-sm">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="px-5 pb-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[18px] font-bold text-[#484848] group-hover:text-[#ff5862] transition-colors truncate">{event.title}</h3>
                    <CheckCircle2 size={16} className="text-[#3b82f6] fill-current shrink-0" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#767676]">
                      <MapPin size={16} className="text-[#ff5862]" /> Coimbatore
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-[#767676]">
                        <CalendarIcon size={16} className="text-[#ff5862]" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <span className="text-[#484848] text-[13px] font-bold">Paid</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Cities Section - Image 2 Style */}
        <section className="space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#484848] tracking-tight flex items-center gap-4">
              <MapPin size={36} className="text-[#ff5862]" fill="currentColor" fillOpacity={0.1} /> Popular Cities 📍
            </h2>
            <p className="text-[#767676] font-medium text-center text-[16px]">
              Upcoming events in the trending destinations!
            </p>
          </div>

          <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1 gap-8">
            {[
              { name: 'Bengaluru', events: 359, image: 'https://images.unsplash.com/photo-1596760405807-0058864744bc?auto=format&fit=crop&q=80&w=600' },
              { name: 'Chennai', events: 539, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=600' },
              { name: 'Coimbatore', events: 313, image: 'https://images.unsplash.com/photo-1540339832862-43187c938495?auto=format&fit=crop&q=80&w=600' },
              { name: 'Hyderabad', events: 23, image: 'https://images.unsplash.com/photo-1626339661448-522606554c15?auto=format&fit=crop&q=80&w=600' },
              { name: 'Mumbai', events: 16, image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=600' },
              { name: 'Kochi', events: 2, image: 'https://images.unsplash.com/photo-1593576045768-4478895b624f?auto=format&fit=crop&q=80&w=600' },
              { name: 'Kolkata', events: 6, image: 'https://images.unsplash.com/photo-1558431382-27e305663a8a?auto=format&fit=crop&q=80&w=600' },
              { name: 'Delhi', events: 5, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600' },
            ].map((city) => (
              <div key={city.name} className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer">
                <img src={city.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={city.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="text-white space-y-1">
                    <h3 className="text-2xl font-bold tracking-tight">{city.name}</h3>
                    <p className="text-xs font-medium text-white/80 uppercase tracking-widest">India</p>
                  </div>
                  <div className="flex items-center gap-2 text-white text-[12px] font-bold backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <CalendarIcon size={14} /> {city.events} events
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:bg-[#ff5862] transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Events Section - Image 4 Style */}
        <section className="space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#484848] tracking-tight">Trending Events 🔥</h2>
            <p className="text-[#767676] font-medium text-center text-[16px]">Be part of the excitement these events are trending now!</p>
          </div>
          <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1 gap-8">
            {events.slice(0, 4).map(event => (
              <Link key={event.id} to={`/event/${event.id}`} className="group card-clean overflow-hidden p-2">
                <div className="aspect-[16/10] rounded-[2.25rem] overflow-hidden relative mb-6">
                  <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={event.title} />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-[#767676] hover:text-[#ff5862] border border-black/5 transition-all">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="px-5 pb-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[18px] font-bold text-[#484848] group-hover:text-[#ff5862] transition-colors truncate">{event.title}</h3>
                    <CheckCircle2 size={16} className="text-[#3b82f6] fill-current shrink-0" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#767676]">
                      <MapPin size={16} className="text-[#ff5862]" /> Coimbatore, Tamil Nadu, India
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-[#767676]">
                        <CalendarIcon size={16} className="text-[#ff5862]" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <span className="text-[#484848] text-[13px] font-bold">Paid</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Spotlight Section - Image 4 Style */}
        <section className="space-y-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-[#484848] tracking-tight">Spotlight 🎯</h2>
            <p className="text-[#767676] font-medium text-[16px]">Handpicked experiences and standout events you won't want to miss!</p>
          </div>

          <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col md:flex-row p-6 gap-10">
            <div className="md:w-[65%] rounded-[2.5rem] overflow-hidden relative aspect-[16/9]">
              <img
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover"
                alt="Spotlight Event"
              />
            </div>
            <div className="md:w-[35%] flex flex-col justify-center space-y-8 py-6 bg-[#F9FAFB]/50 rounded-[2.5rem] px-8 border border-black/[0.01]">
              <div className="space-y-6">
                <h3 className="text-[32px] font-bold text-[#484848] tracking-tight leading-tight">Holi Blast 2026</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#ff5862]">
                    <Clock size={16} /> Event Starts In
                  </div>
                  <CountdownTimer targetDate="2026-03-08T09:00:00" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#F7F7F7] rounded-2xl p-4 flex items-center gap-3 border border-black/[0.02]">
                    <CalendarIcon size={20} className="text-[#ff5862]" />
                    <span className="text-[13px] font-bold text-[#484848]">Mar 8, 2026</span>
                  </div>
                  <div className="flex-1 bg-[#F7F7F7] rounded-2xl p-4 flex items-center gap-3 border border-black/[0.02]">
                    <Clock size={20} className="text-[#ff5862]" />
                    <span className="text-[13px] font-bold text-[#484848]">09:00 AM</span>
                  </div>
                </div>
                <div className="bg-[#F7F7F7] rounded-2xl p-4 flex items-center gap-3 border border-black/[0.02]">
                  <MapPin size={20} className="text-[#ff5862]" />
                  <span className="text-[13px] font-bold text-[#484848]">G Square City 2.0, Coimbatore</span>
                </div>
              </div>

              <button className="w-full py-5 bg-[#ff5862] text-white rounded-full font-bold text-[16px] shadow-lg shadow-[#ff5862]/20 hover:bg-[#ff385c] transition-all hover:scale-[1.02] active:scale-95">
                Register Now
              </button>
            </div>
          </div>
        </section>

        {/* Featured Organizers Section - Image 3 Style */}
        <section className="space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#484848] tracking-tight">Featured Organizers 🌟</h2>
            <p className="text-[#767676] font-medium text-center text-[16px]">Discover events from our trusted organizers worldwide</p>
          </div>
          <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1 gap-8">
            {[
              { name: 'SHARUL CHANNA', events: 3, icon: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
              { name: 'LEA360COMMUNITY', events: 1, icon: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=200' },
              { name: 'Unherd Music Community', events: 3, icon: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200' },
              { name: 'Medai Bengaluru', events: 6, icon: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=200' },
            ].map((org) => (
              <div key={org.name} className="card-clean p-10 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all border border-black/5 p-1 bg-white">
                  <img src={org.icon} className="w-full h-full object-cover rounded-xl" alt={org.name} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-[14px] font-bold text-[#484848] uppercase tracking-wide">{org.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-[#767676] text-[12px] font-medium">
                    <CalendarIcon size={14} className="text-[#ff5862]" /> {org.events} events
                  </div>
                </div>
                <div className="divider-dashed"></div>
                <button className="text-[12px] font-bold text-[#767676] hover:text-[#ff5862] transition-colors flex items-center gap-2">
                  Click to explore events <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Popular Events Section - Image 5 Style */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-black/5 pb-10">
            <div className="space-y-4">
              <h2 className="text-[32px] md:text-[40px] font-bold text-[#484848] tracking-tight">Explore Popular Events 🥳</h2>
              <p className="text-[#767676] font-medium text-[16px]">Dive into the most popular events and experiences nearby!</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex bg-[#f9fafb] p-1 rounded-2xl border border-black/5 mr-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[12px] font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-[#ff5862]' : 'text-[#767676] hover:text-[#484848]'}`}
                >
                  <LayoutGrid size={16} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[12px] font-bold transition-all ${viewMode === 'map' ? 'bg-white shadow-md text-[#ff5862]' : 'text-[#767676] hover:text-[#484848]'}`}
                >
                  <MapIcon size={16} /> Map View
                </button>
              </div>
              <button className="px-8 py-4 rounded-2xl bg-[#fff2f3] border border-[#ff5862]/10 text-[#ff5862] text-[12px] font-bold flex items-center gap-2">
                <CalendarIcon size={16} /> All Events
              </button>
              <button className="px-8 py-4 rounded-2xl bg-[#f9fafb] border border-black/5 text-[#767676] text-[12px] font-bold flex items-center gap-2">
                <CalendarIcon size={16} /> This Month
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <>
              {/* Category Icons - Exact Image 1 Style */}
              <div className="flex items-start justify-between overflow-x-auto pb-8 no-scrollbar gap-8">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className="flex flex-col items-center gap-4 group min-w-[80px]"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === cat.name ? 'bg-[#FF5A5F] text-white shadow-xl shadow-[#FF5A5F]/30 scale-110' : 'bg-[#F7F7F7] text-[#484848] border border-black/5 group-hover:bg-white group-hover:shadow-lg'}`}>
                      {React.cloneElement(cat.icon as React.ReactElement, { size: 24 })}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider text-center transition-colors ${activeCategory === cat.name ? 'text-[#484848]' : 'text-[#767676] group-hover:text-[#484848]'}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1 gap-10">
                {filteredEvents.slice(0, 8).map(event => (
                  <Link key={event.id} to={`/event/${event.id}`} className="group card-clean overflow-hidden p-2 flex flex-col">
                    <div className="aspect-[16/10] rounded-[2.25rem] overflow-hidden relative mb-6">
                      <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={event.title} />
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-[#767676] hover:text-[#FF5A5F] border border-black/5 transition-all shadow-sm">
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className="px-5 pb-5 space-y-4">
                      <h3 className="text-[18px] font-bold text-[#484848] group-hover:text-[#ff5862] transition-colors line-clamp-1">{event.title}</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-[13px] font-medium text-[#767676]">
                          <MapPin size={16} className="text-[#ff5862]" /> {event.city}, India
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-black/[0.05]">
                          <div className="flex items-center gap-2 text-[13px] font-medium text-[#767676]">
                            <CalendarIcon size={16} className="text-[#ff5862]" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <span className="text-[#484848] text-[13px] font-bold">Paid</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <EventMap events={filteredEvents} />
          )}
        </section>

        {/* Newsletter Section - Clean Light Style */}
        <section className="relative bg-[#F7F7F7] rounded-[3.5rem] p-16 border border-black/5 overflow-hidden mt-60">
          <div className="flex flex-col lg:flex-row gap-20 items-center justify-between">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <h2 className="text-6xl font-black uppercase tracking-tighter leading-none text-[#484848]">
                  JOIN OUR<br />
                  <span className="text-[#FF5A5F] italic">NEWSLETTER! 📬</span>
                </h2>
                <p className="text-[#767676] font-bold max-w-lg leading-relaxed text-sm">
                  We get it — spam is no one's friend! That's why our newsletter is different. Pure value, zero clutter.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { id: '01', text: 'Access to upcoming events, webinars, and more. 😍', color: 'bg-[#FF5A5F]' },
                  { id: '02', text: 'Exclusive offers and coupons just for our subscribers. 🌟', color: 'bg-[#00A699]' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-6 group">
                    <span className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg group-hover:scale-110 transition-transform`}>{item.id}</span>
                    <p className="text-[#767676] font-black uppercase tracking-widest text-[11px]">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="relative max-w-md group">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL..."
                  className="w-full px-10 py-6 bg-white border border-black/10 rounded-3xl outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 transition-all font-black uppercase tracking-widest text-[12px] placeholder:text-slate-300 text-[#484848]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#FF5A5F] rounded-2xl flex items-center justify-center hover:bg-[#FF385C] transition-all shadow-xl shadow-[#FF5A5F]/20">
                  <ArrowRight size={20} className="text-white" />
                </button>
              </div>
            </div>
            <div className="flex-1 relative w-full lg:w-auto flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] group transition-transform duration-700 hover:scale-105">
                <img
                  src="/newsletter_illustration_premium.png"
                  className="w-full h-auto rounded-[3rem] shadow-2xl relative z-0 scale-95"
                  alt="Newsletter Illustration"
                />
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF5A5F]/10 rounded-full blur-[60px] animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
