import React, { useState } from 'react';
import Sidebar from '../Shared/Sidebar';
import Navbar from '../Shared/Navbar';
import { User, UserRole } from '../../types';
import { LayoutDashboard, Calendar, Users, Settings, PlusCircle, CreditCard, FileText, CheckCircle, Smartphone } from 'lucide-react';
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
        { icon: PlusCircle, label: 'Create Event', path: '/organizer/create-event' },
        { icon: Calendar, label: 'My Events', path: '/organizer/events' },
        { icon: Users, label: 'Attendees', path: '/organizer/attendees' },
        { icon: CreditCard, label: 'Wallet', path: '/organizer/wallet' },
        { icon: CheckCircle, label: 'KYC Status', path: '/organizer/kyc' },
        { icon: Settings, label: 'Settings', path: '/organizer/settings' },
      ];
    }
    if (user?.role === UserRole.ADMIN) {
      return [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },

        // Basic Settings Group
        {
          icon: Settings,
          label: 'Basic Settings',
          children: [
            { icon: FileText, label: 'General Settings', path: '/admin/settings' }, // Reusing system settings as general
            {
              icon: FileText,
              label: 'Email Settings',
              children: [
                { icon: FileText, label: 'Mail From Admin', path: '#' },
                { icon: FileText, label: 'Mail To Admin', path: '#' },
                { icon: FileText, label: 'Mail Templates', path: '/admin/email-templates' },
              ]
            }
          ]
        },

        // PWA Settings Group
        {
          icon: CreditCard, // Using generic icon for now
          label: 'PWA Settings',
          children: [
            { icon: FileText, label: 'PWA Scanner Setting', path: '/admin/qr-scanner' }
          ]
        },

        { icon: Users, label: 'Manage Users', path: '/admin/users' },
        { icon: CheckCircle, label: 'Approvals', path: '/admin/approvals' },
        { icon: CreditCard, label: 'Withdrawals', path: '/admin/withdrawals' },
        { icon: Calendar, label: 'All Events', path: '/admin/events' },
        {
          icon: Settings,
          label: 'Site Settings',
          path: '/admin/settings',
          children: [
            { icon: FileText, label: 'General & Branding', path: '/admin/settings?tab=general' },
            { icon: FileText, label: 'Footer Management', path: '/admin/settings?tab=footer' },
            { icon: Smartphone, label: 'Mobile Bottom Menu', path: '/admin/settings?tab=mobile' },
            { icon: FileText, label: 'Movie API Safe', path: '/admin/settings?tab=movie_api' },
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
