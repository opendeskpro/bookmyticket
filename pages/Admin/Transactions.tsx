import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Search, Filter, ExternalLink, ArrowUpRight, ArrowDownLeft,
    MoreHorizontal, Eye, Download, Calendar, User,
    CreditCard, DollarSign, ListFilter, Wallet, Clock
} from 'lucide-react';

interface Transaction {
    id: string;
    organizer: string;
    type: string;
    method: string;
    preBalance: string;
    amount: string;
    afterBalance: string;
    status: 'Paid' | 'Pending' | 'Canceled';
    date: string;
    isAddition: boolean;
}

const Transactions: React.FC = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const [transactions] = useState<Transaction[]>([
        {
            id: '#1763201580',
            organizer: 'Ambrose Moore',
            type: 'Event Booking',
            method: 'Citibank',
            preBalance: '$450.00',
            amount: '$100.00',
            afterBalance: '$550.00',
            status: 'Paid',
            date: 'Feb 16, 2026',
            isAddition: true
        },
        {
            id: '#1763201581',
            organizer: 'Louis Copeland',
            type: 'Withdrawal',
            method: 'PayPal',
            preBalance: '$1,200.00',
            amount: '$200.00',
            afterBalance: '$1,000.00',
            status: 'Paid',
            date: 'Feb 15, 2026',
            isAddition: false
        },
        {
            id: '#1763201582',
            organizer: 'Jane Smith',
            type: 'Event Booking',
            method: 'Perfect Money',
            preBalance: '$75.00',
            amount: '$50.00',
            afterBalance: '$125.00',
            status: 'Paid',
            date: 'Feb 14, 2026',
            isAddition: true
        },
        {
            id: '#1763201583',
            organizer: 'Ambrose Moore',
            type: 'Refund',
            method: 'Bank Transfer',
            preBalance: '$550.00',
            amount: '$100.00',
            afterBalance: '$450.00',
            status: 'Canceled',
            date: 'Feb 12, 2026',
            isAddition: false
        }
    ]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    return (
        <div className={`p-8 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Transaction History</h2>
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                        <Wallet size={12} />
                        <span>Admin</span>
                        <span>/</span>
                        <span className="text-[#38bdf8]">Transactions</span>
                    </div>
                </div>
            </div>

            <div className={`rounded-[2rem] border overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-[12px] font-black italic uppercase tracking-widest">Transaction Matrix</h3>
                    <div className="relative w-72">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`} size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH TRANSACTION ID..."
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all ${theme === 'dark'
                                ? 'bg-[#1e2736] border-white/5 text-white placeholder:text-white/10'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
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
                                <th className="px-8 py-5">Transaction Id</th>
                                <th className="px-6 py-5">Organizer</th>
                                <th className="px-6 py-5">Type</th>
                                <th className="px-6 py-5">Method</th>
                                <th className="px-6 py-5">Pre Balance</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">After Balance</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className={`group transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-8 py-6 text-[11px] font-black font-mono italic ${theme === 'dark' ? 'text-[#38bdf8]' : 'text-blue-600'}`}>{tx.id}</td>
                                    <td className="px-6 py-6 border-none">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black uppercase tracking-widest italic">{tx.organizer}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Organizer</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-white/60' : 'bg-slate-100 text-slate-600'}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 font-black text-[11px] uppercase tracking-widest italic">{tx.method}</td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono italic">{tx.preBalance}</td>
                                    <td className={`px-6 py-6 font-black text-[11px] font-mono italic ${tx.isAddition ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.isAddition ? '(+)' : '(-)'} {tx.amount}
                                    </td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono italic">{tx.afterBalance}</td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                                                <Eye size={12} /> View
                                            </button>
                                            <button className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-900'
                                                }`}>
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: '$24,500.00', icon: <DollarSign size={20} />, color: 'text-green-500' },
                    { label: 'Pending Payouts', value: '$1,200.00', icon: <Clock size={20} />, color: 'text-amber-500' },
                    { label: 'Platform Fees', value: '$4,800.00', icon: <CreditCard size={20} />, color: 'text-blue-500' }
                ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <div className={stat.color}>{stat.icon}</div>
                            </div>
                            <ArrowUpRight size={18} className="text-white/20" />
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>{stat.label}</p>
                        <p className="text-2xl font-black italic tracking-tighter uppercase">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Transactions;
