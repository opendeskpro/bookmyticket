import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRole, AppState, User, TicketStatus, Event } from './types';
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
import { getEvents, getUserBookings, supabase } from './lib/supabase';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
// import ComingSoonPage from './pages/Public/ComingSoonPage';

import UserDashboard from './pages/User/UserDashboard';
import BrowseEvents from './pages/User/BrowseEvents';
import TicketView from './pages/User/TicketView';
import OrganizerSignup from './pages/Organizer/OrganizerSignup';
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import UserEventDetails from './pages/User/UserEventDetails';
import CreateEvent from './pages/Organizer/CreateEvent';
import ChooseEventType from './pages/Organizer/ChooseEventType';
import AdminDashboard from './pages/Admin/AdminDashboard';
import KYCVerification from './pages/Organizer/KYCVerification';
import DashboardPlaceholder from './pages/Shared/DashboardPlaceholder';
import OrganizerEvents from './pages/Organizer/OrganizerEvents';
import WebCheckIn from './pages/Organizer/WebCheckIn';
import OrganizerWallet from './pages/Organizer/OrganizerWallet';
import OrganizerSettings from './pages/Organizer/OrganizerSettings';
import ManageUsers from './pages/Admin/ManageUsers';
import AdminApprovals from './pages/Admin/AdminApprovals';
import OrganizerRequests from './pages/Admin/OrganizerRequests';
import AdminWithdrawals from './pages/Admin/AdminWithdrawals';
import AdminSiteSettings from './pages/Admin/AdminSiteSettings';
import AdminEvents from './pages/Admin/AdminEvents';
import SystemSettings from './pages/Admin/SystemSettings';
import SEOInformation from './pages/Admin/SEOInformation';
import EmailTemplates from './pages/Admin/EmailTemplates';
import EditEmailTemplate from './pages/Admin/EditEmailTemplate';
import QRScanner from './pages/Admin/QRScanner';
import AdminCMS from './pages/Admin/AdminCMS';
import OrganizerBookings from './pages/Organizer/OrganizerBookings';
import OrganizerPayouts from './pages/Organizer/OrganizerPayouts';
import ManageOrganizers from './pages/Admin/ManageOrganizers';
import PaymentSettings from './pages/Admin/PaymentSettings';
import EmailIntegration from './pages/Admin/EmailIntegration';

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
  const userRef = useRef<User | null>(null);

  const fetchInitialData = async () => {
    try {
      // Define timeoutPromise once, as it's used for both events and session
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Operation timed out")), 30000)
      );

      console.log("🔍 Fetching events...");
      const eventsPromise = getEvents();
      const events = await Promise.race([eventsPromise, timeoutPromise])
        .catch(err => {
          console.warn("⚠️ getEvents failed or timed out:", err);
          return [];
        }) as Event[];
      console.log("🔍 Events processed:", events?.length);

      // 2. Check Session & Fetch User Profile
      console.log("🔍 Getting session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ Session error:", sessionError);
      }

      console.log("🔍 Session retrieved:", !!session, session?.user?.email);

      let userProfile = null;
      if (session?.user) {
        console.log("🔍 Fetching profile for ID:", session.user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("❌ Profile fetch error:", profileError);
        }

        // Force ADMIN role for specific email
        if (session.user.email === 'v.raja2mail@gmail.com') {
          console.log("💎 Forced ADMIN role for:", session.user.email);
          userProfile = {
            id: session.user.id,
            email: session.user.email,
            role: 'ADMIN' as any,
            full_name: profile?.full_name || 'Admin User',
            name: profile?.full_name || 'Admin'
          };
        } else {
          userProfile = profile ? {
            ...profile,
            name: profile.full_name || profile.name || 'User'
          } : null;
        }
      }

      // 3. If logged in, fetch user bookings
      let userBookings = [];
      if (session?.user) {
        console.log("🔍 Fetching user bookings...");
        const bookingsPromise = getUserBookings();
        userBookings = await Promise.race([bookingsPromise, timeoutPromise])
          .catch(() => []) as any[];
      }

      setAppState(prev => ({
        ...prev,
        events,
        user: userProfile,
        tickets: userBookings as any
      }));

      return events; // Return fetched events
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    console.log("🚀 App initialized - Setting up data & auth");
    fetchInitialData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔍 Auth state change:", _event, session?.user?.id);

      let currentUser = userRef.current;

      if (session?.user) {
        if (currentUser?.id === session.user.id) {
          console.log("🔍 Auth session unchanged, skipping update");
          return;
        }

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          let mappedUser = null;
          if (session.user.email === 'v.raja2mail@gmail.com') {
            console.log("💎 Forced auth-change ADMIN fallback for:", session.user.email);
            mappedUser = {
              id: session.user.id,
              email: session.user.email,
              role: 'ADMIN' as any,
              full_name: profile?.full_name || 'Admin User',
              name: profile?.full_name || 'Admin'
            };
          } else if (profile) {
            mappedUser = {
              ...profile,
              name: profile.full_name || profile.name || 'User'
            };
          }

          setUser(mappedUser);
        } catch (err) {
          console.error("❌ Error fetching profile on auth change:", err);
        }
      } else {
        if (currentUser !== null) {
          setUser(null);
        }
      }
    });

    return () => {
      console.log("🧹 App unmounting - cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (user: User | null) => {
    userRef.current = user;
    setAppState(prev => ({ ...prev, user }));
  };

  console.log("💎 App Render - loading:", loading);

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
                <Route path="/events" element={<BrowseEvents events={appState.events} />} />
                <Route path="/get-app" element={<GetAppPage />} />
                <Route path="/movies" element={<MoviesPage />} />


                {/* User Portal */}
                <Route path="/user/dashboard" element={<UserDashboard events={appState.events} tickets={appState.tickets} />} />
                <Route path="/user/event/:id" element={<UserEventDetails />} />
                <Route path="/user/ticket/:id" element={<TicketView />} />
              </Route>

              {/* Organizer Portal */}
              <Route path="/organizer/signup" element={<OrganizerSignup />} />
              <Route path="/organizer/dashboard" element={<OrganizerDashboard user={appState.user} />} />
              <Route path="/organizer/choose-event-type" element={<ChooseEventType user={appState.user} />} />
              <Route path="/organizer/create-event" element={<CreateEvent user={appState.user} onRefreshEvents={fetchInitialData} />} />
              <Route path="/organizer/events" element={<OrganizerEvents user={appState.user} />} />
              <Route path="/organizer/orders" element={<OrganizerBookings user={appState.user} />} />
              <Route path="/organizer/attendees" element={<WebCheckIn user={appState.user} />} />
              <Route path="/organizer/wallet" element={<OrganizerWallet user={appState.user} />} />
              <Route path="/organizer/payouts" element={<OrganizerPayouts user={appState.user} />} />
              <Route path="/organizer/kyc" element={<KYCVerification user={appState.user} />} />
              <Route path="/organizer/settings" element={<OrganizerSettings user={appState.user} />} />

              {/* Admin Portal */}
              <Route path="/admin/dashboard" element={<AdminDashboard user={appState.user} />} />
              <Route path="/admin/users" element={<ManageUsers user={appState.user} />} />
              <Route path="/admin/approvals" element={<AdminApprovals user={appState.user} />} />
              <Route path="/admin/organizer-requests" element={<OrganizerRequests />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals user={appState.user} />} />
              <Route path="/admin/events" element={<AdminEvents user={appState.user} />} />
              <Route path="/admin/settings" element={<AdminSiteSettings user={appState.user} />} />
              <Route path="/admin/system-settings" element={<SystemSettings user={appState.user} />} />
              <Route path="/admin/seo-information" element={<SEOInformation user={appState.user} />} />
              <Route path="/admin/email-templates" element={<EmailTemplates user={appState.user} />} />
              <Route path="/admin/edit-email-template/:id" element={<EditEmailTemplate user={appState.user} />} />
              <Route path="/admin/qr-scanner" element={<QRScanner user={appState.user} />} />
              <Route path="/admin/cms" element={<AdminCMS />} />
              <Route path="/admin/organizers" element={<ManageOrganizers user={appState.user} />} />
              <Route path="/admin/payments" element={<PaymentSettings user={appState.user} />} />
              <Route path="/admin/email-integration" element={<EmailIntegration user={appState.user} />} />

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
