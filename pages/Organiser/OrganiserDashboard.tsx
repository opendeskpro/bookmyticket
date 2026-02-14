
import React from 'react';
import { User, Event } from '../../types.ts';
import {
  Users,
  Calendar,
  MapPin,
  Zap,
  IndianRupee,
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
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'My Balance',
            val: '₹ 48,373.10',
            sub: 'Available for withdrawal',
            iconBg: 'bg-sky-500/10 text-sky-300',
            icon: <IndianRupee className="w-5 h-5" />,
          },
          {
            label: 'Events',
            val: organiserEvents.length.toString(),
            sub: 'Active & upcoming',
            iconBg: 'bg-emerald-500/10 text-emerald-300',
            icon: <Calendar className="w-5 h-5" />,
          },
          {
            label: 'Total Event Bookings',
            val: '6',
            sub: 'Completed this month',
            iconBg: 'bg-amber-500/10 text-amber-300',
            icon: <Zap className="w-5 h-5" />,
          },
          {
            label: 'Total Transactions',
            val: '294',
            sub: 'All time',
            iconBg: 'bg-purple-500/10 text-purple-300',
            icon: <Users className="w-5 h-5" />,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-[#050716] px-6 py-5 flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {card.val}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{card.sub}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-[#050716] p-6">
          <h3 className="text-sm font-semibold text-white mb-1">
            Event Booking Monthly Income (2026)
          </h3>
          <p className="text-[11px] text-slate-500 mb-4">
            High-level income trend across the current year.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#111827"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(55,65,81,0.6)',
                    backgroundColor: '#020617',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#050716] p-6">
          <h3 className="text-sm font-semibold text-white mb-1">
            Monthly Event Bookings (2026)
          </h3>
          <p className="text-[11px] text-slate-500 mb-4">
            Number of bookings across each month.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#111827"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(55,65,81,0.6)',
                    backgroundColor: '#020617',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#050716] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Events</h3>
          <p className="text-[11px] text-slate-500">
            Quick view of your latest events and capacity.
          </p>
        </div>
        <div className="divide-y divide-slate-800/80">
          {organiserEvents.map((event) => (
            <div
              key={event.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-[#080c1f] transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={event.banner}
                  className="w-14 h-14 rounded-lg object-cover"
                  alt={event.title}
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {event.title}
                  </p>
                  <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location || event.city || 'TBA'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  124 / {event.capacity || 500}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Tickets Sold
                </p>
              </div>
            </div>
          ))}

          {organiserEvents.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              You don&apos;t have any events yet. Create your first event from
              the Event Management section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
