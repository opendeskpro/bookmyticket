import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../types.ts';

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Events ({mode === 'all' ? 'All' : mode === 'venue' ? 'Venue' : 'Online'})</h2>
          <p className="text-xs text-slate-400">
            Manage your {mode === 'all' ? 'upcoming and past' : mode === 'venue' ? 'in-person' : 'online'} events.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <select className="bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2">
            <option>English</option>
            <option>All Languages</option>
          </select>
          <input
            type="text"
            placeholder="Enter event name"
            className="bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 w-48 placeholder:text-slate-500"
          />
          <button
            onClick={() => navigate('/organiser/create')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg px-4 py-2"
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#050716] overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-[#080c1f] text-slate-400">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Ticket</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Featured</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr
                key={event.id}
                className="border-t border-slate-800/70 hover:bg-[#080c1f]/60 transition-colors"
              >
                <td className="px-6 py-3 text-slate-100 text-xs">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-[10px] text-slate-500">
                    {event.date} • {event.city || event.location || 'TBA'}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {event.isVirtual ? 'Online' : 'Venue'}
                </td>
                <td className="px-4 py-3 text-slate-200">{event.category}</td>
                <td className="px-4 py-3">
                  <button className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-2">
                    Manage
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${
                      statusBadgeClasses[event.status] || statusBadgeClasses.ACTIVE
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    {event.isSpotlight ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#101632] text-slate-200 hover:bg-[#161d3c] border border-slate-700/60">
                    Select
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-slate-500 text-sm"
                >
                  No events found for this filter yet.
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

