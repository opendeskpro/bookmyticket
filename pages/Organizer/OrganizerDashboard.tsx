import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User, UserRole } from '../../types';
import { AreaChart, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { getOrganizerStats } from '../../lib/supabase';

interface OrganizerDashboardProps {
    user: User | null;
}

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({ totalEvents: 0, ticketsSold: 0, totalRevenue: 0 });
    const [loadingStats, setLoadingStats] = React.useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchStats = async () => {
            try {
                const data = await getOrganizerStats(user.id);
                setStats(data);
            } catch (error) {
                console.error("Error fetching organiser stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <DashboardLayout user={user}>
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user.organizationName || user.name}.</p>
                </div>
                <button
                    onClick={() => navigate('/organizer/choose-event-type')}
                    className="bg-[#FF006E] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff4650] transition-colors shadow-lg shadow-red-500/20"
                >
                    + Create Event
                </button>
            </div>

            {/* KYC Warning Banner */}
            {user.role === UserRole.ORGANISER && (!user.kycStatus || user.kycStatus === 'PENDING') ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">⚠️</div>
                        <div>
                            <p className="font-bold text-yellow-800">Account Verification Pending</p>
                            <p className="text-sm text-yellow-700">You need to verify your organization details to start withdrawing funds.</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/organizer/verify')} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-200 transition-colors">
                        Verify Now
                    </button>
                </div>
            ) : null}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Events', value: loadingStats ? '...' : stats.totalEvents.toString(), icon: <Calendar size={20} className="text-blue-500" />, trend: 'Live' },
                    { label: 'Tickets Sold', value: loadingStats ? '...' : stats.ticketsSold.toString(), icon: <TrendingUp size={20} className="text-emerald-500" />, trend: 'Live' },
                    { label: 'Total Revenue', value: loadingStats ? '...' : `₹${stats.totalRevenue.toLocaleString()}`, icon: <span className="text-xl font-bold text-yellow-500">₹</span>, trend: 'Live' },
                    { label: 'Avg. Occupancy', value: '0%', icon: <AreaChart size={20} className="text-purple-500" />, trend: 'Stable' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow cursor-default">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                                <p className="text-3xl font-bold text-[#1E293B]">{stat.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="text-xs font-bold text-gray-400 mt-2">
                            <span className="text-emerald-500">{stat.trend}</span> vs last month
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings Empty State */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                        <TrendingUp size={32} className="text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1E293B] mb-2">No Sales Yet</h2>
                    <p className="text-gray-500 text-sm max-w-[250px] mb-6">Create and publish your first event to start seeing ticket sales data here.</p>
                    <button onClick={() => navigate('/organizer/choose-event-type')} className="text-[#FF006E] font-bold text-sm hover:underline">
                        Create an Event →
                    </button>
                </div>

                {/* Charts Placeholder Empty State */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                        <AreaChart size={32} className="text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1E293B] mb-2">Analytics Overview</h2>
                    <p className="text-gray-500 text-sm max-w-[250px]">Detailed revenue and attendance charts will appear once you have active events.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrganizerDashboard;
