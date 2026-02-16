import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { User } from '../types';
import {
  LayoutDashboard,
  CalendarRange,
  CalendarDays,
  CalendarSearch,
  CalendarX2,
  TicketPercent,
  ChevronRight,
  CreditCard,
  ScanLine,
  Headset,
  UserCog,
  KeyRound,
  LogOut,
  Search,
  PlusCircle,
  Globe,
  ChevronDown,
  LayoutGrid,
  ClipboardList,
  History,
  TicketCheck,
  TicketX,
  FileBarChart,
  MessageSquarePlus,
  Circle,
  Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OrganiserLayoutProps {
  user: User;
  setUser: (user: User | null) => void;
}

const menuBaseClasses =
  'flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-transparent';
const menuActiveClasses =
  'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border-white/10 backdrop-blur-xl scale-[1.02]';
const menuInactiveClasses =
  'text-white/40 hover:text-white/80 hover:bg-white/5 hover:border-white/5';

const OrganiserLayout: React.FC<OrganiserLayoutProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    event_mgmt: true,
    bookings: false,
    support: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex text-white relative font-inter ${currentLanguage.isRTL ? 'rtl' : 'ltr'}`}>
      {/* Absolute Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-[10000ms] scale-110 hover:scale-100"
        style={{ backgroundImage: `url('file:///home/raja/.gemini/antigravity/brain/6e645366-9b22-4abc-9ec9-a36d5dd0694f/premium_sidebar_bg_1771147469027.png')` }}
      />
      {/* Dark Overlay with subtle noise/gradient */}
      <div className="fixed inset-0 z-0 bg-[#050716]/90 backdrop-blur-3xl" />

      {/* Sidebar - Premium Glassmorphic Theme */}
      <aside className="w-80 relative flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-hidden group z-10 border-r border-white/5 bg-slate-900/40 backdrop-blur-2xl">
        {/* Animated Highlight Gradient */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Logo Section */}
        <div className="h-24 flex items-center px-10 flex-shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7209B7] to-[#FF006E] flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-3 border border-white/20">
              <Zap className="text-white w-6 h-6 -rotate-3" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter text-white leading-none uppercase">
                EVENTO<br /><span className="text-[9px] not-italic tracking-[0.3em] text-white/40 font-bold">ORGANISER</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-y border-white/5 flex-shrink-0 relative bg-white/5">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/search:text-white/60 transition-colors" />
            <input
              type="text"
              placeholder="Search Terminal..."
              className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-6 overflow-y-auto no-scrollbar relative">
          {/* Overview */}
          <div>
            <p className="px-4 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
              Overview
            </p>
            <NavLink
              to="/organiser/dashboard"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{t('dashboard')}</span>
            </NavLink>
          </div>

          {/* Event Management */}
          <div>
            <button
              onClick={() => toggleSection('event_mgmt')}
              className="w-full px-4 mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
            >
              <span>Event Management</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedSections.event_mgmt ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 mt-2 transition-all duration-300 overflow-hidden ${expandedSections.event_mgmt ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <NavLink
                to="/organiser/create"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('add_event')}</span>
              </NavLink>
              <NavLink
                to="/organiser/events/all"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses} pl-6`}
              >
                <Circle className="w-1 h-1 fill-current opacity-40 mr-2" />
                <span>All Events</span>
              </NavLink>
              <NavLink
                to="/organiser/events/venue"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses} pl-6`}
              >
                <Circle className="w-1 h-1 fill-current opacity-40 mr-2" />
                <span>Venue Events</span>
              </NavLink>
              <NavLink
                to="/organiser/events/online"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses} pl-6`}
              >
                <Circle className="w-1 h-1 fill-current opacity-40 mr-2" />
                <span>Online Events</span>
              </NavLink>
            </div>
          </div>

          {/* Event Bookings */}
          <div>
            <button
              onClick={() => toggleSection('bookings')}
              className="w-full px-4 mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
            >
              <span>Event Bookings</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedSections.bookings ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 mt-2 transition-all duration-300 overflow-hidden ${expandedSections.bookings ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <NavLink
                to="/organiser/bookings/all"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses} pl-6`}
              >
                <Circle className="w-1 h-1 fill-current opacity-40 mr-2" />
                <span>{t('all_bookings')}</span>
              </NavLink>
              <NavLink
                to="/organiser/bookings/completed"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses} pl-6`}
              >
                <Circle className="w-1 h-1 fill-current opacity-40 mr-2" />
                <span>Completed</span>
              </NavLink>
              <NavLink
                to="/organiser/bookings/report"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses} pl-6`}
              >
                <Circle className="w-1 h-1 fill-current opacity-40 mr-2" />
                <span>Analytics Report</span>
              </NavLink>
            </div>
          </div>

          {/* Finance & Tools */}
          <div className="space-y-1">
            <p className="px-4 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
              Finance
            </p>
            <NavLink
              to="/organiser/withdraw"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('withdraw')}</span>
            </NavLink>
            <NavLink
              to="/organiser/transactions"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <History className="w-4 h-4" />
              <span>{t('transactions')}</span>
            </NavLink>
          </div>

          {/* Support & Profile */}
          <div className="space-y-1">
            <p className="px-4 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
              Terminal Settings
            </p>
            <NavLink
              to="/organiser/profile"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <UserCog className="w-4 h-4" />
              <span>{t('edit_profile')}</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className={`${menuBaseClasses} text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 backdrop-blur-md w-full text-left transition-all italic`}
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-slate-900/20 backdrop-blur-2xl flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">
              {t('organiser_portal')}
            </p>
            <h1 className="text-xl font-black text-white italic">
              {t('welcome_back')}, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 pr-6 border-r border-white/10">
              <button
                onClick={() => navigate('/organiser/pwa-scanner')}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all group relative"
                title="PWA Scanner"
              >
                <ScanLine size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-[#050716]">2</span>
              </button>
              <button
                onClick={() => navigate('/organiser/support/all')}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-500/30 transition-all group"
                title="Support Tickets"
              >
                <Headset size={18} />
              </button>
            </div>

            <div className="flex items-center gap-5">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:border-white/30 transition-all text-white/60">
                  <span>{currentLanguage.flag}</span>
                  <span>{currentLanguage.name}</span>
                  <Globe size={14} className="text-white/20" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[200] overflow-hidden backdrop-blur-3xl">
                  <div className="max-h-64 overflow-y-auto py-2">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-[9px] font-black uppercase tracking-widest text-left hover:bg-white/5 transition-colors ${currentLanguage.code === lang.code ? 'text-[#FF006E] bg-white/5' : 'text-white/40'
                          }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden ring-4 ring-white/5 p-1 bg-white/5">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="profile" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganiserLayout;
