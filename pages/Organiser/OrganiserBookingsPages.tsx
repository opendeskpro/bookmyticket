import React from 'react';

type BookingStatus = 'COMPLETED' | 'PENDING' | 'REJECTED' | 'FREE';

interface BookingRow {
  id: string;
  event: string;
  customer: string;
  customerPaid: number;
  organiserReceived: number;
  paidVia: string;
  paymentStatus: BookingStatus;
  ticketScanStatus: string;
}

interface BookingsProps {
  mode: 'all' | 'completed' | 'pending' | 'rejected';
}

const SAMPLE_BOOKINGS: BookingRow[] = [
  {
    id: '#691852196afc34',
    event: 'Small Business Ideas',
    customer: 'Jane Doe',
    customerPaid: 240,
    organiserReceived: 209,
    paidVia: 'Citibank',
    paymentStatus: 'COMPLETED',
    ticketScanStatus: 'Already Scanned',
  },
  {
    id: '#691852196afc35',
    event: 'Betsson Peruvian Volleyball',
    customer: 'Goutam Sharma',
    customerPaid: 396,
    organiserReceived: 344.88,
    paidVia: 'Citibank',
    paymentStatus: 'COMPLETED',
    ticketScanStatus: '9/10',
  },
  {
    id: '#691852196afc36',
    event: 'Motivation for online business',
    customer: 'John Doe',
    customerPaid: 0,
    organiserReceived: 0,
    paidVia: '-',
    paymentStatus: 'FREE',
    ticketScanStatus: 'Already Scanned',
  },
  {
    id: '#691852196afc37',
    event: 'Designer carrier conference',
    customer: 'Jane Doe',
    customerPaid: 220,
    organiserReceived: 190,
    paidVia: 'Citibank',
    paymentStatus: 'REJECTED',
    ticketScanStatus: '1/12',
  },
];

const paymentBadgeClasses: Record<BookingStatus, string> = {
  COMPLETED: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
  PENDING: 'bg-amber-500/10 text-amber-300 border border-amber-500/40',
  REJECTED: 'bg-rose-500/10 text-rose-300 border border-rose-500/40',
  FREE: 'bg-sky-500/10 text-sky-300 border border-sky-500/40',
};

const BookingsTable: React.FC<BookingsProps> = ({ mode }) => {
  const filtered = SAMPLE_BOOKINGS.filter((b) => {
    if (mode === 'all') return true;
    if (mode === 'completed') return b.paymentStatus === 'COMPLETED';
    if (mode === 'pending') return b.paymentStatus === 'PENDING';
    if (mode === 'rejected') return b.paymentStatus === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Event Booking {mode === 'all' ? '' : `– ${mode.charAt(0).toUpperCase()}${mode.slice(1)}`}
          </h2>
          <p className="text-xs text-slate-400">
            View and manage ticket bookings and payment status.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 w-40 placeholder:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search by Event Title"
            className="bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 w-48 placeholder:text-slate-500"
          />
          <select className="bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2">
            <option value="all">Payment – All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#050716] overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-[#080c1f] text-slate-400">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Booking ID</th>
              <th className="text-left px-4 py-3 font-medium">Event</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Cust. Paid</th>
              <th className="text-left px-4 py-3 font-medium">Org. Received</th>
              <th className="text-left px-4 py-3 font-medium">Paid Via</th>
              <th className="text-left px-4 py-3 font-medium">Payment Status</th>
              <th className="text-left px-4 py-3 font-medium">Ticket Scan Status</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="border-t border-slate-800/70 hover:bg-[#080c1f]/60 transition-colors"
              >
                <td className="px-6 py-3 text-slate-200">{b.id}</td>
                <td className="px-4 py-3 text-slate-200">{b.event}</td>
                <td className="px-4 py-3 text-slate-200">{b.customer}</td>
                <td className="px-4 py-3 text-slate-200">₹{b.customerPaid}</td>
                <td className="px-4 py-3 text-slate-200">₹{b.organiserReceived}</td>
                <td className="px-4 py-3 text-slate-200">{b.paidVia}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${paymentBadgeClasses[b.paymentStatus]
                      }`}
                  >
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-200">{b.ticketScanStatus}</td>
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
                  colSpan={9}
                  className="px-6 py-10 text-center text-slate-500 text-sm"
                >
                  No bookings found for this filter yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AllBookingsPage: React.FC = () => <BookingsTable mode="all" />;

export const CompletedBookingsPage: React.FC = () => (
  <BookingsTable mode="completed" />
);

export const PendingBookingsPage: React.FC = () => (
  <BookingsTable mode="pending" />
);

export const RejectedBookingsPage: React.FC = () => (
  <BookingsTable mode="rejected" />
);

export const BookingsReportPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-white">Report</h2>
      <p className="text-xs text-slate-400">
        Export booking reports by date range, payment method, and status.
      </p>
    </div>
    <div className="rounded-xl border border-slate-800 bg-[#050716] p-6 space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">From</label>
          <input
            type="date"
            className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">To</label>
          <input
            type="date"
            className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Payment Method
          </label>
          <select className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2">
            <option>All</option>
            <option>Credit / Debit Card</option>
            <option>Net Banking</option>
            <option>UPI / Wallet</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Payment Status
          </label>
          <select className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2">
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg px-6 py-2">
          Submit
        </button>
        <button className="border border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10 font-semibold rounded-lg px-5 py-2">
          Export
        </button>
      </div>
    </div>
  </div>
);

