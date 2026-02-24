
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
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
  Target,
  Menu,
  Settings as SettingsIcon,
  Heart,
  HelpCircle,
  UserPlus,
  Globe,
  LayoutDashboard,
  Clapperboard as ClapperboardIcon,
  ShoppingBag,
  Camera,
  Layers,
  ArrowUp,
  Mail,
  Phone,
  Send,
  Ticket,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import LocationModal from './LocationModal';
import SideMenu from './SideMenu';
import OrganizerRequestForm from './OrganizerRequestForm';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  user: User | null;
  setUser: (user: User | null) => void;
  currentCity: string;
  setCurrentCity: (city: string) => void;
}

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      <h1 className="text-2xl lg:text-3xl font-black tracking-tight leading-none lowercase font-sans flex items-center">
        <span className="dark:text-white text-[#111111]">book</span>
        <span className="mx-1 px-1.5 py-0.5 bg-[#F84464] text-white rounded-sm relative flex items-center justify-center overflow-hidden">
          {/* Jagged edges for the ticket effect */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--bg-header)] rounded-full -ml-[3px]"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--bg-header)] rounded-full -mr-[3px]"></div>
          my
        </span>
        <span className="dark:text-white text-[#111111]">ticket</span>
      </h1>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ user, setUser, currentCity, setCurrentCity }) => {
  const { config } = useSiteConfig();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
    setUser(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#F84464] selection:text-white">

      {/* Top Promotional Banner (PaytmTravel/Ticket9) */}
      <div className="bg-[#F5F5F5] py-2.5 px-4 border-b border-gray-200">
        <div className="max-w-[1440px] w-[95%] mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
          <div className="flex items-center gap-2">
            <TicketIcon size={14} className="text-[#F84464]" />
            <span className="text-sm font-bold text-[#F84464]">Ticket9</span>
            <span className="text-sm font-medium text-gray-600">partners with</span>
            <div className="flex items-center gap-0.5">
              <span className="text-sm font-black text-[#00B9F1]">Paytm</span>
              <span className="text-sm font-black text-black">travel</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-600">to bring you special discounts on bus, flight & hotel bookings.</span>
          <Link to="/offers" className="text-sm font-bold text-[#F84464] hover:underline flex items-center gap-1">
            Claim your coupon <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Header - bookmyticket Style Recreation */}
      <header className="bg-[var(--bg-header)] sticky top-0 z-[100] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-gray-100/10 flex flex-col transition-all">

        {/* Main Header Row */}
        <div className="py-4">
          <div className="max-w-[1440px] w-[95%] mx-auto flex items-center justify-between gap-8">

            {/* Left Section: Logo */}
            <div className="flex items-center gap-12 shrink-0">
              <Link to="/" className="hover:opacity-90 transition-opacity">
                <Logo />
              </Link>
            </div>

            {/* Middle Section: Central Search Bar (BMS Style) */}
            <div className="flex-1 hidden lg:flex max-w-2xl">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-[#F84464] transition-colors" />
                </div>
                <input
                  type="text"
                  value={headerSearchTerm}
                  onChange={(e) => setHeaderSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/events?q=${encodeURIComponent(headerSearchTerm)}`);
                    }
                  }}
                  placeholder="Search for Movies, Events, Plays, Sports and Activities"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-sm dark:text-white text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white/10 focus:border-white/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-6">
              {/* Location Display */}
              <div
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 nav-link font-bold text-sm cursor-pointer hover:text-[#F84464] transition-colors border-l border-white/10 pl-6 mr-2"
              >
                <MapPin size={16} className="text-[#F84464]" />
                <span>{currentCity}</span>
                <ChevronDown size={14} />
              </div>

              {/* Auth / Profile */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowOrganizerForm(true)}
                  className="hidden xl:flex items-center gap-2 px-4 py-2 border border-[#F84464] text-[#F84464] rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#F84464] hover:text-white transition-all group"
                >
                  <UserCheck size={14} className="group-hover:scale-110 transition-transform" />
                  Become an Organiser
                </button>

                {!user ? (
                  <Link to="/auth" className="hidden md:block nav-link font-bold text-sm hover:text-[#FFC107] transition-colors">
                    Login / Signup
                  </Link>
                ) : (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 rounded-full border border-white/10 hover:border-[#FFC107] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-black flex items-center justify-center font-black text-xs shadow-sm">
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    </button>
                    {isProfileOpen && (
                      <div className="absolute top-full right-0 mt-3 w-64 bg-[#0B0B0B] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/5 py-2 z-[200] overflow-hidden backdrop-blur-xl">
                        <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                          <p className="font-extrabold text-[15px] truncate text-white">{user.name}</p>
                          <p className="text-[11px] text-[#FFC107] font-bold uppercase tracking-widest mt-0.5">{user.role}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/my-tickets" className="flex items-center gap-3 px-5 py-2.5 text-gray-300 hover:bg-white/5 hover:text-[#FFC107] text-[14px] font-bold transition-colors">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                        </div>
                        <div className="border-t border-white/5 pt-2 pb-1">
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 text-red-500 hover:text-red-400 text-[13px] font-bold transition-colors">
                            <LogOut size={16} /> Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hamburger Menu */}
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-white hover:text-[#FFC107] transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals & Drawers */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={setCurrentCity}
        currentCity={currentCity}
      />

      <SideMenu
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        user={user}
      />


      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Footer - bookmyticket Style Recreation */}
      {
        config.footer.visible && (
          <footer className="bg-[var(--bg-footer)] text-white pt-20 pb-10 font-sans border-t border-white/5 relative overflow-hidden">
            <div className="max-w-[1440px] w-[95%] mx-auto relative z-10">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">

                {/* Column 1: Logo & Mission */}
                <div className="space-y-6">
                  <Logo className="mb-4" />
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    bookmyticket is your one-stop destination for all things entertainment. From the latest movies to exclusive workshops and live events, we bring the best experiences to your fingertips.
                  </p>
                  <div className="flex gap-4">
                    <div className="h-12 w-auto bg-white/5 rounded-lg border border-white/10 flex items-center justify-center px-4">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#FFC107]">Top Training</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-6">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest border-l-2 border-[#F84464] pl-3">Quick Links</h4>
                  <ul className="space-y-3">
                    <li><Link to="/" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">Home</Link></li>
                    <li><Link to="/events/all" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">All Events</Link></li>
                    <li><Link to="/about" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">About Us</Link></li>
                    <li><Link to="/careers" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">Careers</Link></li>
                  </ul>
                </div>

                {/* Column 3: Help & Support */}
                <div className="space-y-6">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest border-l-2 border-[#F84464] pl-3">Help & Support</h4>
                  <ul className="space-y-3">
                    <li><Link to="/faq" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">FAQs</Link></li>
                    <li><Link to="/sitemap" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">Sitemap</Link></li>
                    <li><Link to="/terms" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/support" className="text-gray-400 hover:text-[#F84464] text-sm transition-colors">Customer Care</Link></li>
                  </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div className="space-y-6">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest border-l-2 border-[#FFC107] pl-3">Subscribe For Latest News</h4>
                  <p className="text-gray-400 text-sm">Be the first to know about new courses and offers.</p>
                  <form className="relative group max-w-sm" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-sm outline-none focus:border-[#FFC107] transition-all"
                    />
                    <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#FFC107] text-black px-4 rounded-md hover:bg-[#E6AD00] transition-colors flex items-center justify-center">
                      <Send size={18} />
                    </button>
                  </form>
                </div>

              </div>

              {/* Sub Footer: Social & Legal */}
              <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Social Links */}
                <div className="flex gap-6 text-gray-500">
                  <Twitter size={18} className="hover:text-white cursor-pointer transition-colors" />
                  <Facebook size={18} className="hover:text-white cursor-pointer transition-colors" />
                  <Instagram size={18} className="hover:text-white cursor-pointer transition-colors" />
                  <Linkedin size={18} className="hover:text-white cursor-pointer transition-colors" />
                </div>

                {/* Legal / Copyright */}
                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <Link to="/corporate" className="hover:text-[#FFC107] transition-colors">Corporate Website</Link>
                  <Link to="/blog" className="hover:text-[#FFC107] transition-colors">Blog</Link>
                  <Link to="/terms" className="hover:text-[#FFC107] transition-colors">Terms of Use</Link>
                  <span className="text-gray-600">Copyright &copy; 2026 bookmyticket</span>
                </div>
              </div>

            </div>

            {/* Background Decorative Element */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFC107]/5 rounded-full blur-[150px] pointer-events-none"></div>
          </footer>
        )
      }
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Organizer Request Modal */}
      {
        showOrganizerForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOrganizerForm(false)}></div>
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <OrganizerRequestForm onClose={() => setShowOrganizerForm(false)} />
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Layout;
