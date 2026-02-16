import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import {
    LayoutDashboard, Ticket, Briefcase, UserCircle, Headset, Layout,
    FileSearch, MessageSquare, HelpCircle, MapPin, ImageIcon, Bell,
    CreditCard as PaymentIcon, Settings2, Smartphone, SearchCode, Monitor,
    Lock as SecurityIcon, Zap, ChevronDown, ChevronRight, Menu, Sun, Moon,
    Search, History, CreditCard, Speaker, LogOut
} from 'lucide-react';

interface SidebarItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    url?: string;
    subItems?: SidebarItem[];
}

const AdminLayout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['EVENT_MGMT', 'EVENT_BKG']);
    const [menuSearch, setMenuSearch] = useState('');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('demo_user');
        navigate('/');
        window.location.reload(); // Force refresh to clear all states
    };

    // Sidebar items mapping
    const menuItems: SidebarItem[] = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={18} />, url: '/admin/dashboard' },
        { id: 'MENU_BUILDER', label: 'Menu Builder', icon: <Menu size={18} />, url: '/admin/menu-builder' },
        {
            id: 'EVENT_MGMT',
            label: 'Event Management',
            icon: <Ticket size={18} />,
            subItems: [
                {
                    id: 'EVENT_SPECS',
                    label: 'Event Specifications',
                    subItems: [
                        { id: 'SETTINGS', label: 'Settings' },
                        { id: 'CATEGORIES', label: 'Categories' },
                        { id: 'COUNTRIES', label: 'Countries' },
                        { id: 'STATES', label: 'States' },
                        { id: 'CITIES', label: 'Cities' },
                    ]
                },
                {
                    id: 'EVENT_MGMT_SUB',
                    label: 'Event Management',
                    subItems: [
                        { id: 'ADD_EVENT', label: 'Add Event' },
                        { id: 'ALL_EVENTS', label: 'All Events' },
                        { id: 'VENUE_EVENTS', label: 'Venue Events' },
                        { id: 'ONLINE_EVENTS', label: 'Online Events' },
                    ]
                },
            ]
        },
        {
            id: 'EVENT_BKG',
            label: 'Event Bookings',
            icon: <Ticket size={18} />,
            subItems: [
                {
                    id: 'BKG_SETTINGS',
                    label: 'Settings',
                    subItems: [
                        { id: 'BKG_PREFERENCE', label: 'Preference' },
                        { id: 'BKG_COUPONS', label: 'Coupons' },
                        { id: 'BKG_TAX', label: 'Tax & Commission' }
                    ]
                },
                { id: 'ALL_BOOKINGS', label: 'All Bookings', url: '/admin/bookings' },
                { id: 'COMPLETED_BOOKINGS', label: 'Completed Bookings', url: '/admin/bookings/completed' },
                { id: 'PENDING_BOOKINGS', label: 'Pending Bookings', url: '/admin/bookings/pending' },
                { id: 'REJECTED_BOOKINGS', label: 'Rejected Bookings', url: '/admin/bookings/rejected' },
                { id: 'BOOKING_REPORT', label: 'Report', url: '/admin/bookings/report' }
            ]
        },
        {
            id: 'WITHDRAW',
            label: 'Withdraw Method',
            icon: <CreditCard size={18} />,
            subItems: [
                { id: 'PAYMENT_METHODS', label: 'Payment Methods', url: '/admin/withdraw/payment-methods' },
                { id: 'WITHDRAW_REQ', label: 'Requests', url: '/admin/withdraw/requests' }
            ]
        },
        { id: 'TRANSACTIONS', label: 'Transactions', icon: <History size={18} />, url: '/admin/transactions' },
        {
            id: 'ORG_MGMT',
            label: 'Organizers Management',
            icon: <Briefcase size={18} />,
            subItems: [
                { id: 'ORG_SETTINGS', label: 'Settings', url: '/admin/organizers/settings' },
                { id: 'REGISTERED_ORG', label: 'Registered Organizers', url: '/admin/organizers' },
                { id: 'ADD_ORG', label: 'Add Organizer', url: '/admin/organizers/add' }
            ]
        },
        {
            id: 'CUST_MGMT',
            label: 'Customers Management',
            icon: <UserCircle size={18} />,
            subItems: [
                { id: 'REG_USERS', label: 'Registered Users' }
            ]
        },
        {
            id: 'SUPPORT_TICKETS',
            label: 'Support Tickets',
            icon: <Headset size={18} />,
            subItems: [
                { id: 'SUPPORT_SETTINGS', label: 'Settings', url: '/admin/support/settings' },
                { id: 'ALL_TICKETS', label: 'All Tickets', url: '/admin/support/all' },
                { id: 'PENDING_TICKETS', label: 'Pending Ticket', url: '/admin/support/pending' },
                { id: 'OPEN_TICKETS', label: 'Open Ticket', url: '/admin/support/open' },
                { id: 'CLOSED_TICKETS', label: 'Closed Ticket', url: '/admin/support/closed' },
            ]
        },

        { id: 'HOME_PAGE', label: 'Home Page', icon: <Layout size={18} /> },
        { id: 'FOOTER', label: 'Footer', icon: <FileSearch size={18} /> },
        { id: 'CUSTOM_PAGES', label: 'Custom Pages', icon: <Speaker size={18} /> },
        { id: 'BLOG_MGMT', label: 'Blog Management', icon: <MessageSquare size={18} /> },
        { id: 'FAQ_MGMT', label: 'FAQ Management', icon: <HelpCircle size={18} /> },
        { id: 'CONTACT_PAGE', label: 'Contact Page', icon: <MapPin size={18} /> },
        { id: 'ADS', label: 'Ads', icon: <ImageIcon size={18} /> },
        { id: 'PUSH_NOTIF', label: 'Push Notification', icon: <Bell size={18} /> },
        { id: 'PAYMENT_GW', label: 'Payment Gateways', icon: <PaymentIcon size={18} /> },
        { id: 'BASIC_SETTINGS', label: 'Basic Settings', icon: <Settings2 size={18} /> },
        { id: 'PWA_SETTINGS', label: 'PWA Settings', icon: <Smartphone size={18} /> },
        { id: 'PWA_SCANNER', label: 'Pwa Scanner', icon: <SearchCode size={18} /> },
        { id: 'MOBILE_INT', label: 'Mobile Interface', icon: <Monitor size={18} /> },
        { id: 'ADMIN_MGMT', label: 'Admin Management', icon: <SecurityIcon size={18} /> },
    ];

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/details') || path.includes('/invoice')) return 'EVENT_BOOKINGS';
        if (path.includes('/bookings')) return 'ALL_BOOKINGS';
        if (path.includes('/dashboard')) return 'DASHBOARD';
        if (path.includes('/menu-builder')) return 'MENU_BUILDER';
        return 'DASHBOARD';
    };

    const handleItemClick = (item: SidebarItem) => {
        if (item.subItems) {
            setExpandedMenus(prev =>
                prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
            );
        } else if (item.url) {
            navigate(item.url);
        }
    };

    const renderSidebarItem = (item: SidebarItem, depth = 0) => {
        const isExpanded = expandedMenus.includes(item.id);
        const activeTab = getActiveTab();
        const isActive = activeTab === item.id;
        const hasChildren = item.subItems && item.subItems.length > 0;
        const paddingLeft = 16 + (depth * 12);

        return (
            <div key={item.id}>
                <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between py-3 pr-4 transition-all group ${isActive
                        ? theme === 'dark'
                            ? 'bg-white text-[#131922] shadow-[0_8px_20px_rgba(255,255,255,0.1)]'
                            : 'bg-[#3A86FF] text-white shadow-lg shadow-blue-500/30'
                        : theme === 'dark'
                            ? 'text-white/60 hover:text-white hover:bg-white/5'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        } ${depth === 0 ? 'rounded-xl mb-1' : 'text-[11px] font-bold tracking-widest uppercase border-l border-white/5'}`}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                >
                    <div className="flex items-center gap-3">
                        {item.icon && (
                            <div className={`${isActive ? (theme === 'dark' ? 'text-[#131922]' : 'text-white') : (theme === 'dark' ? 'text-white/30 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600')} transition-colors`}>
                                {item.icon}
                            </div>
                        )}
                        <span className={`${depth === 0 ? 'text-[11px] font-bold tracking-tight uppercase' : ''}`}>{item.label}</span>
                    </div>
                    {hasChildren && (
                        <ChevronRight size={14} className={`opacity-40 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    )}
                </button>

                {/* Recursive Children */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.subItems && item.subItems.map(sub => renderSidebarItem(sub, depth + 1))}
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0c1017] text-white' : 'bg-gray-50 text-slate-900'} flex font-inter overflow-hidden transition-colors duration-300`}>

            {/* Sidebar */}
            <aside className={`w-[280px] flex-shrink-0 ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'} border-r flex flex-col h-screen z-[100] shadow-2xl transition-colors duration-300`}>
                {/* Branding */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#38bdf8]/20">
                        <Zap className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Evento</h1>
                </div>

                {/* Profile */}
                <div className="relative">
                    <div
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className={`px-6 py-4 flex items-center gap-3 border-b ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'} transition-colors cursor-pointer group`}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                            <img src="https://i.pravatar.cc/100?u=fahad" className="w-full h-full object-cover" alt="Profile" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate group-hover:text-[#38bdf8] transition-colors">Fahad</p>
                            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Super Admin</p>
                        </div>
                        <ChevronDown size={14} className={`text-white/20 group-hover:text-white transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isProfileMenuOpen && (
                        <div className={`absolute top-full left-6 right-6 mt-2 rounded-xl shadow-2xl z-50 overflow-hidden border animate-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1e2736] border-white/10' : 'bg-white border-slate-200'}`}>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <input
                            type="text"
                            placeholder="Search Menu Here.."
                            className={`w-full ${theme === 'dark' ? 'bg-[#1e2736] border-white/5 text-white/70 placeholder:text-white/20' : 'bg-slate-100 border-slate-200 text-slate-700 placeholder:text-slate-400'} border rounded-lg pl-9 pr-4 py-2.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all`}
                            value={menuSearch}
                            onChange={(e) => setMenuSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                    {menuItems.map((item) => renderSidebarItem(item))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-center">Copyright ©2026. All Rights Reserved.</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className={`h-16 flex-shrink-0 ${theme === 'dark' ? 'bg-[#0c1017] border-white/5' : 'bg-white border-slate-200'} border-b flex items-center justify-between px-10 relative z-50 transition-colors duration-300`}>
                    <div className="flex items-center gap-4">
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Menu size={20} />
                        </button>
                        <div className="h-6 w-px bg-white/5" />
                        <h2 className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">{getActiveTab().replace(/_/g, ' ')}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === 'light' ? 'bg-[#FFB703]/20 text-[#FFB703] shadow-lg shadow-[#FFB703]/10' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Sun size={14} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-[#3A86FF]/20 text-[#3A86FF] shadow-lg shadow-[#3A86FF]/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                        >
                            <Moon size={14} />
                        </button>
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                            <img src="https://i.pravatar.cc/100?u=fahad" className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    </div>
                </header>

                {/* Outlet for children */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
