
import React, { useState } from 'react';
import { Ticket, User, TicketStatus } from '../../types';
import { Download, Share2, Ticket as TicketIcon, Clock, MapPin, QrCode as QrIcon, ArrowRight, Check, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MyTicketsPageProps {
  tickets: Ticket[];
  user: User;
}

const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ tickets, user }) => {
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [ticketList, setTicketList] = useState(tickets); // Local state for demo purposes to handle status updates
  const userTickets = ticketList.filter(t => t.userId === user.id);

  const handleSave = (ticket: Ticket) => {
    // We add a temporary ID to the ticket element to isolate it for printing
    // The @media print styles in index.html handle the visibility toggle
    const element = document.getElementById(`ticket-${ticket.id}`);
    if (element) {
      const originalId = element.id;
      element.id = 'printable-ticket';
      window.print();
      element.id = originalId;
    }
  };

  const handleShare = async (ticket: Ticket) => {
    const shareData = {
      title: `My Ticket: ${ticket.eventTitle}`,
      text: `Hey! I'm attending ${ticket.eventTitle}. Check out my digital ticket!`,
      url: window.location.origin + `/#/event/${ticket.eventId}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const shareLink = `${window.location.origin}/#/ticket-view/${ticket.id}`;
        await navigator.clipboard.writeText(shareLink);
        setSharedId(ticket.id);
        setTimeout(() => setSharedId(null), 2000);
      }
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  const handleCancel = (ticketId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking? A refund will be initiated to your original payment method.")) {
      // Simulate API call update
      const updatedList = ticketList.map(t => {
        if (t.id === ticketId) {
          return { ...t, status: TicketStatus.REFUNDED };
        }
        return t;
      });
      setTicketList(updatedList);
      alert("Booking cancelled. Refund of ₹" + updatedList.find(t=>t.id===ticketId)?.pricePaid + " initiated.");
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
            id={`ticket-${ticket.id}`}
            className={`bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col group hover:shadow-2xl transition-all ${ticket.status === TicketStatus.REFUNDED ? 'opacity-75 grayscale' : ''}`}
          >
            {/* Top Section */}
            <div className="p-10 flex gap-8 relative">
               {ticket.status === TicketStatus.REFUNDED && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                    <div className="bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-xl transform -rotate-12 border-4 border-white">
                      Cancelled & Refunded
                    </div>
                 </div>
               )}
               <div className="w-24 h-24 rounded-[2rem] bg-slate-900 p-2 flex items-center justify-center shrink-0 shadow-xl border-4 border-white -mt-5">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`} alt="QR" className="w-full h-full rounded-2xl" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-black text-slate-900 truncate">{ticket.eventTitle}</h3>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       ticket.status === TicketStatus.BOOKED ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                     }`}>
                       {ticket.status}
                     </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                     <span className="text-[#d97706]">{ticket.ticketTypeName}</span>
                     <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                     <span>#{ticket.id.slice(-8).toUpperCase()}</span>
                  </div>
                  {ticket.seats && ticket.seats.length > 0 && (
                    <div className="mt-2 text-xs font-bold text-slate-700">
                      Seats: {ticket.seats.join(', ')}
                    </div>
                  )}
               </div>
            </div>

            {/* Ticket Info Area */}
            <div className="bg-slate-50/50 p-10 grid grid-cols-2 gap-8 border-y border-dashed border-slate-200 relative">
               {/* Notches for ticket look */}
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
                  <p className="text-sm font-black text-slate-900 truncate">Main Arena, Mumbai</p>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-10 flex items-center justify-between no-print">
               <div className="flex gap-4">
                  <button 
                    onClick={() => handleSave(ticket)}
                    disabled={ticket.status === TicketStatus.REFUNDED}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-50 disabled:opacity-50"
                  >
                     <Download size={16} /> Save
                  </button>
                  <button 
                    onClick={() => handleShare(ticket)}
                    disabled={ticket.status === TicketStatus.REFUNDED}
                    className={`flex items-center gap-2 px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      sharedId === ticket.id 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-white border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50'
                    }`}
                  >
                     {sharedId === ticket.id ? <><Check size={16} /> Copied!</> : <><Share2 size={16} /> Share</>}
                  </button>
                  {ticket.status === TicketStatus.BOOKED && (
                    <button 
                      onClick={() => handleCancel(ticket.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-100 transition-all"
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  )}
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Code</p>
                  <p className="text-xl font-black text-[#0a0a23]">{ticket.qrCode.slice(3, 7)}</p>
               </div>
            </div>
          </div>
        ))}

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
    </div>
  );
};

export default MyTicketsPage;
