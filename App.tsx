import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRole, AppState, User, TicketStatus, Event } from './types';
import { MOCK_EVENTS } from './constants';
import Layout from './components/Layout';
import OrganiserLayout from './components/OrganiserLayout';
import { api } from './lib/api';

// Pages
import HomePage from './pages/Public/HomePage';
import EventDetailsPage from './pages/Public/EventDetailsPage';
import BookingPage from './pages/Public/BookingPage';
import MyTicketsPage from './pages/Public/MyTicketsPage';
import RSVPPage from './pages/Public/RSVPPage';
import MoviesPage from './pages/Public/MoviesPage';
import RefundPolicyPage from './pages/Public/RefundPolicyPage';
import TermsPage from './pages/Public/TermsPage';
import OrganizerProfilePage from './pages/Public/OrganizerProfilePage';
import ProfileSettingsPage from './pages/Public/ProfileSettingsPage';
import AuthPage from './pages/AuthPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MenuBuilder from './pages/Admin/MenuBuilder';
import BookingList from './pages/Admin/Bookings/BookingList';
import OrganiserDashboard from './pages/Organiser/OrganiserDashboard';
import CreateEventPage from './pages/Organiser/CreateEventPage';
import KYCPage from './pages/Organiser/KYCPage';
import BecomeOrganizerPage from './pages/Organiser/BecomeOrganizerPage';
import { AllEventsPage, VenueEventsPage, OnlineEventsPage } from './pages/Organiser/OrganiserEventsPages';
import { AllBookingsPage, CompletedBookingsPage, PendingBookingsPage, RejectedBookingsPage, BookingsReportPage } from './pages/Organiser/OrganiserBookingsPages';
import { WithdrawPage, TransactionsPage, PwaScannerPage, SupportTicketsListPage, SupportTicketsAddPage, OrganiserProfilePage as OrganiserProfileSettingsPage, ChangePasswordPage } from './pages/Organiser/OrganiserFinanceAndToolsPages';
import InvoicePage from './pages/Admin/Bookings/InvoicePage';
import BookingReport from './pages/Admin/Bookings/BookingReport';
import WithdrawMethods from './pages/Admin/Withdraw/WithdrawMethods';
import ManageWithdrawForm from './pages/Admin/Withdraw/ManageWithdrawForm';
import WithdrawRequests from './pages/Admin/Withdraw/WithdrawRequests';
import Transactions from './pages/Admin/Transactions';
import OrganizerSettings from './pages/Admin/Organizer/OrganizerSettings';
import RegisteredOrganizers from './pages/Admin/Organizer/RegisteredOrganizers';
import AddOrganizer from './pages/Admin/Organizer/AddOrganizer';
import SupportSettings from './pages/Admin/Support/SupportSettings';
import TicketList from './pages/Admin/Support/TicketList';
import TicketDetails from './pages/Admin/Support/TicketDetails';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null; requireRole?: UserRole | UserRole[] }> = ({ children, user, requireRole }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!roles.includes(user.role) && user.role !== UserRole.ADMIN) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    events: MOCK_EVENTS,
    tickets: [],
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      let currentUser: User | null = null;

      if (token) {
        try {
          const user = await api.auth.me();
          if (user) {
            currentUser = user;
            setAppState(prev => ({ ...prev, user }));
          }
        } catch (authErr) {
          console.warn("Auth initialization issue:", authErr);
          localStorage.removeItem('token');
        }
      } else {
        // Check for persisted demo user
        const savedDemoUser = localStorage.getItem('demo_user');
        if (savedDemoUser) {
          try {
            const user = JSON.parse(savedDemoUser);
            setAppState(prev => ({ ...prev, user }));
          } catch (e) {
            localStorage.removeItem('demo_user');
          }
        }
      }

      try {
        const dbEvents = await api.events.list();
        if (dbEvents && dbEvents.length > 0) {
          setAppState(prev => ({
            ...prev,
            events: [...dbEvents, ...MOCK_EVENTS.filter(me => !dbEvents.some(de => String(de.id) === String(me.id)))]
          }));
        }
      } catch (dbErr) {
        console.warn("Using mock events fallback:", dbErr);
      }

      setLoading(false);
    };

    initializeApp();
  }, []);

  const setUser = (user: User | null) => {
    setAppState(prev => ({ ...prev, user }));
  };

  const bookTicket = (ticket: any) => {
    setAppState(prev => ({ ...prev, tickets: [ticket, ...prev.tickets] }));
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
        <HashRouter>
          <Routes>
            {/* Public & shared layout */}
            <Route element={<Layout user={appState.user} setUser={setUser} />}>
              <Route path="/" element={<HomePage events={appState.events} />} />
              <Route path="/rsvp" element={<RSVPPage events={appState.events} user={appState.user} />} />
              <Route path="/settings" element={<ProtectedRoute user={appState.user}><ProfileSettingsPage user={appState.user!} onUpdate={(updated) => setUser({ ...appState.user!, ...updated })} /></ProtectedRoute>} />
              <Route path="/event/:id" element={<EventDetailsPage events={appState.events} user={appState.user} />} />
              <Route path="/book/:eventId" element={<ProtectedRoute user={appState.user}><BookingPage events={appState.events} user={appState.user!} onBook={bookTicket} /></ProtectedRoute>} />
              <Route path="/my-tickets" element={<ProtectedRoute user={appState.user}><MyTicketsPage tickets={appState.tickets} user={appState.user!} /></ProtectedRoute>} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/organizer/:id" element={<OrganizerProfilePage events={appState.events} />} />
              <Route path="/become-organizer" element={<BecomeOrganizerPage />} />
              <Route path="/organiser/kyc" element={<ProtectedRoute user={appState.user}><KYCPage user={appState.user!} /></ProtectedRoute>} />
            </Route>

            {/* Admin Routes - Nested under AdminLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={appState.user} requireRole={UserRole.ADMIN}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard events={appState.events} />} />
              <Route path="menu-builder" element={<MenuBuilder />} />
              <Route path="bookings" element={<BookingList status="all" />} />
              <Route path="bookings/completed" element={<BookingList status="completed" />} />
              <Route path="bookings/pending" element={<BookingList status="pending" />} />
              <Route path="bookings/rejected" element={<BookingList status="rejected" />} />
              <Route path="bookings/report" element={<BookingReport />} />
              <Route path="withdraw/payment-methods" element={<WithdrawMethods />} />
              <Route path="withdraw/requests" element={<WithdrawRequests />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="withdraw/manage-form/:id" element={<ManageWithdrawForm />} />
              <Route path="organizers" element={<RegisteredOrganizers />} />
              <Route path="organizers/add" element={<AddOrganizer />} />
              <Route path="organizers/settings" element={<OrganizerSettings />} />
              <Route path="support" element={<TicketList filter="all" />} />
              <Route path="support/all" element={<TicketList filter="all" />} />
              <Route path="support/pending" element={<TicketList filter="pending" />} />
              <Route path="support/open" element={<TicketList filter="open" />} />
              <Route path="support/closed" element={<TicketList filter="closed" />} />
              <Route path="support/ticket/:id" element={<TicketDetails />} />
              <Route path="support/settings" element={<SupportSettings />} />
            </Route>
            <Route path="/admin/bookings/invoice/:id" element={
              <ProtectedRoute user={appState.user} requireRole={UserRole.ADMIN}>
                <InvoicePage />
              </ProtectedRoute>
            } />

            {/* Organiser portal with its own layout */}
            <Route
              path="/organiser"
              element={
                <ProtectedRoute user={appState.user} requireRole={UserRole.ORGANISER}>
                  <OrganiserLayout user={appState.user!} setUser={setUser} />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<OrganiserDashboard user={appState.user!} events={appState.events} />} />
              <Route path="create" element={<CreateEventPage user={appState.user!} onAdd={() => { }} onVerifyUser={() => { }} />} />
              <Route path="events/all" element={<AllEventsPage events={appState.events} />} />
              <Route path="events/venue" element={<VenueEventsPage events={appState.events} />} />
              <Route path="events/online" element={<OnlineEventsPage events={appState.events} />} />
              <Route path="bookings/all" element={<AllBookingsPage />} />
              <Route path="bookings/completed" element={<CompletedBookingsPage />} />
              <Route path="bookings/pending" element={<PendingBookingsPage />} />
              <Route path="bookings/rejected" element={<RejectedBookingsPage />} />
              <Route path="bookings/report" element={<BookingsReportPage />} />
              <Route path="withdraw" element={<WithdrawPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="pwa-scanner" element={<PwaScannerPage />} />
              <Route path="support" element={<SupportTicketsListPage />} />
              <Route path="support/all" element={<SupportTicketsListPage />} />
              <Route path="support/add" element={<SupportTicketsAddPage />} />
              <Route path="profile" element={<OrganiserProfileSettingsPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>

            <Route path="/auth" element={<AuthPage onAuth={setUser} />} />
          </Routes>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
