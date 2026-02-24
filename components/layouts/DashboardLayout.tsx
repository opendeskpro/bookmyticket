import React, { useState } from 'react';
import Sidebar from '../Shared/Sidebar';
import Navbar from '../Shared/Navbar';
import { User, UserRole } from '../../types';
import { LayoutDashboard, Calendar, Users, Settings, PlusCircle, CreditCard, FileText, CheckCircle, Smartphone, ShoppingBag, Banknote, UserPlus, Layers, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Define nav items based on role
  const getNavItems = () => {
    if (user?.role === UserRole.ORGANISER) {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/organizer/dashboard' },
        { icon: PlusCircle, label: 'Create Event', path: '/organizer/choose-event-type' },
        { icon: Calendar, label: 'My Events', path: '/organizer/events' },
        { icon: ShoppingBag, label: 'Orders', path: '/organizer/orders' },
        { icon: Users, label: 'Attendees', path: '/organizer/attendees' },
        { icon: CreditCard, label: 'Wallet', path: '/organizer/wallet' },
        { icon: Banknote, label: 'Payouts', path: '/organizer/payouts' },
        { icon: CheckCircle, label: 'KYC Status', path: '/organizer/kyc' },
        { icon: Settings, label: 'Settings', path: '/organizer/settings' },
      ];
    }
    if (user?.role === UserRole.ADMIN) {
      return [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },

        // Operations Group
        {
          icon: Calendar,
          label: 'Operations',
          children: [
            { icon: Calendar, label: 'All Events', path: '/admin/events' },
            { icon: CheckCircle, label: 'Event Approvals', path: '/admin/approvals' },
            { icon: CreditCard, label: 'Withdrawal Requests', path: '/admin/withdrawals' },
          ]
        },

        // Management Group
        {
          icon: Users,
          label: 'Management',
          children: [
            { icon: Users, label: 'Manage Users', path: '/admin/users' },
            { icon: Users, label: 'Manage Organizers', path: '/admin/organizers' },
            { icon: UserPlus, label: 'Organiser Requests', path: '/admin/organizer-requests' },
          ]
        },

        // CMS & Content
        {
          icon: Layers,
          label: 'Content Management',
          children: [
            { icon: Layers, label: 'Homepage CMS', path: '/admin/cms' },
            { icon: FileText, label: 'Mail Templates', path: '/admin/email-templates' },
          ]
        },

        // Settings & Config
        {
          icon: Settings,
          label: 'System Settings',
          children: [
            { icon: Mail, label: 'Email Integration', path: '/admin/email-integration' },
            { icon: CreditCard, label: 'Payment Gateways', path: '/admin/payments' },
            { icon: CheckCircle, label: 'KYC Settings', path: '/admin/settings?tab=kyc' },
            { icon: Smartphone, label: 'PWA & QR Scanner', path: '/admin/qr-scanner' },
            { icon: FileText, label: 'General & Branding', path: '/admin/settings?tab=general' },
            { icon: ShoppingBag, label: 'Footer & Layout', path: '/admin/settings?tab=footer' },
          ]
        },
      ];
    }
    return [];
  };

  // Redirect if not authorized (simple check, normally handled by ProtectedRoute)
  React.useEffect(() => {
    if (!user || (user.role !== UserRole.ORGANISER && user.role !== UserRole.ADMIN)) {
      // navigate('/'); // Commented out for now to allow dev preview if manually navigating
    }
  }, [user, navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await api.auth.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('demo_user');
      navigate('/auth'); // Redirect to auth page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={user?.role || UserRole.USER}
        items={getNavItems()}
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        <main className="flex-1 overflow-x-hidden p-6 animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
