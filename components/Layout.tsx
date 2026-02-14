
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types.ts';
import {
  LogOut,
  MapPin,
  Search,
  ChevronDown,
  Smartphone,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Zap,
  Lock,
  Bell,
  Ticket as TicketIcon,
  Plus,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Clapperboard,
  PartyPopper,
  CreditCard,
  Menu,
  Settings as SettingsIcon,
  Heart,
  HelpCircle,
  UserPlus,
  Globe,
  LayoutDashboard
} from 'lucide-react';

interface LayoutProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-[#ff5862] flex items-center justify-center shadow-lg shadow-[#ff5862]/20">
        <TicketIcon className="text-white w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-[#484848] leading-none lowercase">
          ticket<span className="text-[#ff5862]">9</span>
        </h1>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ user, setUser }) => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [locationName, setLocationName] = useState('Coimbatore');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#484848]">
      {/* Header - Ticket9 Exact Style */}
      <header className="bg-white sticky top-0 z-[100] border-b border-black/5 h-20 flex items-center shadow-sm">
        <div className="max-w-[1200px] w-[90%] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Link to="/" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
              <Logo />
            </Link>

            <div className="hidden lg:flex items-center gap-8 border-l border-black/5 pl-8">
              <button className="flex items-center gap-2 text-[14px] font-semibold text-[#484848] hover:text-[#ff5862] transition-all">
                Explore <ChevronDown size={16} />
              </button>

              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search For Any Event"
                  className="w-80 pl-6 pr-12 py-3 bg-[#f9fafb] border border-black/5 rounded-full text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#ff5862]/10 focus:bg-white transition-all placeholder:text-[#767676]"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#767676]" size={16} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#484848] cursor-pointer hover:text-[#ff5862] transition-colors">
                <MapPin size={18} className="text-[#ff5862]" />
                {locationName} <ChevronDown size={14} />
              </div>
              <div className="flex items-center gap-3 text-[#767676] opacity-60">
                <TicketIcon size={18} />
                <span className="text-lg font-light text-black/20">/</span>
                <MapPin size={18} />
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={createRef}>
                <button
                  onClick={() => setIsCreateOpen(!isCreateOpen)}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF9650] to-[#FB426E] text-white text-[14px] font-bold shadow-lg shadow-[#FB426E]/20 hover:scale-105 active:scale-95 transition-all text-center"
                >
                  Create
                </button>

                {isCreateOpen && (
                  <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-black/5 py-3 px-2 z-[200]">
                    <Link
                      to="/become-organizer"
                      onClick={() => setIsCreateOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#f9fafb] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FF9650]/10 flex items-center justify-center text-[#FF9650] group-hover:scale-110 transition-transform">
                        <PartyPopper size={20} />
                      </div>
                      <span className="font-bold text-[15px] text-[#484848]">Events</span>
                    </Link>

                    <Link
                      to="/rsvp"
                      onClick={() => setIsCreateOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#f9fafb] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                        <CreditCard size={20} />
                      </div>
                      <span className="font-bold text-[15px] text-[#484848]">RSVP</span>
                    </Link>

                    <div
                      className="flex items-center justify-between p-4 rounded-xl opacity-40 cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#767676]/10 flex items-center justify-center text-[#767676]">
                          <Clapperboard size={20} />
                        </div>
                        <span className="font-bold text-[15px] text-[#484848]">Movies</span>
                      </div>
                      <Lock size={14} className="text-[#767676]" />
                    </div>
                  </div>
                )}
              </div>


              {!user ? (
                <Link
                  to="/auth"
                  className="px-7 py-3 rounded-full border border-black/10 text-[#484848] text-[14px] font-bold hover:bg-[#f9fafb] transition-all active:scale-95"
                >
                  Login
                </Link>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-[#ff5862] text-white flex items-center justify-center font-bold shadow-lg shadow-[#ff5862]/20 active:scale-95 transition-all"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-black/5 py-4 px-2 z-[200]">
                      <div className="flex items-center gap-3 p-4 border-b border-black/5 mb-2">
                        <div className="w-10 h-10 bg-[#ff5862] text-white rounded-full flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-[14px] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#767676] font-medium uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                      <Link to="/my-tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f9fafb] text-[13px] font-semibold text-[#767676] hover:text-[#484848] transition-all">
                        <TicketIcon size={16} /> My Bookings
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 text-[13px] font-semibold transition-all">
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button className="w-10 h-10 flex items-center justify-center text-[#484848] hover:text-[#ff5862] bg-[#f9fafb] rounded-full border border-black/5 transition-all">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Nav Bar */}
      <div className="bg-white border-b border-black/5 h-12 hidden md:flex items-center sticky top-20 z-[90]">
        <div className="max-w-[1200px] w-[90%] mx-auto flex items-center justify-between text-[13px] font-semibold">
          <nav className="flex items-center gap-8">
            <Link to="/" className="text-[#ff5862] border-b-2 border-[#ff5862] h-12 flex items-center">Events</Link>
            <Link to="/rsvp" className="text-[#767676] hover:text-[#484848] h-12 flex items-center transition-colors">RSVP</Link>
            <span className="text-[#767676] flex items-center gap-1.5 cursor-not-allowed opacity-60">Movies <Lock size={12} /></span>
          </nav>
          <div className="flex items-center gap-8 text-[#767676]">
            <span className="hover:text-[#ff5862] cursor-pointer transition-colors text-[13px]">What's New</span>
            <span className="flex items-center gap-1.5 hover:text-[#ff5862] cursor-pointer transition-colors text-[13px]"><Smartphone size={14} /> Get App</span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-black/5 py-24">
        <div className="max-w-[1200px] w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 pb-16 border-b border-black/5">
            <div className="md:col-span-2 space-y-8">
              <Logo />
              <p className="text-[14px] font-medium leading-relaxed max-w-sm text-[#767676]">
                Ticket9 is India's premier high-end event discovery portal. We bridge the gap between imagination and live experience.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-[#f9fafb] flex items-center justify-center text-[#767676] hover:bg-[#ff5862] hover:text-white transition-all cursor-pointer shadow-sm">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[#484848] font-bold text-[14px] uppercase tracking-wide">Marketplace</h4>
              <ul className="space-y-4 text-[13px] font-medium text-[#767676]">
                {['All Events', 'Concerts', 'Comedy Shows', 'Workshops', 'Free Events'].map(l => (
                  <li key={l}><a href="#" className="hover:text-[#ff5862] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[#484848] font-bold text-[14px] uppercase tracking-wide">Support</h4>
              <ul className="space-y-4 text-[13px] font-medium text-[#767676]">
                {['Help Center', 'Privacy Policy', 'Terms of Use', 'Refund Policy', 'Contact Us'].map(l => (
                  <li key={l}><a href="#" className="hover:text-[#ff5862] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[#484848] font-bold text-[14px] uppercase tracking-wide">Get App</h4>
              <div className="space-y-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-10 cursor-pointer hover:scale-105 transition-transform" alt="Play Store" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-10 cursor-pointer hover:scale-105 transition-transform" alt="App Store" />
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[12px] font-semibold text-[#767676] uppercase tracking-[0.2em]">
              © 2026 ticket9. all rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
