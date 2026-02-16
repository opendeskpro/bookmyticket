import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Search, Filter, ExternalLink, Clock, CheckCircle2, XCircle,
    MoreHorizontal, ArrowUpRight, Eye, Check, X, Trash2,
    Calendar, User, CreditCard, DollarSign, Info
} from 'lucide-react';

interface WithdrawRequest {
    id: string;
    organizer: string;
    method: string;
    amount: string;
    charge: string;
    receivable: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Decline';
    date: string;
}

const WithdrawRequests: React.FC = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Deletion Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

    const [requests, setRequests] = useState<WithdrawRequest[]>([
        { id: '690841f02e30e', organizer: 'Ambrose Moore', method: 'Bitcoin', amount: '$100.00', charge: '$28.00', receivable: '$72.00', status: 'Pending', date: 'Feb 15, 2026' },
        { id: '68c5e9c81e42f', organizer: 'Louis Copeland', method: 'Bank Transfer', amount: '$100.00', charge: '$5.00', receivable: '$95.00', status: 'Pending', date: 'Feb 14, 2026' },
        { id: '68e39d7c517c7', organizer: 'Perfect Money', method: 'Perfect Money', amount: '$100.00', charge: '$6.88', receivable: '$93.12', status: 'Decline', date: 'Feb 13, 2026' },
        { id: '68e39850854cb', organizer: 'Jane Smith', method: 'Perfect Money', amount: '$100.00', charge: '$6.88', receivable: '$93.12', status: 'Decline', date: 'Feb 12, 2026' },
    ]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Decline':
            case 'Rejected': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const handleAction = (id: string, newStatus: WithdrawRequest['status']) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setIsDrawerOpen(false);
    };

    const confirmDelete = (id: string) => {
        setRequestToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (requestToDelete) {
            setRequests(prev => prev.filter(r => r.id !== requestToDelete));
            setIsDeleteModalOpen(false);
            setRequestToDelete(null);
        }
    };

    const openDetails = (req: WithdrawRequest) => {
        setSelectedRequest(req);
        setIsDrawerOpen(true);
    };

    return (
        <div className={`p-8 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Withdraw Requests</h2>
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                        <CreditCard size={12} />
                        <span>Withdraw Method</span>
                        <span>/</span>
                        <span className="text-[#38bdf8]">Withdraw Requests</span>
                    </div>
                </div>
            </div>

            <div className={`rounded-[2rem] border overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-[12px] font-black italic uppercase tracking-widest">Withdraw Requests</h3>
                    <div className="relative w-72">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`} size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH WITHDRAW ID, METHOD NAME..."
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-[#1e2736] border-white/5 text-white placeholder:text-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                                }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`text-[10px] font-black uppercase tracking-widest border-b ${theme === 'dark' ? 'bg-white/5 text-white/40 border-white/5' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                <th className="px-8 py-5">#</th>
                                <th className="px-6 py-5">Withdraw ID</th>
                                <th className="px-6 py-5">Method Name</th>
                                <th className="px-6 py-5">Total Amount</th>
                                <th className="px-6 py-5">Total Charge</th>
                                <th className="px-6 py-5">Total Payable Amount</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {requests.map((req, idx) => (
                                <tr key={req.id} className={`group transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-8 py-6 text-[11px] font-black ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`}>{idx + 1}</td>
                                    <td className={`px-6 py-6 text-[11px] font-black font-mono italic ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>{req.id}</td>
                                    <td className="px-6 py-6 font-black text-[11px] uppercase tracking-widest italic">{req.method}</td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono italic">{req.amount}</td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono italic text-red-500">{req.charge}</td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono italic text-green-500">{req.receivable}</td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openDetails(req)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                <Eye size={12} /> View
                                            </button>
                                            {req.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'Approved')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                                    >
                                                        <Check size={12} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'Decline')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                                    >
                                                        <X size={12} /> Decline
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => confirmDelete(req.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Drawer */}
            {isDrawerOpen && selectedRequest && (
                <div className="fixed inset-0 z-[500] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    <div className={`absolute inset-y-0 right-0 w-full max-w-xl shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${theme === 'dark' ? 'bg-[#0f1218]' : 'bg-white'
                        }`}>
                        {/* Drawer Header */}
                        <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">Withdraw Details</h3>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-900'}`}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Transaction ID</p>
                                    <p className="text-xs font-black font-mono italic text-[#38bdf8]">{selectedRequest.id}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Status</p>
                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${getStatusStyles(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Request Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#38bdf8] italic">Request Metadata</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { icon: <User size={14} />, label: 'Organizer', value: selectedRequest.organizer },
                                        { icon: <CreditCard size={14} />, label: 'Method', value: selectedRequest.method },
                                        { icon: <Calendar size={14} />, label: 'Date', value: selectedRequest.date },
                                        { icon: <DollarSign size={14} />, label: 'Total Amount', value: selectedRequest.amount, color: theme === 'dark' ? 'text-white' : 'text-slate-900' },
                                        { icon: <Info size={14} />, label: 'Total Charge', value: selectedRequest.charge, color: 'text-red-500' },
                                        { icon: <Check size={14} />, label: 'Payable Amount', value: selectedRequest.receivable, color: 'text-green-500' },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>{item.icon}</div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>{item.label}</span>
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-widest italic ${item.color || (theme === 'dark' ? 'text-white/80' : 'text-slate-700')}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Provided Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#38bdf8] italic">Information Provided by User</h4>
                                <div className={`p-6 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className={`text-[9px] font-black uppercase tracking-widest ml-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Bank Name</p>
                                            <div className={`px-6 py-4 rounded-2xl border text-[12px] font-black italic uppercase ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                                Chase Bank USA
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className={`text-[9px] font-black uppercase tracking-widest ml-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Account Holder</p>
                                            <div className={`px-6 py-4 rounded-2xl border text-[12px] font-black italic uppercase ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                                AMBROSE MOORE
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className={`text-[9px] font-black uppercase tracking-widest ml-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Account Number</p>
                                            <div className={`px-6 py-4 rounded-2xl border text-[12px] font-black italic uppercase ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                                4456 8892 0012 3345
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Actions */}
                        {selectedRequest.status === 'Pending' && (
                            <div className={`p-8 border-t flex gap-4 ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-slate-100 bg-slate-50'}`}>
                                <button
                                    onClick={() => { handleAction(selectedRequest.id, 'Approved'); setIsDrawerOpen(false); }}
                                    className="flex-1 bg-green-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest italic shadow-xl shadow-green-500/20 hover:scale-105 transition-all"
                                >
                                    Approve Request
                                </button>
                                <button
                                    onClick={() => { handleAction(selectedRequest.id, 'Decline'); setIsDrawerOpen(false); }}
                                    className="flex-1 bg-orange-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest italic shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
                                >
                                    Decline Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className={`relative w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-[#131922] border-white/10' : 'bg-white border-slate-200'
                        }`}>
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Trash2 size={40} />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2">Delete Request?</h3>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 leading-relaxed ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>
                                This action is permanent. The request matrix will be purged from memory.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest italic shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className={`flex-1 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest italic transition-all ${theme === 'dark' ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 text-slate-600'
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawRequests;
