import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User } from '../../types';
import { supabase, getEvents } from '../../lib/supabase';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell
} from 'recharts';
import {
    Users, Calendar, IndianRupee, TrendingUp, ArrowUpRight,
    Clock, Briefcase, Activity
} from 'lucide-react';

interface AdminDashboardProps {
    user: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeOrganizers: 0,
        liveEvents: 0,
        totalRevenue: 0,
        pendingWithdrawals: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [
                { count: usersCount },
                { data: organisers },
                { data: events },
                { data: bookings },
                { data: withdrawals }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('organisers').select('id, status'),
                supabase.from('events').select('id, status'),
                supabase.from('bookings').select('total_amount, created_at'),
                supabase.from('withdrawals').select('amount').eq('status', 'PENDING')
            ]);

            const activeOrganisers = (organisers || []).filter((o: any) => o.status === 'ACTIVE').length;
            const liveEvents = (events || []).filter((e: any) => e.status === 'PUBLISHED').length;
            const totalRevenue = (bookings || []).reduce((sum: number, b: any) => sum + Number(b.total_amount), 0);
            const pendingWithdrawalsCount = (withdrawals || []).length;

            setStats({
                totalUsers: usersCount || 0,
                activeOrganizers: activeOrganisers,
                liveEvents,
                totalRevenue,
                pendingWithdrawals: pendingWithdrawalsCount
            });

            // Process chart data (last 7 days)
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = [...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayName = days[date.getDay()];
                const dateStr = date.toISOString().split('T')[0];

                const dayBookings = (bookings || []).filter((b: any) => b.created_at.startsWith(dateStr));
                const revenue = dayBookings.reduce((sum: number, b: any) => sum + Number(b.total_amount), 0);

                return {
                    name: dayName,
                    revenue: revenue,
                    bookings: dayBookings.length
                };
            });
            setChartData(last7Days);

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
        { label: 'Active Organizers', value: stats.activeOrganizers.toLocaleString(), icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%' },
        { label: 'Live Events', value: stats.liveEvents.toLocaleString(), icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', trend: '+18%' },
        { label: 'Total Revenue', value: '₹' + stats.totalRevenue.toLocaleString(), icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+24%' }
    ];

    return (
        <DashboardLayout user={user}>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Platform Overview</h1>
                        <p className="text-gray-500 text-sm font-medium">Real-time statistics and growth metrics for your ticketing platform.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <Clock size={14} /> Last 24 Hours
                        </div>
                        <button
                            onClick={fetchStats}
                            className="p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all text-gray-600"
                        >
                            <TrendingUp size={18} />
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="flex items-center gap-1 text-green-500 text-xs font-black bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={12} /> {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Area Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-black text-lg text-gray-900">Revenue Performance</h3>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Weekly Sales overview</p>
                            </div>
                            <select className="bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg text-gray-600 outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#7c3aed"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bookings Bar Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mb-8">
                            <h3 className="font-black text-lg text-gray-900">Booking Activity</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Ticket Sales Volume</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                                        dy={10}
                                    />
                                    <YAxis axisLine={false} tickLine={false} hide />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 6 ? '#F84464' : '#f3f4f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Activity & Requests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
                            <div className="flex items-center gap-2">
                                <Activity className="text-[#7c3aed]" size={20} />
                                <h3 className="font-black text-lg text-gray-900">System Activity</h3>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full">Live Feed</span>
                        </div>
                        <div className="p-2 max-h-[400px] overflow-y-auto">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <Users size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">New Organizer Registration</p>
                                        <p className="text-xs text-gray-500 font-medium">EventHub Solutions requested access</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">2h ago</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Pending Actions */}
                    <div className="bg-[#111111] rounded-2xl p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-black mb-2">Needs Your Attention</h3>
                                <p className="text-gray-400 text-sm font-medium mb-8">Maintain platform quality by reviewing pending requests.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                            <span className="font-bold text-sm">Organizer Requests</span>
                                        </div>
                                        <span className="text-sm font-black bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-lg">12 Pending</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer text-blue-400">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="font-bold text-sm">Withdrawal Requests</span>
                                        </div>
                                        <span className="text-sm font-black bg-blue-500/20 px-3 py-1 rounded-lg">₹{stats.pendingWithdrawals * 5000} Pending</span>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 w-full py-4 bg-[#F84464] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#D93654] transition-all shadow-lg shadow-[#F84464]/20">
                                Go to Action Center
                            </button>
                        </div>

                        {/* Abstract Background patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F84464]/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#F84464]/20 transition-all duration-500" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#7c3aed]/10 rounded-full -ml-10 -mb-10 blur-2xl group-hover:bg-[#7c3aed]/20 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
