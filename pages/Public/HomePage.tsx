
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Search,
  ChevronRight,
  ChevronLeft,
  Music,
  Trophy,
  Mic2,
  Users,
  PartyPopper,
  Tv,
  List,
  Smile,
  Layout,
  Mic,
  Presentation,
  FerrisWheel,
  Activity,
  Headphones,
  Calendar as CalendarIcon,
  Ticket,
  Star,
  Heart,
  Quote,
  Mail,
  TrendingUp,
  Globe,
  Clock,
  ArrowRight,
  Clapperboard,
  Settings as SettingsIcon,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { Event } from '../../types';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import OrganizerRequestForm from '../../components/OrganizerRequestForm';
import { getCityEventCounts, getFeaturedOrganizers, getHomepageSections } from '../../lib/supabase';
import * as LucideIcons from 'lucide-react';


interface HomePageProps {
  events: Event[];
  currentCity: string;
  setCurrentCity: (city: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ events, currentCity, setCurrentCity }) => {
  const { config } = useSiteConfig();
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});
  const [liveOrganizers, setLiveOrganizers] = useState<any[]>([]);
  const [cmsSections, setCmsSections] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Icon mapping for CMS
  const getIcon = (iconName: string, size = 24) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent size={size} />;
  };

  // Default Categories fallback
  const defaultCategories = [
    { name: 'All', icon: <LucideIcons.List size={24} />, color: '#FF6E4E' },
    { name: 'Comedy Show', icon: <LucideIcons.Smile size={24} />, color: '#F3F4F6' },
    { name: 'Competition', icon: <LucideIcons.Trophy size={24} />, color: '#F3F4F6' },
    { name: 'Concert', icon: <LucideIcons.Mic size={24} />, color: '#F3F4F6' },
    { name: 'Conference', icon: <LucideIcons.Users size={24} />, color: '#F3F4F6' },
    { name: 'Exhibition', icon: <LucideIcons.Presentation size={24} />, color: '#F3F4F6' },
    { name: 'Entertainment', icon: <LucideIcons.FerrisWheel size={24} />, color: '#F3F4F6' },
    { name: 'Fun', icon: <LucideIcons.Smile size={24} />, color: '#F3F4F6' },
    { name: 'Marathon', icon: <LucideIcons.Activity size={24} />, color: '#F3F4F6' },
    { name: 'Musics', icon: <LucideIcons.Headphones size={24} />, color: '#F3F4F6' },
  ];

  const defaultOrganizers = [
    { name: 'Sunburn Arena', count: '12 Events', color: 'bg-orange-500', logo: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop' },
    { name: 'Comedy Store', count: '8 Events', color: 'bg-purple-500', logo: 'https://images.unsplash.com/photo-1543584756-8f40a802e14f?q=80&w=200&auto=format&fit=crop' },
    { name: 'Live Nation', count: '24 Events', color: 'bg-blue-500', logo: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200&auto=format&fit=crop' },
    { name: 'Super Star', count: '5 Events', color: 'bg-red-500', logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop' },
    { name: 'Tech Conferences', count: '15 Events', color: 'bg-green-500', logo: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=200&auto=format&fit=crop' },
    { name: 'Food Fests', count: '3 Events', color: 'bg-yellow-500', logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200&auto=format&fit=crop' },
  ];

  const displayOrganizers = liveOrganizers.length > 0 ? liveOrganizers : defaultOrganizers;

  const cities = [
    { name: 'Coimbatore', image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1000&auto=format&fit=crop', count: '10+ Events' },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1000&auto=format&fit=crop', count: '45+ Events' },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1585464231473-196d4fb52749?q=80&w=1000&auto=format&fit=crop', count: '32+ Events' },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop', count: '28+ Events' },
    { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop', count: '19+ Events' },
    { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1626014303757-6366116894c7?q=80&w=1000&auto=format&fit=crop', count: '22+ Events' },
    { name: 'Kochi', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop', count: '15+ Events' },
  ];

  // Fallback image helper
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop';
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  // Helper to format price
  const getEventPrice = (event: Event) => {
    if (!event.tickets || event.tickets.length === 0) return { label: 'Free', isFree: true };
    const prices = event.tickets.map(t => Number(t.price) || 0);
    const minPrice = Math.min(...prices);
    if (minPrice === 0) return { label: 'Free', isFree: true };
    return { label: `\u20B9 ${minPrice.toLocaleString('en-IN')}`, isFree: false };
  };

  // Hero Slides fallback
  const defaultHeroSlides = [
    {
      title: "Experience the Magic of Cinema",
      subtitle: "Book tickets for the latest Hollywood and Bollywood blockbusters. Experience the big screen like never before.",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop",
      cta: "Book Movies"
    },
    {
      title: "Live Music, Unforgettable Nights",
      subtitle: "Join thousands of fans for the biggest rock, pop, and electronic concerts in your city.",
      image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2670&auto=format&fit=crop",
      cta: "Find Concerts"
    },
    {
      title: "Laughter is the Best Medicine",
      subtitle: "Catch the funniest stand-up comedians and improv shows. Book your seats for a night of pure joy.",
      image: "https://images.unsplash.com/photo-1514525253361-b83f85dfd75c?q=80&w=2670&auto=format&fit=crop",
      cta: "Join Shows"
    }
  ];

  // Resolve dynamic content
  const heroBannersSection = cmsSections.find(s => s.section_key === 'hero_banners');
  const heroSlides = heroBannersSection?.content || defaultHeroSlides;

  const categoryPinsSection = cmsSections.find(s => s.section_key === 'category_pins');
  const categories = categoryPinsSection
    ? categoryPinsSection.content.map((c: any) => ({ ...c, icon: getIcon(c.icon) }))
    : defaultCategories;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (window.location.hash === '#organizer-request') {
      setShowOrganizerForm(true);
      // Clean up hash without refresh
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const fetchHomeStats = async () => {
      try {
        const [counts, orgs, cms] = await Promise.all([
          getCityEventCounts(),
          getFeaturedOrganizers(),
          getHomepageSections()
        ]);
        setCityCounts(counts);
        setLiveOrganizers(orgs);
        setCmsSections(cms);
      } catch (err) {
        console.error("Error fetching homepage stats:", err);
      }
    };

    fetchHomeStats();
  }, []);

  return (
    <div className="min-h-screen pb-20 selection:bg-[#F84464] selection:text-white transition-colors duration-500">

      {/* Hero Section - bookmyticket Slider Recreation */}
      <section className="relative h-[650px] flex items-center overflow-hidden">

        {/* Slides Container */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover scale-105"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/40 to-transparent"></div>
              {/* Background Glows */}
              <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#FFCC00]/10 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1440px] w-[95%] mx-auto px-4 mt-20">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 bg-[#F84464] text-white rounded-sm font-black text-[10px] uppercase tracking-[0.2em] shadow-lg animate-bounce-slow">
                Experience Live Events 🚀
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-[64px] font-black text-white leading-[1.1] tracking-tighter">
                {heroSlides[activeSlide].title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? 'text-[#F84464]' : ''}>{word} </span>
                ))}
              </h1>
              <p className="text-gray-100 text-lg md:text-xl font-bold max-w-2xl leading-relaxed drop-shadow-lg opacity-90">
                {heroSlides[activeSlide].subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button className="bg-[#F84464] text-white px-10 py-4 rounded-md font-black text-sm uppercase tracking-widest hover:bg-[#D93654] hover:-translate-y-1 transition-all shadow-[0_20px_40px_rgba(248,68,100,0.3)] flex items-center gap-3 group">
                {heroSlides[activeSlide].cta}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 border-l border-white/20 pl-6 hidden sm:flex">

                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#000000] bg-gray-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Student" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white">10M+ Users</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === activeSlide ? 'w-12 bg-[#FFCC00]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

      </section>





      {/* Recently Viewed Events */}
      <section className="py-12 bg-transparent border-b border-white/5 reveal">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold dark:text-white text-[#111111] mb-2 flex items-center gap-2">
                Recently Viewed Events <span className="text-2xl">📌</span>
              </h2>
              <p className="dark:text-gray-400 text-gray-600 font-medium">Here's a quick look at events you've shown interest in.</p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#FBB040] hover:text-[#d38f29] transition-colors group">
              View All <span className="w-8 h-8 rounded-full bg-[#FBB040]/10 flex items-center justify-center group-hover:bg-[#FBB040] group-hover:text-black transition-all"><ChevronRight size={16} /></span>
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-12 pt-4 gap-6 snap-x scrollbar-hide -mx-4 px-4">
            {events.slice(0, 3).map((event, i) => (
              <Link key={`recent-${event.id}`} to={`/event/${event.id}`} className="min-w-[280px] md:min-w-[320px] snap-center dark:bg-[#151515] bg-white rounded-3xl border dark:border-white/5 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
                  <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={handleImageError} />
                  <div className="absolute top-3 right-3">
                    <button className="w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-[#F84464] transition-colors shadow-sm">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base dark:text-white text-gray-900 leading-tight line-clamp-1 flex-1">{event.title}</h3>
                    <CheckCircle2 size={16} className="text-[#3B82F6]" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                    <MapPin size={14} className="text-[#F84464]" />
                    <span className="truncate">{event.city}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                      <CalendarIcon size={14} className="text-[#F84464]" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span className="text-[#F84464] font-bold text-[13px]">Paid</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="py-20 dark:bg-gradient-to-b dark:from-[#0B0B0B] dark:to-[#111111] bg-[#f9f9f9]">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black dark:text-white text-[#111111] mb-2 flex items-center gap-3">Trending Events <span className="text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]">🔥</span></h2>
              <p className="dark:text-gray-400 text-gray-600 text-lg">Events that are catching everyone's eye right now.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/events?filter=trending" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#FF006E] hover:text-[#FF006E] transition-colors group">
                View All <span className="w-10 h-10 rounded-full bg-[#FF006E]/10 border border-[#FF006E]/30 flex items-center justify-center group-hover:bg-[#FF006E] group-hover:text-white transition-all group-hover:shadow-[0_0_15px_rgba(255,0,110,0.5)]"><ChevronRight size={18} /></span>
              </Link>
              <div className="hidden md:flex gap-3 border-l border-white/10 pl-6">
                <button className="w-12 h-12 rounded-full bg-[#151515] border border-white/10 text-white flex items-center justify-center hover:bg-[#FF006E] hover:border-[#FF006E] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,0,110,0.5)]">
                  <ChevronLeft size={22} />
                </button>
                <button className="w-12 h-12 rounded-full bg-[#151515] border border-white/10 text-white flex items-center justify-center hover:bg-[#FF006E] hover:border-[#FF006E] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,0,110,0.5)]">
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.slice(0, 4).map((event, i) => (
              <Link key={`trending-${i}`} to={`/event/${event.id}`} className="group dark:bg-[#151515] bg-white rounded-3xl border dark:border-white/5 border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={event.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={event.title} onError={handleImageError} />
                  <div className="absolute top-3 right-3">
                    <button className="w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-[#F84464] transition-colors shadow-sm">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base dark:text-white text-gray-900 leading-tight line-clamp-1 flex-1">{event.title}</h3>
                    <CheckCircle2 size={16} className="text-[#3B82F6]" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                    <MapPin size={14} className="text-[#F84464]" />
                    <span className="truncate">{event.city}, Tamil Nadu, India</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                    <div className="flex items-center gap-2 text-[#F84464] text-[13px] font-bold">
                      <CalendarIcon size={14} />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span className="text-[#F84464] font-bold text-[13px] opacity-70 border-b border-[#F84464]/20 pb-0.5">Paid</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Popular Events */}
      <section className="py-16 dark:bg-[#0B0B0B] bg-transparent">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black dark:text-white text-[#111111] mb-2 flex items-center gap-3">
                Explore Popular Events 🥳
              </h2>
              <p className="dark:text-gray-400 text-gray-600 text-sm font-medium">Dive into the most popular events and experiences nearby!</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#F84464] text-[#F84464] rounded-full text-sm font-bold bg-white hover:bg-[#F84464]/5 transition-all">
                <CalendarIcon size={16} /> All Events
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
                <CalendarIcon size={16} /> This Month
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
                <CalendarIcon size={16} /> This Week
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-8 pt-4 gap-8 scrollbar-hide -mx-4 px-4 justify-start md:justify-center">
            {categories.map((cat, i) => (
              <button key={i} className="flex flex-col items-center gap-3 group min-w-[100px]">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${i === 0 ? 'bg-[#FF6E4E] text-white shadow-lg shadow-[#FF6E4E]/40' : 'bg-gray-50 dark:bg-white/5 dark:text-gray-400 text-gray-600 border border-gray-100 dark:border-white/10 group-hover:border-[#FF6E4E] group-hover:text-[#FF6E4E] group-hover:-translate-y-1'}`}>
                  {cat.icon}
                </div>
                <span className={`text-[13px] font-bold transition-colors ${i === 0 ? 'text-black dark:text-white' : 'text-gray-500 group-hover:text-[#FF6E4E]'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Section - High Fidelity Refactor */}
      <section className="py-16 bg-white dark:bg-[#0B0B0B] reveal">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black dark:text-white text-[#111111] mb-2 flex items-center gap-3">
                Spotlight 🎯
              </h2>
              <p className="dark:text-gray-400 text-gray-600 text-sm font-medium">Handpicked experiences and standout events you won't want to miss!</p>
            </div>
          </div>

          <div className="relative group">
            {/* Split Layout Container */}
            <div className="flex flex-col lg:flex-row bg-[#FFF8F9] dark:bg-[#1A1112] rounded-[2rem] overflow-hidden border border-[#F84464]/10 shadow-[0_20px_50px_rgba(248,68,100,0.1)]">
              {/* Image Side (Left) */}
              <div className="w-full lg:w-3/5 h-[450px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
                  alt="Spotlight Event"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details Side (Right) */}
              <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black dark:text-white text-gray-900 leading-tight mb-2">
                    Kaber Vasuki - Frangipani Tour 2026 - Coimbatore
                  </h3>
                  <div className="flex items-center gap-2 text-[#F84464] text-sm font-bold mb-6">
                    <Clock size={16} />
                    <span>Event Starts In</span>
                  </div>

                  {/* Countdown Style Box */}
                  <div className="grid grid-cols-4 gap-3 mb-8">
                    {[
                      { value: '62', label: 'DAYS' },
                      { value: '03', label: 'HOURS' },
                      { value: '05', label: 'MINS' },
                      { value: '07', label: 'SECS' }
                    ].map((timer, i) => (
                      <div key={i} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-3 text-center shadow-sm">
                        <div className="text-xl md:text-2xl font-bold dark:text-white text-gray-800">{timer.value}</div>
                        <div className="text-[9px] font-black text-gray-400 tracking-widest">{timer.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-5 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 w-fit">
                      <CalendarIcon size={18} className="text-[#F84464]" />
                      <span>Apr 25, 2026</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <Clock size={18} className="text-[#F84464]" />
                      <span>07:00 PM</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-5 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 w-fit">
                      <MapPin size={18} className="text-[#F84464]" />
                      <span>Medai The Stage, Coimbatore</span>
                    </div>
                  </div>

                  <button className="w-full sm:w-fit bg-gradient-to-r from-[#FF6E4E] to-[#F84464] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#F84464]/30 hover:shadow-xl hover:shadow-[#F84464]/50 hover:-translate-y-1 transition-all">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -left-6 md:-left-8 -translate-y-1/2">
              <button className="w-12 h-12 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/10 shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#F84464] transition-colors">
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute top-1/2 -right-6 md:-right-8 -translate-y-1/2">
              <button className="w-12 h-12 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/10 shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#F84464] transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Events Section */}
      <section className="py-16 dark:bg-[#151515] bg-transparent">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black dark:text-white text-[#111111] mb-2">Featured Events ✨</h2>
              <p className="dark:text-gray-400 text-gray-600 text-sm">Explore top events and unforgettable experiences</p>
            </div>
            <Link to="/events/featured" className="text-[#FBB040] text-sm font-bold hover:underline flex items-center gap-1 drop-shadow-[0_0_5px_rgba(251,176,64,0.5)]">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {events.slice(0, 4).map(event => {
              const { label, isFree } = getEventPrice(event);
              return (
                <Link key={event.id} to={`/event/${event.id}`} className="group dark:bg-[#0B0B0B] bg-white rounded-[2rem] overflow-hidden border dark:border-white/5 border-gray-200 shadow-xl hover:shadow-[0_15px_40px_rgba(251,176,64,0.1)] transition-all duration-500 hover:-translate-y-3">
                  <div className="relative aspect-[16/10] overflow-hidden border-b dark:border-white/5 border-gray-100">
                    <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" onError={handleImageError} />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-[#FBB040] border border-[#FBB040]/30 shadow-[0_0_15px_rgba(251,176,64,0.3)]">
                      {event.category || 'EVENT'}
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#FF006E] hover:text-white transition-all shadow-lg border border-white/20 active:scale-90 hover:shadow-[0_0_15px_rgba(255,0,110,0.8)]">
                      <Heart size={20} />
                    </button>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                      <div className="bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,0,110,0.5)]">
                        {label}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-black text-[#FBB040] mb-3 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(251,176,64,0.4)]">
                      {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <h3 className="font-extrabold text-xl dark:text-white text-[#111111] mb-3 line-clamp-2 leading-tight group-hover:text-[#FBB040] transition-colors h-14">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                      <MapPin size={16} className="text-[#FF006E]" />
                      <span className="truncate">{event.city}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exclusive Events Section */}
      <section className="py-16 dark:bg-[#0B0B0B] bg-transparent">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black dark:text-white text-[#111111] mb-2">Exclusive Events 🌟</h2>
              <p className="dark:text-gray-400 text-gray-600 text-sm">Be the first to experience exclusive events before anyone else</p>
            </div>
            <Link to="/events/exclusive" className="text-[#FF006E] text-sm font-bold hover:underline flex items-center gap-1 drop-shadow-[0_0_5px_rgba(255,0,110,0.5)]">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {events.slice(2, 6).map((event, i) => {
              const { label, isFree } = getEventPrice(event);
              return (
                <Link key={event.id + i} to={`/event/${event.id}`} className="group dark:bg-[#151515] bg-white rounded-[2rem] overflow-hidden border dark:border-white/5 border-gray-200 shadow-xl hover:shadow-[0_15px_40px_rgba(255,0,110,0.1)] transition-all duration-500 hover:-translate-y-3">
                  <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden border-b dark:border-white/5 border-gray-100">
                    <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" onError={handleImageError} />
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white text-xs font-black px-4 py-2 rounded-bl-3xl shadow-[0_0_15px_rgba(255,0,110,0.5)] z-10 tracking-widest pl-6 pb-3">
                      EXCLUSIVE
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-black text-[#FBB040] mb-3 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(251,176,64,0.4)]">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' })}
                    </div>
                    <h3 className="font-extrabold text-xl dark:text-white text-[#111111] mb-2 line-clamp-2 leading-tight group-hover:text-[#FBB040] transition-colors h-14">
                      {event.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 dark:text-gray-400 text-gray-600 text-sm font-medium">
                        <MapPin size={16} className="text-[#FF006E]" />
                        <span className="truncate max-w-[100px]">{event.city}</span>
                      </div>
                      <span className="font-black dark:text-white text-[#111111] text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{label}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Virtual Events Section */}
      <section className="py-16 dark:bg-gradient-to-b dark:from-[#111111] dark:to-[#0B0B0B] bg-[#f0f4f8]">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black dark:text-white text-[#111111] mb-2 flex items-center gap-3">Virtual Events <Globe className="text-blue-500" size={28} /></h2>
              <p className="dark:text-gray-400 text-gray-600 text-sm">Enjoy live experiences from the comfort of your home.</p>
            </div>
            <Link to="/events/virtual" className="text-[#3b82f6] text-sm font-bold hover:underline flex items-center gap-1 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {events.slice(1, 5).map((event, i) => (
              <Link key={`virtual-${i}`} to={`/event/${event.id}`} className="block group dark:bg-[#151515] bg-white p-5 rounded-[2rem] border dark:border-white/5 border-gray-200 shadow-xl hover:shadow-[0_15px_40px_rgba(59,130,246,0.1)] transition-all duration-500 hover:-translate-y-3">
                <div className="relative rounded-2xl overflow-hidden mb-5 h-52 border dark:border-white/10 border-gray-100">
                  <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" onError={handleImageError} />
                  <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-md text-white text-xs font-black tracking-widest px-3 py-1.5 rounded bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-400/50">ONLINE</div>
                </div>
                <h3 className="font-extrabold dark:text-white text-gray-900 text-lg group-hover:text-blue-400 transition-colors line-clamp-1">{event.title}</h3>
                <p className="text-sm font-medium dark:text-gray-400 text-gray-500 mt-2 dark:bg-white/5 bg-gray-100 inline-block px-3 py-1 rounded-full">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Organizers - Marquees */}
      <section className="py-20 relative overflow-hidden z-10 border-b border-gray-100 dark:border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?auto=format&fit=crop&q=80&w=2500" className="w-full h-full object-cover opacity-40 dark:opacity-20" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/95 via-purple-50/90 to-orange-50/95 dark:from-black/95 dark:via-[#111]/90 dark:to-[#1a1111]/95 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] w-[95%] mx-auto mb-10 text-center">
          <h2 className="text-4xl font-black dark:text-white text-gray-900 drop-shadow-sm">Featured Organizers 🌟</h2>
        </div>

        <div className="relative z-10 space-y-8 py-4">
          {/* Row 1: scrolls left */}
          <div className="overflow-hidden">
            <div className="flex gap-6 px-4 animate-marquee-left" style={{ width: 'max-content' }}>
              {[...displayOrganizers, ...displayOrganizers, ...displayOrganizers, ...displayOrganizers, ...displayOrganizers].map((org, i) => (
                <Link key={`org-1-${i}`} to={`/events?search=${org.name}`} className="flex-shrink-0 group cursor-pointer w-48 h-28 bg-white border border-gray-100 shadow-sm hover:shadow-[0_10px_30px_rgba(255,0,110,0.15)] rounded-[1rem] flex items-center justify-center p-4 transition-all duration-500 hover:-translate-y-2 hover:border-[#FF006E]/30">
                  <img src={org.logo} alt={org.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500 max-h-[80px]" onError={handleImageError} />
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: scrolls right */}
          <div className="overflow-hidden">
            <div className="flex gap-6 px-4 animate-marquee-right" style={{ width: 'max-content' }}>
              {[...[...displayOrganizers].reverse(), ...[...displayOrganizers].reverse(), ...[...displayOrganizers].reverse(), ...[...displayOrganizers].reverse(), ...[...displayOrganizers].reverse()].map((org, i) => (
                <Link key={`org-2-${i}`} to={`/events?search=${org.name}`} className="flex-shrink-0 group cursor-pointer w-48 h-28 bg-white border border-gray-100 shadow-sm hover:shadow-[0_10px_30px_rgba(255,0,110,0.15)] rounded-[1rem] flex items-center justify-center p-4 transition-all duration-500 hover:-translate-y-2 hover:border-[#FF006E]/30">
                  <img src={org.logo} alt={org.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500 max-h-[80px]" onError={handleImageError} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities - Marquee Left to Right */}
      <section className="py-20 bg-[#111111] overflow-hidden">
        <div className="max-w-[1440px] w-[95%] mx-auto mb-12 text-center">
          <h2 className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Popular Cities 🏙️</h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-8 px-4 py-4 animate-marquee-left" style={{ width: 'max-content' }}>
            {[...cities, ...cities, ...cities, ...cities, ...cities].map((city, i) => (
              <div
                key={`city-${i}`}
                onClick={() => setCurrentCity(city.name)}
                className="relative w-[280px] h-[180px] rounded-[2rem] overflow-hidden cursor-pointer group flex-shrink-0 shadow-2xl border border-white/10 hover:shadow-[0_15px_40px_rgba(248,68,100,0.3)] transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
              >
                <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" onError={handleImageError} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/20 transition-colors flex flex-col items-center justify-end pb-8 text-white">
                  <h3 className="text-2xl font-black drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:text-[#FBB040] transition-colors">{city.name}</h3>
                  <p className="text-xs font-bold text-gray-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {cityCounts[city.name] ? `${cityCounts[city.name]}+ Events` : 'Check Events'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Events Section */}
      <section className="py-20 dark:bg-[#0B0B0B] bg-transparent border-t border-gray-100/10">
        <div className="max-w-[1440px] w-[95%] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black dark:text-white text-[#111111] mb-2">Recommended For You 🗓️</h2>
              <p className="dark:text-gray-400 text-gray-600 font-medium">Handpicked events based on your interests.</p>
            </div>
            <Link to="/events/recommended" className="text-[#FF006E] font-bold hover:underline flex items-center gap-1 drop-shadow-[0_0_5px_rgba(255,0,110,0.5)]">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {events.slice(3, 7).map((event, i) => (
              <Link key={`rec-${i}`} to={`/event/${event.id}`} className="dark:bg-[#151515] bg-white p-4 rounded-[2rem] hover:shadow-[0_15px_30px_rgba(255,0,110,0.1)] transition-all border dark:border-white/5 border-gray-200 group hover:-translate-y-2">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 border dark:border-white/10 border-gray-100">
                  <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={handleImageError} />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-[#FBB040] border border-[#FBB040]/30">{event.category}</span>
                  </div>
                </div>
                <h3 className="font-extrabold dark:text-white text-gray-900 line-clamp-1 mb-2 group-hover:text-[#FBB040] transition-colors">{event.title}</h3>
                <div className="flex items-center justify-between text-[11px] font-bold dark:text-gray-400 text-gray-500">
                  <span className="flex items-center gap-1"><CalendarIcon size={12} className="text-[#FF006E]" /> {new Date(event.date).toLocaleDateString()}</span>
                  <span className="text-[#FF006E] group-hover:text-[#FBB040] transition-colors uppercase tracking-widest">Book Now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 dark:bg-[#0B0B0B] bg-transparent relative overflow-hidden">
        <div className="max-w-[1440px] w-[95%] mx-auto bg-[#151515] rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-white/5 shadow-2xl group">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF006E]/10 rounded-full -mr-32 -mt-32 blur-[100px] transition-all group-hover:bg-[#FF006E]/20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FBB040]/5 rounded-full -ml-32 -mb-32 blur-[100px] transition-all group-hover:bg-[#FBB040]/10"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Text Content */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF006E] to-[#FB426E] rounded-[2rem] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(255,0,110,0.4)] mx-auto lg:mx-0 rotate-6 group-hover:rotate-12 transition-transform duration-500">
                <Mail size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBB040] to-[#FF006E]">Beat.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0 font-medium">
                Subscribe to our newsletter for exclusive event early-access, member-only discounts, and the best experiences delivered to your inbox.
              </p>
            </div>

            {/* Form */}
            <div className="flex-1 w-full max-w-lg">
              <div className="bg-black/40 backdrop-blur-xl p-2.5 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/10 focus-within:border-[#FF006E]/50 focus-within:shadow-[0_0_25px_rgba(255,0,110,0.2)] transition-all duration-500">
                <input
                  type="email"
                  placeholder="name@awesome.com"
                  className="flex-1 w-full px-8 py-4 outline-none text-white bg-transparent placeholder:text-gray-600 font-bold"
                />
                <button className="bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(255,0,110,0.4)] hover:shadow-[0_15px_30px_rgba(255,0,110,0.6)] hover:scale-[1.05] active:scale-95 transition-all w-full md:w-auto">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-[10px] font-bold text-center mt-6 uppercase tracking-widest opacity-60">
                No spam, only excellence. Unsubscribe with one click.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Organizer Request Modal */}
      {showOrganizerForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOrganizerForm(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <OrganizerRequestForm onClose={() => setShowOrganizerForm(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
