import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Badge from '../../components/Shared/UI/Badge';
import { User } from '../../types';
import { getOrganiserIdForUser, getBookingsForOrganiser } from '../../lib/supabase';
import { Search, ShoppingBag, Loader2 } from 'lucide-react';

interface OrganizerBookingsProps {
  user: User | null;
}

interface BookingRow {
  id: string;
  event_id?: string;
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
  buyerName?: string;
  buyerEmail?: string;
  total_amount: number;
  quantity: number;
  status: string;
  created_at?: string;
  booking_time?: string;
}

const OrganizerBookings: React.FC<OrganizerBookingsProps> = ({ user }) => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const organiserId = await getOrganiserIdForUser(user.id);
        if (cancelled) return;
        if (organiserId) {
          const data = await getBookingsForOrganiser(organiserId);
          if (!cancelled) setBookings(data as BookingRow[]);
        } else {
          if (!cancelled) setBookings([]);
        }
      } catch (e) {
        if (!cancelled) setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const filtered = bookings.filter(
    (b) =>
      (b.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = filtered.reduce((sum, b) => sum + (b.total_amount || 0), 0);

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-600 mt-1">View and manage ticket orders for your events.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <ShoppingBag className="text-[#FF006E]" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{filtered.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">₹ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm font-medium">Confirmed</p>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {filtered.filter((b) => b.status === 'CONFIRMED' || b.status === 'confirmed').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by event, buyer, email or order ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF006E]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order / Buyer</th>
                  <th className="px-6 py-4 font-semibold">Event</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Qty</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No orders yet. Orders will appear here when customers book tickets for your events.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{b.buyerName || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{b.buyerEmail || '—'}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">#{String(b.id).slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{b.eventTitle || '—'}</p>
                        {b.eventVenue && <p className="text-xs text-gray-500">{b.eventVenue}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-800">{b.eventDate || '—'}</p>
                        {b.booking_time && <p className="text-xs text-gray-500">{b.booking_time}</p>}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{b.quantity}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">₹ {(b.total_amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={b.status === 'CONFIRMED' || b.status === 'confirmed' ? 'success' : 'neutral'}>
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerBookings;
