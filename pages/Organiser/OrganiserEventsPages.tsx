import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../types';

interface OrganiserEventsProps {
  events: Event[];
  mode: 'all' | 'venue' | 'online';
}

const statusBadgeClasses: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
  PENDING: 'bg-amber-500/10 text-amber-300 border border-amber-500/40',
  REJECTED: 'bg-rose-500/10 text-rose-300 border border-rose-500/40',
  CANCELLED: 'bg-slate-500/10 text-slate-300 border border-slate-500/40',
};

const OrganiserEventsTable: React.FC<OrganiserEventsProps> = ({ events, mode }) => {
  const navigate = useNavigate();
  const filtered = events.filter((e) => {
    if (mode === 'venue') return !e.isVirtual;
    if (mode === 'online') return !!e.isVirtual;
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            {mode === 'all' ? 'Event Registry' : mode === 'venue' ? 'Venue Nodes' : 'Online Streams'}
          </h2>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Managing global coordination of your event infrastructure.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-4 backdrop-blur-xl">
            <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white/60 outline-none border-none cursor-pointer">
              <option className="bg-[#050716]">All Languages</option>
              <option className="bg-[#050716]">English</option>
            </select>
            <div className="w-[1px] h-4 bg-white/10" />
            <input
              type="text"
              placeholder="Filter by name..."
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/20 outline-none border-none"
            />
          </div>
          <button
            onClick={() => navigate('/organiser/create')}
            className="px-8 py-3.5 bg-[#FF006E] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#FF006E] transition-all shadow-2xl shadow-[#FF006E]/20 active:scale-95 italic"
          >
            Deploy New Event
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5">
              <th className="px-10 py-6">Identity & Schedule</th>
              <th className="px-10 py-6">Protocol</th>
              <th className="px-10 py-6">Category</th>
              <th className="px-10 py-6">Inventory</th>
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6 text-right">Action Hub</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-10 py-8">
                  <div className="font-black text-white text-[15px] italic leading-tight">{event.title}</div>
                  <div className="text-[10px] font-bold text-white/30 mt-1.5 uppercase tracking-widest">
                    {event.date} • {event.city || event.location || 'GLOBAL'}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-[9px] font-black text-white/60 uppercase tracking-tighter">
                    {event.isVirtual ? 'Virtual Stream' : 'Venue Node'}
                  </span>
                </td>
                <td className="px-10 py-8 text-[11px] font-black text-white uppercase tracking-widest italic">{event.category}</td>
                <td className="px-10 py-8">
                  <button className="text-[10px] font-black text-[#FF006E] uppercase tracking-widest hover:text-white transition-colors underline decoration-2 underline-offset-4">
                    Manage Tickets
                  </button>
                </td>
                <td className="px-10 py-8">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${statusBadgeClasses[event.status] || statusBadgeClasses.ACTIVE
                      }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl active:scale-95 italic">
                    Select
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-10 py-24 text-center"
                >
                  <div className="flex flex-col items-center">
                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] italic">No active nodes found in this sector</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AllEventsPage: React.FC<{ events: Event[] }> = ({ events }) => (
  <OrganiserEventsTable events={events} mode="all" />
);

export const VenueEventsPage: React.FC<{ events: Event[] }> = ({ events }) => (
  <OrganiserEventsTable events={events} mode="venue" />
);

export const OnlineEventsPage: React.FC<{ events: Event[] }> = ({ events }) => (
  <OrganiserEventsTable events={events} mode="online" />
);

