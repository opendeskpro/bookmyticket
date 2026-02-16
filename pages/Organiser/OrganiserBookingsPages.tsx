import React from 'react';
import {
  Search,
  PlusCircle,
  Circle,
  IndianRupee,
  Calendar,
  CreditCard,
  Clock,
  History,
  TrendingDown,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  FileBarChart,
  Download,
  Share2
} from 'lucide-react';

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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            Order Ledger {mode === 'all' ? '' : `// ${mode}`}
          </h2>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Monitoring real-time booking mutations and guest fulfillment.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 flex items-center gap-4 backdrop-blur-xl">
            <Search size={16} className="text-white/20" />
            <input
              type="text"
              placeholder="FILTER BY ORDER_ID"
              className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/10 outline-none border-none w-48"
            />
          </div>
          <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none backdrop-blur-xl cursor-pointer hover:bg-white/10 transition-all">
            <option value="all" className="bg-slate-900">Filter By Status</option>
            <option value="completed" className="bg-slate-900">Completed</option>
            <option value="pending" className="bg-slate-900">Pending</option>
            <option value="rejected" className="bg-slate-900">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5">
              <th className="px-10 py-7">Booking Hash</th>
              <th className="px-8 py-7">Target Event</th>
              <th className="px-8 py-7">Guest Identity</th>
              <th className="px-8 py-7">Revenue Status</th>
              <th className="px-8 py-7">Payment Vector</th>
              <th className="px-8 py-7">Fulfillment</th>
              <th className="px-10 py-7 text-right">Action Hub</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-10 py-8 text-[11px] font-black text-white/60 font-mono italic">{b.id}</td>
                <td className="px-8 py-8">
                  <div className="font-black text-white text-[13px] italic leading-tight max-w-[200px] truncate">{b.event}</div>
                </td>
                <td className="px-8 py-8 text-[11px] font-black text-white uppercase tracking-widest italic">{b.customer}</td>
                <td className="px-8 py-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-white">₹{b.organiserReceived}</span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Net Payout</span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/40 uppercase italic">{b.paidVia}</span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${paymentBadgeClasses[b.paymentStatus]
                      }`}
                  >
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl active:scale-95 italic">
                    Inspect
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-20 text-center"
                >
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">No data transmissions detected for this sector.</p>
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
  <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl">
    <div>
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Intelligence Report</h2>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
        Synthesizing historical booking data into actionable analytical nodes.
      </p>
    </div>
    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 space-y-10 shadow-2xl relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Temporal Start</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest color-scheme-dark"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Temporal End</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest color-scheme-dark"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Payment Node</label>
          <div className="relative">
            <CreditCard size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <select className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[11px] tracking-widest appearance-none">
              <option className="bg-[#050716]">All Vectors</option>
              <option className="bg-[#050716]">Credit / Debit Card</option>
              <option className="bg-[#050716]">Net Banking</option>
              <option className="bg-[#050716]">UPI / Wallet</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Mutation Status</label>
          <div className="relative">
            <History size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <select className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[11px] tracking-widest appearance-none">
              <option className="bg-[#050716]">All States</option>
              <option className="bg-[#050716]">Completed</option>
              <option className="bg-[#050716]">Pending</option>
              <option className="bg-[#050716]">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-6 pt-6 border-t border-white/5">
        <button className="px-10 py-4 bg-white/5 text-white/40 font-black rounded-2xl text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all italic flex items-center gap-3 active:scale-95">
          <Download size={16} /> Export Dataset
        </button>
        <button className="px-12 py-4 bg-[#7209B7] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#7209B7] transition-all shadow-2xl shadow-purple-500/20 italic flex items-center gap-3 active:scale-95">
          <FileBarChart size={16} /> Compile Report
        </button>
      </div>
    </div>
  </div>
);
