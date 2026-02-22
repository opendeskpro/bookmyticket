import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRole, AppState, User, TicketStatus, Event } from './types';
import { MOCK_EVENTS } from './constants/mockData';
import Layout from './components/Layout';
import { api } from './lib/api';
// Pages
import HomePage from './pages/Public/HomePage';
import EventDetailsPage from './pages/Public/EventDetailsPage';
import BookingPage from './pages/Public/BookingPage';
import GetAppPage from './pages/Public/GetAppPage';
import MyTicketsPage from './pages/Public/MyTicketsPage';
import RSVPPage from './pages/Public/RSVPPage';
import MoviesPage from './pages/Public/MoviesPage';
import RefundPolicyPage from './pages/Public/RefundPolicyPage';
import TermsPage from './pages/Public/TermsPage';
import OrganizerProfilePage from './pages/Public/OrganizerProfilePage';
import AllEventsPage from './pages/Public/AllEventsPage';
import ProfileSettingsPage from './pages/Public/ProfileSettingsPage';
import AuthPage from './pages/AuthPage';
import { getEvents, supabase } from './lib/supabase';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import ComingSoonPage from './pages/Public/ComingSoonPage';

import UserDashboard from './pages/User/UserDashboard';
import BrowseEvents from './pages/User/BrowseEvents';
import TicketView from './pages/User/TicketView';
import OrganizerSignup from './pages/Organizer/OrganizerSignup';
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import UserEventDetails from './pages/User/UserEventDetails';
import CreateEvent from './pages/Organizer/CreateEvent';
import AdminDashboard from './pages/Admin/AdminDashboard';
import KYCVerification from './pages/Organizer/KYCVerification';
import DashboardPlaceholder from './pages/Shared/DashboardPlaceholder';
import OrganizerEvents from './pages/Organizer/OrganizerEvents';
import WebCheckIn from './pages/Organizer/WebCheckIn';
import OrganizerWallet from './pages/Organizer/OrganizerWallet';
import OrganizerSettings from './pages/Organizer/OrganizerSettings';
import ManageUsers from './pages/Admin/ManageUsers';
import AdminApprovals from './pages/Admin/AdminApprovals';
import AdminWithdrawals from './pages/Admin/AdminWithdrawals';
import AdminSiteSettings from './pages/Admin/AdminSiteSettings';
import AdminEvents from './pages/Admin/AdminEvents';
import SystemSettings from './pages/Admin/SystemSettings';
import SEOInformation from './pages/Admin/SEOInformation';
import EmailTemplates from './pages/Admin/EmailTemplates';
import EditEmailTemplate from './pages/Admin/EditEmailTemplate';
import QRScanner from './pages/Admin/QRScanner';

// Helper component to handle global theme switching via URL
const URLThemeListener: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const isAuthPage = location.pathname.includes('/auth');
    const isRoot = location.pathname === '/';
    const isOrganizerPage = location.pathname.includes('/organizer');

    // Remove existing theme classes
    document.body.classList.remove('theme-dark', 'theme-light');

    // Apply new theme class - BMS Light is now the global default for public pages
    if (isAuthPage || isRoot) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.add('theme-dark');
    }

    // Smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    events: [],
    tickets: [],
    transactions: []
  });
  const [currentCity, setCurrentCity] = useState('Coimbatore');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Events
        const events = await getEvents();

        // 2. Check Session & Fetch User Profile
        const { data: { session } } = await supabase.auth.getSession();

        let userProfile = null;
        if (session?.user) {
          // Fetch profile including role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          userProfile = profile;
        }

        setAppState(prev => ({
          ...prev,
          events,
          user: userProfile
        }));

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (user: User | null) => {
    setAppState(prev => ({ ...prev, user }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Launching Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteConfigProvider>
          <HashRouter>
            <URLThemeListener />
            <Routes>
              {/* Public Routes with Main Layout */}
              <Route element={<Layout user={appState.user} setUser={setUser} currentCity={currentCity} setCurrentCity={setCurrentCity} />}>
                <Route path="/" element={<HomePage events={appState.events} currentCity={currentCity} setCurrentCity={setCurrentCity} />} />
                <Route path="/events" element={<BrowseEvents />} />
                <Route path="/get-app" element={<GetAppPage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/meeting-now" element={<ComingSoonPage />} />

                {/* User Portal */}
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/event/:id" element={<UserEventDetails />} />
                <Route path="/user/ticket/:id" element={<TicketView />} />
              </Route>

              {/* Organizer Portal */}
              <Route path="/organizer/signup" element={<OrganizerSignup />} />
              <Route path="/organizer/dashboard" element={<OrganizerDashboard user={appState.user} />} />
              <Route path="/organizer/create-event" element={<CreateEvent user={appState.user} />} />
              <Route path="/organizer/events" element={<OrganizerEvents />} />
              <Route path="/organizer/attendees" element={<WebCheckIn />} />
              <Route path="/organizer/wallet" element={<OrganizerWallet user={appState.user} />} />
              <Route path="/organizer/kyc" element={<KYCVerification />} />
              <Route path="/organizer/settings" element={<OrganizerSettings />} />

              {/* Admin Portal */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/approvals" element={<AdminApprovals />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/settings" element={<AdminSiteSettings />} />
              <Route path="/admin/system-settings" element={<SystemSettings />} />
              <Route path="/admin/seo-information" element={<SEOInformation />} />
              <Route path="/admin/email-templates" element={<EmailTemplates />} />
              <Route path="/admin/email-templates/edit/:id" element={<EditEmailTemplate />} />
              <Route path="/admin/qr-scanner" element={<QRScanner />} />

              <Route path="/auth" element={<AuthPage onAuth={setUser} />} />
              <Route path="/organiser/*" element={<Navigate to="/organizer/dashboard" replace />} />
            </Routes>
          </HashRouter>
        </SiteConfigProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
