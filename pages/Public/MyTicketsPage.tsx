
import React, { useState, useEffect } from 'react';
import { Ticket, User, TicketStatus } from '../../types';
import { Download, Share2, Ticket as TicketIcon, Clock, MapPin, QrCode as QrIcon, ArrowRight, Check, XCircle, AlertTriangle, X, Printer, Mail, Send, Maximize2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import TicketTemplate from '../../components/TicketTemplate';
import html2canvas from 'html2canvas';

interface MyTicketsPageProps {
  tickets: Ticket[];
  user: User;
}

const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ tickets, user }) => {
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [ticketList, setTicketList] = useState<Ticket[]>(tickets);
  const [loading, setLoading] = useState(tickets.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [isSending, setIsSending] = useState<string | null>(null); // 'EMAIL' | 'WHATSAPP' | 'SMS'
  const [isDownloading, setIsDownloading] = useState(false);

  const userTickets = ticketList.filter(t => t.userId === user.id);

  useEffect(() => {
    const fetchTickets = async () => {
      // const token = localStorage.getItem('token');
      // if (!token) return;

      try {
        // const data = await api.auth.getProfile(token);
        // if (data.bookings) {
        //   setTicketList(data.bookings);
        // }
        const tickets = await api.bookings.list();
        setTicketList(tickets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.id]);

  const handleShare = async (ticket: Ticket) => {
    const shareLink = `${window.location.origin}/#/ticket-view/${ticket.id}`;
    await navigator.clipboard.writeText(shareLink);
    setSharedId(ticket.id);
    setTimeout(() => setSharedId(null), 2000);
  };

  const handleCancel = async (ticketId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking? A refund will be initiated to your original payment method.")) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        await api.bookings.cancel(ticketId, token);
        const updatedList = ticketList.map(t => {
          if (t.id === ticketId) {
            return { ...t, status: TicketStatus.REFUNDED };
          }
          return t;
        });
        setTicketList(updatedList);
        alert("Booking cancelled successfully.");
      } catch (err: any) {
        alert("Failed to cancel booking: " + err.message);
      }
    }
  };

  const simulateSending = (type: string) => {
    setIsSending(type);
    setTimeout(() => {
      setIsSending(null);
      alert(`${type} sent successfully!`);
    }, 2000);
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('ticket-template-container');
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      } as any);

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `ticket-${viewingTicket?.id || 'download'}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate ticket image", err);
      alert("Failed to generate ticket image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 no-print">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-4">
            <TicketIcon size={14} className="text-blue-600" />
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">Digital Wallet</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900">My Tickets</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and access your active event bookings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {userTickets.map(ticket => (
          <div
            key={ticket.id}
            className={`bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col group hover:shadow-2xl transition-all ${ticket.status === TicketStatus.REFUNDED ? 'opacity-75 grayscale' : ''}`}
          >
            {/* Top Section */}
            <div className="p-10 flex gap-8 relative">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-900 p-2 flex items-center justify-center shrink-0 shadow-xl border-4 border-white -mt-5">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`} alt="QR" className="w-full h-full rounded-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-900 truncate">{ticket.eventTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.status === TicketStatus.BOOKED ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-[#d97706]">{ticket.ticketTypeName}</span>
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span>#{ticket.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Ticket Info Area */}
            <div className="bg-slate-50/50 p-10 grid grid-cols-2 gap-8 border-y border-dashed border-slate-200 relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#fdfdfd] rounded-full border-r border-slate-100"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#fdfdfd] rounded-full border-l border-slate-100"></div>

              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} className="text-[#d97706]" /> Date & Time
                </p>
                <p className="text-sm font-black text-slate-900">{new Date(ticket.purchaseDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-[#d97706]" /> Location
                </p>
                <p className="text-sm font-black text-slate-900 truncate">Main Arena, Venue</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-10 flex items-center justify-between no-print">
              <div className="flex gap-4">
                <button
                  onClick={() => setViewingTicket(ticket)}
                  disabled={ticket.status === TicketStatus.REFUNDED}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0a0a23] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Maximize2 size={16} /> View Ticket
                </button>
                <button
                  onClick={() => handleShare(ticket)}
                  disabled={ticket.status === TicketStatus.REFUNDED}
                  className={`flex items-center gap-2 px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sharedId === ticket.id
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-white border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50'
                    }`}
                >
                  {sharedId === ticket.id ? <><Check size={16} /> Copied!</> : <><Share2 size={16} /> Share</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Viewer Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#050716]/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setViewingTicket(null)}></div>

          <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-300">
            {/* Modal Actions */}
            <div className="sticky top-0 z-10 flex justify-between items-center mb-6 bg-[#050716]/80 p-6 rounded-3xl backdrop-blur-md border border-white/5">
              <div className="flex gap-4">
                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="flex items-center gap-3 px-6 py-3 bg-purple-500/10 text-purple-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all border border-purple-500/20 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <><ImageIcon size={16} /> Download Image</>}
                </button>
                <button
                  onClick={() => simulateSending('EMAIL')}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                >
                  {isSending === 'EMAIL' ? <Loader2 size={16} className="animate-spin" /> : <><Mail size={16} /> Email</>}
                </button>
                <button
                  onClick={() => simulateSending('WHATSAPP')}
                  className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                >
                  {isSending === 'WHATSAPP' ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> WhatsApp</>}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-3 px-6 py-3 bg-blue-500/10 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all border border-blue-500/20"
                >
                  <Printer size={16} /> Print
                </button>
              </div>
              <button
                onClick={() => setViewingTicket(null)}
                className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-red-500 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden" id="ticket-template-container">
              <TicketTemplate
                event={{
                  title: viewingTicket.eventTitle,
                  description: "Exclusive access to the premier event highlighting innovation and designer carrier trends of 2026.",
                  date: new Date(viewingTicket.purchaseDate).toLocaleDateString(),
                  time: "07:00 PM",
                  venue: "Grand Arena National, Mumbai",
                  banner: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
                }}
                booking={{
                  id: viewingTicket.id,
                  date: new Date(viewingTicket.purchaseDate).toLocaleDateString(),
                  duration: "4 Hours",
                  seats: viewingTicket.seats || ["A-1", "A-2"],
                  price: viewingTicket.pricePaid,
                  tax: 45,
                  total: viewingTicket.pricePaid + 45,
                  paymentMethod: "Credit Card",
                  status: "Completed"
                }}
              />
            </div>
          </div>
        </div>
      )}

      {userTickets.length === 0 && (
        <div className="col-span-full py-32 bg-white rounded-[4rem] border border-slate-100 text-center shadow-sm no-print">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
            <TicketIcon size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4">No Active Tickets</h3>
          <p className="text-slate-500 mb-12 font-medium max-w-sm mx-auto">Discover the hottest events and secure your entry today!</p>
          <Link to="/" className="bg-[#0a0a23] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all inline-flex items-center gap-3 active:scale-95">
            Explore Events <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
