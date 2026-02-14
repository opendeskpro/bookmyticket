
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, UserRole, User, AdminLog, CMSContent, Organizer } from '../../types';
import {
  ShieldCheck, Calendar, Users, IndianRupee, CheckCircle2, XCircle,
  BarChart3, CreditCard, Settings, Bell, Search, Filter, MoreVertical,
  ArrowUpRight, TrendingUp, FileText, AlertTriangle, LayoutDashboard,
  Ticket, ReceiptText, Percent, Calculator, Image as ImageIcon,
  MapPin, List, History, Ban, ExternalLink, ChevronRight, Plus,
  Smartphone, Trash2, Edit2, Globe, Lock, ShieldAlert, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Logo } from '../../components/Layout';
import { getOrganizersForAdmin, approveOrganizer, rejectOrganizer } from '../../lib/supabase';

const AdminDashboard: React.FC<{ events: Event[] }> = ({ events }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORGANISERS' | 'MODERATION' | 'FINANCE' | 'CMS' | 'AUDIT'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  // Real Data State
  const [organisers, setOrganisers] = useState<any[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  // CMS Mock States
  const [banners, setBanners] = useState<CMSContent[]>([
    { id: 'b1', type: 'BANNER', label: 'Festive Season Sale', value: '/promo/diwali', imageUrl: 'https://picsum.photos/seed/promo1/800/400', isActive: true },
    { id: 'b2', type: 'BANNER', label: 'New Year Concerts', value: '/promo/ny2026', imageUrl: 'https://picsum.photos/seed/promo2/800/400', isActive: true }
  ]);

  const [cities, setCities] = useState<CMSContent[]>([
    { id: 'c1', type: 'CITY', label: 'Coimbatore', value: 'coimbatore', isActive: true },
    { id: 'c2', type: 'CITY', label: 'Chennai', value: 'chennai', isActive: true },
    { id: 'c3', type: 'CITY', label: 'Bangalore', value: 'bangalore', isActive: true }
  ]);

  const [categories, setCategories] = useState<CMSContent[]>([
    { id: 'cat1', type: 'CATEGORY', label: 'Concerts', value: 'concert', isActive: true },
    { id: 'cat2', type: 'CATEGORY', label: 'Comedy Shows', value: 'comedy', isActive: true }
  ]);

  // Economics Mock State
  const [economics, setEconomics] = useState({
    commission: 10.0,
    gatewayFee: 2.5,
    flatConvenience: 45,
    minWithdrawal: 1000
  });

  // Audit Log Mock Data
  const auditLogs: AdminLog[] = [
    { id: 'l1', adminId: 'admin1', action: 'COMMISSION_UPDATE', module: 'FINANCE', targetId: 'GLOBAL', payload: { old: 10, new: 12 }, createdAt: '2 mins ago' },
    { id: 'l2', adminId: 'admin1', action: 'EVENT_APPROVED', module: 'MODERATION', targetId: 'E123', createdAt: '1 hour ago' },
    { id: 'l3', adminId: 'admin1', action: 'ORG_SUSPENDED', module: 'ORGANISERS', targetId: 'org3', createdAt: '3 hours ago' }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 450000, platformCut: 45000 },
    { name: 'Feb', revenue: 520000, platformCut: 52000 },
    { name: 'Mar', revenue: 480000, platformCut: 48000 },
    { name: 'Apr', revenue: 610000, platformCut: 61000 },
    { name: 'May', revenue: 750000, platformCut: 75000 },
    { name: 'Jun', revenue: 890000, platformCut: 89000 },
  ];

  useEffect(() => {
    if (activeTab === 'ORGANISERS') {
      fetchOrganizers();
    }
  }, [activeTab]);

  const fetchOrganizers = async () => {
    setLoadingOrgs(true);
    try {
      const data = await getOrganizersForAdmin();
      if (data) setOrganisers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleApprove = async (orgId: string, userId: string) => {
    try {
      await approveOrganizer(orgId, userId);
      // Optimistic update
      setOrganisers(organisers.map(o => o.id === orgId ? { ...o, status: 'ACTIVE', is_verified: true } : o));
    } catch (err) {
      alert("Failed to approve organizer");
    }
  };

  const handleReject = async (orgId: string) => {
    try {
      await rejectOrganizer(orgId);
      // Optimistic update
      setOrganisers(organisers.map(o => o.id === orgId ? { ...o, status: 'SUSPENDED', is_verified: false } : o));
    } catch (err) {
      alert("Failed to reject organizer");
    }
  };

  const renderOverview = () => (
    <div className="space-y-12 animate-in fade-in duration-500 font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform Gross (GTV)', val: '₹45.8L', icon: <Calculator className="text-emerald-600" />, trend: '12.5%' },
          { label: 'Net Revenue', val: '₹4.58L', icon: <IndianRupee className="text-amber-600" />, trend: '10%' },
          { label: 'Active Events', val: events.length.toString(), icon: <Calendar className="text-blue-600" />, trend: 'Healthy' },
          { label: 'Moderation Queue', val: events.filter(e => e.status === 'PENDING').length.toString(), icon: <ShieldAlert className="text-red-600" />, trend: 'Action Required' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 rounded-2xl bg-amber-50">{stat.icon}</div>
              <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-slate-900">{stat.val}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-100">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black mb-1">Financial Trajectory</h3>
              <p className="text-sm font-medium text-slate-400">Aggregated platform fee earnings over time</p>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: '32px', border: 'none', boxShadow: '0 30px 40px -10px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="platformCut" stroke="#f59e0b" strokeWidth={5} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white flex flex-col shadow-2xl shadow-amber-900/10">
          <h3 className="text-2xl font-black mb-12">System Quick Settings</h3>
          <div className="space-y-8 flex-1">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Platform Commission</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black">{economics.commission}%</span>
                <button onClick={() => setActiveTab('FINANCE')} className="p-2 bg-amber-500 rounded-lg text-slate-950"><Edit2 size={16} /></button>
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Global Convenience Fee</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black">₹{economics.flatConvenience}</span>
                <button onClick={() => setActiveTab('FINANCE')} className="p-2 bg-amber-500 rounded-lg text-slate-950"><Edit2 size={16} /></button>
              </div>
            </div>
          </div>
          <button onClick={() => setActiveTab('CMS')} className="mt-8 py-5 border border-white/10 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-slate-950 transition-all">Enter CMS Mode</button>
        </div>
      </div>
    </div>
  );

  const renderOrganisers = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Verified Host Directory</h3>
        <div className="flex gap-4">
          <div className="relative w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name, ID or pan..." className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-amber-500 font-bold" />
          </div>
        </div>
      </div>

      {loadingOrgs ? (
        <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-10 py-6">Organiser Details</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Verification</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {organisers.map(org => (
                <tr key={org.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <p className="font-black text-slate-900 text-lg">{org.org_name}</p>
                    <p className="text-xs font-bold text-slate-400">User: {org.profiles?.full_name} • PAN: {org.pan_number}</p>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${org.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' :
                      org.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    {org.is_verified ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={16} /> <span className="text-[10px] font-black uppercase">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <History size={16} /> <span className="text-[10px] font-black uppercase">Pending KYC</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 transition-opacity">
                      <button onClick={() => handleApprove(org.id, org.user_id)} className="p-3 bg-white border border-slate-100 rounded-xl text-emerald-600 hover:shadow-md hover:bg-emerald-50"><CheckCircle2 size={18} /></button>
                      <button onClick={() => handleReject(org.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-red-600 hover:shadow-md hover:bg-red-50"><Ban size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6">
        {events.filter(e => e.status === 'PENDING').map(event => (
          <div key={event.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center gap-10 group hover:shadow-xl transition-all">
            <img src={event.banner} className="w-56 h-40 rounded-[2rem] object-cover shadow-lg" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{event.category}</span>
                <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">{event.date}</span>
              </div>
              <h4 className="text-3xl font-black text-slate-900">{event.title}</h4>
              <p className="text-sm font-medium text-slate-400 line-clamp-2">{event.description}</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-48 border-l border-slate-100 pl-10">
              <button className="py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:scale-105 transition-all">Approve</button>
              <button className="py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
            </div>
          </div>
        ))}
        {events.filter(e => e.status === 'PENDING').length === 0 && (
          <div className="py-32 text-center bg-slate-50/50 rounded-[4rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-sm">
              <ShieldCheck size={40} />
            </div>
            <h4 className="text-2xl font-black text-slate-900">Moderator Desk Clear</h4>
            <p className="text-slate-400 font-medium">No pending events require approval right now.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCMS = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Banners CMS */}
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black flex items-center gap-4"><ImageIcon className="text-amber-500" /> Hero Banners</h4>
            <button className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100"><Plus size={24} /></button>
          </div>
          <div className="space-y-6">
            {banners.map(banner => (
              <div key={banner.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-amber-100 group transition-all">
                <img src={banner.imageUrl} className="w-32 h-20 rounded-2xl object-cover shadow-md" />
                <div className="flex-1">
                  <p className="font-black text-slate-900">{banner.label}</p>
                  <p className="text-xs font-bold text-slate-400">{banner.value}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 bg-white rounded-xl text-slate-400 hover:text-amber-500"><Edit2 size={18} /></button>
                  <button className="p-3 bg-white rounded-xl text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Categories CMS */}
        <div className="space-y-12">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-black flex items-center gap-4"><MapPin className="text-amber-500" /> Cities</h4>
              <button className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-amber-500 hover:text-white transition-all"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-4">
              {cities.map(city => (
                <span key={city.id} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase text-slate-700 flex items-center gap-3 group hover:border-amber-500 cursor-pointer">
                  {city.label}
                  <XCircle size={14} className="text-slate-300 group-hover:text-red-500" />
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-black flex items-center gap-4"><List className="text-amber-500" /> Categories</h4>
              <button className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-amber-500 hover:text-white transition-all"><Plus size={20} /></button>
            </div>
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:border-amber-500 border border-transparent transition-all cursor-pointer">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-widest">{cat.label}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center">
          <h4 className="text-2xl font-black">Immutable Audit Trail</h4>
          <button className="flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-white transition-all"><Filter size={16} /> Filter Logs</button>
        </div>
        <div className="divide-y divide-slate-50">
          {auditLogs.map(log => (
            <div key={log.id} className="px-12 py-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${log.module === 'FINANCE' ? 'bg-amber-50 text-amber-500' :
                  log.module === 'MODERATION' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'
                  }`}>
                  <History size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{log.action.replace('_', ' ')}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin: {log.adminId} • Target: {log.targetId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-700">{log.createdAt}</p>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400">{log.module}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcfd] flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-950 text-white flex flex-col p-8 hidden lg:flex sticky top-0 h-screen z-[100]">
        <div className="mb-20">
          <Link to="/" className="group">
            <Logo light className="scale-90 origin-left" />
          </Link>
        </div>

        <nav className="space-y-4 flex-1 font-inter">
          {[
            { id: 'OVERVIEW', label: 'Global Health', icon: <LayoutDashboard size={18} /> },
            { id: 'ORGANISERS', label: 'Host Management', icon: <Users size={18} /> },
            { id: 'MODERATION', label: 'Trust & Safety', icon: <ShieldAlert size={18} /> },
            { id: 'FINANCE', label: 'Platform Economics', icon: <CreditCard size={18} /> },
            { id: 'CMS', label: 'Content (CMS)', icon: <ImageIcon size={18} /> },
            { id: 'AUDIT', label: 'Root Logs', icon: <History size={18} /> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all group ${activeTab === item.id
                ? 'bg-amber-500 text-slate-950 shadow-2xl shadow-amber-500/20'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl uppercase">R</div>
            <div>
              <p className="font-black text-sm tracking-tight">Raja Vasu</p>
              <p className="text-[9px] font-black uppercase text-amber-500 tracking-[0.2em]">Super User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-16 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 font-inter">
          <div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">
              {activeTab === 'OVERVIEW' ? 'Command' :
                activeTab === 'ORGANISERS' ? 'Hosts' :
                  activeTab === 'MODERATION' ? 'Moderator' :
                    activeTab === 'FINANCE' ? 'Economics' :
                      activeTab === 'CMS' ? 'CMS Mode' : 'System Audit'}
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mt-2">
              Management Interface — book my ticket root access
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-10 py-5 bg-white border border-slate-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 shadow-sm transition-all flex items-center gap-3">
              <Bell size={20} />
              Global Alerts
            </button>
            <button className="px-10 py-5 bg-amber-500 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center gap-3">
              <FileText size={20} />
              Platform Report
            </button>
          </div>
        </header>

        <div className="max-w-[1500px]">
          {activeTab === 'OVERVIEW' && renderOverview()}
          {activeTab === 'ORGANISERS' && renderOrganisers()}
          {activeTab === 'MODERATION' && renderModeration()}
          {activeTab === 'FINANCE' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                  <h4 className="text-2xl font-black flex items-center gap-4"><Percent className="text-amber-500" /> Economics Split</h4>
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Platform Commission Rate</span>
                        <span className="text-amber-600">{economics.commission}%</span>
                      </div>
                      <input
                        type="range" min="0" max="30" step="0.5"
                        className="w-full accent-amber-500 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                        value={economics.commission}
                        onChange={e => setEconomics({ ...economics, commission: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Gateway Overhead (Pass-through)</span>
                        <span className="text-slate-900">{economics.gatewayFee}%</span>
                      </div>
                      <input type="range" min="0" max="5" step="0.1" className="w-full accent-slate-950 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer" value={economics.gatewayFee} disabled />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Standard Convenience Fee (Flat INR)</span>
                        <span className="text-amber-600">₹{economics.flatConvenience}</span>
                      </div>
                      <input
                        type="range" min="0" max="200" step="5"
                        className="w-full accent-amber-500 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                        value={economics.flatConvenience}
                        onChange={e => setEconomics({ ...economics, flatConvenience: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <button className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200">Commit Changes to Engine</button>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-10 text-center">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shadow-inner">
                    <ReceiptText size={40} />
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-slate-900 mb-2">₹12,45,600</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending Settlement Queue</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full pt-10 border-t border-slate-50">
                    <div className="p-6 bg-slate-50 rounded-3xl">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Avg. Payout Time</p>
                      <p className="text-xl font-black text-slate-900">4.2h</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Dispute Rate</p>
                      <p className="text-xl font-black text-red-500">0.02%</p>
                    </div>
                  </div>
                  <button className="w-full py-5 bg-amber-500 text-slate-950 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-100">Batch Process Settlements</button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'CMS' && renderCMS()}
          {activeTab === 'AUDIT' && renderAudit()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
