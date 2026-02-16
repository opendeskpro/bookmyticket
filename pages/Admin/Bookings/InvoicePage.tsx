import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { ArrowLeft, Download, Printer, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InvoicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Decode ID if it was encoded
    const bookingId = id ? decodeURIComponent(id) : '#691852196fac4';

    // Mock Data based on ticket template & screenshot
    const invoice = {
        id: bookingId,
        date: '15 Jan, 2026 12:00am',
        eventName: 'Small Business Ideas',
        location: 'Rockingham, North Carolina, United States',
        bookingDate: 'Nov 15, 2025',
        duration: '3d',
        billingAddr: '33 Robin Covington Road, Rockingham,nc, 28339 United States',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Invoice_' + (bookingId || 'test'),
        items: [
            { desc: 'Small Business Ideas', qty: 1, price: '100.00 INR' },
            { desc: 'Tax', qty: 1, price: '20.00 INR' }
        ],
        total: '240 INR',
        paymentMethod: 'Citibank',
        status: 'Completed',
        logo: 'https://cdn-icons-png.flaticon.com/512/2859/2859158.png', // Represents the FoodTicket logo
        heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60' // Represents the event hero image
    };

    const handleDownloadImage = async () => {
        const element = document.getElementById('invoice-container');
        if (!element) return;

        setIsDownloading(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            } as any);

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `invoice-${invoice.id}.png`;
            link.click();
        } catch (err) {
            console.error("Failed to generate invoice image", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('invoice-container');
        if (!element) return;

        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            } as any);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoice.id}.pdf`);
        } catch (err) {
            console.error("Failed to generate PDF", err);
        } finally {
            setIsGeneratingPDF(false);
        }
    };



    return (
        <div className={`min-h-screen py-10 px-6 animate-in fade-in duration-500 flex flex-col items-center ${theme === 'dark' ? 'bg-[#1a1b1e]' : 'bg-slate-200'}`}>
            <div className="w-full max-w-[850px] flex items-center justify-between mb-8 no-print">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Invoice | Evento</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Booking Reference: {invoice.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {isGeneratingPDF ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> Export PDF</>}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className={`px-5 py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'border-white/5 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <ArrowLeft size={16} />
                    </button>
                </div>
            </div>

            {/* Invoice Container - Professional PDF Style */}
            <div id="invoice-container" className="bg-white text-slate-900 w-[800px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden font-inter border border-slate-200 mb-20">

                {/* 1. Header with Logo */}
                <div className="pt-12 pb-8 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                            <img src={invoice.logo} alt="FoodTicket" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-600 mt-2">FoodTicket</span>
                    </div>
                </div>

                {/* 2. Main Ticket Card */}
                <div className="px-12 pb-6">
                    <div className="border-[2px] border-cyan-400 rounded-none overflow-hidden flex relative min-h-[440px]">

                        {/* Left: Event Hero Image */}
                        <div className="w-[38%] relative border-r-[2px] border-cyan-400">
                            <img src={invoice.heroImage} className="w-full h-full object-cover" alt="Event" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>

                        {/* Right: Event Details Section */}
                        <div className="flex-1 p-10 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <h1 className="text-[26px] font-black text-slate-900 leading-tight tracking-tight uppercase">{invoice.eventName}</h1>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{invoice.location}</p>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase">{invoice.date}</p>
                                    </div>

                                    <div className="pt-8 space-y-3">
                                        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">Small Business Ideas</h3>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billing Address</p>
                                            <p className="text-[12px] font-bold text-slate-700 leading-snug pr-10">{invoice.billingAddr}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Aligned QR & ID */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className="w-24 h-24 bg-white border border-slate-100 p-1 mb-2">
                                        <img src={invoice.qrCode} alt="QR" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info Grid */}
                            <div className="mt-auto grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Booking Date</p>
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{invoice.bookingDate}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration</p>
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{invoice.duration}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Booking ID</p>
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight font-mono">{invoice.id}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Tax</p>
                                    <p className="text-[12px] font-black text-cyan-500 uppercase tracking-tight">20.00 INR</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Early Bird</p>
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">0 INR</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Coupon</p>
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">0 INR</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Paid</p>
                                    <p className="text-[16px] font-black text-slate-900 uppercase tracking-tight">{invoice.total}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</p>
                                    <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{invoice.paymentMethod}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</p>
                                    <p className="text-[12px] font-black text-green-500 uppercase tracking-tight">{invoice.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Important Information Section */}
                <div className="px-12 pb-16 pt-4">
                    <div className="border-[2px] border-cyan-400 rounded-none bg-[#f8fdff] p-10 pt-8">
                        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                            Important information
                        </h4>
                        <div className="space-y-3.5 pl-2">
                            {[
                                "We are FoodTicket and we are dedicated to selling tickets for the best events in the country. However, you must know that we are not the organizers of the events.",
                                "In event of any eventuality related to the event, like cancellation, change of date etc, you should contact the organizing company directly.",
                                "If you purchase tickets at unauthorized points of sale, responsibility is exclusively yours.",
                                "We recommend you not to disclose details of your ticket to third parties, to avoid being victims of theft or deception.",
                                "IMPORTANT! Please present this ticket along with your identity document at the venue of the event."
                            ].map((text, i) => (
                                <div key={i} className="flex gap-4 text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                    <span className="text-cyan-500 flex-shrink-0 text-md">•</span>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">
                                For any questions, contact us via support on https://www.bookmyticket.io
                            </p>
                        </div>
                    </div>
                </div>

                {/* Aesthetic Teal Bottom Accents */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-cyan-400"></div>
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-400"></div>
            </div>
        </div>
    );
};

export default InvoicePage;
