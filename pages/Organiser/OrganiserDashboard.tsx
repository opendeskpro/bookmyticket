
import React from 'react';
import { User, Event } from '../../types';
import {
  Users,
  Calendar,
  MapPin,
  Zap,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Filter,
  Download,
  MoreVertical,
  Activity,
  CreditCard,
  Wallet,
  Clock,
  ChevronRight,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface OrganiserDashboardProps {
  user: User;
  events: Event[];
}

const OrganiserDashboard: React.FC<OrganiserDashboardProps> = ({ user, events }) => {
  const organiserEvents = events.filter(e => e.organiserId === user.id || e.organiserId === 'org1');

  const chartData = [
    { name: 'Jan', sales: 4000, bookings: 240 },
    { name: 'Feb', sales: 3000, bookings: 198 },
    { name: 'Mar', sales: 5000, bookings: 350 },
    { name: 'Apr', sales: 2780, bookings: 210 },
    { name: 'May', sales: 1890, bookings: 120 },
    { name: 'Jun', sales: 2390, bookings: 160 },
    { name: 'Jul', sales: 3490, bookings: 250 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Welcome & Quick Actions */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Terminal Overview</h2>
          <p className="text-white/30 font-bold mt-1 uppercase tracking-widest text-[10px]">Real-time synchronization across global event nodes.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all hover:bg-white/10 italic">
            <Filter size={14} /> Refine Logic
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-[#FF006E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#FF006E] transition-all shadow-2xl shadow-[#FF006E]/20 active:scale-95 italic">
            <Download size={14} /> Export Payload
          </button>
        </div>
      </div>

      {/* KPI Cards - Vibrant "Evento" Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: 'Lifetime Earning',
            val: '₹ 2,48,373',
            change: '+12.5%',
            positive: true,
            icon: <IndianRupee size={22} />,
            color: 'bg-[#219EBC]',
            accent: 'shadow-blue-500/40'
          },
          {
            label: 'Total Profit',
            val: '₹ 1,94,284',
            change: '+8.2%',
            positive: true,
            icon: <TrendingUp size={22} />,
            color: 'bg-[#7209B7]',
            accent: 'shadow-purple-500/40'
          },
          {
            label: 'Active Events',
            val: organiserEvents.length.toString(),
            change: 'Stable',
            positive: true,
            icon: <Calendar size={22} />,
            color: 'bg-[#38B000]',
            accent: 'shadow-green-500/40'
          },
          {
            label: 'Global Reach',
            val: '1,294',
            change: '+45 new',
            positive: true,
            icon: <Globe size={22} />,
            color: 'bg-[#FFB703]',
            accent: 'shadow-amber-500/40'
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`relative group h-44 rounded-[2.5rem] ${card.color} p-8 overflow-hidden hover:scale-[1.02] transition-all cursor-pointer shadow-2xl ${card.accent}`}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  {card.label}
                </p>
                <div className="w-12 h-12 bg-black/20 rounded-2xl flex items-center justify-center text-white border border-white/10 backdrop-blur-md">
                  {card.icon}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter">{card.val}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{card.change}</span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Growth Factor</span>
                </div>
              </div>
            </div>
            {/* Glass decoration */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 rounded-[3.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl p-10 overflow-hidden relative shadow-2xl">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Revenue Flow Analysis</h3>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Global financial nodes monitoring // Core 2026</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[9px] font-black text-white/40 uppercase tracking-widest backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#7209B7] animate-pulse"></div> Net Revenue
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[9px] font-black text-white/40 uppercase tracking-widest backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#38B000]"></div> Ticket Volume
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7209B7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#7209B7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38B000" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#38B000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050716',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#7209B7" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="bookings" stroke="#38B000" strokeWidth={5} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-[#FF006E]/20 via-transparent to-transparent backdrop-blur-3xl p-10 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 flex items-center justify-center">
                  <Wallet className="text-white w-7 h-7" />
                </div>
                <Activity className="text-white/10" size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Sync Balance</p>
              <h2 className="text-5xl font-black text-white italic tracking-tighter mb-10">₹ 48,373 <span className="text-base opacity-20 not-italic">.10</span></h2>

              <button className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:rotate-1 hover:scale-105 transition-all shadow-2xl shadow-white/10 active:scale-95 italic">
                <ArrowUpRight size={18} /> Instant Payout
              </button>
              <p className="mt-8 text-[9px] text-center text-white/20 font-black uppercase tracking-[0.3em]">Lifecycle Update: 18th Feb 2026</p>
            </div>
            {/* Decors */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF006E]/10 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="rounded-[3.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl p-10 shadow-2xl">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-10 pl-2 border-l-2 border-[#FF006E]">Recent Telemetry</h3>
            <div className="space-y-8">
              {[
                { icon: <CreditCard />, title: 'Withdrawal Flow', desc: 'Secure Success', time: '2h ago', price: '- ₹10k', color: 'text-[#FF006E]' },
                { icon: <Zap />, title: 'Inbound Ticket', desc: 'Node #A32', time: '5h ago', price: '+ ₹1,200', color: 'text-[#38B000]' },
                { icon: <Clock />, title: 'Event Mutation', desc: 'Metal Protocol', time: '1d ago', price: 'SYNCED', color: 'text-white/20' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-white/10 transition-all">
                      {React.cloneElement(act.icon as React.ReactElement, { size: 18 })}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">{act.title}</p>
                      <p className="text-[10px] text-white/20 font-bold mt-1 uppercase italic tracking-tighter">{act.desc}</p>
                    </div>
                  </div>
                  <div className="text-right leading-none">
                    <p className={`text-[11px] font-black ${act.color} uppercase tracking-widest`}>{act.price}</p>
                    <p className="text-[9px] text-white/10 font-bold mt-2 uppercase tracking-tighter">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[4rem] border border-white/5 bg-slate-900/10 backdrop-blur-md p-12 shadow-2xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Event Nodes</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Monitoring real-time inventory and security analytics.</p>
          </div>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#FF006E] hover:bg-[#FF006E] hover:text-white transition-all italic flex items-center gap-3">
            View All Nodes <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {organiserEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-[3rem] bg-slate-900/40 border border-white/5 p-8 hover:border-white/20 transition-all hover:bg-slate-900/60 shadow-xl"
            >
              <div className="relative h-48 rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
                <img
                  src={event.banner}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="px-4 py-1.5 bg-[#38B000]/20 text-[#38B000] border border-[#38B000]/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">STABLE</span>
                  <span className="px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">HIGH LOAD</span>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-black text-white italic tracking-tighter line-clamp-1 leading-tight">{event.title}</h4>

                <div className="grid grid-cols-2 gap-5">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-colors">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Sold Units</p>
                    <p className="text-2xl font-black text-white italic">124</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-colors">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Revenue</p>
                    <p className="text-2xl font-black text-[#FFB703] italic">₹ 62k</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3 text-white/30">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                      <MapPin size={14} className="text-[#7209B7]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">{event.city || 'Global'}</span>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-xl active:scale-95">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {organiserEvents.length === 0 && (
            <div className="col-span-full py-24 text-center border-4 border-dashed border-white/5 rounded-[4rem] bg-white/[0.02]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Calendar className="text-white/10" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 italic tracking-tighter uppercase">No Active Nodes Detected</h3>
              <p className="text-white/20 font-black uppercase tracking-[0.2em] text-xs">Initialize your first event to start data synchronization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
