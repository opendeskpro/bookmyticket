import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { User } from '../types.ts';
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
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface OrganiserLayoutProps {
  user: User;
  setUser: (user: User | null) => void;
}

const menuBaseClasses =
  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300';
const menuActiveClasses =
  'bg-white text-[#050716] shadow-[0_0_20px_rgba(255,255,255,0.1)]';
const menuInactiveClasses =
  'text-slate-400 hover:bg-slate-800/30 hover:text-white';

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
    setUser(null);
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex bg-[#050716] text-slate-100 ${currentLanguage.isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <aside className="w-80 bg-[#080c1f] border-r border-slate-800/60 flex flex-col sticky top-0 h-screen overflow-hidden">
        {/* Logo Section */}
        <div className="h-24 flex items-center px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center rotate-3 shadow-lg shadow-cyan-500/20">
              <Zap className="text-white w-6 h-6 -rotate-3" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
                Book My<br />Ticket
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-transparent rounded-full mt-1" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-slate-800/60 flex-shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search Menu Here..."
              className="w-full bg-[#050716] border border-slate-800/60 rounded-xl pl-12 pr-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-200 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-cyan-400/30 focus:border-cyan-400/50 transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide">
          {/* Overview */}
          <div>
            <p className="px-4 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
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
              className="w-full px-4 mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
            >
              <span>Event Management</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedSections.event_mgmt ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 transition-all duration-300 overflow-hidden ${expandedSections.event_mgmt ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <NavLink
                to="/organiser/create"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('add_event')}</span>
              </NavLink>
              <NavLink
                to="/organiser/events/all"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>All Events</span>
              </NavLink>
              <NavLink
                to="/organiser/events/venue"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>Venue Events</span>
              </NavLink>
              <NavLink
                to="/organiser/events/online"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>Online Events</span>
              </NavLink>
            </div>
          </div>

          {/* Event Bookings */}
          <div>
            <button
              onClick={() => toggleSection('bookings')}
              className="w-full px-4 mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
            >
              <span>Event Bookings</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedSections.bookings ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 transition-all duration-300 overflow-hidden ${expandedSections.bookings ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <NavLink
                to="/organiser/bookings/all"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>{t('all_bookings')}</span>
              </NavLink>
              <NavLink
                to="/organiser/bookings/completed"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>Completed Bookings</span>
              </NavLink>
              <NavLink
                to="/organiser/bookings/pending"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>Pending Bookings</span>
              </NavLink>
              <NavLink
                to="/organiser/bookings/rejected"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>Rejected Bookings</span>
              </NavLink>
              <NavLink
                to="/organiser/bookings/report"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>Report</span>
              </NavLink>
            </div>
          </div>

          {/* Finance & Tools */}
          <div className="space-y-1">
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
            <NavLink
              to="/organiser/pwa-scanner"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <ScanLine className="w-4 h-4" />
              <span>{t('pwa_scanner')}</span>
            </NavLink>
          </div>

          {/* Support */}
          <div>
            <button
              onClick={() => toggleSection('support')}
              className="w-full px-4 mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
            >
              <span>Support Tickets</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedSections.support ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 transition-all duration-300 overflow-hidden ${expandedSections.support ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <NavLink
                to="/organiser/support/all"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <Circle className="w-2 h-2 ml-1 mr-1 fill-current" />
                <span>{t('all_tickets')}</span>
              </NavLink>
              <NavLink
                to="/organiser/support/add"
                className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Add Ticket</span>
              </NavLink>
            </div>
          </div>

          {/* Profile & Settings */}
          <div className="space-y-1">
            <NavLink
              to="/organiser/profile"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <UserCog className="w-4 h-4" />
              <span>{t('edit_profile')}</span>
            </NavLink>
            <NavLink
              to="/organiser/change-password"
              className={({ isActive }) => `${menuBaseClasses} ${isActive ? menuActiveClasses : menuInactiveClasses}`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{t('change_password')}</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className={`${menuBaseClasses} ${menuInactiveClasses} w-full text-left bg-red-500/5 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30`}
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-8 bg-[#080c1f] flex-shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {t('organiser_portal')}
            </p>
            <h1 className="text-lg font-semibold text-white">
              {t('welcome_back')}, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-[#050716] border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 transition-all text-slate-300">
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
                <Globe size={14} className="text-slate-500" />
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-[#080c1f] border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[200] overflow-hidden">
                <div className="max-h-64 overflow-y-auto py-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-left hover:bg-[#1b2140] transition-colors ${currentLanguage.code === lang.code ? 'text-amber-500 bg-[#1b2140]/50' : 'text-slate-400'
                        }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full border border-slate-800 overflow-hidden ring-2 ring-slate-800/50">
              <img src={`https://i.pravatar.cc/100?u=${user.id}`} alt="profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-[#050716] overflow-y-auto p-8 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganiserLayout;
